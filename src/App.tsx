import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CityExplorer } from './components/CityExplorer';
import { InteractiveMap } from './components/InteractiveMap';
import { SafetyDashboard } from './components/SafetyDashboard';
import { PlaceComparison } from './components/PlaceComparison';
import { SmartCityDashboard } from './components/SmartCityDashboard';
import { AiAssistant } from './components/AiAssistant';
import { TripPlanner } from './components/TripPlanner';
import { PlaceDetailsModal } from './components/PlaceDetailsModal';
import { 
  MOCK_PLACES, 
  MOCK_SAFETY_INCIDENTS 
} from './data/mockData';
import { Place, SafetyIncident, ItineraryItem } from './types';
import { Compass, ShieldCheck, Heart, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [incidents, setIncidents] = useState<SafetyIncident[]>(MOCK_SAFETY_INCIDENTS);
  
  // Initial demo comparison items for immediate hackathon showcase
  const [comparedPlaceIds, setComparedPlaceIds] = useState<string[]>([
    'pune-shaniwar-wada',
    'pune-aga-khan-palace'
  ]);

  // Initial demo itinerary items
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    {
      id: 'itin-01',
      placeId: 'pune-shaniwar-wada',
      day: 1,
      timeSlot: 'Morning',
      customNotes: 'Start early at 9:30 AM to explore Dilli Darwaza before peak sun',
    },
    {
      id: 'itin-02',
      placeId: 'pune-vaishali-restaurant',
      day: 1,
      timeSlot: 'Afternoon',
      customNotes: 'Order SPDP and Mysore Masala Dosa with South Indian filter coffee',
    },
    {
      id: 'itin-03',
      placeId: 'pune-saras-baug',
      day: 1,
      timeSlot: 'Evening',
      customNotes: 'Visit Talyatla Ganpati temple and enjoy sunset near lotus pond',
    },
    {
      id: 'itin-04',
      placeId: 'pune-sinhagad-fort',
      day: 2,
      timeSlot: 'Morning',
      customNotes: 'Trek up for fresh Pithla Bhakri and mountain breeze',
    },
    {
      id: 'itin-05',
      placeId: 'pune-kayani-bakery',
      day: 2,
      timeSlot: 'Evening',
      customNotes: 'Pick up Shrewsbury biscuits and Mawa cake in Camp',
    }
  ]);

  // Modal & Navigation States
  const [activeModalPlace, setActiveModalPlace] = useState<Place | null>(null);
  const [mapCenterPlace, setMapCenterPlace] = useState<Place | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Comparison Handlers
  const handleToggleCompare = (place: Place) => {
    if (comparedPlaceIds.includes(place.id)) {
      setComparedPlaceIds(comparedPlaceIds.filter(id => id !== place.id));
      showToast(`Removed "${place.name}" from comparison`);
    } else {
      if (comparedPlaceIds.length >= 4) {
        showToast('Maximum 4 places can be compared simultaneously.');
        return;
      }
      setComparedPlaceIds([...comparedPlaceIds, place.id]);
      showToast(`Added "${place.name}" to comparison`);
    }
  };

  const handleRemoveFromCompare = (placeId: string) => {
    setComparedPlaceIds(comparedPlaceIds.filter(id => id !== placeId));
  };

  const handleClearComparison = () => {
    setComparedPlaceIds([]);
    showToast('Comparison tray cleared');
  };

  const handleAddPresetComparison = (ids: string[]) => {
    setComparedPlaceIds(ids);
    setActiveTab('compare');
    showToast('Loaded preset comparison');
  };

  // Planner Handlers
  const handleAddToPlanner = (place: Place) => {
    const isAlreadyIn = itinerary.some(item => item.placeId === place.id);
    if (isAlreadyIn) {
      showToast(`"${place.name}" is already in your itinerary.`);
      return;
    }

    const newItem: ItineraryItem = {
      id: `itin-${Date.now()}`,
      placeId: place.id,
      day: 1,
      timeSlot: 'Morning',
      customNotes: `Planned stop at ${place.neighborhood}`,
    };

    setItinerary([...itinerary, newItem]);
    showToast(`Added "${place.name}" to Day 1 Itinerary!`);
  };

  const handleRemoveItineraryItem = (itemId: string) => {
    setItinerary(itinerary.filter(i => i.id !== itemId));
    showToast('Removed stop from itinerary');
  };

  const handleAddPlannerItem = (
    placeId: string, 
    day: number, 
    slot: 'Morning' | 'Afternoon' | 'Evening' | 'Night'
  ) => {
    const newItem: ItineraryItem = {
      id: `itin-${Date.now()}`,
      placeId,
      day,
      timeSlot: slot,
    };
    setItinerary([...itinerary, newItem]);
    showToast('Added stop to planner!');
  };

  const handleUpdateItemNotes = (itemId: string, notes: string) => {
    setItinerary(itinerary.map(item => item.id === itemId ? { ...item, customNotes: notes } : item));
  };

  const handleLoadPresetItinerary = () => {
    setItinerary([
      {
        id: 'itin-01',
        placeId: 'pune-shaniwar-wada',
        day: 1,
        timeSlot: 'Morning',
        customNotes: 'Visit 9:30 AM before peak heat',
      },
      {
        id: 'itin-02',
        placeId: 'pune-vaishali-restaurant',
        day: 1,
        timeSlot: 'Afternoon',
        customNotes: 'Iconic SPDP & Filter Coffee on FC Road',
      },
      {
        id: 'itin-03',
        placeId: 'pune-saras-baug',
        day: 1,
        timeSlot: 'Evening',
        customNotes: 'Walk around lotus garden and Talyatla Ganpati',
      },
      {
        id: 'itin-04',
        placeId: 'pune-sinhagad-fort',
        day: 2,
        timeSlot: 'Morning',
        customNotes: 'Cool mountain air & steaming Pithla Bhakri',
      },
      {
        id: 'itin-05',
        placeId: 'pune-kayani-bakery',
        day: 2,
        timeSlot: 'Evening',
        customNotes: 'Pick up fresh Shrewsbury biscuits batch',
      }
    ]);
    showToast('Loaded recommended 2-day Pune trip!');
  };

  // Map Navigation
  const handleViewOnMap = (place: Place) => {
    setMapCenterPlace(place);
    setActiveTab('map');
  };

  // Safety Incident Handlers
  const handleAddIncident = (newIncident: SafetyIncident) => {
    setIncidents([newIncident, ...incidents]);
  };

  const handleUpvoteIncident = (incidentId: string) => {
    setIncidents(incidents.map((inc) => {
      if (inc.id === incidentId) {
        const nextUpvoted = !inc.hasUpvoted;
        return {
          ...inc,
          hasUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? inc.upvotes + 1 : Math.max(0, inc.upvotes - 1),
        };
      }
      return inc;
    }));
  };

  const comparedPlaces = places.filter(p => comparedPlaceIds.includes(p.id));
  const plannerPlaceIds = itinerary.map(i => i.placeId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedPlaceIds.length}
        plannerCount={itinerary.length}
        safetyAlertsCount={incidents.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'explore' && (
          <CityExplorer
            places={places}
            onSelectPlace={(p) => setActiveModalPlace(p)}
            onToggleCompare={handleToggleCompare}
            comparedPlaceIds={comparedPlaceIds}
            onAddToPlanner={handleAddToPlanner}
            plannerPlaceIds={plannerPlaceIds}
            onViewOnMap={handleViewOnMap}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            places={places}
            incidents={incidents}
            onSelectPlace={(p) => setActiveModalPlace(p)}
            onAddToPlanner={handleAddToPlanner}
            plannerPlaceIds={plannerPlaceIds}
            initialCenterPlace={mapCenterPlace}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyDashboard
            incidents={incidents}
            onAddIncident={handleAddIncident}
            onUpvoteIncident={handleUpvoteIncident}
          />
        )}

        {activeTab === 'compare' && (
          <PlaceComparison
            comparedPlaces={comparedPlaces}
            allPlaces={places}
            onRemoveFromCompare={handleRemoveFromCompare}
            onClearComparison={handleClearComparison}
            onAddPresetComparison={handleAddPresetComparison}
            onSelectPlace={(p) => setActiveModalPlace(p)}
            onAddToPlanner={handleAddToPlanner}
            plannerPlaceIds={plannerPlaceIds}
          />
        )}

        {activeTab === 'smart-city' && (
          <SmartCityDashboard />
        )}

        {activeTab === 'assistant' && (
          <AiAssistant />
        )}

        {activeTab === 'planner' && (
          <TripPlanner
            itinerary={itinerary}
            allPlaces={places}
            onRemoveItem={handleRemoveItineraryItem}
            onAddItem={handleAddPlannerItem}
            onUpdateItemNotes={handleUpdateItemNotes}
            onLoadPresetItinerary={handleLoadPresetItinerary}
            onSelectPlace={(p) => setActiveModalPlace(p)}
          />
        )}
      </main>

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={activeModalPlace}
        onClose={() => setActiveModalPlace(null)}
        onAddToPlanner={handleAddToPlanner}
        onToggleCompare={handleToggleCompare}
        isCompared={activeModalPlace ? comparedPlaceIds.includes(activeModalPlace.id) : false}
        isInPlanner={activeModalPlace ? plannerPlaceIds.includes(activeModalPlace.id) : false}
        onViewOnMap={handleViewOnMap}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-xs">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4 text-teal-200" />
                </div>
                <span className="font-extrabold text-slate-900 text-sm">
                  CityWise AI — Explore Smart. Travel Safe.
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-md">
                A modern urban exploration and civic safety intelligence platform created for the College Hackathon. Built to empower students, tourists, and residents to discover Pune's rich heritage with verified safety benchmarks and AI guidance.
              </p>
              <div className="flex items-center gap-2 text-teal-700 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Pune Smart City Prototype • Realistic Datasets Clearly Marked</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Platform Capabilities
              </h4>
              <ul className="space-y-1 text-slate-600">
                <li className="cursor-pointer hover:text-teal-700" onClick={() => setActiveTab('explore')}>• Categorized Pune Explorer</li>
                <li className="cursor-pointer hover:text-teal-700" onClick={() => setActiveTab('map')}>• OpenStreetMap Leaflet Map</li>
                <li className="cursor-pointer hover:text-teal-700" onClick={() => setActiveTab('safety')}>• Crowdsourced Safety Dashboard</li>
                <li className="cursor-pointer hover:text-teal-700" onClick={() => setActiveTab('compare')}>• Multi-factor Place Comparison</li>
                <li className="cursor-pointer hover:text-teal-700" onClick={() => setActiveTab('smart-city')}>• Weather & Traffic Pulse</li>
                <li className="cursor-pointer hover:text-teal-700" onClick={() => setActiveTab('assistant')}>• Gemini 3.8 Flash City Assistant</li>
                <li className="cursor-pointer hover:text-teal-700" onClick={() => setActiveTab('planner')}>• Multi-Day Budget Trip Planner</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Hackathon Verification
              </h4>
              <p className="text-slate-500 leading-relaxed">
                Server-side Gemini AI proxy route on <code>/api/assistant</code> prevents client API key exposure. Fallback heuristic engine ensures 100% demo uptime.
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                Dev port: <strong>3000</strong> • Built with Vite, React 19, TypeScript, Tailwind CSS, Leaflet.
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              © 2026 CityWise AI • College Hackathon Edition.
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Made with dedication for smart urban exploration</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
