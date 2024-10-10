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
import { VideoData } from '@/configs/schema';
import PlayerDialog from '../_components/PlayerDialog';
import { useRouter } from 'next/navigation';



function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [statusMessage, setStatusMessage] = useState(''); // New state for status message
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imagList, setImageList] = useState();
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser(); 
  const router = useRouter();
  const [saved, setSaved] = useState(false);  // Added saved state

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  };

  const onCreateClickHandler = () => {
    GetVideoScript();
  };

  // get video script.
  const GetVideoScript = async () => {
    setLoading(true);
    const expectedNumberOfScenes = 5; // Adjust based on your preference
    const expectedPacing = Math.ceil(formData.duration / expectedNumberOfScenes);
    
    const prompt = `Create a rich, complete video script that lasts exactly ${formData.duration} seconds on the topic "${formData.topic}". 
    Each scene must include an AI image prompt in the style of "${formData.imageStyle}" and descriptive content text. 
    Assume a pacing of approximately ${expectedPacing} seconds per scene. 
    Ensure that the total duration of the script matches the specified duration (${formData.duration} seconds) precisely, 
    including pacing considerations for video motion. The script should conclude clearly at the end. 
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
    console.log(result);
    setLoading(false);
    // Clear all states
    // Navigate to dashboard
    setVideoData(null);
    router.push('/dashboard');
    // window.location.href = '/dashboard';
    
  };

   



  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>

      <div className='mt-10 shadow-md p-10'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        {/* select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/* create a button */}
        <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
      </div>
      <CustomLoading loading={loading} status={statusMessage} />
      {/* <PlayerDialog playVideo={playVideo} videoId={videoId}/> */}
    </div>
  )
}

export default CreateNew