'use client'
import React, { useState, useContext, useEffect } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { Users, VideoData } from '@/configs/schema';
import PlayerDialog from '../_components/PlayerDialog';
import { useRouter } from 'next/navigation';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { toast } from 'sonner';
import { eq } from 'drizzle-orm';
import LowBalanceDialog from '../_components/LowBallanceDialog';



function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); // New state for status message
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imagList, setImageList] = useState();
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState(false);  // Added saved state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);  // Track topic selection
  const [selectedStyle, setSelectedStyle] = useState(null);  // Track style selection
  const [selectedDuration, setSelectedDuration] = useState(null); 

  const onHandleInputChange = (fieldName, fieldValue,   ) => {
    console.log(fieldName, fieldValue);
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
     
  };

  const onCreateClickHandler = () => {
    console.log(userDetail?.credits);

    

    // Check if free credits are below 1 and the user does not have an active subscription
    if (userDetail?.credits < 1 && !userDetail.subscription) {
      // Show dialog
      setDialogOpen(true);
      return;
    }

    GetVideoScript();
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };


// get video script.
const GetVideoScript = async () => {
  setLoading(true);
  setStatusMessage('Generating Script...');
  const expectedNumberOfScenes = 5; // Adjust based on your preference
  const totalScenesDuration = formData.duration - 10; // Reserve 10 seconds for conclusion
  const expectedPacing = Math.ceil(totalScenesDuration / expectedNumberOfScenes);

  const prompt = `Create a complete video script that lasts exactly ${formData.duration} seconds on the topic "${formData.topic}". 
    Each scene must include an AI image prompt in the style of "${formData.imageStyle}" and descriptive content text. 
    Ensure that the total duration of the script matches the specified duration (${formData.duration} seconds) precisely, 
    with the last 10 seconds reserved for a clear and effective conclusion that summarizes the key points of the video. 
    Distribute the remaining time across the preceding scenes, ensuring each scene maintains a pacing of approximately ${expectedPacing} seconds. 
    The output should be structured in JSON format, with fields for "imagePrompt" and "contentText" for each scene. 
    Avoid truncating the script or providing partial responses. Ensure the script is fully developed and complete.`;

  try {
    const resp = await axios.post('/api/get-video-script', {
      prompt: prompt
    });

    if (resp.data.result) {
      setVideoData(prev => ({
        ...prev,
        'videoScript': resp.data.result
      }));
      setVideoScript(resp.data.result);
      setStatusMessage('Script generated! Generating Audio...');
      await GenerateAudioFile(resp.data.result);
    }
  } catch (error) {
    console.error('Error generating video script:', error);
  } finally {
    setLoading(false);
  }
};



const GenerateAudioFile = async (videoScriptData) => {
  setLoading(true);
  let script = '';
  const id = uuidv4();
  videoScriptData.forEach(item => {
    script += (item.content || item.contentText) + ' ';
  });

  try {
    const resp = await axios.post('/api/generate-audio', {
      text: script,
      id: id
    });

    if (resp.data.result) {
      const firebaseAudioUrl = resp.data.result;
      setVideoData((prev) => ({
        ...prev,
        'audioFileUrl': firebaseAudioUrl
      }));
      setAudioFileUrl(firebaseAudioUrl);
      setStatusMessage('Audio generated! Generating captions...');
      await GenerateAudioCaption(firebaseAudioUrl, videoScriptData);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
  setLoading(true);
  try {
    const resp = await axios.post('/api/generate-caption', {
      audioFileUrl: fileUrl
    });

    if (resp.data.result) {
      setCaptions(resp.data.result);
      setVideoData(prev => ({
        ...prev,
        'captions': resp.data.result
      }));
      setStatusMessage('Captions generated! Generating images...');
      await GenerateImage(videoScriptData);
    }
  } catch (error) {
    console.error('Error generating captions:', error);
  } finally {
    setLoading(false);
  }
};

const GenerateImage = async (videoScriptData) => {
  setLoading(true);
  let images = [];

  try {
    for (const element of videoScriptData) {
      const resp = await axios.post('/api/generate-image', {
        prompt: element.imagePrompt
      });

      if (resp.data.result) {
        images.push(resp.data.result);
      } else {
        console.error('Failed to generate image for prompt:', element.imagePrompt);
      }
    }

    setVideoData(prev => ({
      ...prev,
      'imageList': images
    }));
    setImageList(images);
    setStatusMessage('Images generated! Saving video data...');
  } catch (error) {
    console.error('Error generating images:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  console.log(videoData)
  if (videoData && Object.keys(videoData).length === 4) {
    SaveVideoData(videoData);
  }
}, [videoData]);


const SaveVideoData = async (videoData) => {
  setLoading(true);

  const result = await db.insert(VideoData).values({
    script: videoData?.videoScript,
    audioFileUrl: videoData?.audioFileUrl,
    captions: videoData?.captions,
    imageList: videoData?.imageList,
    createdBy: user?.primaryEmailAddress?.emailAddress,
  }).returning({ id: VideoData?.id });
  await UpdateUserCredits();
  console.log(result);
  setLoading(false);
  // Clear all states
  // Navigate to dashboard
  setVideoData(null);
  router.push('/dashboard');
  // window.location.href = '/dashboard';

};

//  user credits.
const UpdateUserCredits = async () => {
  const result = await db.update(Users).set({
    credits: userDetail?.credits - 5
  }).where(eq(Users?.email, user?.primaryEmailAddress?.emailAddress));
  setUserDetail(prev => ({
    ...prev,
    "credits": userDetail?.credits - 5
  }))
}



return (
  <div className='md:px-20'>
    <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>

    <div className='mt-10 shadow-md p-10'>
      {/* Select Topic */}
      <SelectTopic onUserSelect={onHandleInputChange}/>

      {/* select Style */}
      <SelectStyle onUserSelect={onHandleInputChange} />
      {/* Duration */}
      <SelectDuration onUserSelect={onHandleInputChange} />
      {/* create a button */}
      <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
    </div>
    <CustomLoading loading={loading} status={statusMessage} />
    {/* <PlayerDialog playVideo={playVideo} videoId={videoId}/> */}

     {/* LowBalanceDialog triggered when isDialogOpen is true */}
     <LowBalanceDialog
        title="Time to Activate Your Plan!"
        description="Your current plan has ended. To continue using all features, please activate a subscription plan."
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
  </div>
)
}

export default CreateNew