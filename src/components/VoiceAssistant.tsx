/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  MessageSquare,
  AlertCircle
} from "lucide-react";

interface VoiceResponse {
  replyText: string;
  replyTextHindi?: string;
  voiceScript: string;
  actionSteps: string[];
}

const SAMPLE_QUESTION_CHIPS = [
  "६ महीने के शिशु को क्या खिलाएं? (Hindi)",
  "Diet remedies for underweight child? (English)",
  "How to cook Moong Dal-Ragi Porridge?",
  "Signs of Iron deficiency anemia?"
];

export default function VoiceAssistant() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoiceResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const triggerChat = async (questionText: string) => {
    setLoading(true);
    setQuery(questionText);
    setErrorText(null);
    try {
      const response = await fetch("/api/chat-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: questionText,
          childAge: "6-12 months",
          childIssue: "underweight"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process conversation.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setErrorText(err.message || "Failed to process chat query.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoicePlayback = () => {
    if (!result) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const SpeechText = result.replyTextHindi || result.replyText;
    const utterance = new SpeechSynthesisUtterance(SpeechText);
    utterance.lang = result.replyTextHindi ? "hi-IN" : "en-IN";
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="voice-assistant" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-600 animate-pulse" />
            NutriNet Verbal Companion
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tap standard Indian nutrition queries below or type child-raising issues to hear maternal spoken guidance.
          </p>
        </div>
        <span className="hidden sm:inline-flex bg-indigo-50 text-indigo-700 font-mono text-xs px-2.5 py-1 rounded-full border border-indigo-100 items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Speak-to-Text Enabled
        </span>
      </div>

      {/* Query chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          Suggested Maternal Queries
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTION_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              id={`voice-chip-btn-${idx}`}
              onClick={() => triggerChat(chip)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-650 text-xs font-semibold rounded-xl border border-slate-200/60 hover:border-indigo-300 transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="flex gap-2.5">
        <input 
          type="text"
          id="verbal-query-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask e.g. what should I feed a 6-month underweight infant?"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-10"
        />
        <button
          onClick={() => triggerChat(query)}
          disabled={loading || !query.trim()}
          id="verbal-query-submit-btn"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
        >
          {loading ? "Thinking..." : "Submit Question"}
        </button>
      </div>

      {errorText && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex gap-1 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Answer Pane */}
      {result ? (
        <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200 space-y-4 animate-fade-in text-slate-850">
          
          <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-150">
            <div className="flex gap-2">
              <MessageSquare className="w-8 h-8 text-indigo-600 shrink-0 bg-white p-1.5 rounded-full border shadow-xs" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Moong-Ragi Verbal Companion</h4>
                <p className="text-[10px] text-slate-400 font-semibold font-sans uppercase">A.I-Guided Pediatric Advisor</p>
              </div>
            </div>
            {/* Direct Auditory Synth */}
            <button
              id="assistant-voice-playback-btn"
              onClick={handleVoicePlayback}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${
                isSpeaking ? "bg-red-650 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border"
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
              {isSpeaking ? "Mute Voice" : "Listen spoken voice"}
            </button>
          </div>

          <div className="space-y-3 font-sans leading-relaxed text-xs">
            {result.replyTextHindi && (
              <p className="font-bold text-slate-800 text-sm">
                {result.replyTextHindi}
              </p>
            )}
            <p className="text-slate-650">
              {result.replyText}
            </p>
          </div>

          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
              Verified clinical steps index
            </span>
            <div className="space-y-1.5">
              {result.actionSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/60 text-xs">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50/20 rounded-2xl border border-dashed border-slate-100">
          <MessageSquare className="w-10 h-10 text-slate-300 stroke-[1.5] mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600 font-sans">No Conversation History</p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
            Choose a suggested query chip above or search manually to interact verbally.
          </p>
        </div>
      )}

    </div>
  );
}
