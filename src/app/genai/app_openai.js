import * as dotenv from "dotenv";
dotenv.config();

import {OpenAI} from "openai";

const openai = new OpenAI();

const resp = await openai.chat.completions.create(
    {
        model : "gpt-4o-mini",
        messages : [
            {
                role: "user",
                content:[
                    {
                        type:"text",
                        text:"Describe this image"
                    },
                    {
                        type : "image_url",
                        image_url:{
                            url:"https://i.pinimg.com/564x/91/92/63/91926392e1128a5bb7e506a40d85349c.jpg",
                            detail: "low",
                        }
                    }
                ]
            }
        ],
        max_tokens:1000,
    }
)
console.log(resp);
console.log(resp.choices[0]);