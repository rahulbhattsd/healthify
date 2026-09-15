'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { pipeline } = require('@xenova/transformers');
const KnowledgeChunk = require('../KnowledgeChunk');

const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge');
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const CHUNK_SIZE = 300;
const CHUNK_OVERLAP = 50;

function extractTitle(content, filename) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  return path.basename(filename, path.extname(filename));
}

function splitIntoChunks(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= chunkSize) {
    return [words.join(' ')];
  }

  const chunks = [];
  const step = Math.max(1, chunkSize - overlap);
  for (let i = 0; i < words.length; i += step) {
    const chunkWords = words.slice(i, i + chunkSize);
    if (chunkWords.length > 0) {
      chunks.push(chunkWords.join(' '));
    }
    if (i + chunkSize >= words.length) {
      break;
    }
  }

  return chunks;
}

async function buildKnowledgeBase() {
  const atlasUrl = process.env.ATLASDB_URL;
  if (!atlasUrl) {
    console.error('❌ Error: ATLASDB_URL is not defined in environment variables.');
    process.exit(1);
  }

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`❌ Error: Knowledge directory not found at ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.warn(`⚠️ Warning: No markdown files found in ${KNOWLEDGE_DIR}`);
    return;
  }

  console.log(`📚 Found ${files.length} knowledge files to process.`);
  console.log(`🤖 Loading embedding model (${MODEL_NAME})...`);
  const extractor = await pipeline('feature-extraction', MODEL_NAME);

  console.log('📡 Connecting to MongoDB Atlas...');
  await mongoose.connect(atlasUrl, {
    serverSelectionTimeoutMS: 30000,
  });
  console.log('✅ Connected to MongoDB Atlas.');

  const docsToInsert = [];

  for (const file of files) {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const title = extractTitle(content, file);
    const chunks = splitIntoChunks(content, CHUNK_SIZE, CHUNK_OVERLAP);

    console.log(`📄 Processing "${file}" (${chunks.length} chunk(s))...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const output = await extractor(chunkText, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);

      docsToInsert.push({
        title,
        sourceFile: file,
        text: chunkText,
        embedding,
      });
    }
  }

  console.log(`🔄 Clearing existing KnowledgeChunk collection and inserting ${docsToInsert.length} chunks...`);
  await KnowledgeChunk.deleteMany({});
  await KnowledgeChunk.insertMany(docsToInsert);

  console.log(`✅ Successfully stored ${docsToInsert.length} knowledge chunks in Atlas.`);
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB. Build complete.');
}

if (require.main === module) {
  buildKnowledgeBase().catch((err) => {
    console.error('❌ Failed to build knowledge base:', err);
    process.exit(1);
  });
}

module.exports = {
  extractTitle,
  splitIntoChunks,
  buildKnowledgeBase,
};
