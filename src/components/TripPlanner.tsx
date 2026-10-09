import React, { useState } from 'react';
import { 
  CalendarDays, 
  Trash2, 
  Clock, 
  IndianRupee, 
  Plus, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Train, 
  Car, 
  Bus, 
  FileText, 
  Download,
  AlertCircle
} from 'lucide-react';
import { Place, ItineraryItem } from '../types';

interface TripPlannerProps {
  itinerary: ItineraryItem[];
  allPlaces: Place[];
  onRemoveItem: (itemId: string) => void;
  onAddItem: (placeId: string, day: number, slot: 'Morning' | 'Afternoon' | 'Evening' | 'Night') => void;
  onUpdateItemNotes: (itemId: string, notes: string) => void;
  onLoadPresetItinerary: () => void;
  onSelectPlace: (place: Place) => void;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  itinerary,
  allPlaces,
  onRemoveItem,
  onAddItem,
  onUpdateItemNotes,
  onLoadPresetItinerary,
  onSelectPlace,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [selectedPlaceToAdd, setSelectedPlaceToAdd] = useState<string>('');
  const [selectedSlotToAdd, setSelectedSlotToAdd] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  const [transitMode, setTransitMode] = useState<'metro' | 'bus' | 'auto' | 'cab'>('metro');
  const [includeBuffer, setIncludeBuffer] = useState<boolean>(true);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const placesMap = new Map<string, Place>(allPlaces.map((p) => [p.id, p]));

  const dayItems = itinerary.filter((item) => item.day === activeDay);

  const slots: Array<'Morning' | 'Afternoon' | 'Evening' | 'Night'> = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // Transit daily cost
  const transitCosts: Record<string, number> = {
    bus: 50, // PMPML unlimited daily pass
    metro: 70, // Metro return tickets
    auto: 250, // Metered auto-rickshaw hops
    cab: 650, // App cab comfort
  };

  const dailyTransitCost = transitCosts[transitMode] || 70;

  // Budget Calculations
  const plannedPlaces = itinerary.map((item) => placesMap.get(item.placeId)).filter(Boolean) as Place[];
  
  // Total entry costs
  const entryFeesTotal = plannedPlaces.reduce((sum, p) => {
    // If historical/attraction, add fee; if food/hotel, estimated cost represents dining/stay
    if (p.category === 'historical' || p.category === 'attraction' || p.category === 'park') {
      return sum + p.estimatedCost;
    }
    return sum;
  }, 0);

  // Total dining costs from planned eateries + baseline meal estimate
  const plannedFoodPlaces = plannedPlaces.filter((p) => p.category === 'food');
  const foodCostFromSpots = plannedFoodPlaces.reduce((sum, p) => sum + p.estimatedCost, 0);
  const baselineDailyMealAllowance = 250; // default ₹250/day if no food places picked
  const foodCostTotal = Math.max(foodCostFromSpots, baselineDailyMealAllowance * (Math.max(...itinerary.map(i => i.day), 1)));

  // Total transit
  const totalDays = Math.max(...itinerary.map(i => i.day), 1);
  const totalTransitCost = dailyTransitCost * totalDays;

  // Buffer
  const bufferCost = includeBuffer ? 200 * totalDays : 0;

