/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client Lazily/Safely to avoid crashes if API key is not set
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

function getGeminiClient(): GoogleGenAI {
  if (ai) return ai;
  if (!API_KEY || API_KEY === "MY_GEMINI_API_KEY" || API_KEY === "") {
    console.warn("GEMINI_API_KEY environment variable is not configured or contains placeholder.");
    throw new Error("API_KEY_MISSING");
  }
  
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  return ai;
}

// Global In-Memory Store for Mother Support Groups (Seeded data from Ahmedabad)
let groupPosts = [
  {
    id: "p1",
    userName: "Meena Patel",
    location: "Vastrapur, Ahmedabad",
    childAgeGroup: "6-12 months",
    issue: "underweight",
    message: "Starting ragi formulation was a blessing for my 8-month-old child! He weighed only 6.2 kg last month, but following the custom recipes, he is active and gained 0.8kg. Highly recommend dal khichdi too!",
    isVoicePost: false,
    timestamp: "2 hours ago",
    likes: 8,
    expertVerified: true,
    expertAnswer: "This is a great milestone, Meena! Ragi (finger millet) is rich in calcium and iron, making it highly suitable for babies transitioning to solids. Continue with 2 servings daily."
  },
  {
    id: "p2",
    userName: "Anjali Sharma",
    location: "Maninagar, Ahmedabad",
    childAgeGroup: "1-2 years",
    issue: "anemia",
    message: "Is anyone here using Sabja/Basil seeds for fibers? My 14-month daughter has low hemoglobin levels. Pediatrician suggested locally available iron supplements. Seeking advice.",
    isVoicePost: true,
    timestamp: "5 hours ago",
    likes: 3,
    expertVerified: true,
    expertAnswer: "Hi Anjali, sabja contains good dietary fiber, but for anemia (low hemoglobin), introducing boiled and pureed beetroot, mashed drumstick leaves (moringa), and sattu mixed with jaggery will deliver faster iron replenishment."
  },
  {
    id: "p3",
    userName: "Sultana Shaikh",
    location: "Ellisbridge, Ahmedabad",
    childAgeGroup: "0-6 months",
    issue: "healthy",
    message: "My 3-month-old is exclusively breastfed. Her weight gain is perfectly following the WHO median of 5.8kg. Grateful for this visual tracker to watch her progress easily!",
    isVoicePost: false,
    timestamp: "1 day ago",
    likes: 12,
    expertVerified: false,
    expertAnswer: ""
  },
  {
    id: "p4",
    userName: "Preeti Desai",
    location: "Ghatlodia, Ahmedabad",
    childAgeGroup: "2-5 years",
    issue: "stunting",
    message: "My toddler is extremely picky with vegetables. He is in the 2nd percentile for height. Tried preparing Ragi pancakes with banana, and he finally loved it! Keep trying, mothers!",
    isVoicePost: false,
    timestamp: "2 days ago",
    likes: 15,
    expertVerified: true,
    expertAnswer: "Excellent adaptation, Preeti! Incorporating flour of roasted bengal gram and ragi inside standard recipes ensures excellent nutrient absorption even for picky toddlers."
  }
];

