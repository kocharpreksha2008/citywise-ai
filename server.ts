import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API: Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'CityWise AI',
    timestamp: new Date().toISOString(),
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Knowledge base fallback for Pune city in case GEMINI_API_KEY is not set or network fails
function generateFallbackResponse(query: string, history: Array<{ role: string; content: string }>): string {
  const q = query.toLowerCase();

  if (q.includes('budget') || q.includes('cheap') || q.includes('cost') || q.includes('student')) {
    return `### 💡 Budget-Friendly Guide to Pune
Here are top student and budget-friendly recommendations:
- **Food & Chai**:
  - *Vaishali & Goodluck Cafe on FC Road*: Budget iconic meals (₹120–₹250 per person).
  - *Camp Burger / Kayani Bakery*: Mawa cake and Shrewsbury biscuits for under ₹200.
  - *Katakirr / Bedekar Misal*: Iconic spicy Pune Misal Pav (₹90–₹140).
- **Historic & Sightseeing (Under ₹50 entry)**:
  - *Shaniwar Wada*: Entry is just ₹25 for Indian citizens.
  - *Aga Khan Palace*: ₹25 entry; lush historic gardens and Mahatma Gandhi memorial.
  - *Pataleshwar Cave Temple*: Completely **free entry** rock-cut 8th-century monolithic wonder.
  - *Sinhagad Fort*: Nominal forest toll (₹50 per vehicle), great trek with pithla-bhakri at the top (₹120).
- **Public Transit**:
  - Use the newly expanded **Pune Metro (Purple & Aqua Lines)** for fast ₹10–₹35 commutes between Vanaz, Civil Court, Ruby Hall, and PCMC.
  - PMPML daily city bus passes cost approx ₹50 for unlimited local travel!`;
  }

  if (q.includes('history') || q.includes('historical') || q.includes('fort') || q.includes('heritage') || q.includes('monument')) {
    return `### 🏛️ Historical & Heritage Trail in Pune
Pune is the cultural and historical capital of Maharashtra, with deep Maratha and colonial heritage:
1. **Shaniwar Wada (1732 AD)**:
   - Built by Peshwa Baji Rao I. The fortified seat of the Maratha Empire. Note the famous Delhi Gate with iron spikes to deter war elephants.
2. **Sinhagad Fort (Lion Fort)**:
   - 30 km southwest, site of Tanaji Malusare's legendary battle in 1670. High altitude panoramic views and historical memorial.
3. **Pataleshwar Cave Temple (8th Century)**:
   - Carved out of a single basalt rock during the Rashtrakuta period. Dedicated to Lord Shiva, located right in the heart of Shivajinagar.
4. **Aga Khan Palace (1892)**:
   - Built by Sultan Muhammed Shah Aga Khan III. Served as a prison for Mahatma Gandhi, Kasturba Gandhi, and Sarojini Naidu during the Quit India movement.
5. **Raja Dinkar Kelkar Museum**:
   - 42-section collection of 20,000+ Indian artifacts curated by Dr. D.G. Kelkar.`;
  }

  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('misal') || q.includes('cafe')) {
    return `### 🍽️ Pune Culinary Highlights & Must-Eats
Pune's culinary scene is a mix of traditional Puneri Maharashtrian dishes and Irani cafe classics:
- **Misal Pav**:
  - *Katakirr Misal* (Karve Nagar/Deccan): Renowned for its spicy 'Tarri' (Kolhapuri/Puneri rassa).
  - *Bedekar Tea Stall* (Narayan Peth): Authentic Puneri style slightly sweet-spicy misal with fresh bread.
- **Breakfast & Irani Cafes**:
  - *Vohuman Cafe* (near Pune Station): Cheese omelette, bun maska, and Irani chai.
  - *Cafe Goodluck* (FC Road): Established 1935; famous for Bun Maska, Keema Pav, and Irani chai.
- **Bakeries**:
  - *Kayani Bakery* (East Street, Camp): Legendary Shrewsbury butter biscuits (arrive early before stocks run out!).
- **Student Hubs**:
  - *Fergusson College (FC) Road* & *JM Road*: South Indian filter coffee at Vaishali, rolls, and cold coffee.
  - *Koregaon Park (KP)*: Artisanal cafes, sourdough pizzas, and continental bistros.`;
  }

  if (q.includes('safe') || q.includes('safety') || q.includes('night') || q.includes('women') || q.includes('emergency')) {
    return `### 🛡️ Safety & Travel Advisory for Pune
Pune is generally ranked among India's safest metropolitan student and IT cities, but smart travel practices are essential:
- **Night Travel**:
  - Well-lit, active corridors after 10 PM include FC Road, Koregaon Park North Main Road, Viman Nagar, and Baner High Street.
  - Avoid isolated stretches near riverbed roads (Mutha river causeways) and secluded trails around Vetal Tekdi after dark.
- **Transport Safety**:
  - App-based cabs (Uber/Ola) and verified auto-rickshaws with digital meters are readily available.
  - Pune Metro operates until 10:00 PM with dedicated women's coaches and CCTV surveillance.
- **Emergency Numbers**:
  - Police Helpline: **112**
  - Women's Helpline: **1091**
  - Pune City Police WhatsApp Helpline: **8975283100**
  - Ambulance: **108**
  - Traffic Police Control: **020-26685000**`;
  }

  return `### 🧭 CityWise AI Assistant: Exploring Pune
Welcome to CityWise AI! Here are several ways I can help you plan your time in Pune:
1. **Budget Planning**: Ask for "1-day student trip under ₹500" or "cheap local transit options".
2. **Historical Context**: Inquire about Maratha history at Shaniwar Wada, Sinhagad, or the Pataleshwar Caves.
3. **Food Trails**: Ask where to get the best Misal Pav, Irani Bun Maska, or local Puneri thalis.
4. **Safety & Night Advisories**: Ask about safe transit routes, ward incident statistics, or well-lit walking corridors.

Feel free to ask any specific question about places, timings, or safety tips!`;
}

