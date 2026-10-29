/**
 * File: api/chat.js
 * Vercel Serverless Function untuk Kak Diko SD (Kelas 1 s/d Kelas 6 SD) (`/api/chat`).
 * Menggunakan SDK resmi terbaru `@google/genai` (Interactions API) dengan otak AI
 * ringan dan ekspresif `gemini-3.5-flash-lite` serta kustomisasi karakter favorit anak.
 */

import { getCharacterCompanion, getGradeProfile } from './curriculumData.js';
import {
  buildSystemInstruction,
  generateSmartFallbackReply,
  historyToInteractionSteps,
  pruneHistory,
  resolveChildNameFromSession,
  sanitizeForTTS
} from './systemPrompt.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'Kak Diko SD (Kelas 1-6) Adaptive Voice AI Tutor API',
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      supportedGrades: [1, 2, 3, 4, 5, 6],
      supportedCharacters: ['owl', 'dino', 'robot', 'cat', 'astro'],
      hasApiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Metode HTTP tidak diizinkan. Gunakan metode POST.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Format JSON tidak valid.' });
    }
  }

  const {
    message,
    history = [],
    topic = 'kenalan',
    childName = '',
    grade = 1,
    characterId = 'owl',
    childBio = '',
    parentDirective = '',
    scheduleNote = ''
  } = body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'Pesan suara atau teks anak tidak boleh kosong.'
    });
  }

  const profile = getGradeProfile(grade);
  const companion = getCharacterCompanion(characterId);
  const cleanMessage = message.trim().slice(0, 400);
  const cleanedHistory = pruneHistory(history, 12);
  const detectedName = resolveChildNameFromSession(cleanMessage, cleanedHistory, childName);

  const systemInstruction = buildSystemInstruction({
    grade: profile.grade,
    characterId: companion.id,
    topic,
    childName: detectedName,
    childBio,
    parentDirective,
    scheduleNote
  });

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const modelName = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    const fallbackReply = generateSmartFallbackReply({
      message: cleanMessage,
      history: cleanedHistory,
      topic,
      childName,
      grade: profile.grade,
      characterId: companion.id,
      childBio,
      parentDirective,
      scheduleNote
    });
    return res.status(200).json({
      reply: fallbackReply,
      childName: detectedName,
      grade: profile.grade,
      characterId: companion.id,
      model: 'local-smart-tutor-v3',
      mode: 'local-fallback'
    });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const steps = historyToInteractionSteps(cleanedHistory, cleanMessage);

    const interaction = await ai.interactions.create({
      model: modelName,
      input: steps,
      system_instruction: systemInstruction,
      generation_config: {
        max_output_tokens: profile.maxTokens
      }
    });

    const rawOutputText = interaction?.output_text || '';
    const reply = sanitizeForTTS(rawOutputText, profile.maxSentences);

    return res.status(200).json({
      reply,
      childName: detectedName,
      grade: profile.grade,
      characterId: companion.id,
      model: modelName,
      mode: 'gemini-api',
      interactionId: interaction?.id || null
    });
  } catch (error) {
    console.error('[Kak Diko /api/chat Error]:', error?.message || error);

    const gracefulReply = generateSmartFallbackReply({
      message: cleanMessage,
      history: cleanedHistory,
      topic,
      childName,
      grade: profile.grade,
      characterId: companion.id,
      childBio,
      parentDirective,
      scheduleNote
    });

    return res.status(200).json({
      reply: gracefulReply,
      childName: detectedName,
      grade: profile.grade,
      characterId: companion.id,
      model: modelName,
      mode: 'error-recovery-fallback',
      warning: 'Menggunakan respons cadangan karena koneksi ke Gemini sedang sibuk.'
    });
  }
}
