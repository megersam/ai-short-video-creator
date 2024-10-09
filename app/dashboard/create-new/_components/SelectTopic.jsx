'use client'
import React, {useState} from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

function SelectTopic({onUserSelect}) {
    const options=[
        'Custom Promts', 
        'kids story', 
        'Animal Story',
        'Motivational',
        'life couch',
        'short funny story',
        'Random AI story', 
        'Scary Story', 
        
    ]
    const [selectedOption, setSelectedOption]=useState();
    return (
        <div>
            <h2 className='font-bold text-xl text-primary'>Content</h2>
            <p className='text-gray-500'>Whats is the topic of your video?</p>
            <Select onValueChange={(value)=>{
                setSelectedOption(value)
                value!= 'Custom Promts' &&onUserSelect('topic', value)
                }}>
                <SelectTrigger className="w-full mt-2 p-2 text-lg">
                    <SelectValue placeholder="Select Content" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((item, index) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))}
                     
                </SelectContent>
            </Select>

           {selectedOption=='Custom Promts'&&
             <Textarea className='mt-3' 
             onChange={(e)=>onUserSelect('topic', e.target.value)}
             placeholder='Write promt on which you want to generate'/>
           }
        </div>
    )
}

export default SelectTopic