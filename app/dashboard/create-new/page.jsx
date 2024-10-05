'use client'
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'

function CreateNew() {
   const [formData, setFormData]=useState([]);
  const onHandleInputChange=(fieldName, fieldValue)=>{
     console.log(fieldName, fieldValue);
  }
  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>

      <div className='mt-10 shadow-md p-10'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange}/>

        {/* select Style */}

        {/* Duration */}

        {/* create a button */}
      </div>
    </div>
  )
}

export default CreateNew