// API: AI City Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback when API key is not configured in environment
      const reply = generateFallbackResponse(message, conversationHistory);
      return res.json({
        reply,
        source: 'knowledge_base_fallback',
        disclaimer: 'Generated using CityWise curated knowledge engine (API key not configured).',
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are CityWise AI, an expert, enthusiastic, and safety-conscious city guide for Pune, Maharashtra, India.
Your mission is to help travelers, students, and citizens explore smart and travel safe.
Key guidelines:
1. Provide practical, accurate advice on sightseeing, historical context (Maratha empire, Peshwas, British era), budget estimates in Indian Rupees (₹), transit (Pune Metro, PMPML, auto-rickshaws), and authentic local food (Misal, Bun Maska, Pithla Bhakri, Shrewsbury biscuits).
2. Always emphasize safety awareness: well-lit areas, transit advice, women safety helplines (1091, 112), and emergency contacts.
3. Keep answers clear, well-formatted with markdown bullet points, and actionable.
4. Clearly state when estimating travel time or budgets that local conditions may vary.`;

      // Build contents
      const prompt = `${message}\n\n[Context: You are advising someone visiting or exploring Pune, India. Provide helpful details including approximate costs in INR (₹), safety considerations, and best timings where appropriate.]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || generateFallbackResponse(message, conversationHistory);
      return res.json({
        reply: replyText,
        source: 'gemini_3.8_flash',
      });
    } catch (genAiError: any) {
      console.warn('Gemini API call failed, using knowledge fallback:', genAiError?.message);
      const fallbackReply = generateFallbackResponse(message, conversationHistory);
      return res.json({
        reply: fallbackReply,
        source: 'knowledge_base_fallback',
        disclaimer: 'Switched to CityWise curated knowledge engine due to AI service limit.',
      });
    }
  } catch (error: any) {
    console.error('Error handling assistant request:', error);
    res.status(500).json({ error: 'Failed to process assistant request' });
  }
});

// Setup Vite in Dev or Static Files in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CityWise AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
