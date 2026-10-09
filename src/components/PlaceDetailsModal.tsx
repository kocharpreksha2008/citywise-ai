import React from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Accessibility, 
  Clock, 
  IndianRupee, 
  Plus, 
  Check, 
  ArrowLeftRight, 
  Navigation,
  Train,
  CheckCircle2
} from 'lucide-react';
import { Place } from '../types';
import { PlaceImage } from './PlaceImage';

interface PlaceDetailsModalProps {
  place: Place | null;
  onClose: () => void;
  onAddToPlanner: (place: Place) => void;
  onToggleCompare: (place: Place) => void;
  isCompared: boolean;
  isInPlanner: boolean;
  onViewOnMap: (place: Place) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  onClose,
  onAddToPlanner,
  onToggleCompare,
  isCompared,
  isInPlanner,
  onViewOnMap,
}) => {
  if (!place) return null;

  const categoryColors: Record<string, { bg: string }> = {
    historical: { bg: 'bg-amber-100 text-amber-800 border-amber-300' },
    food: { bg: 'bg-orange-100 text-orange-800 border-orange-300' },
    park: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    attraction: { bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    hotel: { bg: 'bg-rose-100 text-rose-800 border-rose-300' },
  };

  const catStyle = categoryColors[place.category] || { bg: 'bg-slate-100 text-slate-800 border-slate-300' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col">
        {/* Sticky Header Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-sm transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0 overflow-hidden rounded-t-3xl bg-slate-100">
          <PlaceImage
            place={place}
            className="w-full h-full"
            showAttribution={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Badges on hero */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm ${catStyle.bg}`}>
              {place.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white border border-slate-700 backdrop-blur-sm">
              Price: {place.priceLevel} ({place.estimatedCost === 0 ? 'Free' : `₹${place.estimatedCost}`})
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded bg-teal-500/30 text-teal-200 border border-teal-400/40 font-medium">
                {place.neighborhood}
              </span>
              {place.marathiName && (
                <span className="text-xs text-slate-300 font-serif">
                  ({place.marathiName})
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {place.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="p-2">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-base text-slate-900">{place.rating}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{place.reviewCount} Reviews</p>
            </div>

            <div className="p-2 border-l border-slate-200">
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span className="font-extrabold text-base text-teal-900">{place.safetyScore}/10</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Safety Score</p>
            </div>

            <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-base text-slate-900">{place.cleanlinessScore}/10</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Cleanliness</p>
            </div>

            <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
              <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                <Accessibility className="w-4 h-4 text-indigo-600" />
                <span className="font-extrabold text-base text-slate-900">{place.accessibilityScore}/10</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Accessibility</p>
            </div>
          </div>

          {/* Detailed Descriptions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Overview</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {place.longDescription || place.description}
            </p>
          </div>

          {/* Highlights */}
          {place.highlights && place.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Highlights</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {place.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-teal-900 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Advisory Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                CityWise Safety Analysis & Advisory
              </h4>
            </div>
            <p className="text-xs text-teal-950 leading-relaxed">
              {place.safetyNotes}
            </p>
          </div>

          {/* Logistics & Practical Info */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Timings</span>
                <span className="text-slate-600">{place.openingHours}</span>
                <span className="block mt-1 text-[11px] text-teal-700 font-semibold">
                  Best time: {place.bestTimeToVisit}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Address</span>
                <span className="text-slate-600">{place.address}</span>
                {place.metroNearby && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-700 font-medium">
                    <Train className="w-3 h-3" />
                    <span>{place.metroNearby}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-600 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onViewOnMap(place);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-slate-600" />
              Locate on Map
            </button>
            <button
              onClick={() => onToggleCompare(place)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                isCompared
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              {isCompared ? 'In Comparison' : 'Compare'}
            </button>
          </div>

          <button
            onClick={() => onAddToPlanner(place)}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              isInPlanner
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/10'
            }`}
          >
            {isInPlanner ? (
              <>
                <Check className="w-4 h-4" />
                Added to Itinerary
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to Trip Planner
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
