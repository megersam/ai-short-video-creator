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



function CreateNew() {

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imagList, setImageList] = useState();
  // const {videoData, setVideoData} = useContext(VideoDataContext);

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
      // setVideoData(prev=>({
      //   ...prev,
      //   'videoScript': resp.data.result
      // }))
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
      script = script + item.content + ' ';
    });

    // Call the API to generate audio and get the Firebase URL
    const resp = await axios.post('/api/generate-audio', {
      text: script,
      id: id
    });

    if (resp.data.result) {
      const firebaseAudioUrl = resp.data.result;
      console.log('Firebase Audio URL:', firebaseAudioUrl);

      // Store the Firebase URL in state
      // setVideoData((prev) => ({
      //     ...prev,
      //     'audioFileUrl': firebaseAudioUrl
      // }));
      setAudioFileUrl(firebaseAudioUrl);

      // Call the caption generation function with the Firebase URL
      await GenerateAudioCaption(firebaseAudioUrl, videoScriptData);
    }
  };


  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/generate-caption', {
        audioFileUrl: fileUrl
      });

      if (resp.data.result) {
        console.log('Captions:', resp.data.result);
        setCaptions(resp.data.result);

        await GenerateImage(videoScriptData);
      }
    } catch (error) {
      console.error('Error generating captions:', error);
    } finally {
      setLoading(false);
    }
  };


  const GenerateImage = async (videoScriptData) => {
    let images = [];
    for (const element of videoScriptData) {
      try {
        const resp = await axios.post('/api/generate-image', {
          prompt: element.imagePrompt
        });
        console.log(resp.data.result);
        images.push(resp.data.result);
      } catch (error) {
        console.log('Error:', error);
      }
    }
    // setVideoData(prev=>({
    //   ...prev,
    //   'imageList': resp.data.result 
    // }))
    setImageList(images);
    setLoading(false);
  }



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
    </div>
  )
}

export default CreateNew