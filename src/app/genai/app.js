import { GoogleGenerativeAI } from "@google/generative-ai";
// import fs from 'fs';
import mime from 'mime';
import * as dotenv from "dotenv";



function convertImageToBase64(imagePath) {
    // const fileBuffer = fs.readFileSync(imagePath);
    // const base64Image = fileBuffer.toString('base64')
    if(imagePath){
        const base64Image = imagePath.toString('base64');
        return base64Image;
    }
    return
}
async function run(imagePath,api_key) {
    dotenv.config();
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    // const imagePath = '/Users/vinayupadhyayula/Documents/git_projects/pantry_tracker/src/app/assets/banyan_sale.jpg'; // Replace with your image path
 //const base64Image = convertImageToBase64(imagePath);
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = "Identify the item in the image and return a json response with two fields, item_name and image_descr in a formatted json without the ```"
 console.log(imagePath);
 console.log(mime.getType(imagePath))
const image = {
    inlineData: {
      data: imagePath.split(';')[1].split(',')[1], // Only the base64-encoded data
      mimeType : imagePath.split(';')[0].split(':')[1]
    },
  };
  
  const result = await model.generateContent([prompt, image]);
  console.log(result.response);
  return result;
}
export {convertImageToBase64,run}
// run();