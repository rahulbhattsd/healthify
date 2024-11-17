const { pipeline } = require('transformers');
let aiPipeline;

const loadModel = async () => {
  if (!aiPipeline) {
    aiPipeline = await pipeline('text-generation', {
      model: 'medalpaca/medalpaca-7b',
    });
  }
};

const getAIResponse = async (inputText) => {
  if (!aiPipeline) await loadModel();
  return await aiPipeline(inputText, { max_length: 100 });
};

module.exports = { getAIResponse };
