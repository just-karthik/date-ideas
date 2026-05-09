'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Map } from '@/components/Map';
import { SearchBar } from '@/components/SearchBar';
import { BottomNav } from '@/components/BottomNav';
import { BottomSheet } from '@/components/BottomSheet';
import { SavedView, PlanView } from '@/components/Tabs';
import { LocationPermissionModal } from '@/components/LocationPermissionModal';
import { DATE_IDEAS } from '@/data/date-ideas';
import { DateIdea, TabType } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<DateIdea | null>(null);
  const [savedIdeas, setSavedIdeas] = useLocalStorage<DateIdea[]>('saved-date-ideas', []);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Check if location permission was already asked
  useEffect(() => {
    const hasAskedLocation = localStorage.getItem('has-asked-location');
    if (!hasAskedLocation) {
      setTimeout(() => setShowLocationModal(true), 1500);
    } else {
      // If previously allowed, try to get location
      const wasAllowed = localStorage.getItem('location-allowed') === 'true';
      if (wasAllowed) {
        requestLocation();
      }
    }
  }, []);

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
          localStorage.setItem('location-allowed', 'true');
        },
        (error) => {
          console.error("Error getting location:", error);
          localStorage.setItem('location-allowed', 'false');
        }
      );
    }
  };

  const handleAllowLocation = () => {
    setShowLocationModal(false);
    localStorage.setItem('has-asked-location', 'true');
    requestLocation();
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
    localStorage.setItem('has-asked-location', 'true');
    localStorage.setItem('location-allowed', 'false');
  };

  // Filter ideas based on search, category and subcategory
  const filteredIdeas = useMemo(() => {
    return DATE_IDEAS.filter((idea) => {
      const matchesSearch = 
        idea.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.area.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory ? idea.category === selectedCategory : true;
      const matchesSubcategory = selectedSubcategory ? idea.subcategory === selectedSubcategory : true;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  const toggleSaveIdea = (idea: DateIdea) => {
    const isAlreadySaved = savedIdeas.some((item) => item.id === idea.id);
    if (isAlreadySaved) {
      setSavedIdeas(savedIdeas.filter((item) => item.id !== idea.id));
    } else {
      setSavedIdeas([...savedIdeas, idea]);
    }
  };

  const isIdeaSaved = (id: string) => savedIdeas.some((item) => item.id === id);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Views */}
      <div className="absolute inset-0 pb-20">
        {activeTab === 'home' && (
          <>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
            />
            <Map 
              ideas={filteredIdeas} 
              onPinClick={setSelectedIdea} 
              userLocation={userLocation}
            />
          </>
        )}

        <div className="max-w-[500px] mx-auto h-full">
          {activeTab === 'saved' && (
            <SavedView 
              savedIdeas={savedIdeas} 
              onIdeaClick={(idea) => {
                setSelectedIdea(idea);
              }} 
            />
          )}

          {activeTab === 'plan' && <PlanView />}
        </div>
      </div>

      {/* Overlays */}
      <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * DATE_IDEAS.length);
            setSelectedIdea(DATE_IDEAS[randomIndex]);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#4A1D96]/10 text-[#4A1D96] rounded-full shadow-lg shadow-[#4A1D96]/5 hover:scale-105 transition-transform active:scale-95 animate-bounce-subtle border border-[#4A1D96]/20 backdrop-blur-md"
        >
          <div className="bg-[#4A1D96]/10 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M12 3v1"/><path d="m5 8 1 1"/><path d="M3 12h1"/><path d="m5 16 1-1"/><path d="M12 21v-1"/><path d="m19 16-1-1"/><path d="M21 12h-1"/><path d="m19 8-1 1"/><path d="m12 8-4 4 4 4 4-4-4-4z"/></svg>
          </div>
          <span className="text-xs font-black tracking-wider uppercase">Surprise Me</span>
        </button>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <BottomSheet
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
        isSaved={selectedIdea ? isIdeaSaved(selectedIdea.id) : false}
        onToggleSave={toggleSaveIdea}
        onPlanClick={() => setActiveTab('plan')}
      />

      <LocationPermissionModal
        show={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />
    </main>
  );
}
