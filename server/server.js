import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const VEO_MODEL = 'veo-2.0-generate-001';

// In-memory store for operations
const operations = new Map();

app.post('/api/videos/generate', async (req, res) => {
  const { prompt, referenceImage, sceneId } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const operationId = `op_${Date.now()}_${sceneId}`;
  operations.set(operationId, { status: 'RUNNING', sceneId, prompt, startTime: Date.now() });

  // Kick off the generation asynchronously
  (async () => {
    try {
      console.log(`Starting generation for ${sceneId}`);
      const response = await ai.models.generateVideos({
        model: VEO_MODEL,
        prompt: prompt, // Will trigger a deprecation warning but works in the current SDK version
      });
      
      console.log(`Successfully generated video for ${sceneId}`);
      operations.set(operationId, { 
        ...operations.get(operationId), 
        status: 'SUCCEEDED', 
        result: response 
      });
    } catch (error) {
      console.error(`Error generating video for ${sceneId}:`, error);
      operations.set(operationId, { 
        ...operations.get(operationId), 
        status: 'FAILED', 
        error: error.message 
      });
    }
  })();

  res.json({ operationId, status: 'RUNNING' });
});

app.get('/api/videos/status/:operationId', (req, res) => {
  const { operationId } = req.params;
  const op = operations.get(operationId);
  
  if (!op) {
    return res.status(404).json({ error: 'Operation not found' });
  }
  
  res.json({ operationId, status: op.status, error: op.error });
});

app.get('/api/videos/download/:operationId', async (req, res) => {
  const { operationId } = req.params;
  const op = operations.get(operationId);
  
  if (!op || op.status !== 'SUCCEEDED') {
    return res.status(400).json({ error: 'Video not ready or operation failed' });
  }

  try {
    const sceneId = op.sceneId;
    const mediaDir = path.resolve(__dirname, '../public/media');
    
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }
    
    const outputPath = path.join(mediaDir, `${sceneId}.mp4`);
    
    // Parse the generated video result
    const videoData = op.result; 
    let videoBuffer;

    if (videoData.generatedVideos && videoData.generatedVideos.length > 0) {
       const video = videoData.generatedVideos[0].video;
       if (video.uri) {
         const fileRes = await fetch(video.uri);
         videoBuffer = Buffer.from(await fileRes.arrayBuffer());
       } else if (video.content) {
         videoBuffer = Buffer.from(video.content, 'base64');
       } else if (videoData.generatedVideos[0].bytes) {
         // Another common SDK format
         videoBuffer = Buffer.from(videoData.generatedVideos[0].bytes);
       }
    }

    if (!videoBuffer) {
        throw new Error('Could not extract video bytes from API response.');
    }

    fs.writeFileSync(outputPath, videoBuffer);
    
    res.json({ success: true, file: `${sceneId}.mp4`, path: `/media/${sceneId}.mp4` });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download video', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
