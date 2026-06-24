/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Mic, 
  Search, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Plus,
  Send,
  Sparkles,
  MapPin,
  Baby
} from "lucide-react";

interface GroupPost {
  id: string;
  userName: string;
  location: string;
  childAgeGroup: string;
  issue: string;
  message: string;
  isVoicePost: boolean;
  timestamp: string;
  likes: number;
  expertVerified: boolean;
  expertAnswer: string;
}

// Age-based dynamic supportive nutrition tips
const AGE_NUTRITION_TIPS = {
  "0-6 months": "Exclusively breastfeed. Under WHO guidelines, avoid giving normal water, honey, or cow-milk. Breast milk provides all necessary moisture and protective immunity.",
  "6-12 months": "Begin complement solids. Transition with thin Moong Dal starch, mashed Ragi porridge (rab) and pureed pumpkin. Maintain breast feeds regularly.",
  "1-2 years": " toddler feeding. Introduce small soft portions of standard household meals (roti mixed with dal, curd, mashed paneer). Add 1 tsp cow fat/ghee for dense calories.",
  "2-5 years": "Strengthen bone height. Offer ragi flour flatbreads, spinach puree, iron-dense boiled chickpeas, split beans, and milk shakes. Maintain vitamin D intake."
};

const SAMPLE_VOICE_SCRIPTS = [
  "मैंने गुजराती दाल बनाना सिखा, बच्चों को घी मिलाकर खिला रही हूँ, क्या यह सेहतमंद है?",
  "मेरा ६ महीने का बच्चा सिर्फ दूध पीता है, दलिया खिलाने की शुरूआत कैसे करूँ?",
  "मेरे बच्चे का वजन सही ढंग से नहीं बढ़ रहा, अहमदाबाद में सरकारी पोषण केंद्र कहाँ है?"
];

