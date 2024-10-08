import React,{useState} from 'react'
import {Thumbnail} from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import PlayerDialog from './PlayerDialog'; 

function VideoList({videoList}) {
    const [openPlayDialog, setOpenPlayDialog] = useState(false);
    const [videoId, setVideoId] = useState();

  return (
    <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'
    >
        {videoList?.map((video,index)=>(
            <div className='cursor-pointer
             hover:scale-105 transition-all'
             onClick={()=>{setOpenPlayDialog(Date.now());
                setVideoId(video?.id)
             }}

             >
                <Thumbnail
                  component={RemotionVideo}
                  compositionWidth={250}
                  compositionHeight={350}
                  frameToDisplay={30}
                  durationInFrames={120}
                  fps={30}
                  style={{
                    borderRadius:25
                  }}
                  inputProps={{
                    ...video,
                    setDurationInFrame:(v)=>console.log(v)
                  }}
                />
            </div>
        ))}
        <PlayerDialog playVideo={openPlayDialog} videoId={videoId}/>
    </div>
  )
}

export default VideoList