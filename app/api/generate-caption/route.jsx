import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { audioFileUrl } = await req.json();

        const client = new AssemblyAI({
            apiKey: process.env.CAPTION_API,
        });

        const FILE_URL = audioFileUrl;

        const data = { audio: FILE_URL };

        // Get the full transcript response
        const transcript = await client.transcripts.transcribe(data);
        console.log(transcript); // Log the full response to check structure

        return NextResponse.json({ 'result': transcript.words });
    } catch (error) {
        return NextResponse.json({ 'error': error });
    }
}
