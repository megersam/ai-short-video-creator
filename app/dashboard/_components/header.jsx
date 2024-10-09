import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


function Header(){
    return (
        <div className='p-3 px-5 flex items-center justify-between shadow-md'>
           <div className='flex gap-3 items-center'>
            <Image src={'/logo.png'} width={30} height={30}/>
            <h2 className='font-bold text-xl'>Ai Short Creator</h2>
           </div>
           <div className='flex gap-3 items-center'>
            <Link href='/dashboard' passHref>
            <Button>Dashboard</Button>
            </Link>
            <UserButton/>
           </div>
        </div>
    )
}

export  default Header