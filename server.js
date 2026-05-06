'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const path = require('path');
const Groq = require('groq-sdk');

require('dotenv').config();

const connectDB = require('./database');
const authMiddleware = require('./middleware/authMiddleware');
const {
  buildHealthAdvicePrompt,
  resolveGroqModel,
  validateHealthAdvicePayload,
} = require('./healthAdviceService');
const User = require('./User');

const DEFAULT_PORT = 5000;
const GROQ_TIMEOUT_MS = 45000;
const MAX_TOKENS = 1500;

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5000',
  'http://localhost:5173',
  'https://healthify-31ok.onrender.com',
];

function splitEnvList(value) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeOrigin(value) {
  if (!value) {
    return '';
  }

  try {
    return new URL(value).origin;
  } catch (_error) {
    return value.replace(/\/$/, '');
  }
}

const allowedOrigins = new Set(
  [
    ...DEFAULT_ALLOWED_ORIGINS,
    process.env.CLIENT_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.RENDER_EXTERNAL_URL,
    ...splitEnvList(process.env.CLIENT_ORIGINS),
  ]
    .map(normalizeOrigin)
    .filter(Boolean),
);

const apiConnectOrigins = [
  process.env.VITE_API_BASE_URL,
  process.env.PUBLIC_API_BASE_URL,
  process.env.API_BASE_URL,
]
  .map(normalizeOrigin)
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return (
      protocol === 'https:' &&
      (hostname === 'onrender.com' || hostname.endsWith('.onrender.com'))
    );
  } catch (_error) {
    return false;
  }
}

const groqApiKey = (process.env.GROQ_API_KEY || '').trim();
const groq =
  groqApiKey && groqApiKey !== 'your_key_here'
    ? new Groq({ apiKey: groqApiKey })
    : null;

if (!groq) {
  console.warn(
    '[WARN] GROQ_API_KEY is not set or is still the placeholder value. ' +
      'The /api/health-advice endpoint will return errors until it is configured.',
  );
}

if (!process.env.JWT_SECRET) {
  console.warn(
    '[WARN] JWT_SECRET is not set. Login and signup will work, but protected JWT routes will be unavailable.',
  );
}

const app = express();
app.set('trust proxy', 1);

connectDB();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", ...allowedOrigins, ...apiConnectOrigins],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      callback(Object.assign(new Error('Not allowed by CORS'), { status: 403 }));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '1mb' }));

app.use(
  createRateLimiter({
    windowMs: 60 * 1000,
    max: 60,
    message: { error: 'Too many requests, please try again in a minute.' },
  }),
);

function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(Object.assign(new Error(label), { isTimeout: true }));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

function createRateLimiter({ windowMs, max, message }) {
  const hits = new Map();

  const cleanupTimer = setInterval(() => {
    const now = Date.now();

    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  }, windowMs);

  cleanupTimer.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip?.replace(/^::ffff:/, '') || req.socket.remoteAddress || 'unknown';
    const current = hits.get(key);
    const entry =
      current && current.resetAt > now
        ? current
        : { count: 0, resetAt: now + windowMs };

    entry.count += 1;
    hits.set(key, entry);

    const remaining = Math.max(max - entry.count, 0);
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(resetSeconds));

    if (entry.count > max) {
      res.setHeader('Retry-After', String(resetSeconds));
      return res.status(429).json(message);
    }

    return next();
  };
}

function clientSafeError(error) {
  const status = error?.status ?? error?.statusCode;
  const detail = error?.error?.message || error?.message;

  if (status === 401 || status === 403) {
    return 'Unable to authenticate with the AI service. Please contact support.';
  }

  if (status === 429) {
    return 'The advice service is busy right now. Please wait a moment and try again.';
  }

  if (status === 400) {
    return detail
      ? `Groq rejected the request: ${detail}`
      : 'The request to the AI service was invalid. Please try again or contact support.';
  }

  if (error?.isTimeout) {
    return 'The request timed out. Please try again.';
  }

  return 'Unable to generate health advice right now. Please try again shortly.';
}

