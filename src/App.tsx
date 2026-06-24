/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { 
  Heart, 
  Camera, 
  Clipboard, 
  Users, 
  RefreshCw, 
  AlertCircle, 
  Mic, 
  Activity, 
  BarChart, 
  CheckCircle,
  HelpCircle,
  Calendar,
  Layers,
  Sparkles,
  TrendingDown,
  Info
} from "lucide-react";

// Import custom sub-components
import MealScanner from "./components/MealScanner";
import GrowthTracker from "./components/GrowthTracker";
import SupportGroups from "./components/SupportGroups";
import RecipeTranslator from "./components/RecipeTranslator";
import WarningAlerts from "./components/WarningAlerts";
import VoiceAssistant from "./components/VoiceAssistant";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top clean navigation bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-indigo-950 uppercase">
                Nutri<span className="text-indigo-600">Net</span>
              </h1>
              <p className="text-[10px] text-indigo-700 font-mono font-bold uppercase tracking-wider leading-none">
                Pediatric Nutrition Core
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 font-sans">
            <span className="inline-flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 rounded px-2.5 py-1">
              Gujarat PHC Node active
            </span>
          </div>
        </div>
      </header>

      {/* Main dashboard viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left hand Sidebar: Controller tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block px-3 mb-3">
              NutriNet Core Sections
            </span>
            
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "dashboard" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart className="w-4 h-4" /> Pediatric Dashboard
            </button>

            <button
              id="tab-scanner"
              onClick={() => setActiveTab("scanner")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "scanner" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Camera className="w-4 h-4" /> AI Plate Scanner
            </button>

            <button
              id="tab-tracker"
              onClick={() => setActiveTab("tracker")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "tracker" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Clipboard className="w-4 h-4" /> Health Growth Tracker
            </button>

            <button
              id="tab-groups"
              onClick={() => setActiveTab("groups")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "groups" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4" /> Support Group Circles
            </button>

            <button
              id="tab-recipes"
              onClick={() => setActiveTab("recipes")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "recipes" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <RefreshCw className="w-4 h-4" /> Recipe substitution
            </button>

            <button
              id="tab-alerts"
              onClick={() => setActiveTab("alerts")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "alerts" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <AlertCircle className="w-4 h-4" /> Early Warning Alerts
            </button>

            <button
              id="tab-voice"
              onClick={() => setActiveTab("voice")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === "voice" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Mic className="w-4 h-4" /> Verbal Companion
            </button>
          </div>

          <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <div>
              <span className="text-[9px] font-extrabold text-[#818cf8] uppercase tracking-widest block">Project Guide Code</span>
              <h4 className="text-xs font-bold mt-1">Python Code Export</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1 font-sans">
                Check and download fully functional python scripts in <code className="font-mono text-indigo-300 font-bold">/python/*</code> containing WHO calculation, K-Means profiles, and substitution.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-800 flex flex-wrap gap-2 text-[9px] text-[#818cf8] font-mono">
              <span>WAZ Equations✔</span>
              <span>KNN Engine✔</span>
            </div>
          </div>
        </aside>

        {/* Right hand Content Panel */}
        <section className="flex-1 min-w-0">
          
          <div className="transition-all animate-fade-in">
            {activeTab === "dashboard" && (
              <div id="dashboard-overview" className="space-y-8">
                
                {/* Hero introduction */}
                <div className="bg-indigo-950 text-white p-8 rounded-2xl border border-slate-900 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 max-w-xl space-y-3">
                    <span className="text-[10px] bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full text-indigo-200 font-mono font-bold uppercase tracking-widest items-center gap-1 inline-flex">
                      <Sparkles className="w-3 h-3" /> Child Nutrition Portal
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase">
                      Saving children from severe undernutrition
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                      NutriNet integrates WHO standard alignment curves, computer vision meal plate scans, budget substitutions, and early stunting predictive warning triggers to bridge the information gap.
                    </p>
                  </div>
                  {/* Subtle design block */}
                  <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl" />
                </div>

                {/* Real verified problem statistics */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-slate-400" />
                    Verified Crisis Statistics (NFHS-5 & UN SOFI 2025)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Child wasting under 5</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-extrabold font-mono text-red-600">18.7%</span>
                        <span className="text-[10px] font-semibold text-slate-500 font-sans">21M Kids</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div className="bg-rose-500 h-full" style={{ width: "18.7%" }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 leading-normal font-sans">
                        Low weight-for-height, UN SOFI 2025 report.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Child stunting under 5</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-extrabold font-mono text-amber-600">35.5%</span>
                        <span className="text-[10px] font-semibold text-slate-500 font-sans">37.4M Kids</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: "35.5%" }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 leading-normal font-sans">
                        Chronic undernutrition milestones, NFHS-5 data.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Underweight children</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-extrabold font-mono text-indigo-600">16.5%</span>
                        <span className="text-[10px] font-semibold text-slate-500 font-sans">0-6 Years</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: "16.5%" }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 leading-normal font-sans">
                        Poshan Tracker June 2025 verified figures.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Anaemic Women</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-extrabold font-mono text-purple-600">53.0%</span>
                        <span className="text-[10px] font-semibold text-slate-500 font-sans">15-49 Years</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: "53%" }} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 leading-normal font-sans">
                        203 million individuals suffering low hemoglobin, NFHS-5.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guidelines quick start guide */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      How to get started with NutriNet
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 text-xs font-sans">
                    <div className="space-y-2 p-3 rounded-xl hover:bg-slate-50 transition-all">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-mono">1</span>
                        Measure Weight & Height
                      </h4>
                      <p className="leading-relaxed">
                        Input measurements under <b>Health Growth Tracker</b>. The system plots standard WHO curves.
                      </p>
                    </div>
                    <div className="space-y-2 p-3 rounded-xl hover:bg-slate-50 transition-all">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-mono">2</span>
                        Scan Plate Nutrition
                      </h4>
                      <p className="leading-relaxed">
                        Take or choose standard child meal photos inside <b>AI Plate Scanner</b> to count proteins and trace minerals.
                      </p>
                    </div>
                    <div className="space-y-2 p-3 rounded-xl hover:bg-slate-50 transition-all">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-mono">3</span>
                        Audit substitutions
                      </h4>
                      <p className="leading-relaxed">
                        Audit ingredients, review equivalent low-cost grains costing under ₹15, and use voice readouts for steps.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "scanner" && <MealScanner />}
            {activeTab === "tracker" && <GrowthTracker />}
            {activeTab === "groups" && <SupportGroups />}
            {activeTab === "recipes" && <RecipeTranslator />}
            {activeTab === "alerts" && <WarningAlerts />}
            {activeTab === "voice" && <VoiceAssistant />}
          </div>

        </section>

      </main>

      {/* Standard non-cluttered footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p>© 2026 NutriNet Pediatric Core. Developed to support child growth and prevent severe wasting.</p>
          <div className="flex gap-4 font-semibold text-indigo-600 uppercase tracking-wide text-[10px]">
            <span>WHO Aligned Node</span>
            <span>Unsupervised KNN Clustering</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
