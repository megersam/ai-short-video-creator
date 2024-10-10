'use client'
import React,{useState, useEffect} from 'react'
import Header from './_components/header';
import SideNav from './_components/SideNav';
import { VideoDataContext } from '../_context/VideoDataContext'; 
import {useUser} from '@clerk/nextjs'
import { db } from '../../configs/db';
import {Users} from '../../configs/schema';
import { eq } from 'drizzle-orm'; 
import { UserDetailContext } from '../_context/UserDetailContext';
 

function DashboardLayout({ children }) {
    const [videoData, setVideoData] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const {user} = useUser();

    useEffect(()=>{
        user&&getUserDetail();
    }, [user])

    const getUserDetail=async()=>{
        const result = await db.select().from(Users)
        .where(eq(Users.email,user?.primaryEmailAddress?.emailAddress))
        setUserDetail(result[0]);
    }


    return (
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
        <VideoDataContext.Provider  value={{videoData, setVideoData}}>

      
        <div>
            <div  className='hidden md:block h-screen bg-white fixed mt-[65px] w-[65px]'>

                <SideNav/>
            </div>
            <div>
                <Header />
               <div className='md:ml-64 p-10'>
               {children}
               </div>
            </div>
        </div>
         </VideoDataContext.Provider>
         </UserDetailContext.Provider>

    )
}

export default DashboardLayout;