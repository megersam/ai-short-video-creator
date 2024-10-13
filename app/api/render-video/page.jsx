 // pages/api/render-video.js
import { renderMedia } from '@remotion/renderer'; // Assuming you are using Remotion
import RemotionVideo from '../app/dashboard/_components/RemotionVideo'; // Import your video component
const util = require('util');
const fs = require("fs");
export default async function handler(req, res) {
  const { captions, imageList, audioFileUrl, durationInFrames } = req.body;

  try {
    const videoFile = await renderMedia({
      component: RemotionVideo,
      props: { captions, imageList, audioFileUrl },
      composition: {
        width: 300,
        height: 450,
        fps: 30,
        durationInFrames,
      },
    });

    // Here you might save the file to your server or cloud storage
    // For this example, we will send the file back as a response
    res.status(200).json({ videoFile });
  } catch (error) {
    console.error("Error rendering video:", error);
    res.status(500).json({ error: "Failed to render video." });
  }
}
