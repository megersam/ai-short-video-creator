'use client'
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm"; 
import VideoList from "./_components/VideoList";


function Dashboard() {
    const {user} = useUser();
    const [videoList, setVideoList] = useState([]);
    

    // used to get users video.

    useEffect(()=>{
        user&&GetVideoList()
    }, [user])

    const GetVideoList= async()=>{
        // API call to get video list
        const result = await db.select().from(VideoData)
         .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress))


         console.log(result);
         setVideoList(result);
    }



    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
                <Link href={'/dashboard/create-new'}>
                <Button>+ Create New</Button>
                </Link>
            </div>
            {/* //  video list or video empty state. */}
            {videoList?.length == 0 && <div>
                <EmptyState />
            </div>}
             {/* list of videos */}
             <VideoList videoList={videoList}/>
        </div>
    );
}

export default Dashboard;