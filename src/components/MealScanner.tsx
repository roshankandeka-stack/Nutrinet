/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Camera, Upload, AlertCircle, Sparkles, Check, ChevronRight, Activity, Clock } from "lucide-react";

interface MealItem {
  itemName: string;
  portionSize: string;
  protein_g: number;
  calories: number;
  fat_g?: number;
  carbs_g?: number;
  vitamins?: string[];
}

interface ScanResult {
  items: MealItem[];
  totalProtein: number;
  totalCalories: number;
  allergyWarning: string;
  budgetImprovement: string;
  ragiDalRecipe: string;
}

// Sample traditional Indian baby foods to test scanner with single click
const SAMPLE_MEALS = [
  {
    name: "Standard Dal & Roti Khichdi Plate",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
    text: "Mashed moong dal with soft wheat roti and boiled potato ghee mix"
  },
  {
    name: "Traditional Ragi Porridge and Milk",
    img: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=400",
    text: "Cooked finger millet flour rab with warm breast milk booster"
  },
  {
    name: "Plain White Rice & Dal Water",
    img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=400",
    text: "Boiled rice starch water with pinch of salt used for weaning"
  }
];

export default function MealScanner() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSample = (sample: typeof SAMPLE_MEALS[0]) => {
    setSelectedFile(sample.img);
    setTextInput(sample.text);
    setError(null);
  };

  const triggerScan = async () => {
    if (!selectedFile) {
      setError("Please select a sample meal or upload a photo first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/scan-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedFile,
          textInput
        })
      });
      if (!response.ok) {
        throw new Error("Failed to scan nutrition indices.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong during food scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="meal-scanner" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            AI Meal Photo Scanner
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload photo of the baby's dish to count protein, calories, and discover ₹15 nutritious boosters.
          </p>
        </div>
        <span className="hidden sm:inline-flex bg-indigo-50 text-indigo-700 font-mono text-xs px-2.5 py-1 rounded-full items-center gap-1 border border-indigo-100">
          <Sparkles className="w-3 h-3" /> LogMeal AI Engine
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left pane: Upload elements */}
        <div className="lg:col-span-5 md:col-span-full space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Step 1: Choose Image or Sample 
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_MEALS.map((sample, idx) => (
                <button
                  key={idx}
                  id={`sample-meal-btn-${idx}`}
                  onClick={() => selectSample(sample)}
                  className={`relative h-20 rounded-xl overflow-hidden text-left border-2 transition-all ${
                    selectedFile === sample.img ? "border-indigo-600 scale-[1.02]" : "border-slate-100 hover:border-slate-350"
                  }`}
                >
                  <img src={sample.img} alt={sample.name} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 flex items-end">
                    <span className="text-[10px] text-white line-clamp-2 leading-none font-medium">
                      Sample {idx+1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center transition-all min-h-[180px]">
            {selectedFile ? (
              <div className="w-full relative rounded-lg overflow-hidden">
                <img src={selectedFile} alt="Child meal preview" className="w-full h-40 object-cover" />
                <button
                  id="reset-preview-btn"
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white text-[10px] px-2 py-1 rounded-md"
                >
                  Clear Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer space-y-3 flex flex-col items-center">
                <div className="p-3 bg-white hover:bg-slate-100 text-slate-600 rounded-full shadow-sm hover:scale-105 transition-all">
                  <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Upload child meal photo</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPEG, JPG, PNG formats</p>
                </div>
                <input
                  type="file"
                  id="meal-photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600" htmlFor="meal-voice-note">
              What did your child eat? (Optional Voice/Notes)
            </label>
            <input
              type="text"
              id="meal-voice-note"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. Mash of 2 rotis with half cup moong dal, no ghee"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30"
            />
          </div>

          <button
            onClick={triggerScan}
            disabled={loading}
            id="start-plate-scan-btn"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-55 flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                Measuring Plate Nutrition...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                Analyze Nutrition Content
              </>
            )}
          </button>

          {error && (
            <div className="flex gap-2 p-3.5 bg-red-50 text-red-700 rounded-xl text-xs border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right pane: Results */}
        <div className="lg:col-span-7 md:col-span-full border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8 pt-6 lg:pt-0">
          {result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <Activity className="w-10 h-10 text-indigo-600 shrink-0" />
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                      Total Energy Analyzed
                    </span>
                    <span className="text-2xl font-bold font-mono text-indigo-950">
                      {result.totalCalories} <span className="text-xs font-normal">kcal</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                      Total Protein Yield
                    </span>
                    <span className="text-2xl font-bold font-mono text-indigo-900">
                      {result.totalProtein}g
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Identified Food Plate Matrix
                </h3>
                <div className="space-y-2">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100/80">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{item.itemName}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-indigo-600" /> Portion: {item.portionSize}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 bg-white text-indigo-700 rounded-full font-mono text-xs border border-slate-200">
                          {item.protein_g}g Prot
                        </span>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5 font-mono">
                          {item.calories} kcal
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/45 p-4 rounded-xl border border-amber-100">
                  <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Allergen Risk Assessment
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    {result.allergyWarning}
                  </p>
                </div>

                <div className="bg-indigo-50/45 p-4 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-800 flex items-center gap-1.5 uppercase tracking-wider mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    ₹15 High Nutrition Boost Hack
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    {result.budgetImprovement}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50">
                <h4 className="text-xs font-bold text-indigo-905 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                  <Clock className="w-4 h-4 text-indigo-650" />
                  Recommended Homemade Formula (5-Min Recipe)
                </h4>
                <p className="text-xs text-slate-650 leading-relaxed bg-white p-3 rounded-lg border border-indigo-50 shadow-sm font-sans">
                  {result.ragiDalRecipe}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/30 rounded-2xl border border-dashed border-slate-100">
              <Camera className="w-12 h-12 text-slate-300 stroke-[1.5] mb-3" />
              <p className="text-sm font-medium text-slate-600">Scan Results Interface</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                When you choose an image and perform the scan, the AI results containing proteins, calories, allergens, and local recipe tips will render here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
