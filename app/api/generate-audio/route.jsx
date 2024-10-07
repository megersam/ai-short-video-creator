import { storage } from "@/configs/FirebaseConfig";
import textToSpeechClient from "@google-cloud/text-to-speech";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";

const util = require('util');
const fs = require("fs");

// Initialize Text-to-Speech client
const client = new textToSpeechClient.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY
});

export async function POST(req) {
    const { text, id } = await req.json();

    // Firebase storage reference for the audio file
    const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);

    // Google Cloud TTS request object
    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: 'MALE' }, // Ensure the correct language and gender
        audioConfig: { audioEncoding: 'MP3' }
    };

    // Generate audio from text using Google Cloud TTS
    const [response] = await client.synthesizeSpeech(request);

    // Convert binary response to Buffer for upload
    const audioBuffer = Buffer.from(response.audioContent, 'binary');

    // Upload the audio buffer to Firebase storage
    try {
        await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });
        
        // Fetch the download URL for the uploaded file
        const downloadUrl = await getDownloadURL(storageRef);

        console.log('Audio content successfully uploaded to Firebase');
        console.log('Firebase Download URL:', downloadUrl);

        // Return the download URL as the response
        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        console.error('Error uploading audio to Firebase or fetching download URL:', error);
        return NextResponse.json({ error: 'Failed to generate audio and upload to Firebase' });
    }
}
