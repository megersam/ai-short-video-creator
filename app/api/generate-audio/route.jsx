import { storage } from "@/configs/FirebaseConfig";
import textToSpeechClient from "@google-cloud/text-to-speech";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";

// Initialize Text-to-Speech client
const client = new textToSpeechClient.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const runtime = "nodejs"

export async function POST(req) {
  const { text, id } = await req.json();

  // Firebase storage reference for the audio file
  const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);

  // Google Cloud TTS request object
  const request = {
    input: { text: text },
    voice: { languageCode: "en-US", ssmlGender: "MALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    // Generate audio from text using Google Cloud TTS
    const [response] = await client.synthesizeSpeech(request);
    
    // Convert binary response to Buffer
    const audioBuffer = Buffer.from(response.audioContent, "binary");

    // Run the upload in the background
    const uploadTask = uploadAudioToFirebase(storageRef, audioBuffer);

    // Return a response immediately while the upload happens in the background
    return NextResponse.json({ message: 'Audio generation started', taskId: id });
  } catch (error) {
    console.error("Error generating audio or uploading:", error);
    return NextResponse.json({ error: "Failed to generate audio and upload to Firebase" });
  }
}

// Helper function to upload audio to Firebase
async function uploadAudioToFirebase(storageRef, audioBuffer) {
  try {
    await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });
    const downloadUrl = await getDownloadURL(storageRef);
    console.log("Firebase Download URL:", downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading audio to Firebase:", error);
    throw new Error("Failed to upload audio");
  }
}
