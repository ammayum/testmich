const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// GET /chat - render chat page
router.get('/', (req, res) => {
  res.render('chat'); // Must exist: views/chat.ejs
});

// POST /chat - handle message
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error(err);
    if (err.code === 'insufficient_quota' || err.status === 429) {
      return res.status(503).json({ error: 'OpenAI quota exceeded or rate limit reached.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
