import express, { json } from "express";
import cloudinary from "cloudinary";

const router = express.Router();
router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
    const cloud = await cloudinary.v2.uploader.upload(buffer);
    res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id,
    });
  } catch (error: any) {
    console.error("Error uploading file to Cloudinary:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });

router.post("/career", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills) {
      return res.status(400).json({
        message: "Skills are required",
      });
    }

    const prompt = `
Based on the following skills: ${skills}.
Please act as a career advisor and generate a career path suggestion.
Your entire response must be in a valid JSON format. Do not include any text or markdown formatting outside of the JSON structure.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let jsonResponse;

    try {
      let rawText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("No response from AI");
      }

      // remove markdown
      rawText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // extract JSON only
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No valid JSON found");
      }

      jsonResponse = JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.log("RAW CAREER RESPONSE:", response);

      return res.status(200).json({
        summary: "AI is currently unstable, try again",
        jobOptions: [],
        skillsToLearn: [],
        learningApproach: { title: "", points: [] },
      });
    }

    // ✅ THIS WAS MISSING
    return res.json(jsonResponse);

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/resume-analyser", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({
        message: "Resume is required",
      });
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume
and provide:
1. An ATS compatibility score (0-100)
2. Detailed suggestions to improve the resume for better ATS performance
Your entire response must be in valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.
The JSON object should have the following structure:
{
 "atsScore": 85,
 "scoreBreakdown": {
 "formatting": {
 "score": 90,
 "feedback": "Brief feedback on formatting"
 },
 "keywords": {
 "score": 80,
 "feedback": "Brief feedback on keyword usage"
 },
 "structure": {
 "score": 85,
 "feedback": "Brief feedback on resume structure"
 },
 "readability": {
 "score": 88,
 "feedback": "Brief feedback on readability"
 }
 },
 "suggestions": [
 {
 "category": "Category name (e.g., 'Formatting', 'Content', 'Keywords',
'Structure')",
 "issue": "Description of the issue found",
 "recommendation": "Specific actionable recommendation to fix it",
 "priority": "high/medium/low"
 }
 ],
 "strengths": [
 "List of things the resume does well for ATS"
 ],
 "summary": "A brief 2-3 sentence summary of the overall ATS performance"
}
Focus on:
- File format and structure compatibility
- Proper use of standard section headings
- Keyword optimization
- Formatting issues (tables, columns, graphics, special characters)
- Contact information placement
- Date formatting
- Use of action verbs and quantifiable achievements
- Section organization and flow
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
              },
            },
          ],
        },
      ],
    });
    let jsonResponse;

    try {
      const rawText = response?.text
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      if (!rawText) {
        throw new Error("No response from AI");
      }
      jsonResponse = JSON.parse(rawText);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to parse AI response as JSON",
        error: (error as Error).message,
        rawResponse: response?.text,
      });
    }
    res.json(jsonResponse);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
