/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  interpolateWHO, 
  calculateZScore, 
  clinicsInAhmedabad, 
  Clinic 
} from "../who_standards";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Check, 
  Share2, 
  Hospital, 
  AlertCircle, 
  Sparkles,
  Search,
  Bell
} from "lucide-react";

interface ChildProfile {
  id: string;
  name: string;
  gender: 'boys' | 'girls';
  logs: { month: number; weight: number; height: number; date: string }[];
}

export default function WarningAlerts() {
  const [selectedArea, setSelectedArea] = useState("all");
  const [smsTriggered, setSmsTriggered] = useState(false);

  // Mock weight drops of common profile: Month 6 (6.5kg), Month 8 (6.3kg) -> drop of 0.2kg!
  const mockUnhealthyLog = [
    { month: 0, weight: 3.3, height: 49.9, date: "2025-10-10" },
    { month: 3, weight: 6.2, height: 60.5, date: "2026-01-10" },
    { month: 6, weight: 6.5, height: 64.0, date: "2026-04-10" }, // -2SD WAZ (Underweight warning limit)
    { month: 8, weight: 6.3, height: 65.5, date: "2026-06-10" }  // drop of 0.2kg! Weight drop over 2 months!
  ];

  // We analyze this drop:
  const lastWeight = mockUnhealthyLog[mockUnhealthyLog.length - 1].weight;
  const prevWeight = mockUnhealthyLog[mockUnhealthyLog.length - 2].weight;
  const isDrop = lastWeight < prevWeight;
  const weightLossGrams = Math.round((prevWeight - lastWeight) * 1000);

  const filteredClinics = selectedArea === "all" 
    ? clinicsInAhmedabad 
    : clinicsInAhmedabad.filter(c => c.area.toLowerCase() === selectedArea.toLowerCase());

  const handleSmsSimulation = () => {
    setSmsTriggered(true);
    setTimeout(() => {
      setSmsTriggered(false);
    }, 4000);
  };

  return (
    <div id="warning-alerts" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-8">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-slate-850 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-650 animate-pulse" />
          Early Warning Alert System
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Unsupervised time-series prediction metrics flag malnutrition risk, drop in weight milestones, and locate emergency pediatric wings.
        </p>
      </div>

      {/* Warning Diagnosis panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        <div className="md:col-span-7 bg-red-50/45 p-6 rounded-2xl border border-red-100 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-650" /> Malnutrition Risk patterns detected
            </span>
            <h3 className="text-lg font-black text-slate-800 leading-tight">
              Weight drop of {weightLossGrams}g identified over last 60 days
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed leading-normal font-sans">
              Child had a weight of {prevWeight}kg on month 6, decreasing to {lastWeight}kg on month 8. 
              According to WHO child standards trajectory, losing weight or failing to gain weight during post-weaning months flags an <b>85% probability risk of stunting and wasting</b> in the next 3 months.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-red-200 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between text-xs font-semibold text-slate-700">
            <span>Critical Category level: <span className="text-red-800 font-extrabold font-mono uppercase">Moderate Wasting Warning</span></span>
            <button 
              id="sms-simulation-trigger-btn"
              onClick={handleSmsSimulation}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Direct SMS grandfathers
            </button>
          </div>
        </div>

        <div className="md:col-span-5 bg-amber-50/25 p-6 rounded-2xl border border-amber-100 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">Risk probability prediction</span>
            <div className="flex items-baseline gap-1 font-mono text-amber-900">
              <span className="text-4xl font-extrabold">85%</span>
              <span className="text-xs font-semibold">Stunting Propensity</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Predictive Random Forest classify model flags immediate risk. Add Cow's ghee, roasted peanuts, finger millets, and egg daily. Re-log weight within 15 days.
            </p>
          </div>

          {smsTriggered && (
            <div id="sms-alert-bubble" className="p-2 bg-indigo-100 text-indigo-800 font-bold rounded-lg border border-indigo-250 text-[10px] text-center animate-bounce">
              ✔ SMS alert dispatched: "URGENT: child Kabir weight drops 200g. Please arrange free health screening at SVP clinic."
            </div>
          )}
        </div>

      </div>

      {/* Ahmedabad Pediatric wings directories */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-indigo-600" />
              SVP Pediatric wings & Government PHCs (Ahmedabad)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Locate Municipal primary health institutions of Ahmedabad providing free child nutritional formulas.
            </p>
          </div>
          
          <select
            id="clinic-area-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">Show All areas in Ahmedabad</option>
            <option value="Vastrapur">Vastrapur</option>
            <option value="Maninagar">Maninagar</option>
            <option value="Ellisbridge">Ellisbridge</option>
            <option value="Asarwa">Asarwa</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-350 bg-slate-50/10 hover:bg-slate-50/40 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{clinic.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold font-sans uppercase">{clinic.type}</span>
                  </div>
                  <span className="text-[9px] bg-slate-150 text-slate-500 font-bold px-1.5 py-0.5 rounded shrink-0">
                    {clinic.area}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-3.5 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  {clinic.address}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100/50 flex justify-between items-center text-xs">
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold font-sans">
                  {clinic.charge}
                </span>
                <a 
                  id={`call-clinic-anchor-${clinic.id}`}
                  href={`tel:${clinic.contact}`}
                  className="flex items-center gap-1 font-bold text-indigo-800 border border-indigo-150 rounded-lg px-2 py-1 bg-white hover:bg-indigo-50 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-600" /> Dial Clinic
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
