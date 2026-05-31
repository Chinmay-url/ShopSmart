const express = require('express');
const axios = require('axios');

const router = express.Router();

const SYSTEM_PROMPT = `You are Rupees, a friendly and helpful AI shopping assistant for ShopSmart, an Indian e-commerce price comparison platform. Your role is to help users find the best deals, compare prices, understand price trends, and make smart purchasing decisions.

Key guidelines:
- Keep responses concise and conversational (2-4 sentences max unless detailed info is requested)
- Focus on Indian e-commerce (Amazon.in, Flipkart, etc.)
- Always use ₹ for prices
- Be enthusiastic about saving money
- If asked about specific products you don't have real-time data for, suggest the user search for it on ShopSmart
- You can help with: price comparison tips, when to buy, deal hunting strategies, product recommendations, and general shopping advice
- Never make up prices or product availability
- Be polite and professional`;

router.post('/', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(503).json({ message: 'AI service is not configured. Please set GROQ_API_KEY.' });
    }

    let finalSystemPrompt = SYSTEM_PROMPT;
    if (context) {
      finalSystemPrompt += `\n\nCURRENT CONTEXT:\n${JSON.stringify(context)}\nUse this data to provide evidence-based advice if the user asks about the current product.`;
    }

    const systemMessage = {
      role: 'system',
      content: finalSystemPrompt,
    };

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const reply = response.data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    res.json({ reply });
  } catch (error) {
    const status = error.response?.status;
    const apiError = error.response?.data || error.message;
    console.error('Chat error:', apiError);

    if (status === 429) {
      return res.status(429).json({ message: 'Rate limit reached. Please try again in a moment.', error: apiError });
    }

    if (status === 401 || status === 403) {
      return res.status(status).json({ message: 'AI service authorization failed. Check your GROQ_API_KEY.', error: apiError });
    }

    res.status(500).json({ message: 'Failed to get response from AI', error: apiError });
  }
});

module.exports = router;
