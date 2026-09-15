const mongoose = require('mongoose');

const knowledgeChunkSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sourceFile: {
      type: String,
      required: true,
      trim: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('KnowledgeChunk', knowledgeChunkSchema);
