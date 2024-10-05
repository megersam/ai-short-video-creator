/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
   
   export const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "write a script to generate 60 seconds video on topic: interesting historical story alng with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePromt and content as a field"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## 60 Second Historical Story Script with AI Image Prompts\n\n**Title:** The Lost City of Petra\n\n**Content:**\n\n```json\n[\n  {\n    \"imagePrompt\": \"A vast, barren desert landscape under a scorching sun. A lone, weathered signpost reads 'To Petra.'\",\n    \"content\": \"For centuries, the ancient city of Petra lay hidden in the Jordanian desert, shrouded in mystery and legend. Known as the 'Rose City' for its sandstone cliffs, Petra was once a thriving hub of trade and culture. But in the 4th century AD, it was abandoned, swallowed by the sands of time.\"\n  },\n  {\n    \"imagePrompt\": \"Close-up shot of a hand delicately tracing the intricate carvings on a sandstone facade, revealing a hidden entrance to the city. Sunlight streams through the opening.\",\n    \"content\": \"In the 19th century, a Swiss explorer named Johann Ludwig Burckhardt stumbled upon the entrance to this lost city. As he entered the narrow gorge, the sun glinted off the rose-colored cliffs, revealing a breathtaking sight.\"\n  },\n  {\n    \"imagePrompt\": \"Panoramic view of the Treasury of Petra, a majestic, intricately carved facade with a towering urn at its peak. Sunlight bathes the facade in golden light.\",\n    \"content\": \"Before him stood the Treasury, a magnificent temple carved into the sandstone. Its ornate facade, complete with a towering urn at its peak, spoke of the wealth and artistry of the Nabataeans, the people who built Petra.\"\n  },\n  {\n    \"imagePrompt\": \"A bustling marketplace in ancient Petra, filled with merchants, traders, and travelers from all corners of the world. Camels laden with goods traverse the narrow streets.\",\n    \"content\": \"Imagine the city in its heyday, bustling with life. Traders from across the ancient world gathered here, exchanging goods and stories. The city was a melting pot of cultures, a testament to the power of trade and diplomacy.\"\n  },\n  {\n    \"imagePrompt\": \"A large, intricately decorated tomb carved into the cliff face, with intricate carvings depicting scenes of daily life and religious rituals.\",\n    \"content\": \"Petra wasn't just a trading center, it was a place of great beauty and spirituality. The Nabataeans carved elaborate tombs into the cliffs, showcasing their beliefs and artistic talents.\"\n  },\n  {\n    \"imagePrompt\": \"A lone, weathered stone inscription on a cliff face, barely visible in the harsh desert light. The inscription reads 'The lost city of Petra.'\",\n    \"content\": \"But why was Petra abandoned? The exact reasons remain a mystery. Some believe it was due to climate change, others to the rise of new trade routes. But whatever the cause, Petra was swallowed by the sands, its secrets lost for centuries.\"\n  },\n  {\n    \"imagePrompt\": \"A modern-day tourist stands in awe before the Treasury of Petra, dwarfed by its grandeur. The vast desert landscape stretches out behind the city.\",\n    \"content\": \"Today, Petra is a UNESCO World Heritage Site, a testament to the enduring power of human ingenuity and the enduring mystery of a lost civilization. As you stand before the Treasury, imagine the echoes of a forgotten world whispering through the sandstone.\"\n  }\n]\n```\n\n**Note:** This script is designed for a 60-second video. You can adjust the content and image prompts for each scene to fit your desired narrative and pacing. \n\n**Additional Tips:**\n\n* **Visual Variety:** Include different shots (wide, close-up, pan) and angles to maintain viewer interest.\n* **Music:** Use evocative music to enhance the emotional impact of the story.\n* **Voiceover:** A professional voiceover can add depth and authenticity to the narrative.\n\nThis script provides a starting point for your video. You can add your own creative touches and adapt it to your specific needs. Remember, the goal is to tell a compelling and visually engaging story about the lost city of Petra. \n"},
          ],
        },
      ],
    });
  
     
   