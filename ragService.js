'use strict';

const { pipeline } = require('@xenova/transformers');
const KnowledgeChunk = require('./KnowledgeChunk');

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
let embeddingPipelinePromise = null;

function getEmbeddingPipeline() {
  if (!embeddingPipelinePromise) {
    embeddingPipelinePromise = pipeline('feature-extraction', MODEL_NAME);
  }
  return embeddingPipelinePromise;
}

/**
 * Generates an embedding vector for the given text using local transformers.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function embedText(text) {
  const safeText = typeof text === 'string' ? text.trim() : '';
  const extractor = await getEmbeddingPipeline();
  // If text is completely empty, use a fallback neutral token to produce a valid vector
  const input = safeText || 'health advice';
  const output = await extractor(input, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Builds a concise query string from symptoms, conditions, and medications only.
 * Explicitly ignores age, weight, height, and duration.
 * @param {object} value
 * @returns {string}
 */
function buildRetrievalQuery(value) {
  if (!value || typeof value !== 'object') {
    return '';
  }

  const parts = [];

  const symptoms = (typeof value.symptoms === 'string' ? value.symptoms : '').trim();
  if (symptoms && !isNotProvided(symptoms)) {
    parts.push(`Symptoms: ${symptoms}`);
  }

  const rawConditions = value.preExistingConditions ?? value.conditions;
  const conditions = (typeof rawConditions === 'string' ? rawConditions : '').trim();
  if (conditions && !isNotProvided(conditions)) {
    parts.push(`Pre-existing conditions: ${conditions}`);
  }

  const rawMedications = value.currentMedications ?? value.medications;
  const medications = (typeof rawMedications === 'string' ? rawMedications : '').trim();
  if (medications && !isNotProvided(medications)) {
    parts.push(`Current medications: ${medications}`);
  }

  return parts.join('. ').trim();
}

function isNotProvided(val) {
  const lower = val.toLowerCase();
  return (
    lower === 'not provided' ||
    lower === 'none reported' ||
    lower === 'none' ||
    lower === 'n/a' ||
    lower === 'nil' ||
    lower === 'no'
  );
}

/**
 * Computes cosine similarity between two numeric vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number}
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieves the top-k most relevant knowledge chunks.
 * Tries MongoDB Atlas $vectorSearch first, falls back to in-memory cosine similarity.
 * @param {number[]} queryEmbedding
 * @param {number} k
 * @returns {Promise<Array<{ title: string, sourceFile: string, text: string, score?: number }>>}
 */
async function retrieveRelevantChunks(queryEmbedding, k = 4) {
  if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
    return [];
  }

  // 1. Attempt Atlas $vectorSearch
  try {
    const vectorSearchResults = await KnowledgeChunk.aggregate([
      {
        $vectorSearch: {
          index: 'kb_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: Math.max(k * 10, 20),
          limit: k,
        },
      },
      {
        $project: {
          title: 1,
          sourceFile: 1,
          text: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]).exec();

    if (Array.isArray(vectorSearchResults) && vectorSearchResults.length > 0) {
      console.log(`[RAG] Retrieved ${vectorSearchResults.length} chunk(s) via Atlas $vectorSearch (kb_vector_index).`);
      return vectorSearchResults;
    }

    console.log('[RAG] Atlas $vectorSearch returned 0 results. Falling back to in-memory cosine similarity.');
  } catch (vectorSearchError) {
    console.log(
      `[RAG] Atlas $vectorSearch unavailable or failed (${vectorSearchError.message}). Falling back to in-memory cosine similarity.`,
    );
  }

  // 2. In-memory cosine similarity fallback
  try {
    const allChunks = await KnowledgeChunk.find({}, 'title sourceFile text embedding').lean().exec();
    if (!allChunks || allChunks.length === 0) {
      console.warn('[RAG] In-memory fallback: No chunks found in KnowledgeChunk collection.');
      return [];
    }

    const scored = allChunks
      .map((chunk) => ({
        title: chunk.title,
        sourceFile: chunk.sourceFile,
        text: chunk.text,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    console.log(`[RAG] Retrieved ${scored.length} chunk(s) via in-memory cosine similarity fallback.`);
    return scored;
  } catch (fallbackError) {
    console.error('[RAG] In-memory cosine similarity fallback failed:', fallbackError.message);
    return [];
  }
}

/**
 * Formats retrieved chunks into a numbered Reference Material block and sources metadata.
 * @param {Array<{ title: string, sourceFile: string, text: string }>} chunks
 * @returns {{ contextBlock: string, sources: Array<{ number: number, title: string, sourceFile: string }> }}
 */
function formatContextBlock(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return {
      contextBlock: '',
      sources: [],
    };
  }

  const sources = [];
  const lines = ['### Reference Material'];

  chunks.forEach((chunk, index) => {
    const number = index + 1;
    const title = chunk.title || 'General Medical Topic';
    const sourceFile = chunk.sourceFile || 'knowledge-base';
    const text = (chunk.text || '').trim();

    sources.push({
      number,
      title,
      sourceFile,
    });

    lines.push(`[${number}] ${title} (${sourceFile}):\n${text}`);
  });

  return {
    contextBlock: lines.join('\n\n'),
    sources,
  };
}

module.exports = {
  embedText,
  buildRetrievalQuery,
  cosineSimilarity,
  retrieveRelevantChunks,
  formatContextBlock,
};
