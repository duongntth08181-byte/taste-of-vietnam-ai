require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// Mock responses for fallback
const mockResponses = {
    pho: {
        en: "Phở is Vietnam's most iconic dish - a fragrant noodle soup made with a complex broth simmered for hours with spices like star anise, cinnamon, and cloves. It's typically served with rice noodles, beef or chicken, and fresh herbs like basil and cilantro. Each bowl is customized at the table with hoisin sauce, sriracha, and lime juice. Originated in Hanoi in the early 20th century, it's now beloved worldwide.",
        vi: "Phở là đặc sản nổi tiếng nhất của Việt Nam - một món canh mì thơm ngon với nước dùng được nấu hàng giờ cùng các gia vị như quế, hoa hồi. Nó thường được phục vụ với bánh mì, thịt bò hoặc gà, và các loại rau thơm tươi. Phở xuất phát từ Hà Nội vào đầu thế kỷ 20 và giờ đã trở nên nổi tiếng khắp thế giới."
    },
    default: {
        en: "Vietnamese cuisine is a delightful blend of sweet, sour, salty, and spicy flavors, emphasizing fresh herbs, vegetables, and quality ingredients. From street food to fine dining, each dish tells a story of Vietnam's rich cultural heritage.",
        vi: "Ẩm thực Việt Nam là sự kết hợp tuyệt vời của các hương vị ngọt, chua, mặn và cay, nhấn mạnh rau thơm, rau xanh và nguyên liệu chất lượng. Từ đồ ăn đường phố đến ẩm thực cao cấp, mỗi món ăn kể một câu chuyện về di sản văn hóa phong phú của Việt Nam."
    }
};

function getMockResponse(prompt, language = 'en') {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('pho')) {
        return mockResponses.pho[language] || mockResponses.pho.en;
    }
    return mockResponses.default[language] || mockResponses.default.en;
}

// Initialize Groq AI
const groqApiKey = process.env.GROQ_API_KEY;
let groq = null;

if (groqApiKey) {
    groq = new Groq({ apiKey: groqApiKey });
}

// System prompt for Vietnamese food context
const SYSTEM_PROMPT = `You are an expert guide on Vietnamese cuisine and culture. Your role is to:
- Provide accurate information about Vietnamese dishes, recipes, and cooking techniques
- Share cultural stories and traditions behind Vietnamese food
- Give practical cooking tips and ingredient suggestions
- Be friendly, enthusiastic, and concise (keep responses under 200 words)
- Support both English and Vietnamese languages
- Respond in the same language the user asks in`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, language = 'en' } = req.body;

        if (!prompt || prompt.trim() === '') {
            return res.status(400).json({ reply: 'Please enter a message' });
        }

        // If no Groq API key, use mock response
        if (!groq) {
            const mockReply = getMockResponse(prompt, language);
            return res.json({ reply: mockReply });
        }

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `${SYSTEM_PROMPT}\n\nUser question: ${prompt}`
                }
            ],
            model: 'llama-3.1-8b-instant',
            max_tokens: 500,
            temperature: 0.7
        });

        const botReply = completion.choices[0].message.content;

        res.json({ reply: botReply });

    } catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        
        // Fallback to mock response on error
        const userLanguage = req.body.language || 'en';
        const mockReply = getMockResponse(req.body.prompt, userLanguage);
        
        res.json({ reply: mockReply });
    }
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index (3).html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running ✅', mode: groq ? 'Groq AI' : 'Mock Mode' });
});

// Start server
app.listen(PORT, () => {
    const mode = groq ? '🤖 Groq AI' : '📚 Mock Mode';
    console.log(`
╔════════════════════════════════════════╗
║  🇻🇳 Taste of Vietnam AI Chatbot 🤖   ║
╠════════════════════════════════════════╣
║  Frontend: http://localhost:${PORT}            ║
║  API: POST /api/chat                   ║
║  Mode: ${mode}                 ║
║  Health: http://localhost:${PORT}/health     ║
╚════════════════════════════════════════╝
    `);
});
