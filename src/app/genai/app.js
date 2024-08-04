import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import mime from 'mime';
import * as dotenv from "dotenv";
dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function convertImageToBase64(imagePath) {
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = fileBuffer.toString('base64');
    return base64Image;
}

async function run() {
    const imagePath = '/Users/vinayupadhyayula/Documents/git_projects/pantry_tracker/src/app/assets/banyan_sale.jpg'; // Replace with your image path
const base64Image = convertImageToBase64(imagePath);
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = "Create a JSON structure for all the items their sale price and quantities from the sale image"

 
const image = {
    inlineData: {
      data: base64Image, // Only the base64-encoded data
      mimeType: mime.getType(imagePath),
    },
  };
  
  const result = await model.generateContent([prompt, image]);
  console.log(result.response.text());
}

run();