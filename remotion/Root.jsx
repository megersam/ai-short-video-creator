import RemotionVideo from '../app/dashboard/_components/RemotionVideo';
import React from 'react';
import { Composition } from 'remotion';

function RemotionRoot() {
    return (
        <>
            <Composition
                id='Empty'
                component={RemotionVideo}
                durationInFrames={60}
                fps={30}
                width={1280}
                height={720}
            />
        </>
    );
}

export default RemotionRoot;  // This is correct
