'use client'
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';

function CreateNew() {
   const [formData, setFormData]=useState([]);
   const [loading, setLoading]= useState(false);
   const [videoScript, setVideoScript]=useState();
  const onHandleInputChange=(fieldName, fieldValue)=>{
     console.log(fieldName, fieldValue);

     setFormData(prev=>({
      ...prev,
      [fieldName]: fieldValue
     }))
  }
  const onCreateClickHandler=()=>{
    GetVideoScript();
  }
  // get video script.
  const GetVideoScript=async ()=>{
    setLoading(true);
    const prompt = 'Write a script to generate '+formData.duration+' video on topic '+formData.topic+' along with AI image propmt in '+formData.imageStyle+' format for each scene and give result in JSON format with image prompt and content Text as field, No plain Text'
    // console.log(prompt);
    const result = await axios.post('/api/get-video-script', {
      prompt:prompt
    }).then(resp=>{
      // console.log(resp.data.result);
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
    script=script+item.contentText+' ';
  })
  // console.log(script);
  await axios.post('/api/generate-audio',{
    text: script,
    id:id
  }).then(resp=>{
    console.log(resp.data);
  });
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