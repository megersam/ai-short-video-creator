'use client'
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';

const FILE_URL='https://firebasestorage.googleapis.com/v0/b/ai-short-video-creator.appspot.com/o/ai-short-video-files%2Fecc6a118-f724-4c3b-9b53-c8758d17b2a4.mp3?alt=media&token=3ba07ac3-0fd3-43c7-b9e9-663a967be848'

function CreateNew() {
   const [formData, setFormData]=useState([]);
   const [loading, setLoading]= useState(false);
   const [videoScript, setVideoScript]=useState();
   const [audioFileUrl, setAudioFileUrl]=useState();
   const [captions, setCaptions]=useState();
  const onHandleInputChange=(fieldName, fieldValue)=>{
     console.log(fieldName, fieldValue);

     setFormData(prev=>({
      ...prev,
      [fieldName]: fieldValue
     }))
  }
  const onCreateClickHandler=()=>{
    // GetVideoScript();
    GenerateAudioCaption(FILE_URL);
  }
  // get video script.
  const GetVideoScript=async ()=>{
    setLoading(true);
    const prompt = 'Write a script to generate '+formData.duration+' video on topic '+formData.topic+' along with AI image propmt in '+formData.imageStyle+' format for each scene and give result in JSON format with image prompt and content Text as field, No plain Text'
    // console.log(prompt);
    const result = await axios.post('/api/get-video-script', {
      prompt:prompt
    }).then(resp=>{
      console.log(resp.data.result);
      setVideoScript(resp.data.result);
      GenerateAudioFile(resp.data.result);
    })
   setLoading(false);
  }
// generate the video by accepting the script written.
const GenerateAudioFile=async(videoScript)=>{
  setLoading(true);
  let script='';
  const id = uuidv4();
  videoScript.forEach(item=>{
    script=script+item.content+' ';
  })
  console.log(script);
  await axios.post('/api/generate-audio',{
    text: script,
    id:id
  }).then(resp=>{
    console.log(resp.data);
    setAudioFileUrl(resp.data.result);
  });
  setLoading(false);
}

const GenerateAudioCaption= async (fileUrl)=>{
  setLoading(true);
  
  await axios.post('/api/generate-caption',{
    audioFileUrl:fileUrl
  }).then(resp=>{
    console.log(resp.data.result);
    setCaptions(resp?.data?.result);
  })
  setLoading(false);
}

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>

      <div className='mt-10 shadow-md p-10'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange}/>

        {/* select Style */}
         <SelectStyle onUserSelect={onHandleInputChange}/>
        {/* Duration */}
         <SelectDuration onUserSelect={onHandleInputChange}/>
        {/* create a button */}
        <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
      </div>
      <CustomLoading loading={loading}/>
    </div>
  )
}

export default CreateNew