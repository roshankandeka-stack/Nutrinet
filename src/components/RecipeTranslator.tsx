/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  DollarSign, 
  Activity, 
  Check, 
  ChevronRight, 
  HelpCircle,
  HelpCircle as HelpIcon,
  Globe
} from "lucide-react";

interface RecipeIngredientMap {
  expensiveItem: string;
  localSubstitute: string;
  priceSavings: string;
}

interface TranslatedRecipe {
  equivalentRecipeName: string;
  priceReduction: string;
  ingredientsMap: RecipeIngredientMap[];
  cookingSteps: string[];
  spokenAudioNarrative: string;
}

// Sample expensive urban baby diets to load with one-click
const EXPENSIVE_RECIPES = [
  {
    title: "Pan Grilled Salmon Fillet & White Quinoa Pilaf",
    ingredients: "150g Imported Salmon filet, 1 cup Organic white Quinoa, 1 tsp Avocado oil",
    price: "~₹450"
  },
  {
    title: "Creamy Imported Avocado Bowl with Greek Yogurt Dressing & Chia",
    ingredients: "1 whole Avocado, Half cup Greek yogurt, 1 tbsp organic chia seeds",
    price: "~₹280"
  },
  {
    title: "Steamed Pureed Broccoli Paste with Almond Butter slurry",
    ingredients: "200g Fresh green Broccoli florets, 1 tbsp Imported Raw Almond Butter",
    price: "~₹220"
  }
];

export default function RecipeTranslator() {
  const [originalRecipe, setOriginalRecipe] = useState(EXPENSIVE_RECIPES[0].ingredients);
  const [budgetFilter, setBudgetFilter] = useState("25");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslatedRecipe | null>(null);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  const fetchTranslation = async () => {
    setLoading(true);
    setErrorHeader(null);
    try {
      const response = await fetch("/api/translate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalRecipe,
          budgetFilter,
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Failed to map ingredient metrics.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setErrorHeader(err.message || "Failed to substituted ingredients.");
    } finally {
      setLoading(false);
    }
  };

  // Speaks cooking instructions in browser (translating spoken voice interface in Hindi/Gujarati)
  const handleVoicePlayback = () => {
    if (!result) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narrative = result.spokenAudioNarrative || result.cookingSteps.join(". ");
    const utterance = new SpeechSynthesisUtterance(narrative);
    
    // Attempt to match language voices
    if (targetLanguage === "Hindi") {
      utterance.lang = "hi-IN";
    } else if (targetLanguage === "Gujarati") {
      utterance.lang = "gu-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="recipe-translator" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin-slow" />
            Budget Recipe Translator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Convert expensive ingredients (Salmon, Quinoa, Greek Yogurt) into native nutrition equivalents (Ghee, Ragi, Bajra, Sattu) costing ₹15.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto bg-slate-50 border border-slate-200 p-1.0 rounded-xl">
          <button id="lang-hindi-selector" onClick={() => setTargetLanguage("Hindi")} className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${targetLanguage === "Hindi" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-500"}`}>हिन्दी (Hindi)</button>
          <button id="lang-gujarati-selector" onClick={() => setTargetLanguage("Gujarati")} className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${targetLanguage === "Gujarati" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-500"}`}>ગુજરાતી (Guj)</button>
          <button id="lang-english-selector" onClick={() => setTargetLanguage("English")} className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${targetLanguage === "English" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-500"}`}>English</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Pane */}
        <div className="lg:col-span-5 md:col-span-full space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 block">
              Load expensive urban diet template
            </span>
            <div className="space-y-1.5">
              {EXPENSIVE_RECIPES.map((recipe, idx) => (
                <button
                  key={idx}
                  id={`expensive-recipe-btn-${idx}`}
                  onClick={() => setOriginalRecipe(recipe.ingredients)}
                  className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center transition-all ${
                    originalRecipe === recipe.ingredients ? "bg-indigo-50/40 border-indigo-300 shadow-xs" : "bg-white border-slate-100 hover:border-slate-350"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-750 line-clamp-1">{recipe.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{recipe.ingredients}</p>
                  </div>
                  <span className="text-xs font-bold font-mono text-red-650 shrink-0 ml-2">{recipe.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block pl-1" htmlFor="original-recipe-box">Custom ingredients input</label>
            <textarea
              rows={3}
              id="original-recipe-box"
              value={originalRecipe}
              onChange={(e) => setOriginalRecipe(e.target.value)}
              placeholder="e.g., 200g organic avocado, Greek yogurt sauce, chia seeds porridge"
              className="w-full p-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block pl-1" htmlFor="budget-filter-select">Substitution Budget Cap</label>
            <select
              id="budget-filter-select"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="15">Maximum ₹15 per baby serving (Ultra-Affordable)</option>
              <option value="25">Maximum ₹25 per baby serving (Highly-Affordable)</option>
              <option value="50">Maximum ₹50 per baby serving (Standard Native)</option>
            </select>
          </div>

          <button
            onClick={fetchTranslation}
            disabled={loading}
            id="start-substitution-btn"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs tracking-medium flex items-center justify-center gap-1 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-150" />
            Translate to native ₹15 ingredients
          </button>

          {errorHeader && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex gap-1 border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorHeader}</span>
            </div>
          )}
        </div>

        {/* Output Pane */}
        <div className="lg:col-span-7 md:col-span-full border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8 pt-6 lg:pt-0">
          {result ? (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-indigo-50/45 rounded-2xl border border-indigo-100">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Equivalent Native Recipe</span>
                  <h3 className="text-base font-extrabold text-slate-800 mt-1">{result.equivalentRecipeName}</h3>
                  <p className="text-xs font-semibold text-indigo-900 font-mono mt-0.5">{result.priceReduction}</p>
                </div>
                <button
                  id="voice-narration-btn"
                  onClick={handleVoicePlayback}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-sm ${
                    isSpeaking ? "bg-red-650 hover:bg-red-700 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border"
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
                  {isSpeaking ? "Stop Voice" : "Play Voice Recipe"}
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Ingredient Equivalency Matrix
                </h4>
                <div className="space-y-1.5">
                  {result.ingredientsMap.map((mapPoint, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <p className="text-slate-400 font-medium">Original: <del>{mapPoint.expensiveItem}</del></p>
                        <p className="font-bold text-slate-750 flex items-center gap-1.5 mt-0.5">
                          <Check className="w-4 h-4 text-indigo-600" />
                          Native substitute: {mapPoint.localSubstitute}
                        </p>
                      </div>
                      <span className="font-mono text-indigo-805 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                        {mapPoint.priceSavings}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Step-by-Step Cooking Steps
                </h4>
                <div className="space-y-1.5">
                  {result.cookingSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-2.5 bg-slate-50/30 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                      <span className="w-5 h-5 bg-white border font-bold font-mono text-[10px] text-slate-500 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/30 rounded-2xl border border-dashed border-slate-100">
              <RefreshCw className="w-12 h-12 text-slate-300 stroke-[1.5] mb-3" />
              <p className="text-sm font-medium text-slate-600">Nutritional Financial Replacements</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Choose or submit high-cost child recipes to map their exact nutritious equivalents down to simple native resources.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