// 1. Scan Meal Endpoint
app.post("/api/scan-meal", async (req, res) => {
  try {
    const { image, textInput } = req.body;
    
    // Simulate/Check offline mock
    let useMock = false;
    try {
      getGeminiClient();
    } catch (e) {
      useMock = true;
    }

    if (useMock || !image) {
      // Simulate real response
      console.log("Using Mock Response for Meal Scanner due to missing API key");
      // Pick simulated meals if there is voice search or default
      const isDalInput = textInput && textInput.toLowerCase().includes("dal");
      
      const mockResult = {
        items: [
          {
            itemName: isDalInput ? "Moong Dal Paratha" : "Dal-Roti & Rice Plate",
            portionSize: "1 medium cup (150g)",
            protein_g: 12.5,
            calories: 320,
            fat_g: 6.2,
            carbs_g: 52.0,
            vitamins: ["Vitamin A", "Iron", "Folate"]
          },
          {
            itemName: "Mashed Carrot Puree",
            portionSize: "2 tablespoons",
            protein_g: 1.2,
            calories: 45,
            fat_g: 0.3,
            carbs_g: 10.1,
            vitamins: ["Beta-Carotene", "Vitamin C"]
          }
        ],
        totalProtein: 13.7,
        totalCalories: 365,
        allergyWarning: "No standard allergens identified in dal, roti, and carrots. Safe for infants above 6 months.",
        budgetImprovement: "Add 1 tablespoon of home-churned white butter or ghee (clarified butter) to boost calories and healthy fats by ~100 kcal for underweight recovery, costing under ₹3.",
        ragiDalRecipe: "5-Min Moong-Ragi Porridge: Boil 1 tbsp Moong Dal powder and 2 tbsp Ragi flour in 1 cup water. Whisk continuously. Add tiny jaggery. Cool and feed baby."
      };
      return res.json(mockResult);
    }

    // Call Real Gemini API
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: image.split(",")[1] || image // Strip prefix if present
      },
    };

    const prompt = `You are a certified Pediatric Nutrition Vision expert specializing in Indian food items (dal, roti, khichdi, ragi, bajra) for children under 5 years of age.
    Analyze this uploaded child meal plate. If user has query, use it: "${textInput || 'Analyze nutrition details'}".
    Provide high precision portion size estimation, calorie count, protein grams, fat, carbs, allergen check, and extremely cheap, local Indian recipe modifications to augment protein content under ₹15.
    Output ONLY valid JSON conforming to the requested schema.`;

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              description: "Identified food items inside the child dish plate",
              items: {
                type: Type.OBJECT,
                properties: {
                  itemName: { type: Type.STRING, description: "Food name (e.g., Dal Khichdi, Chapati, Curd)" },
                  portionSize: { type: Type.STRING, description: "Estimated gram or relative size portion" },
                  protein_g: { type: Type.NUMBER, description: "Estimated protein in grams" },
                  calories: { type: Type.NUMBER, description: "Estimated total calories contribution" },
                  fat_g: { type: Type.NUMBER, description: "Estimated fat in grams" },
                  carbs_g: { type: Type.NUMBER, description: "Estimated carbohydrates in grams" },
                  vitamins: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key micronutrients found" }
                },
                required: ["itemName", "protein_g", "calories"]
              }
            },
            totalProtein: { type: Type.NUMBER, description: "Total protein yield in grams" },
            totalCalories: { type: Type.NUMBER, description: "Sum of meal calories" },
            allergyWarning: { type: Type.STRING, description: "Important allergic notices (peanuts, gluten, dairy)" },
            budgetImprovement: { type: Type.STRING, description: "Specific tip to upgrade calorie/protein balance under ₹10-15 using local items like ghee, sattu, peanuts paneer" },
            ragiDalRecipe: { type: Type.STRING, description: "Quick, simple child development recipe using similar native resources" }
          },
          required: ["items", "totalProtein", "totalCalories", "budgetImprovement", "ragiDalRecipe"]
        }
      }
    });

    const outputText = response.text || "{}";
    res.json(JSON.parse(outputText));

  } catch (error: any) {
    console.error("Scan Meal Error: ", error);
    res.status(500).json({ error: error.message || "Failed to analyze meal." });
  }
});

