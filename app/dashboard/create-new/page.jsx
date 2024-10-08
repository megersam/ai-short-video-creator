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



function CreateNew() {

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imagList, setImageList] = useState();
  const {videoData, setVideoData} = useContext(VideoDataContext);
  // get the account owner user data
  const {user} = useUser();

  // play video
  const [playVideo, setPlayVideo] = useState(true);
  const [videoId, setVideoId] = useState(1);

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);

    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }
  const onCreateClickHandler = () => {
    GetVideoScript();

  }
  // get video script.
  const GetVideoScript = async () => {
    setLoading(true);
    const prompt = 'Write a script to generate ' + formData.duration + ' video on topic ' + formData.topic + ' along with AI image propmt in ' + formData.imageStyle + ' format for each scene and give result in JSON format with image prompt and content Text as field, No plain Text'
    console.log(prompt);
    const resp = await axios.post('/api/get-video-script', {
      prompt: prompt
    })
    if (resp.data.result) {
      setVideoData(prev=>({
        ...prev,
        'videoScript': resp.data.result
      }))
      setVideoScript(resp.data.result);
      await GenerateAudioFile(resp.data.result);
    }
  }
  // generate the video by accepting the script written.
  const GenerateAudioFile = async (videoScriptData) => {
    setLoading(true);
    let script = '';
    const id = uuidv4();
    videoScriptData.forEach(item => {
      script += (item.content || item.contentText) + ' ';
    });

    // Call the API to generate audio and get the Firebase URL
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

      // Call the caption generation function with the Firebase URL
      await GenerateAudioCaption(firebaseAudioUrl, videoScriptData);
    }
   } catch (error) {
     console.log('Error:', e);
   }
  };

// Generate the captions from the audio.
  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/generate-caption', {
        audioFileUrl: fileUrl
      });

      if (resp.data.result) {
        //console.log('Captions:', resp.data.result);
        // Store the captions in state
        setCaptions(resp.data.result);
        setVideoData(prev=>({
          ...prev,
          'captions': resp.data.result
        }))

        await GenerateImage(videoScriptData);
      }
    } catch (error) {
      console.error('Error generating captions:', error);
    } finally {
      setLoading(false);
    }
  };

// generate the images from the propt created last time.
  const GenerateImage = async (videoScriptData) => {
    setLoading(true);  // Show loading while images are being generated
    let images = [];
  
    try {
      // Loop through each script element and generate an image
      for (const element of videoScriptData) {
        const resp = await axios.post('/api/generate-image', {
          prompt: element.imagePrompt  // Ensure 'imagePrompt' field is in videoScriptData
        });
  
        if (resp.data.result) {
          //console.log('Firebase Image URL:', resp.data.result);
          images.push(resp.data.result);  // Push the Firebase URL to images array
        } else {
          console.error('Failed to generate image for prompt:', element.imagePrompt);
        }
      }

      setVideoData(prev=>({
        ...prev,
        'imageList': images
      }))
  
      // Set the images in state to be displayed or further processed
      setImageList(images);  // Store generated image URLs in state
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setLoading(false);  // Hide loading when done
    }
  };
  

useEffect(()=>{
  console.log(videoData);
  if(Object.keys(videoData).length==4){
    SaveVideoData(videoData);
  }
}, [videoData]);


// save the video to neo.
const SaveVideoData = async (videoData) => {
  setLoading(true);

  const result=await db.insert(VideoData).values({
    script:videoData?.videoScript,
    audioFileUrl:videoData?.audioFileUrl,
    captions:videoData?.captions,
    imageList:videoData?.imageList,
    createdBy:user?.primaryEmailAddress?.emailAddress,
  }).returning({id:VideoData?.id});

  setVideoId(result[0].id);
  setPlayVideo(true);
  console.log(result);
  setLoading(false);
   
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
      <PlayerDialog playVideo={playVideo} videoId={videoId}/>
    </div>
  )
}

export default CreateNew