export default function SupportGroups() {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState("all");

  // Form states
  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("Ahmedabad");
  const [childAgeGroup, setChildAgeGroup] = useState("6-12 months");
  const [issue, setIssue] = useState("underweight");
  const [message, setMessage] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceQueryIndex, setVoiceQueryIndex] = useState(0);

  const [formError, setFormError] = useState<string | null>(null);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams({
        ageGroup: selectedAge,
        issue: selectedIssue,
        search
      });
      const response = await fetch(`/api/support-groups?${qParams}`);
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedAge, selectedIssue, search]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !message.trim()) {
      setFormError("Name and message cannot be empty.");
      return;
    }
    setFormError(null);

    try {
      const response = await fetch("/api/support-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          location,
          childAgeGroup,
          issue,
          message,
          isVoicePost: isVoiceActive
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to issue support thread.");
      }

      await fetchPosts();
      // Reset
      setMessage("");
      setIsVoiceActive(false);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`/api/support-groups/${id}/like`, { method: "POST" });
      if (res.ok) {
        // Optimistic update
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate Mic Voice Feed Input (Translates voiced Hindi phrases to written text)
  const simulateVoicePost = () => {
    setIsVoiceActive(true);
    const audioScript = SAMPLE_VOICE_SCRIPTS[voiceQueryIndex];
    setVoiceQueryIndex((voiceQueryIndex + 1) % SAMPLE_VOICE_SCRIPTS.length);
    
    // Type out the message as if transcribed in real-time
    setMessage("");
    let currentText = "";
    let charIndex = 0;
    
    const interval = setInterval(() => {
      if (charIndex < audioScript.length) {
        currentText += audioScript[charIndex];
        setMessage(currentText);
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 45);
  };

  return (
    <div id="support-groups" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Mother Support Circles
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Connect offline and post messages. Read daily tips moderated by Gujarat pediatric experts.
          </p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 font-mono text-xs px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1 shrink-0">
          <CheckCircle className="w-3.5 h-3.5" /> NLP Smart Moderate On
        </div>
      </div>

      {/* Daily Tip Feed banner */}
      <div className="bg-gradient-to-r from-indigo-50/50 to-indigo-50/30 p-4 rounded-2xl border border-slate-200 mb-6 flex gap-3.5 items-start">
        <div className="p-2.5 bg-white text-indigo-600 rounded-xl shadow-sm border border-indigo-100 shrink-0">
          <Lightbulb className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Mothers Daily Feeding Guideline</span>
          <p className="text-xs text-slate-700 leading-relaxed mt-1">
            <span className="font-bold text-slate-800">For {childAgeGroup}:</span> {AGE_NUTRITION_TIPS[childAgeGroup as keyof typeof AGE_NUTRITION_TIPS]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Post form with Voice simulator */}
        <div className="lg:col-span-5 md:col-span-full">
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-200/60 pb-2">
              <Plus className="w-4 h-4 text-indigo-600" /> Start Community Question
            </h3>

            <form id="group-post-form" onSubmit={handleSubmitPost} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    id="post-author-name"
                    placeholder="Meena Patel"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1">Your Neighborhood</label>
                  <input 
                    type="text" 
                    id="post-location"
                    placeholder="Vastrapur, Ahmedabad"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1">Child's Development stage</label>
                  <select 
                    id="post-child-agegroup"
                    value={childAgeGroup}
                    onChange={(e) => setChildAgeGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="0-6 months">0-6 Months</option>
                    <option value="6-12 months">6-12 Months</option>
                    <option value="1-2 years">1-2 Years</option>
                    <option value="2-5 years">2-5 Years</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-650 block mb-1">Primary Nutrient Problem</label>
                  <select 
                    id="post-child-issue"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="healthy">Optimal Progress (Healthy)</option>
                    <option value="underweight">Underweight Deficiency</option>
                    <option value="stunting">Stunted Growth</option>
                    <option value="anemia">Iron Deficiency (Anemia)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-655" htmlFor="post-body-message">Describe nutrition query or recipe results</label>
                  <button
                    type="button"
                    onClick={simulateVoicePost}
                    id="voice-transcribe-simulate-btn"
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.0 py-1 rounded-lg cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Speak Hindi simulation
                  </button>
                </div>
                <div className="relative">
                  <textarea 
                    rows={4}
                    required
                    id="post-body-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type or click Speak Hindi to transcribe baby feeding issues..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none block pr-10 leading-relaxed text-slate-800"
                  />
                  {isVoiceActive && (
                    <span className="absolute bottom-2 right-2 bg-indigo-100 text-indigo-800 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-indigo-300">
                      <Sparkles className="w-2.5 h-2.5 animate-spin" /> Transcribed
                    </span>
                  )}
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex gap-1 border border-red-100">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <button 
                type="submit" 
                id="submit-discussion-post-btn"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Publish group post
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Filter & Feeds list */}
        <div className="lg:col-span-7 md:col-span-full space-y-4">
          
          {/* Controls filtering */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                id="search-posts-input"
                placeholder="Search feeds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none"
              />
            </div>
            <select 
              id="filter-post-agegroup"
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="all">Any Age circles</option>
              <option value="0-6 months">0-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-5 years">2-5 years</option>
            </select>
            <select 
              id="filter-post-issue"
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="all">Any Health profile</option>
              <option value="underweight">Underweight</option>
              <option value="stunting">Stunting</option>
              <option value="anemia">Anemia</option>
              <option value="healthy">Healthy progress</option>
            </select>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 uppercase font-mono font-bold text-xs">
                        {post.userName.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          {post.userName}
                          <span className="text-[9px] text-slate-400 font-normal">({post.timestamp})</span>
                        </h4>
                        <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-500 mt-0.5 items-center">
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {post.location}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-0.5"><Baby className="w-3 h-3 text-slate-400" /> {post.childAgeGroup}</span>
                        </div>
                      </div>
                    </div>
                    {post.issue !== "healthy" ? (
                      <span className="text-[9px] bg-orange-100 text-orange-900 border border-orange-200 font-bold px-1.5 py-0.5 rounded capitalize">
                        {post.issue}
                      </span>
                    ) : (
                      <span className="text-[9px] bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold px-1.5 py-0.5 rounded">
                        Optimal
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans pl-1">
                    {post.message}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-semibold font-sans">
                    <button 
                      id={`like-post-btn-${post.id}`}
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-50 stroke-red-400 hover:scale-105" /> Like ({post.likes})
                    </button>
                    {post.isVoicePost && (
                      <span className="flex items-center gap-1 text-[9px] text-indigo-600">
                        <Mic className="w-3 h-3" /> Dictated via Speech-to-Text
                      </span>
                    )}
                  </div>

                  {/* Pediatric Expert verified feedback answer panel */}
                  {post.expertVerified && (
                    <div className="mt-3.5 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider">
                          SVP Pediatric Doctor Advisory
                        </span>
                      </div>
                      <p className="text-xs text-slate-750 font-medium italic leading-relaxed">
                        "{post.expertAnswer}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-205">
                <MessageSquare className="w-10 h-10 text-slate-300 stroke-[1.5] mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No matching discussion circles</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Try selecting a different baby developmental month or health issue filter.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
