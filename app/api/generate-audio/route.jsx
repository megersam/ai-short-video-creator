import { storage } from "@/configs/FirebaseConfig";
import  textToSpeechClient  from "@google-cloud/text-to-speech";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";
import { Result } from "postcss";
const util = require('util');
const fs = require("fs");

const client = new textToSpeechClient.TextToSpeechClient({
    apiKey:process.env.GOOGLE_API_KEY
});

export async function POST(req){
   
    const {text, id}=await req.json();
    const storageRef = ref(storage, 'ai-short-video-files/'+id+'.mp3')
    const request = {
        input: {text: text},
        // select the language and ssml voice gender(optional).
        voice: {languageCode: 'en-Us', ssmlGender: 'MALE'},
        // select the type of audio encoding.
        audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request.
    const [response] = await client.synthesizeSpeech(request);
    // write the binnary audio content to a local file
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile('output.mp3', response.audioContent, 'binary');
    // upload the file to firebase storage
    const audioBuffer = Buffer.from(response.audioContent, 'binary');

    await uploadBytes(storageRef, audioBuffer, {contentType: 'audio/mp3'});
    
    const downloadUlr = await getDownloadURL(storageRef);
    console.log('Audio content written to file: output.mp3');
    console.log(downloadUlr);

    return NextResponse.json({Result: downloadUlr});
}