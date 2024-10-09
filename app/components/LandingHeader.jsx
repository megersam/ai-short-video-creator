 
 
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


function LandingHeader(){
    return (
        <div className="p-3 px-5 flex items-center fixed  w-full bg-white justify-between shadow-md">
           <div className='flex gap-3 items-center'>
            <Image src={''} width={30} height={30}/>
            <h2 className='font-bold text-xl'>Ai Short Creator</h2>
           </div>
           <div className='flex gap-3 items-center'>
           <Link href='/dashboard' passHref>
            <Button>Get Start</Button>
            </Link>
           </div>
        </div>
    )
}

export  default LandingHeader