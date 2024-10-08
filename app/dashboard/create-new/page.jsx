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
    const prompt = 'Write a script to generate ' + formData.duration + ' video on topic ' + formData.topic + ' along with AI image propmt in ' + formData.imageStyle + ' format for each scene and give result in JSON format with image prompt and content Text as field, No plain Text';
    console.log(prompt);
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
  }

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
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(videoData);
    if (Object.keys(videoData).length === 4) {
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
    window.location.href = '/dashboard';
    
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
      <CustomLoading loading={loading} />
      {/* <PlayerDialog playVideo={playVideo} videoId={videoId}/> */}
    </div>
  )
}

export default CreateNew