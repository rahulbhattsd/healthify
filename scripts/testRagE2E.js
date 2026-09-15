'use strict';

require('dotenv').config();
const http = require('http');
const app = require('../server');

async function runTests() {
  console.log('🚀 Starting Healthify RAG End-to-End Verification...');

  // Start app on ephemeral port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`🌐 Test server listening on ${baseUrl}`);

  try {
    // 1. Non-streaming test
    console.log('\n--- Test 1: POST /api/health-advice (Non-streaming) ---');
    const payload = {
      age: 30,
      gender: 'Male',
      weight: '70',
      height: '175',
      duration: '2 days',
      symptoms: ['fever', 'headache'],
      additionalSymptoms: 'feeling warm and tired',
      conditions: 'None',
      medications: 'None',
    };

    const resNonStream = await fetch(`${baseUrl}/api/health-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resNonStream.ok) {
      const errText = await resNonStream.text();
      throw new Error(`Non-stream failed with status ${resNonStream.status}: ${errText}`);
    }

    const dataNonStream = await resNonStream.json();
    console.log('✅ Response status: 200 OK');
    console.log('✅ Has sources field:', Array.isArray(dataNonStream.sources));
    console.log('📚 Sources count:', dataNonStream.sources?.length);
    console.log('📚 Sources:', dataNonStream.sources);

    if (!Array.isArray(dataNonStream.sources) || dataNonStream.sources.length === 0) {
      throw new Error('Expected dataNonStream.sources to contain retrieved items!');
    }

    const hasRelevantSource = dataNonStream.sources.some(
      (s) => s.sourceFile === 'fever.md' || s.sourceFile === 'otc-pain-relief.md' || s.sourceFile === 'red-flag-symptoms.md',
    );
    if (!hasRelevantSource) {
      throw new Error('Expected sources to include fever.md or otc-pain-relief.md!');
    }
    console.log('✅ Verified relevant knowledge file referenced in sources array.');

    const markdown = dataNonStream.response || '';
    if (!markdown.includes('## Sources')) {
      throw new Error('Expected response markdown to contain "## Sources" heading!');
    }
    console.log('✅ Verified response markdown contains "## Sources" heading.');
    console.log('Snippet of response:\n', markdown.slice(0, 400), '\n...\n', markdown.slice(-300));

    // 2. Streaming test
    console.log('\n--- Test 2: POST /api/health-advice?stream=true (Streaming) ---');
    const resStream = await fetch(`${baseUrl}/api/health-advice?stream=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resStream.ok) {
      const errText = await resStream.text();
      throw new Error(`Stream failed with status ${resStream.status}: ${errText}`);
    }

    const ragHeader = resStream.headers.get('x-rag-sources');
    console.log('✅ X-Rag-Sources header present:', Boolean(ragHeader));
    if (ragHeader) {
      const decodedSources = JSON.parse(Buffer.from(ragHeader, 'base64').toString('utf-8'));
      console.log('✅ Decoded X-Rag-Sources count:', decodedSources.length);
      console.log('📚 Streamed Sources:', decodedSources);
    } else {
      throw new Error('Expected X-Rag-Sources header on streaming response!');
    }

    const streamBody = await resStream.text();
    if (!streamBody.includes('## Sources')) {
      throw new Error('Expected streamed markdown to contain "## Sources" heading!');
    }
    console.log('✅ Verified streamed text contains "## Sources" heading.');

    // 3. Fallback / Edge Case: Empty & short symptoms strings
    console.log('\n--- Test 3: Retrieval query builder on edge case strings ---');
    const { buildRetrievalQuery, embedText, retrieveRelevantChunks } = require('../ragService');
    const emptyQuery = buildRetrievalQuery({ symptoms: '', preExistingConditions: 'Not provided' });
    console.log(`Empty query output: "${emptyQuery}"`);
    const emptyEmbedding = await embedText(emptyQuery);
    console.log('Empty query embedded length:', emptyEmbedding.length);
    const emptyChunks = await retrieveRelevantChunks(emptyEmbedding, 2);
    console.log('Empty query retrieved chunks safely without error, count:', emptyChunks.length);
    console.log('✅ Retrieval never throws on empty/short strings.');

    console.log('\n🎉 ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY! 🎉');
  } finally {
    server.close();
  }
}

runTests().then(
  () => process.exit(0),
  (err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  },
);
