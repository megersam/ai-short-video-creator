'use client'
import Image from 'next/image'
import React, {useState} from 'react'

function SelectStyle({onUserSelect}) {
    const styleOptions=[
        {
            name: 'Realstic',
            image: '/realstic.png'
        },
        {
            name: 'carton',
            image: '/carton.jpg'
        },
        {
            name: 'commic',
            image: '/commic.png'
        },
        {
            name: 'water Color',
             
        },
       
    ]
    const [selectedOption, setSelectedOption] = useState();

  return (
    <div className='mt-7'>
         <h2 className='font-bold text-xl text-primary'>Style</h2>
         <p className='text-gray-500'>Select Your Video Style</p>
         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mt-3'>
           {styleOptions.map((item,index)=>(
           <div
           className={`
             relative hover:scale-105 transition-all cursor-pointer rounded-xl
             ${selectedOption === item.name && 'border-4 border-primary'}
           `}
           onClick={() => {
             setSelectedOption(item.name);
             onUserSelect('imageStyle', item.name);
           }}
         >
           <button className="w-full text-center p-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
             {item.name}
           </button>
         </div>
         
           ))}
         </div>
    </div>
  )
}

export default SelectStyle