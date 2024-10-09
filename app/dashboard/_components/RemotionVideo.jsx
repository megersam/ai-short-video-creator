import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

function RemotionVideo({ script, imageList, audioFileUrl, captions, setDurationInFrame }) {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const getDurationFrames = () => {
        setDurationInFrame(captions[captions?.length - 1]?.end / 1000 * fps)
        return captions[captions?.length - 1]?.end / 1000 * fps
    }

    const getCurrentCaptions = () => {
        const currentTime = (frame / 30) * 1000;  // convert frame number to milliseconds
        const currentCaption = captions.find(
            (word) => currentTime >= word.start && currentTime <= word.end
        );
        return currentCaption ? currentCaption?.text : '';
    };

    return (
        <AbsoluteFill className='bg-black'>
            {imageList?.map((item, index) => {
                const startTime = (index * getDurationFrames()) / imageList?.length;
                const duration = getDurationFrames();

                // Updated scale interpolation logic
                const scale = interpolate(
                    frame,
                    [startTime, startTime + duration / 2, startTime + duration],
                    index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                return (
                    <Sequence key={index} from={startTime} durationInFrames={duration}>
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {/* Apply the scale interpolation here */}
                            <Img
                                src={item}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: `scale(${scale})` // Use the scale value here
                                }}
                            />
                            <AbsoluteFill style={{
                                color: 'white',
                                justifyContent: 'center',
                                top: undefined,
                                bottom: 50,
                                height: 150,
                                textAlign: 'center',
                                width: '100%'
                            }}>
                                <h2 className='text-2xl'>
                                    {getCurrentCaptions()}
                                </h2>
                            </AbsoluteFill>
                        </AbsoluteFill>
                    </Sequence>
                );
            })}
            {audioFileUrl ? (
                <Audio src={audioFileUrl} />
            ) : (
                <p>Loading audio...</p>
            )}
        </AbsoluteFill>
    );
}

export default RemotionVideo;
