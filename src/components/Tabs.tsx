import React from 'react';
import { DateIdea } from '@/types';
import { Bookmark, MapPin, ChevronRight, Sparkles } from 'lucide-react';

interface SavedViewProps {
  savedIdeas: DateIdea[];
  onIdeaClick: (idea: DateIdea) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({ savedIdeas, onIdeaClick }) => {
  if (savedIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-10 text-center space-y-4">
        <div className="w-20 h-20 bg-[#4A1D96]/10 rounded-2xl flex items-center justify-center">
          <Bookmark size={36} className="text-[#4A1D96]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">No saved ideas yet</h2>
          <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
            Tap the save button on any date idea to keep it here for later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 pt-14 pb-32 space-y-5 overflow-y-auto h-full bg-white">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Saved Ideas</h1>
        <p className="text-gray-400 text-sm mt-0.5">{savedIdeas.length} idea{savedIdeas.length !== 1 ? 's' : ''} saved</p>
      </div>
      <div className="space-y-3">
        {savedIdeas.map((idea) => (
          <button
            key={idea.id}
            onClick={() => onIdeaClick(idea)}
            className="group w-full text-left bg-[#4A1D96]/[0.03] rounded-2xl p-4 border border-[#4A1D96]/10 flex items-center gap-3.5 active:scale-[0.98] transition-all hover:bg-[#4A1D96]/[0.06] hover:border-[#4A1D96]/20"
          >
            <div className="text-3xl w-12 h-12 flex items-center justify-center bg-white rounded-xl flex-shrink-0 shadow-sm">
              {idea.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] text-gray-900 truncate">{idea.activity}</h3>
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <MapPin size={11} />
                <span className="truncate">{idea.location}, {idea.area}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#4A1D96] transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export const PlanView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-10 text-center space-y-5">
      <div className="w-20 h-20 bg-[#4A1D96]/10 rounded-2xl flex items-center justify-center">
        <Sparkles size={36} className="text-[#4A1D96]" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Plan Your Date</h2>
        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed max-w-xs">
          An AI-powered date planner is coming soon to help you curate the perfect day out.
        </p>
      </div>
      <div className="w-full max-w-[200px]">
        <div className="flex justify-between text-[10px] font-medium text-gray-400 mb-1.5">
          <span>In progress</span>
          <span>67%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#4A1D96] h-full w-2/3 rounded-full" />
        </div>
      </div>
    </div>
  );
};
