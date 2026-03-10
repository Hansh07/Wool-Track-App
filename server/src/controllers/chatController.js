const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `You are WoolMonitor AI, a helpful assistant for the WoolMonitor platform — a wool quality monitoring and trading system used in India.

You help:
- Farmers understand wool grading, pricing (based on wool type and weight), quality bonuses, and how to submit batches
- Quality Inspectors understand inspection parameters: fiber diameter (microns), staple strength, clean wool yield, color grade, contamination
- Mill Operators understand the production pipeline: Received → Cleaning → Carding → Spinning → Finished
- Buyers understand available wool types, quality grades (A–E), and how to purchase batches

Wool types and approximate base prices (INR/kg): Vicuña ₹55,000, Qiviut ₹35,000, Cashmere ₹8,000, Alpaca ₹3,250, Angora ₹2,750, Camel ₹2,100, Mohair ₹1,700, Yak ₹1,400, Fine Merino ₹1,500, Merino ₹1,000, Lambswool ₹1,000, Shetland ₹650, Corriedale ₹600, Crossbred ₹425, Lincoln ₹350, Coarse Wool ₹275, Carpet Wool ₹165.

Quality bonuses: +10% for clean wool yield >70%, +20% for fiber diameter <19 microns, +5% for staple strength >35 N/ktex.
Platform fees: ₹500 inspection fee, ₹20/kg processing fee, 5% platform commission.

Keep responses concise (2–4 sentences). Do not use markdown formatting like ** or ##. Respond in plain text only.
If a question is completely unrelated to wool, farming, textile, or this platform, politely redirect the user.`;

const stripMarkdown = (text) =>
    text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s?/g, '')
        .replace(/`{1,3}(.*?)`{1,3}/gs, '$1')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY missing");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Try models in order — skip on quota (429) or not-found (404) errors
        const MODELS = [
            "gemini-2.0-flash-lite",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro-latest",
            "gemini-2.0-flash",
        ];
        let text = null;
        let allQuotaExceeded = true;

        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const fullPrompt = SYSTEM_PROMPT + "\n\nUser question: " + message;
                const result = await model.generateContent(fullPrompt);
                text = stripMarkdown(result.response.text());
                break;
            } catch (err) {
                const errMsg = String(err.message || err);
                const httpStatus = err.status || err.statusCode || 'unknown';
                // Log full error so we can diagnose
                console.warn(`[chat] Model ${modelName} failed — HTTP ${httpStatus}: ${errMsg}`);

                const isRetryable = httpStatus === 429 || httpStatus === 404 ||
                    errMsg.includes('429') || errMsg.includes('404') ||
                    errMsg.includes('quota') || errMsg.includes('not found');

                if (!isRetryable) {
                    allQuotaExceeded = false;
                    throw err;
                }
                if (httpStatus === 429 || errMsg.includes('429') || errMsg.includes('quota')) {
                    allQuotaExceeded = true;
                }
            }
        }

        if (text !== null) {
            return res.json({ reply: text });
        }

        if (allQuotaExceeded) {
            return res.status(503).json({
                error: "The AI assistant quota is exhausted. To fix this, generate a new API key at https://aistudio.google.com/apikey and update GEMINI_API_KEY in server/.env"
            });
        }

        res.status(500).json({ error: "AI assistant is unavailable right now. Please try again later." });
    } catch (error) {
        console.error("Gemini error:", error);
        res.status(500).json({ error: "AI assistant is unavailable right now. Please try again later." });
    }
};

module.exports = { handleChat };
