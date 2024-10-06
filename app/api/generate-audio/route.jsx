import  textToSpeechClient  from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { Result } from "postcss";
const utils = require('util');
const fs = require("fs");

const client = new textToSpeechClient.TextToSpeechClient({
    apiKey:process.env.GOOGLE_API_KEY
});

export async function POST(req){
   
    const {text, id}=await req.json();

    const request = {
        input: {text: text},
        // select the language and ssml voice gender(optional).
        voice: {languageCode: 'en-Us', ssmlGender: 'NEUTRAL'},
        // select the type of audio encoding.
        audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request.
    const [response] = await client.synthesizeSpeech(request);
    // write the binnary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');

    return NextResponse.json({Result: 'Success'});
}