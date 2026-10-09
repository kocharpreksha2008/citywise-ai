import React, { useState } from 'react';
import { CameraOff, MapPin, Landmark, UtensilsCrossed, TreePine, Sparkles, Building2 } from 'lucide-react';
import { Place, PlaceCategory } from '../types';

interface PlaceImageProps {
  place: Place;
  className?: string;
  imgClassName?: string;
  showAttribution?: boolean;
}

export const PlaceImage: React.FC<PlaceImageProps> = ({
  place,
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover',
  showAttribution = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const getCategoryIcon = (category: PlaceCategory) => {
    switch (category) {
      case 'historical':
        return <Landmark className="w-5 h-5 text-slate-500" />;
      case 'food':
        return <UtensilsCrossed className="w-5 h-5 text-slate-500" />;
      case 'park':
        return <TreePine className="w-5 h-5 text-slate-500" />;
      case 'hotel':
        return <Building2 className="w-5 h-5 text-slate-500" />;
      case 'attraction':
      default:
        return <Sparkles className="w-5 h-5 text-slate-500" />;
    }
  };

  const isUnavailable = place.photoUnavailable || !place.imageUrl || hasError;

  if (isUnavailable) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-500 border border-slate-200/60 select-none overflow-hidden ${className}`}
        role="img"
        aria-label={`Photo unavailable for ${place.name}`}
      >
        <div className="w-10 h-10 rounded-2xl bg-white/80 border border-slate-200 shadow-2xs flex items-center justify-center mb-2">
          {getCategoryIcon(place.category)}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <CameraOff className="w-3.5 h-3.5 text-slate-400" />
          <span>Photo unavailable</span>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-0.5 line-clamp-1 max-w-[85%]">
          Verified real-world photo pending
        </p>
        <span className="mt-2 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-600">
          {place.neighborhood}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={place.imageUrl}
        alt={place.imageAlt || `Genuine photograph of ${place.name} in ${place.neighborhood}, Pune`}
        className={imgClassName}
        loading="lazy"
        onError={() => setHasError(true)}
      />

      {showAttribution && place.imageSourceAttribution && (
        <div className="absolute bottom-1 right-2 z-10 text-[9px] font-medium bg-black/60 text-slate-200 px-1.5 py-0.5 rounded backdrop-blur-xs">
          📷 {place.imageSourceAttribution}
        </div>
      )}
    </div>
  );
};
