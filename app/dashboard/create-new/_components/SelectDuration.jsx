import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
function SelectDuration({onUserSelect}) {
  return (
    <div className='mt-7 '>
    <h2 className='font-bold text-xl text-primary'>Durations</h2>
    <p className='text-gray-500'>Select the duration of your video</p>
    <Select onValueChange={(value)=>{
         
        value!= 'Custom Promts' &&onUserSelect('duration', value)
        }}>
        <SelectTrigger className="w-full mt-2 p-2 text-lg">
            <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value='30 seconds'> 30 Seconds</SelectItem>
            <SelectItem value='60 seconds'> 1 Minute</SelectItem>
            <SelectItem value='90 seconds'> 1:30 Minutes</SelectItem>
            <SelectItem value='120 seconds'> 2:00 Minutes</SelectItem>
            <SelectItem value='180 seconds'> 3:00 Minutes</SelectItem>
             
        </SelectContent>
    </Select>

   
</div>
  )
}

export default SelectDuration