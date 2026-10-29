/**
 * File: api/tts.js
 * Endpoint Serverless `/api/tts` untuk menghasilkan audio suara ekspresif menggunakan
 * model `gemini-3.8-flash-lite-tts` (@google/genai v2 Interactions API).
 * Jika kunci API tidak tersedia, frontend otomatis beralih mulus ke Web Speech API bawaan Chromebook.
 */

const DEFAULT_TTS_MODEL = 'gemini-3.8-flash-lite-tts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Gunakan metode POST.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Format JSON tidak valid.' });
    }
  }

  const { text = '', lang = 'id-ID', voice = 'Kore' } = body || {};
  const cleanText = String(text || '').trim().slice(0, 450);

  if (!cleanText) {
    return res.status(400).json({ error: 'Teks TTS tidak boleh kosong.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      mode: 'browser-webspeech-fallback',
      audioBase64: null
    });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const interaction = await ai.interactions.create({
      model: process.env.GEMINI_TTS_MODEL || DEFAULT_TTS_MODEL,
      input: cleanText,
      response_format: {
        type: 'audio'
      },
      generation_config: {
        speech_config: [
          {
            voice,
            language: lang
          }
        ]
      }
    });

    const audioObj = interaction?.output_audio;
    if (audioObj && audioObj.data) {
      return res.status(200).json({
        mode: 'gemini-flash-lite-tts',
        mimeType: audioObj.mime_type || 'audio/wav',
        audioBase64: audioObj.data
      });
    }

    return res.status(200).json({
      mode: 'browser-webspeech-fallback',
      audioBase64: null
    });
  } catch (err) {
    console.warn('[Kak Bimo /api/tts Fallback]:', err?.message || err);
    return res.status(200).json({
      mode: 'browser-webspeech-fallback',
      audioBase64: null
    });
  }
}