function log(level, msg, meta) {
  const entry = { ts: new Date().toISOString(), level, msg, ...meta };

  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

function createAuthToken(user) {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
}

app.get('/api/healthcheck', (_req, res) => {
  res.json({
    status: 'ok',
    groqReady: groq !== null,
    configuredModel: process.env.GROQ_MODEL || null,
    resolvedModel: resolveGroqModel(process.env.GROQ_MODEL),
    ts: new Date().toISOString(),
  });
});

app.post('/api/signup', async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: 'username, email and password are all required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'An account with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    log('info', 'user.signup', { userId: newUser._id });

    return res.status(201).json({
      message: 'Account created successfully.',
      token: createAuthToken(newUser),
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || 'account';
      const message =
        duplicateField === 'username'
          ? 'That username is already taken.'
          : 'An account with that email already exists.';

      return res.status(409).json({ error: message });
    }

    log('error', 'signup.error', { message: error.message });
    return res
      .status(500)
      .json({ error: 'Failed to create account. Please try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    log('info', 'user.login', { userId: user._id });

    return res.status(200).json({
      message: 'Login successful.',
      token: createAuthToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    log('error', 'login.error', { message: error.message });
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/logout', (_req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you are authorised!` });
});

const adviceLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many advice requests. Please wait a minute.' },
});

app.post('/api/health-advice', adviceLimiter, async (req, res) => {
  const { errors, value } = validateHealthAdvicePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  if (!groq) {
    return res.status(503).json({
      error: 'The health advice service is not configured yet. Please try again later.',
    });
  }

  const { systemPrompt, userPrompt } = buildHealthAdvicePrompt(value);
  const model = resolveGroqModel(process.env.GROQ_MODEL);
  const wantsStream = String(req.query.stream).toLowerCase() === 'true';

  const completionPayload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.35,
    max_completion_tokens: MAX_TOKENS,
    stream: wantsStream,
  };

  log('info', 'health-advice.request', {
    model,
    configuredModel: process.env.GROQ_MODEL || null,
    stream: wantsStream,
  });

  try {
    if (wantsStream) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-Accel-Buffering', 'no');
      res.setHeader('Connection', 'keep-alive');
      res.status(200);

      const stream = await withTimeout(
        groq.chat.completions.create(completionPayload),
        GROQ_TIMEOUT_MS,
        'Groq request timed out',
      );

      let totalTokens = 0;
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content ?? '';
        if (content) {
          res.write(content);
        }

        if (chunk.x_groq?.usage) {
          totalTokens = chunk.x_groq.usage.total_tokens;
        }
      }

      res.end();
      log('info', 'health-advice.stream.done', { model, totalTokens });
      return;
    }

    const completion = await withTimeout(
      groq.chat.completions.create(completionPayload),
      GROQ_TIMEOUT_MS,
      'Groq request timed out',
    );

    const responseText = completion.choices?.[0]?.message?.content?.trim();
    if (!responseText) {
      log('error', 'health-advice.empty-response', { model });
      return res.status(502).json({
        error: 'The AI service returned an empty response. Please try again.',
      });
    }

    const usage = completion.usage ?? {};
    log('info', 'health-advice.done', { model, ...usage });

    return res.json({
      success: true,
      model,
      response: responseText,
      usage,
    });
  } catch (error) {
    log('error', 'health-advice.groq-error', {
      message: error.message,
      status: error?.status,
      isTimeout: error?.isTimeout ?? false,
      model,
      configuredModel: process.env.GROQ_MODEL || null,
    });

    if (res.headersSent) {
      res.end();
      return;
    }

    const httpStatus =
      error?.status && error.status >= 400 && error.status < 600
        ? error.status
        : 500;

    return res.status(httpStatus).json({ error: clientSafeError(error) });
  }
});

const clientDistPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath, { maxAge: '1d' }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, _req, res, _next) => {
  log('error', 'unhandled.error', { message: error.message });
  const status = error.status ?? 500;
  res.status(status).json({ error: error.message || 'Internal server error.' });
});

const PORT = Number(process.env.PORT) || DEFAULT_PORT;
app.listen(PORT, () => {
  log('info', 'server.start', {
    port: PORT,
    env: process.env.NODE_ENV ?? 'development',
  });
});
