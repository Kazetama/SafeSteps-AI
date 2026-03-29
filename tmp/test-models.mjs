import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // There is no direct listModels in the new SDK easily accessible without extra setup, 
    // so I will just try to ping a model.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("gemini-1.5-flash OK");
  } catch (err) {
    console.log("gemini-1.5-flash failed:", err.message);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent("test");
      console.log("gemini-2.0-flash OK");
    } catch (err2) {
      console.log("gemini-2.0-flash failed:", err2.message);
    }
  }
}

listModels();