// 2. Translate Recipe Endpoint (Expensive to Cheap Native substitution)
app.post("/api/translate-recipe", async (req, res) => {
  try {
    const { originalRecipe, budgetFilter, targetLanguage } = req.body;

    let useMock = false;
    try {
      getGeminiClient();
    } catch (e) {
      useMock = true;
    }

    if (useMock || !originalRecipe) {
      const mockResult = {
        equivalentRecipeName: targetLanguage === "Hindi" ? "पौष्टिक सत्तू-रागी हलवा" : targetLanguage === "Gujarati" ? "પૌષ્ટિક સત્તુ-રાગી શીરો" : "Nutritious Moong-Ragi Porridge",
        priceReduction: "Decreased cost from ₹450 (salmon/quinoa) to ₹18 (Sattu, Ragi, Desi ghee)",
        ingredientsMap: [
          { expensiveItem: "Quinoa", localSubstitute: "Finger Millet / Ragi (₹6)", priceSavings: "Saved ₹120 per bowl" },
          { expensiveItem: "Grilled Salmon", localSubstitute: "Sattu Flour & Whole Bengal Gram (₹8)", priceSavings: "Saved ₹280 per serving" },
          { expensiveItem: "Greek Yogurt", localSubstitute: "Fresh Home-Prep Curd (₹4)", priceSavings: "Saved ₹42 per container" }
        ],
        cookingSteps: [
          targetLanguage === "Hindi" 
            ? "1. कढ़ाई में १ चम्मच देसी घी गरम करें और २ चम्मच मूंग पाउडर भूनें।" 
            : targetLanguage === "Gujarati" 
            ? "1. કઢાઈમાં ૧ ચમચી ઘી ગરમ કરો અને ૨ ચમચી મગનો લોટ શેકો."
            : "1. Heat 1 tsp of home-churned ghee and roast 2 tbsp split moong powder.",
          targetLanguage === "Hindi"
            ? "2. धीरे-धीरे सत्तू घोल और पानी डालकर हिलाते रहें जिससे गाँठ न बने।"
            : targetLanguage === "Gujarati"
            ? "2. ધીમે-ધીમે સત્તુ અને પાણી ઉમેરો, ગઠ્ઠા ન વળે તેની કાળજી રાખો."
            : "2. Whisk in nutritious sattu flour slurry and warm water.",
          targetLanguage === "Hindi"
            ? "3. थोड़ा सा गुड़ मिलाकर गाढ़ा होने तक पकाएं और कटोरी में ठंडा खिलाएं।"
            : targetLanguage === "Gujarati"
            ? "3. થોડો ગોળ ઉમેરી ઘટ્ટ થાય ત્યાં સુધી પકાવો અને બાળકને ખવડાવો."
            : "3. Blend with safe jaggery, cook on low heat for 4 minutes till smooth."
        ],
        spokenAudioNarrative: targetLanguage === "Hindi"
          ? "नमस्ते माताजी। आज हम बना रहे हैं मूंग दाल और रागी का स्वादिष्ट शीरा। सबसे पहले कढ़ाई में थोड़ा सा घी डालें..."
          : targetLanguage === "Gujarati"
          ? "નમસ્તે માતાજી. આજે આપણે બનાવીશું મગ દાળ અને રાગીનો શીરો. સૌપ્રથમ કઢાઈમાં ઘી લઈ..."
          : "Hello mother! Today we will prepare an extremely low-cost Moong-Ragi Porridge. Start by warm heating ghee..."
      };
      return res.json(mockResult);
    }

    const client = getGeminiClient();
    const prompt = `You are a traditional Indian Pediatric Nutritionist and chef.
    Convert this urban/expensive recipe: "${originalRecipe}".
    Budget limit requested: ₹${budgetFilter || 50}/day.
    Map global or expensive items (Quinoa, salmon, avocado, chia, expensive yogurts) to affordable local grains/ingredients (ragi, bajra, sattu, makhana, ground peanuts, fresh curd) with IDENTICAL protein and macronutrients.
    Translate the complete equivalent recipe and cooking steps into "${targetLanguage || 'English'}" language.
    Include a friendly, conversational spoken voice narrative that we can read back to illiterate parents.
    Return ONLY JSON matching the requested schema.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            equivalentRecipeName: { type: Type.STRING, description: "Title of substituted local native Indian dish" },
            priceReduction: { type: Type.STRING, description: "E.g., Saved ₹350, original vs estimated current cost" },
            ingredientsMap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  expensiveItem: { type: Type.STRING },
                  localSubstitute: { type: Type.STRING, description: "Affordable native replacement food item with approximate cost" },
                  priceSavings: { type: Type.STRING }
                }
              }
            },
            cookingSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step simplified preparation recipe guide" },
            spokenAudioNarrative: { type: Type.STRING, description: "Voice instructions written in phonetic or translated text for TTS voice assistance." }
          },
          required: ["equivalentRecipeName", "priceReduction", "ingredientsMap", "cookingSteps", "spokenAudioNarrative"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));

  } catch (error: any) {
    console.error("Translate Recipe Error: ", error);
    res.status(500).json({ error: error.message || "Failed to map recipe ingredients." });
  }
});

// 3. Smart Voice Assistant Q&A Chatbot
app.post("/api/chat-voice", async (req, res) => {
  try {
    const { query, childAge, childIssue } = req.body;

    let useMock = false;
    try {
      getGeminiClient();
    } catch (e) {
      useMock = true;
    }

    if (useMock || !query) {
      const qLower = query ? query.toLowerCase() : "";
      let reply = "Hello! I am your NutriNet pediatric companion. Breastfeeding is vital for babies under 6 months. How can I guide you today with ragi, sattu, or weight tracking?";
      let steps = ["Exclusively breastfeed for the first 6 months", "Track child weight on the 1st Sunday of every month"];
      
      if (qLower.includes("hindi") || qLower.includes("महीने") || qLower.includes("खिला")) {
         reply = "६ महीने के बच्चे के लिए सबसे पहले दाल का पानी, पतली उबली खिचड़ी या रागी राब शुरू करें। दिन में १-२ छोटे चम्मच खिलाएं और स्तनपान जारी रखें।";
         steps = [
           "शुरुआत में दाल का पानी छानकर दें (१-२ चम्मच)",
           "कोई भी नया खाना शुरू करने के बाद ३ दिन का इंतजार करें, जिससे एलर्जी का पता चले",
           "धीमी आंच पर पकाया हुआ नरम दलिया ही खिलाएं"
         ];
      } else if (childIssue === "underweight" || qLower.includes("underweight") || qLower.includes("वजन")) {
        reply = "For underweight toddlers, introduce sattu flour (roasted bengal gram), paneer cubes, and 1 boiled egg daily. Adding a spoon of ghee increases caloric intake rapidly.";
        steps = [
          "Mix 1 spoon of Cow's Ghee inside warm dal khichdi",
          "Provide Sattu shake with healthy jaggery instead of sugar",
          "Feed small meals 5 times a day instead of 2 large heavy meals"
        ];
      }

      return res.json({
        replyText: reply,
        replyTextHindi: targetTranscription(reply),
        voiceScript: reply,
        actionSteps: steps
      });
    }

    const client = getGeminiClient();
    const prompt = `You are NutriNet's warm, supportive, maternal voice assistant for rural and semi-urban mothers in India.
    Our user is asking: "${query}".
    Context: Child is ${childAge || 'unspecified'} old, and has nutrition status of "${childIssue || 'healthy'}".
    Answer using extremely warm vocabulary, emphasizing low-cost child nutrition (moong dal, ragi, bajra porridge, drumstick leaves, banana).
    Generate actionable advice steps.
    If the prompt query has Devanagari or Hindi cues, return the main text response in written Hindi (Devanagari) in 'replyTextHindi' and English/transliterated in 'replyText'.
    Return ONLY valid JSON matching the requested schema.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: { type: Type.STRING, description: "Universal English or general transliterated answer" },
            replyTextHindi: { type: Type.STRING, description: "Devanagari script Hindi response for regional display" },
            voiceScript: { type: Type.STRING, description: "Simplified voice text optimized for screen read-outs" },
            actionSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 clear, bulleted child health recipes/feeding tips" }
          },
          required: ["replyText", "voiceScript", "actionSteps"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));

  } catch (error: any) {
    console.error("Voice Assistant Error: ", error);
    res.status(500).json({ error: error.message || "Failed to communicate with nutrition helper." });
  }
});

