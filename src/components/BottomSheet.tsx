'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Bookmark, Share2, IndianRupee } from 'lucide-react';
import { DateIdea } from '@/types';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  idea: DateIdea | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (idea: DateIdea) => void;
  onPlanClick?: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  idea,
  onClose,
  isSaved,
  onToggleSave,
  onPlanClick
}) => {
  const [copied, setCopied] = React.useState(false);
  const [showAllTimings, setShowAllTimings] = React.useState(false);

  if (!idea) return null;

  const parseTimings = (timingsStr: string) => {
    if (!timingsStr) return [];
    
    // Split by newline first to get each day's row
    const lines = timingsStr.split('\n').map(l => l.trim()).filter(Boolean);
    const schedule: { day: string, time: string }[] = [];
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    lines.forEach(line => {
      // Find which day name this line starts with
      const day = dayNames.find(d => line.toLowerCase().startsWith(d.toLowerCase()));
      if (day) {
        // The rest of the line is the time
        const time = line.substring(day.length).trim();
        schedule.push({ day, time });
      }
    });

    return schedule;
  };

  const schedule = parseTimings(idea.timings);
  
  // Get current day in IST
  const today = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    timeZone: 'Asia/Kolkata' 
  }).format(new Date());

  const todayTiming = schedule.find(s => s.day === today) || schedule[0];
  const otherTimings = schedule.filter(s => s.day !== today);

  const handleShare = () => {
    if (idea.google_maps_link) {
      navigator.clipboard.writeText(idea.google_maps_link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <AnimatePresence>
      {idea && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50 backdrop-blur-[2px]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] z-[60] max-h-[80vh] overflow-y-auto max-w-[480px] mx-auto"
          >
            {/* Handle */}
            <div className="sticky top-0 bg-white pt-3 pb-2 rounded-t-[28px]">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
            </div>

            <div className="px-6 pb-10">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <span className="text-4xl mb-3 block">{idea.emoji}</span>
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug tracking-tight">{idea.activity}</h2>
                  <p className="text-[#FB7185] text-[11px] font-semibold uppercase tracking-wider mt-1.5">{idea.subcategory} · {idea.category.replace(" Dates", "")}</p>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">{idea.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 -mr-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-5" />

              {/* Details Grid */}
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4A1D96]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#4A1D96]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{idea.location}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{idea.area} · {idea.address}</p>
                  </div>
                </div>

                {/* Timing Accordion */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4A1D96]/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-[#4A1D96]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {todayTiming?.day === today ? `Today (${todayTiming.day})` : (todayTiming?.day || 'Timings')}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{todayTiming?.time || idea.timings}</p>
                      </div>
                      {schedule.length > 1 && (
                        <button 
                          onClick={() => setShowAllTimings(!showAllTimings)}
                          className="text-[10px] font-bold text-[#4A1D96] uppercase tracking-wider bg-[#4A1D96]/5 px-2 py-1 rounded-md"
                        >
                          {showAllTimings ? 'Close' : 'Other Days'}
                        </button>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {showAllTimings && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 space-y-2 border-t border-gray-50 mt-3">
                            {otherTimings.map((s, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[11px]">
                                <span className="text-gray-400 font-medium">{s.day}</span>
                                <span className="text-gray-600 font-semibold">{s.time}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4A1D96]/10 flex items-center justify-center flex-shrink-0">
                    <IndianRupee size={18} className="text-[#4A1D96]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pricing</p>
                    <p className="text-xs text-gray-500 mt-0.5">{idea.pricing}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[11px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => onToggleSave(idea)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-200",
                    isSaved
                      ? "bg-[#4A1D96] text-white"
                      : "border-2 border-[#4A1D96] text-[#4A1D96] hover:bg-[#4A1D96]/5"
                  )}
                >
                  <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save"}
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-semibold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
                >
                  <Share2 size={18} />
                  <span className="truncate">{copied ? "Copied!" : "Share"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