  const grandTotalCost = entryFeesTotal + foodCostTotal + totalTransitCost + bufferCost;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlaceToAdd) return;
    onAddItem(selectedPlaceToAdd, activeDay, selectedSlotToAdd);
    setSelectedPlaceToAdd('');
  };

  const copySummaryText = () => {
    let summary = `📍 CityWise AI - Pune Itinerary (${totalDays} Days)\n\n`;
    [1, 2, 3].forEach((day) => {
      const items = itinerary.filter((i) => i.day === day);
      if (items.length === 0) return;
      summary += `--- Day ${day} ---\n`;
      items.forEach((item) => {
        const place = placesMap.get(item.placeId);
        if (place) {
          summary += `• [${item.timeSlot}] ${place.name} (${place.neighborhood}) - ₹${place.estimatedCost}\n`;
          if (item.customNotes) summary += `  Notes: ${item.customNotes}\n`;
        }
      });
      summary += `\n`;
    });
    summary += `💰 Estimated Total Budget: ₹${grandTotalCost} (Transit: ${transitMode.toUpperCase()})\n`;
    summary += `Generated with CityWise AI — Explore Smart. Travel Safe.`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Interactive Trip Planner & Smart Budget
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Structure your Pune visit across morning, afternoon, and evening slots with live budget forecasts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {itinerary.length === 0 && (
            <button
              onClick={onLoadPresetItinerary}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Load Curated 2-Day Pune Plan
            </button>
          )}

          {itinerary.length > 0 && (
            <button
              onClick={copySummaryText}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-teal-300" />}
              <span>{copiedSummary ? 'Copied to Clipboard' : 'Copy Itinerary'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Itinerary Timeline / Right Smart Budget Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Timeline Planner */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Tabs */}
          <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex gap-1">
              {[1, 2, 3].map((day) => {
                const count = itinerary.filter((i) => i.day === day).length;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeDay === day
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Day {day}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeDay === day ? 'bg-teal-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] text-slate-400 pr-2 hidden sm:inline">
              Total Stops: {itinerary.length}
            </span>
          </div>

          {/* Add Stop to Current Day Inline Form */}
          <form
            onSubmit={handleAddSubmit}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap sm:flex-nowrap items-center gap-2"
          >
            <select
              value={selectedSlotToAdd}
              onChange={(e: any) => setSelectedSlotToAdd(e.target.value)}
              className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold w-32 flex-shrink-0"
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>

            <select
              value={selectedPlaceToAdd}
              onChange={(e) => setSelectedPlaceToAdd(e.target.value)}
              className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium flex-1 min-w-[200px]"
            >
              <option value="">Select a place to schedule...</option>
              {allPlaces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.neighborhood}) • {p.priceLevel}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={!selectedPlaceToAdd}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors flex-shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stop</span>
            </button>
          </form>

          {/* Time Slots Timeline Feed */}
          {dayItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <CalendarDays className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                No stops scheduled for Day {activeDay} yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a place from the dropdown above or browse the <strong>City Explorer</strong> and click "Add to Trip Planner".
              </p>
              <button
                onClick={onLoadPresetItinerary}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition-colors"
              >
                Load Recommended Pune Itinerary
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => {
                const slotItems = dayItems.filter((i) => i.timeSlot === slot);
                if (slotItems.length === 0) return null;

                const slotColors: Record<string, { bg: string }> = {
                  Morning: { bg: 'bg-amber-500/10 text-amber-800 border-amber-300' },
                  Afternoon: { bg: 'bg-sky-500/10 text-sky-800 border-sky-300' },
                  Evening: { bg: 'bg-indigo-500/10 text-indigo-800 border-indigo-300' },
                  Night: { bg: 'bg-purple-500/10 text-purple-800 border-purple-300' },
                };

                const badge = slotColors[slot];

                return (
                  <div key={slot} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider border ${badge.bg}`}>
                        {slot} Slot
                      </span>
                      <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <div className="space-y-2.5">
                      {slotItems.map((item) => {
                        const place = placesMap.get(item.placeId);
                        if (!place) return null;

                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={place.imageUrl}
                                alt={place.name}
                                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                                onClick={() => onSelectPlace(place)}
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded">
                                    {place.category}
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-0.5">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {place.neighborhood}
                                  </span>
                                </div>
                                <h4
                                  className="text-sm font-extrabold text-slate-900 truncate hover:text-teal-700 cursor-pointer"
                                  onClick={() => onSelectPlace(place)}
                                >
                                  {place.name}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                                  <span className="font-bold text-slate-900">
                                    {place.estimatedCost === 0 ? 'Free' : `₹${place.estimatedCost}`}
                                  </span>
                                  <span className="text-[11px] text-teal-700 font-semibold">
                                    🛡️ {place.safetyScore}/10 Safe
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Item Actions and Notes */}
                            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="text"
                                placeholder="Add note (e.g., Book tickets)..."
                                value={item.customNotes || ''}
                                onChange={(e) => onUpdateItemNotes(item.id, e.target.value)}
                                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:ring-1 focus:ring-teal-500 w-full sm:w-44"
                              />

                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-auto"
                                title="Remove stop"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Smart Budget Estimator */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 sticky top-20">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <IndianRupee className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Live Budget Estimator
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Transparent cost projection for your {totalDays}-day Pune exploration.
              </p>
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 text-white space-y-1">
              <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider block">
                Total Estimated Outlay
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight">₹{grandTotalCost}</span>
                <span className="text-xs text-slate-300 font-medium">INR</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Avg. ₹{Math.round(grandTotalCost / totalDays)} per day for {totalDays} day{totalDays > 1 ? 's' : ''}
              </p>
            </div>

            {/* Transit Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Preferred Mode of Transit
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTransitMode('metro')}
                  className={`p-2 rounded-xl border text-left font-semibold transition-all ${
                    transitMode === 'metro'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Train className="w-3.5 h-3.5 mb-1 text-indigo-600" />
                  <span className="block text-[11px] font-bold">Pune Metro</span>
                  <span className="text-[10px] text-slate-500">₹70 / day</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransitMode('bus')}
                  className={`p-2 rounded-xl border text-left font-semibold transition-all ${
                    transitMode === 'bus'
                      ? 'bg-teal-50 border-teal-400 text-teal-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5 mb-1 text-teal-600" />
                  <span className="block text-[11px] font-bold">PMPML Bus Pass</span>
                  <span className="text-[10px] text-slate-500">₹50 / day</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransitMode('auto')}
                  className={`p-2 rounded-xl border text-left font-semibold transition-all ${
                    transitMode === 'auto'
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 mb-1 text-amber-600" />
                  <span className="block text-[11px] font-bold">Auto-Rickshaw</span>
                  <span className="text-[10px] text-slate-500">₹250 / day</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransitMode('cab')}
                  className={`p-2 rounded-xl border text-left font-semibold transition-all ${
                    transitMode === 'cab'
                      ? 'bg-purple-50 border-purple-400 text-purple-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 mb-1 text-purple-600" />
                  <span className="block text-[11px] font-bold">App Cab (Uber/Ola)</span>
                  <span className="text-[10px] text-slate-500">₹650 / day</span>
                </button>
              </div>
            </div>

            {/* Cost Breakdown Items */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Entry & Monument Tickets:</span>
                <span className="font-bold text-slate-900">₹{entryFeesTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Food & Snacks Budget:</span>
                <span className="font-bold text-slate-900">₹{foodCostTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transit ({transitMode.toUpperCase()}):</span>
                <span className="font-bold text-slate-900">₹{totalTransitCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Emergency / Tea & Water Buffer:</span>
                <span className="font-bold text-slate-900">₹{bufferCost}</span>
              </div>
            </div>

            {/* Buffer toggle */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={includeBuffer}
                onChange={(e) => setIncludeBuffer(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="font-medium text-slate-700">
                Include ₹200/day incidental cushion
              </span>
            </label>

            {/* Safety & Transit Tips */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-900 text-xs space-y-1">
              <div className="flex items-center gap-1 font-bold text-teal-950">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Smart Travel Tip</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Metro stations (Mandai, Deccan Gymkhana, Ruby Hall) have security checks and CCTV. Save tickets digitally on the Maha Metro app for quick gate entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
