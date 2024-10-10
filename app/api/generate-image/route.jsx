import { storage } from "@/configs/FirebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios"; // Ensure axios is imported

// export const config = {
//   runtime: "nodejs", // Switch to Node.js runtime to allow background functions
// };

export async function POST(req) {
  try {
    // Fix the variable name
    const { prompt } = await req.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1
    };

    // Call Replicate API to generate the image
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );
    console.log(output); // Check if the output is correct

    // Fetch the image data from the generated image URL
    const base64Image = "data:image/png;base64," + await ConvertImage(output[0]);

    // Save the image to Firebase Storage
    const fileName = 'ai-short-video-files/' + Date.now() + ".png";
    const storageRef = ref(storage, fileName);
    await uploadString(storageRef, base64Image, 'data_url');

    // Get the download URL from Firebase
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(downloadUrl);

    // Return the download URL as a response
    return NextResponse.json({ result: downloadUrl });

  } catch (error) {
    console.error("Error in generating image:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 400 });
  }
}

// Convert image URL to base64 string
const ConvertImage = async (imageUrl) => {
  try {
    const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(resp.data).toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error fetching image data:', error);
  }
};