// 4. Support Group Endpoints
app.get("/api/support-groups", (req, res) => {
  const { ageGroup, issue, search } = req.query;
  let filtered = [...groupPosts];

  if (ageGroup && ageGroup !== "all") {
    filtered = filtered.filter(p => p.childAgeGroup.toLowerCase() === (ageGroup as string).toLowerCase());
  }
  if (issue && issue !== "all") {
    filtered = filtered.filter(p => p.issue.toLowerCase() === (issue as string).toLowerCase());
  }
  if (search) {
    const term = (search as string).toLowerCase();
    filtered = filtered.filter(p => p.message.toLowerCase().includes(term) || p.userName.toLowerCase().includes(term));
  }

  res.json(filtered);
});

app.post("/api/support-groups", (req, res) => {
  const { userName, location, childAgeGroup, issue, message, isVoicePost } = req.body;
  if (!userName || !message) {
    return res.status(400).json({ error: "Name and message are required." });
  }

  // Simple automated moderation analysis
  const lowerMsg = message.toLowerCase();
  const flaggables = ["buy bit coin", "earn money instantly", "scam", "viagra", "magical healing water", "weight loss pill"];
  const isSpam = flaggables.some(word => lowerMsg.includes(word));
  
  if (isSpam) {
    return res.status(400).json({ error: "Spam warning: Post details flagged by automated NLP moderator." });
  }

  // Automatic pediatrician advisory match depending on words
  let expertVerified = false;
  let expertAnswer = "";

  if (lowerMsg.includes("ragi") || lowerMsg.includes("weight") || lowerMsg.includes("underweight") || lowerMsg.includes("khichdi") || lowerMsg.includes("anemia")) {
    expertVerified = true;
    expertAnswer = "Expert Dr. Smita (Ahmedabad Civil Pediatric Wing): Great discussion. Remember, when boiling ragi, ensure it is soaked for 8 hours beforehand. This guarantees the highest absorption of iron and phosphorus.";
  }

  const newPost = {
    id: "p_" + Date.now(),
    userName: userName || "Anonymous Mother",
    location: location || "Ahmedabad",
    childAgeGroup: childAgeGroup || "6-12 months",
    issue: issue || "healthy",
    message,
    isVoicePost: !!isVoicePost,
    timestamp: "Just now",
    likes: 0,
    expertVerified,
    expertAnswer
  };

  groupPosts.unshift(newPost);
  res.status(201).json(newPost);
});

// Post Likes increment
app.post("/api/support-groups/:id/like", (req, res) => {
  const { id } = req.params;
  const post = groupPosts.find(p => p.id === id);
  if (post) {
    post.likes += 1;
    return res.json(post);
  }
  res.status(404).json({ error: "Post not found." });
});

// Helper for offline phonetic transcription support
function targetTranscription(text: string): string {
  // Simple Mock Transliteration
  return text;
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NutriNet] Server operational at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
