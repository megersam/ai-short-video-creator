'use client'
import { CircleUserIcon, FileVideo, PanelsTopLeft, ShieldIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav() {
    const MenuOptions= [
        {
            id:1,
            name:"Dashboard",
            path: '/dashboard',
            icon: PanelsTopLeft
        },
        {
            id:2,
            name:"Create New",
            path: '/dashboard/create-new',
            icon: FileVideo
        },
        {
            id:3,
            name:"Upgrade",
            path: '/dashboard/upgrade',
            icon: ShieldIcon
        },
        {
            id:4,
            name:"Account",
            path: '/account',
            icon: CircleUserIcon
        }
    ]
    // get current path namme and id.
    const path = usePathname();
    
  return (
    <div className='w-64 h-screen shadow-md p-5'>
        <div className='grid gap-3' >
            {MenuOptions.map((item, index)=>(
                <Link href={item.path} key={index} passHref>
                <div className={`flex items-center gap-3 p-3
                hover:bg-primary hover:text-white rounded-md cursor-pointer'
                ${path==item.path && 'bg-primary text-white'}
                 key={index}`}>
                    <item.icon/>
                    <h2>{item.name}</h2>
                </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default SideNav