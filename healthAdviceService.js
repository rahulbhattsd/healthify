'use strict';

const VALID_MODELS = [
  'openai/gpt-oss-120b',
  'llama3-70b-8192',
];
const DEFAULT_MODEL = 'openai/gpt-oss-120b';

function resolveGroqModel(envModel) {
  if (envModel && VALID_MODELS.includes(envModel.trim())) {
    return envModel.trim();
  }

  return DEFAULT_MODEL;
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => cleanString(item))
    .filter(Boolean);
}

function sanitiseOptional(raw, maxLen) {
  const value = cleanString(raw);
  if (!value) {
    return 'Not provided';
  }

  return value.length > maxLen ? value.slice(0, maxLen) : value;
}

function normaliseGender(rawGender) {
  const gender = cleanString(rawGender);
  if (!gender) {
    return '';
  }

  const canonical = gender.toLowerCase().replace(/\s+/g, ' ');
  const mapping = {
    female: 'Female',
    male: 'Male',
    'non-binary': 'Non-binary',
    nonbinary: 'Non-binary',
    other: 'Other',
    'prefer not to say': 'Prefer not to say',
    prefer_not_to_say: 'Prefer not to say',
  };

  return mapping[canonical] || gender;
}

function normaliseSymptoms(body) {
  const selectedSymptoms = cleanArray(body.symptoms);
  const additionalSymptoms = cleanString(body.additionalSymptoms);
  const symptomSummary = [...selectedSymptoms];

  if (additionalSymptoms) {
    symptomSummary.push(`Additional notes: ${additionalSymptoms}`);
  }

  return {
    selectedSymptoms,
    additionalSymptoms,
    symptoms: symptomSummary.join(', '),
  };
}

function validateHealthAdvicePayload(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { errors: ['Request body must be a JSON object.'], value: {} };
  }

  const age = Number(body.age);
  if (!body.age && body.age !== 0) {
    errors.push('Age is required.');
  } else if (!Number.isFinite(age) || age < 1 || age > 120) {
    errors.push('Age must be a number between 1 and 120.');
  }

  const gender = normaliseGender(body.gender);
  if (!gender) {
    errors.push('Gender is required.');
  }

  const weight = cleanString(body.weight);
  if (!weight) {
    errors.push('Weight is required.');
  }

  const height = cleanString(body.height);
  if (!height) {
    errors.push('Height is required.');
  }

  const duration = cleanString(body.duration);
  if (!duration) {
    errors.push('Duration is required.');
  }

  const { selectedSymptoms, additionalSymptoms, symptoms } = normaliseSymptoms(body);
  if (!symptoms) {
    errors.push('Symptoms are required.');
  }

  const preExistingConditions = sanitiseOptional(
    body.preExistingConditions ?? body.conditions,
    500,
  );
  const allergies = sanitiseOptional(body.allergies, 500);
  const currentMedications = sanitiseOptional(
    body.currentMedications ?? body.medications,
    500,
  );

  return {
    errors,
    value: {
      age,
      gender,
      weight,
      height,
      duration,
      symptoms,
      selectedSymptoms,
      additionalSymptoms,
      conditions: preExistingConditions,
      preExistingConditions,
      allergies,
      medications: currentMedications,
      currentMedications,
    },
  };
}

function buildHealthAdvicePrompt(data) {
  const {
    age,
    gender,
    symptoms,
    duration,
    weight,
    height,
    preExistingConditions,
    allergies,
    currentMedications,
  } = data;

  const systemPrompt =
    "You are a knowledgeable and empathetic health advisor. Based on the patient's health form data, provide: 1) Possible insights about their condition, 2) Practical home remedies, 3) OTC medicine suggestions (always include a disclaimer to consult a doctor), 4) Lifestyle and dietary tips, 5) Red flag symptoms that require immediate medical attention. Be clear, structured, and compassionate. Do not diagnose - only advise." +
    '\n\n' +
    'Respond in Markdown using exactly these headings in this order:' +
    '\n## Possible Insights' +
    '\n## Home Remedies' +
    '\n## OTC Medicines' +
    '\n## Lifestyle Tips' +
    '\n## See a Doctor' +
    '\n## Safety Disclaimer';

  const userPrompt = [
    'Here is the patient intake information:',
    '',
    `- Age: ${age} years`,
    `- Gender: ${gender}`,
    `- Weight: ${weight} kg`,
    `- Height: ${height} cm`,
    `- Symptoms: ${symptoms}`,
    `- Duration: ${duration}`,
    `- Pre-existing conditions: ${preExistingConditions}`,
    `- Allergies: ${allergies}`,
    `- Current medications: ${currentMedications}`,
    '',
    'Keep the response practical, warm, and easy to follow.',
    'Use short bullet points or short paragraphs inside each section.',
    'Do not imply certainty or present the response as a confirmed diagnosis.',
  ].join('\n');

  return { systemPrompt, userPrompt };
}

module.exports = {
  resolveGroqModel,
  validateHealthAdvicePayload,
  buildHealthAdvicePrompt,
};
