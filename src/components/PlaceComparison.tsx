import React from 'react';
import { 
  ArrowLeftRight, 
  Trash2, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Accessibility, 
  IndianRupee, 
  Clock, 
  Plus, 
  Check, 
  MapPin, 
  Train, 
  Award,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { Place } from '../types';
import { PlaceImage } from './PlaceImage';

interface PlaceComparisonProps {
  comparedPlaces: Place[];
  allPlaces: Place[];
  onRemoveFromCompare: (placeId: string) => void;
  onClearComparison: () => void;
  onAddPresetComparison: (placeIds: string[]) => void;
  onSelectPlace: (place: Place) => void;
  onAddToPlanner: (place: Place) => void;
  plannerPlaceIds: string[];
}

export const PlaceComparison: React.FC<PlaceComparisonProps> = ({
  comparedPlaces,
  allPlaces,
  onRemoveFromCompare,
  onClearComparison,
  onAddPresetComparison,
  onSelectPlace,
  onAddToPlanner,
  plannerPlaceIds,
}) => {
  const presetComparisons = [
    {
      title: 'Heritage Showdown: Fort vs Palace',
      ids: ['pune-shaniwar-wada', 'pune-aga-khan-palace'],
      desc: 'Shaniwar Wada vs Aga Khan Palace',
    },
    {
      title: 'Iconic Pune Breakfast Duel',
      ids: ['pune-vaishali-restaurant', 'pune-cafe-goodluck'],
      desc: 'Vaishali (FC Road) vs Cafe Goodluck (Deccan)',
    },
    {
      title: 'Green Spaces & Nature Walks',
      ids: ['pune-saras-baug', 'pune-osho-teerth-park'],
      desc: 'Saras Baug vs Osho Teerth Park',
    },
    {
      title: 'Stay Options: Luxury vs Heritage',
      ids: ['pune-jw-marriott', 'pune-hotel-shreyas'],
      desc: 'JW Marriott (5-Star) vs Hotel Shreyas (Traditional)',
    },
  ];

  // Calculate dimension winners if 2+ places
  const bestSafety = comparedPlaces.length >= 2 ? Math.max(...comparedPlaces.map(p => p.safetyScore)) : -1;
  const bestRating = comparedPlaces.length >= 2 ? Math.max(...comparedPlaces.map(p => p.rating)) : -1;
  const bestCleanliness = comparedPlaces.length >= 2 ? Math.max(...comparedPlaces.map(p => p.cleanlinessScore)) : -1;
  const bestAccessibility = comparedPlaces.length >= 2 ? Math.max(...comparedPlaces.map(p => p.accessibilityScore)) : -1;
  const lowestCost = comparedPlaces.length >= 2 ? Math.min(...comparedPlaces.map(p => p.estimatedCost)) : -1;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              CityWise Place Comparison Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Compare up to 4 spots side-by-side on affordability, hygiene, accessibility, and verified safety notes.
          </p>
        </div>

        {comparedPlaces.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              {comparedPlaces.length} / 4 spots selected
            </span>
            <button
              onClick={onClearComparison}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Preset 1-Click Comparisons */}
      {comparedPlaces.length < 2 && (
        <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-slate-50 rounded-3xl p-6 border border-teal-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-teal-950">
              Try a Quick Curated Comparison:
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presetComparisons.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onAddPresetComparison(preset.ids)}
                className="p-3.5 rounded-2xl bg-white border border-teal-200 hover:border-teal-500 text-left transition-all hover:shadow-md group"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block mb-1">
                  Preset #{idx + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{preset.desc}</p>
                <div className="mt-2 text-[10px] font-bold text-teal-600 flex items-center gap-1">
                  <span>Compare Pair</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Grid Table */}
      {comparedPlaces.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No places currently in comparison tray</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click the "Compare" button on any place in the <strong>City Explorer</strong> or pick one of the curated presets above to start comparing.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">
                  Attributes
                </th>
                {comparedPlaces.map((place) => (
                  <th key={place.id} className="p-4 w-64 align-top">
                    <div className="space-y-2">
                      <div className="relative h-28 rounded-xl overflow-hidden bg-slate-100">
                        <PlaceImage
                          place={place}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => onRemoveFromCompare(place.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors z-10"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {place.category}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-1">
                          {place.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{place.neighborhood}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Estimated Cost Row */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    <span>Est. Cost & Tier</span>
                  </div>
                </td>
                {comparedPlaces.map((place) => {
                  const isLowest = place.estimatedCost === lowestCost;
                  return (
                    <td key={place.id} className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                        <span>{place.estimatedCost === 0 ? 'Free Entry' : `₹${place.estimatedCost}`}</span>
                        {isLowest && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-0.5">
                            <Award className="w-3 h-3" /> Best Value
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tier: {place.priceLevel}</p>
                    </td>
                  );
                })}
              </tr>

              {/* Safety Score Row */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Safety Index</span>
                  </div>
                </td>
                {comparedPlaces.map((place) => {
                  const isTopSafety = place.safetyScore === bestSafety;
                  return (
                    <td key={place.id} className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-teal-800">
                        <span>{place.safetyScore} / 10</span>
                        {isTopSafety && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-teal-100 text-teal-900 border border-teal-300 font-bold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Top Safe
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {place.safetyNotes}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Traveler Rating Row */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Traveler Rating</span>
                  </div>
                </td>
                {comparedPlaces.map((place) => {
                  const isTopRating = place.rating === bestRating;
                  return (
                    <td key={place.id} className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{place.rating} / 5.0</span>
                        {isTopRating && (
                          <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                            Top Rated
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">({place.reviewCount} reviews)</p>
                    </td>
                  );
                })}
              </tr>

              {/* Cleanliness Index Row */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Cleanliness & Hygiene</span>
                  </div>
                </td>
                {comparedPlaces.map((place) => {
                  const isTopClean = place.cleanlinessScore === bestCleanliness;
                  return (
                    <td key={place.id} className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <span>{place.cleanlinessScore} / 10</span>
                        {isTopClean && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Pristine
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${place.cleanlinessScore * 10}%` }}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Accessibility Row */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <div className="flex items-center gap-1.5">
                    <Accessibility className="w-4 h-4 text-indigo-600" />
                    <span>Accessibility</span>
                  </div>
                </td>
                {comparedPlaces.map((place) => (
                  <td key={place.id} className="p-4">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <span>{place.accessibilityScore} / 10</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        place.wheelchairAccessible
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {place.wheelchairAccessible ? 'Wheelchair Ready' : 'Limited Access'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Crowd & Density Row */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <span>Crowd Density</span>
                </td>
                {comparedPlaces.map((place) => (
                  <td key={place.id} className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                      place.crowdLevel === 'Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : place.crowdLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {place.crowdLevel} Density
                    </span>
                  </td>
                ))}
              </tr>

              {/* Metro & Transit Proximity */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <div className="flex items-center gap-1.5">
                    <Train className="w-4 h-4 text-slate-500" />
                    <span>Nearby Metro / Transit</span>
                  </div>
                </td>
                {comparedPlaces.map((place) => (
                  <td key={place.id} className="p-4 text-slate-700">
                    {place.metroNearby ? (
                      <span className="font-medium text-indigo-800">{place.metroNearby}</span>
                    ) : (
                      <span className="text-slate-400">PMPML Bus / Auto-rickshaw recommended</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Highlights & Best For */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <span>Best For</span>
                </td>
                {comparedPlaces.map((place) => (
                  <td key={place.id} className="p-4">
                    <p className="font-semibold text-slate-800 text-[11px] mb-1">
                      {place.bestTimeToVisit}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {place.highlights.slice(0, 2).map((h, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Action Buttons Row */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  <span>Actions</span>
                </td>
                {comparedPlaces.map((place) => {
                  const isInPlanner = plannerPlaceIds.includes(place.id);
                  return (
                    <td key={place.id} className="p-4 space-y-1.5">
                      <button
                        onClick={() => onSelectPlace(place)}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                      >
                        Full Details
                      </button>
                      <button
                        onClick={() => onAddToPlanner(place)}
                        className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors border ${
                          isInPlanner
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                        }`}
                      >
                        {isInPlanner ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {isInPlanner ? 'In Planner' : 'Add to Plan'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
