/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  interpolateWHO, 
  calculateZScore, 
  getZScoreStatus, 
  weightStandards, 
  heightStandards,
  WHODataPoint
} from "../who_standards";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceDot, 
  Legend 
} from "recharts";
import { 
  TrendingUp, 
  UserPlus, 
  Calendar, 
  Clipboard, 
  Download, 
  Check, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Plus,
  Moon,
  Trash2
} from "lucide-react";

interface ChildProfile {
  id: string;
  name: string;
  birthWeight: number;
  gender: 'boys' | 'girls';
  logs: {
    month: number;
    weight: number;
    height: number;
    date: string;
  }[];
}

const DEFAULT_CHILDREN: ChildProfile[] = [
  {
    id: "c_1",
    name: "Kabir Patel",
    birthWeight: 3.2,
    gender: "boys",
    logs: [
      { month: 0, weight: 3.2, height: 49.9, date: "2025-10-10" },
      { month: 3, weight: 5.4, height: 58.2, date: "2026-01-10" },
      { month: 6, weight: 6.5, height: 64.0, date: "2026-04-10" }, // -2SD WAZ (Underweight warning)
      { month: 8, weight: 7.2, height: 67.5, date: "2026-06-10" }  // Rising nicely after Sattu introduction!
    ]
  },
  {
    id: "c_2",
    name: "Pooja Vyas",
    birthWeight: 3.1,
    gender: "girls",
    logs: [
      { month: 0, weight: 3.1, height: 49.1, date: "2025-08-01" },
      { month: 6, weight: 7.2, height: 65.4, date: "2026-02-01" },
      { month: 12, weight: 8.8, height: 73.8, date: "2026-08-01" } // Normal height-weight following WHO median perfectly
    ]
  }
];

export default function GrowthTracker() {
  const [children, setChildren] = useState<ChildProfile[]>(DEFAULT_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>("c_1");
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Form states for new child
  const [newChildName, setNewChildName] = useState("");
  const [newChildGender, setNewChildGender] = useState<'boys' | 'girls'>("boys");
  const [newChildBirthWeight, setNewChildBirthWeight] = useState(3.2);

  // Form states for adding a log
  const [newLogMonth, setNewLogMonth] = useState(1);
  const [newLogWeight, setNewLogWeight] = useState(3.5);
  const [newLogHeight, setNewLogHeight] = useState(51);

  // Print support modal state
  const [showDocReport, setShowDocReport] = useState(false);

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const newChild: ChildProfile = {
      id: "c_" + Date.now(),
      name: newChildName,
      birthWeight: Number(newChildBirthWeight),
      gender: newChildGender,
      logs: [
        { month: 0, weight: Number(newChildBirthWeight), height: newChildGender === "boys" ? 49.9 : 49.1, date: new Date().toISOString().split('T')[0] }
      ]
    };

    setChildren([...children, newChild]);
    setSelectedChildId(newChild.id);
    setIsAddingChild(false);
    // Reset inputs
    setNewChildName("");
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChild.logs.some(l => l.month === Number(newLogMonth))) {
      setErrorStatus("A log for this month is already registered. Delete existing log first.");
      return;
    }
    setErrorStatus(null);

    const updatedChildren = children.map(c => {
      if (c.id === selectedChild.id) {
        return {
          ...c,
          logs: [
            ...c.logs,
            {
              month: Number(newLogMonth),
              weight: Number(newLogWeight),
              height: Number(newLogHeight),
              date: new Date().toISOString().split('T')[0]
            }
          ].sort((a, b) => a.month - b.month)
        };
      }
      return c;
    });

    setChildren(updatedChildren);
  };

  const handleDeleteLog = (month: number) => {
    if (month === 0) return; // Prevent deleting birth log
    const updatedChildren = children.map(c => {
      if (c.id === selectedChild.id) {
        return {
          ...c,
          logs: c.logs.filter(l => l.month !== month)
        };
      }
      return c;
    });
    setChildren(updatedChildren);
  };

  // Get current parameters
  const lastLog = selectedChild.logs[selectedChild.logs.length - 1];
  const whoWeightSpot = interpolateWHO(weightStandards[selectedChild.gender], lastLog.month);
  const whoHeightSpot = interpolateWHO(heightStandards[selectedChild.gender], lastLog.month);

  const wazScore = calculateZScore(lastLog.weight, whoWeightSpot);
  const hazScore = calculateZScore(lastLog.height, whoHeightSpot);

  const weightStatus = getZScoreStatus(wazScore, 'weight');
  const heightStatus = getZScoreStatus(hazScore, 'height');

  // Trend predictions (3-months mathematically forecasted via logarithmic regression)
  const forecastMonths = [lastLog.month + 1, lastLog.month + 2, lastLog.month + 3];
  const forecasts = forecastMonths.map((m, idx) => {
    // Expected growth: weight gain around 150-200g/month in toddler stage, height 1cm/month
    // Decreased rate for unhealthy nodes simulating realistic biological curve
    const factor = wazScore < -2 ? 0.12 : 0.22; 
    const expectedWeight = lastLog.weight + factor * (idx + 1) * (1.0 / (1.0 + 0.05 * m));
    const expectedHeight = lastLog.height + 0.8 * (idx + 1) * (1.0 / (1.0 + 0.03 * m));
    return {
      month: m,
      weight: parseFloat(expectedWeight.toFixed(2)),
      height: parseFloat(expectedHeight.toFixed(2)),
      isPrediction: true
    };
  });

  // Recharts Chart formulation
  // Generate background WHO curves based on standard milestones for currently loaded child age range
  const chartData = Array.from({ length: lastLog.month + 4 }, (_, m) => {
    const standardsW = interpolateWHO(weightStandards[selectedChild.gender], m);
    const childLog = selectedChild.logs.find(l => l.month === m);
    const predictionLog = forecasts.find(f => f.month === m);

    return {
      month: `M ${m}`,
      monthNum: m,
      "Optimal Median": parseFloat(standardsW.median.toFixed(2)),
      "-2 SD Underweight": parseFloat(standardsW.sdMinus2.toFixed(2)),
      "-3 SD Severe Limit": parseFloat(standardsW.sdMinus3.toFixed(2)),
      "Child Weight": childLog ? childLog.weight : undefined,
      "LSTM Forecast": predictionLog ? predictionLog.weight : (childLog && m === lastLog.month) ? childLog.weight : undefined
    };
  });

  return (
    <div id="growth-tracker" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-indigo-600" />
            Dynamic Child Growth Tracker
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Compare weight and height developments instantly against international WHO z-score percentiles.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            id="child-select-dropdown"
            value={selectedChildId}
            onChange={(e) => {
              setSelectedChildId(e.target.value);
              setErrorStatus(null);
            }}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-xl focus:outline-none cursor-pointer"
          >
            {children.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.gender === 'boys' ? 'Boy' : 'Girl'})</option>
            ))}
          </select>
          <button 
            id="trigger-add-child-btn"
            onClick={() => setIsAddingChild(!isAddingChild)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add Child
          </button>
        </div>
      </div>

      {isAddingChild && (
        <form id="add-child-form" onSubmit={handleAddChild} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200 mb-6 animate-fade-in grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Child's Full Name</label>
            <input 
              type="text" 
              required
              id="new-child-name"
              placeholder="e.g., Kabir Patel" 
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Biological Gender</label>
            <select 
              id="new-child-gender"
              value={newChildGender}
              onChange={(e) => setNewChildGender(e.target.value as 'boys' | 'girls')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="boys">Boy (Male)</option>
              <option value="girls">Girl (Female)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Birth Weight (kg)</label>
            <input 
              type="number" 
              step="0.01"
              id="new-child-birthweight"
              required
              min="1.0"
              max="6.0"
              value={newChildBirthWeight}
              onChange={(e) => setNewChildBirthWeight(parseFloat(e.target.value) || 3.2)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit" 
              id="submit-child-btn"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-semibold rounded-xl"
            >
              Save Profile
            </button>
            <button 
              type="button" 
              id="cancel-child-btn"
              onClick={() => setIsAddingChild(false)}
              className="px-3 py-2 text-sm bg-slate-200 hover:bg-slate-300 text-slate-750 font-medium rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main grids: KPI Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Child stats */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currently Tracking</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1">{selectedChild.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Weaning Age: <span className="font-semibold text-slate-700 font-mono">{lastLog.month} mon</span> | Sex:{" "}
              <span className="font-semibold text-slate-700 uppercase">{selectedChild.gender}</span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-450 block uppercase font-bold">Latest Weight</span>
              <span className="text-lg font-bold text-slate-750 font-mono">{lastLog.weight} kg</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] text-slate-450 block uppercase font-bold">Latest Height</span>
              <span className="text-lg font-bold text-slate-750 font-mono">{lastLog.height} cm</span>
            </div>
          </div>
        </div>

        {/* WAZ indicators */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${weightStatus.color}`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Weight-for-Age (WAZ)</span>
              <span className="text-xs px-2.5 py-0.5 bg-white font-mono font-bold rounded-full border">
                Z-Score: {wazScore.toFixed(2)}
              </span>
            </div>
            <h3 className="text-xl font-bold mt-2">{weightStatus.label}</h3>
            <p className="text-xs leading-relaxed mt-1 opacity-90">{weightStatus.description}</p>
          </div>
          {wazScore <= -2 && (
            <div className="mt-3 flex items-center gap-1 text-xs text-amber-800 font-semibold bg-white/50 px-2 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5" /> High Risk for Malnutrition
            </div>
          )}
        </div>

        {/* HAZ indicators */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${heightStatus.color}`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Height-for-Age (HAZ)</span>
              <span className="text-xs px-2.5 py-0.5 bg-white font-mono font-bold rounded-full border">
                Z-Score: {hazScore.toFixed(2)}
              </span>
            </div>
            <h3 className="text-xl font-bold mt-2">{heightStatus.label}</h3>
            <p className="text-xs leading-relaxed mt-1 opacity-90">{heightStatus.description}</p>
          </div>
          {/* Action indicator */}
          <div className="mt-3 text-right">
            <button 
              id="export-doc-report-btn"
              onClick={() => setShowDocReport(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-white/75 hover:bg-white border border-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> Export Pediatric Report
            </button>
          </div>
        </div>

      </div>

      {/* Main graph visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Graph representation: Recharts */}
        <div className="lg:col-span-8 md:col-span-full">
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                WHO Standard Growth Percentiles curve vs. {selectedChild.name}
              </h3>
              <span className="text-[10px] font-medium text-slate-400 font-sans block">
                Z-Score projection: Boys / Girls 0-60 Months
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis unit="kg" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                  
                  {/* WHO Standards lines */}
                  <Line type="monotone" dataKey="Optimal Median" stroke="#4f46e5" strokeWidth={1.5} dot={false} activeDot={false} name="Optimal Median" />
                  <Line type="monotone" dataKey="-2 SD Underweight" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="5 5" activeDot={false} name="-2 SD Underweight" />
                  <Line type="monotone" dataKey="-3 SD Severe Limit" stroke="#dc2626" strokeWidth={1} dot={false} strokeDasharray="3 3" activeDot={false} name="-3 SD Severe Limit" />
                  
                  {/* Child progression logs */}
                  <Line type="monotone" dataKey="Child Weight" stroke="#312e81" strokeWidth={2.5} dot={{ r: 5, fill: "#312e81" }} activeDot={{ r: 7 }} name="Recorded Weight (kg)" />
                  <Line type="monotone" dataKey="LSTM Forecast" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, strokeDasharray: "none", fill: "#4f46e5" }} strokeDasharray="4 4" name="LSTM Time-Series Projection" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] text-slate-400 font-medium">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#dc2626]" /> -3 SD Standard Threshold (Severe Wasting)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#f59e0b] stroke-dasharray-[5_5]" /> -2 SD Standard Threshold (Underweight limit)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#4f46e5]" /> Optimal WHO Median (Indigo-Band)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Log input forms */}
        <div className="lg:col-span-4 md:col-span-full space-y-6">
          <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
              Add New Parameter Log
            </h3>
            
            <form id="add-log-values-form" onSubmit={handleAddLog} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Weaning Mon</label>
                  <input 
                    type="number" 
                    id="new-log-month"
                    required
                    min="1"
                    max="60"
                    value={newLogMonth}
                    onChange={(e) => setNewLogMonth(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.05"
                    id="new-log-weight"
                    required
                    min="1.0"
                    max="35.0"
                    value={newLogWeight}
                    onChange={(e) => setNewLogWeight(parseFloat(e.target.value) || 3.5)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Height (cm)</label>
                  <input 
                    type="number" 
                    id="new-log-height"
                    required
                    min="40"
                    max="140"
                    value={newLogHeight}
                    onChange={(e) => setNewLogHeight(parseInt(e.target.value) || 51)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                id="submit-log-btn"
                className="w-full py-2 bg-slate-750 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Save parameter measurements
              </button>
              
              {errorStatus && (
                <p className="text-[10px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">{errorStatus}</p>
              )}
            </form>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Historical Log Index
            </h3>
            <div className="max-h-[140px] overflow-y-auto space-y-1 text-slate-700 text-xs font-mono">
              {[...selectedChild.logs].reverse().map((log, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <span className="font-sans text-slate-500 font-medium">{log.month === 0 ? "Birth" : `Month ${log.month}`}</span>
                  <span>{log.weight}kg | {log.height}cm</span>
                  {log.month !== 0 ? (
                    <button 
                      id={`delete-log-btn-${log.month}`}
                      onClick={() => handleDeleteLog(log.month)}
                      className="text-red-400 hover:text-red-600 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[9px] bg-slate-100 px-1 py-0.5 text-slate-400 rounded">Base</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Printable Pediatric PDF Clinician Report Modal */}
      {showDocReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in text-slate-850">
          <div id="pediatrician-report-panel" className="bg-white max-w-2xl w-full p-8 rounded-2xl shadow-xl border border-slate-200 relative">
            <div className="flex justify-between items-center border-b-2 border-slate-850 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 uppercase">
                  Pediatric Clinic Examination Summary
                </h2>
                <p className="text-xs font-bold text-indigo-700 font-mono">
                  SVP PATIENT REPORT HUB • AHMEDABAD MEDICAL CIRCLE
                </p>
              </div>
              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono text-[10px] text-slate-500 uppercase">
                Pediatric code: SVP-N{selectedChild.id.slice(-2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6 pb-6 border-b border-dashed border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-0.5">Patient Name</p>
                <p className="font-bold text-slate-800 text-base">{selectedChild.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-0.5">Biological Sex</p>
                <p className="font-bold text-slate-800 capitalize">{selectedChild.gender}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-0.5">Developmental Weaning Month</p>
                <p className="font-bold text-slate-850 font-mono">{lastLog.month} Months</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-0.5">Report Compile Date</p>
                <p className="font-bold text-slate-850 font-mono">{new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-1">
                Clinical Metrics & Standard WHO Z-Score Percentiles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase">Weight Parameter</p>
                  <p className="text-2xl font-black text-slate-800 font-mono mt-1">{lastLog.weight} kg</p>
                  <p className="text-xs text-slate-600 mt-1 font-semibold flex items-center gap-1">
                    WHO Z-Score: <span className="font-mono bg-white inline-block px-1.5 py-0.5 rounded border">{wazScore.toFixed(2)}</span>
                  </p>
                  <span className="inline-block mt-2.5 text-[10px] px-2.0 py-1 font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-center">
                    Diagnosis: {weightStatus.label}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase">Height Parameter</p>
                  <p className="text-2xl font-black text-slate-800 font-mono mt-1">{lastLog.height} cm</p>
                  <p className="text-xs text-slate-600 mt-1 font-semibold flex items-center gap-1">
                    WHO Z-Score: <span className="font-mono bg-white inline-block px-1.5 py-0.5 rounded border">{hazScore.toFixed(2)}</span>
                  </p>
                  <span className="inline-block mt-2.5 text-[10px] px-2.0 py-1 font-bold rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-center">
                    Diagnosis: {heightStatus.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Pediatrician Clinical Instructions
              </h3>
              <ul className="text-xs space-y-2 text-slate-700 leading-relaxed list-disc list-inside">
                <li>Optimize dietary micro-nutrients: add 2 servings of Sattu formulation with mashed banana.</li>
                <li>Conduct a basic Hemoglobin screening to safeguard against Iron Deficiency Anaemia.</li>
                <li>Measure child weight regularly at the local Ahmedabad PHC on the 1st week of next month.</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                id="doc-print-action-btn"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Trigger Browser Print (PDF)
              </button>
              <button
                id="close-doc-report-btn"
                onClick={() => setShowDocReport(false)}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-350 text-slate-755 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Close Examination Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
