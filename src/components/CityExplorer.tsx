import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Accessibility, 
  MapPin, 
  ArrowLeftRight, 
  Plus, 
  Check, 
  Navigation,
  RotateCcw,
  Compass,
  UtensilsCrossed,
  Landmark,
  TreePine,
  Building2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Place, PlaceCategory } from '../types';
import { PlaceImage } from './PlaceImage';

interface CityExplorerProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onToggleCompare: (place: Place) => void;
  comparedPlaceIds: string[];
  onAddToPlanner: (place: Place) => void;
  plannerPlaceIds: string[];
  onViewOnMap: (place: Place) => void;
}

export const CityExplorer: React.FC<CityExplorerProps> = ({
  places,
  onSelectPlace,
  onToggleCompare,
  comparedPlaceIds,
  onAddToPlanner,
  plannerPlaceIds,
  onViewOnMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'budget' | 'mid' | 'luxury'>('all');
  const [minSafetyScore, setMinSafetyScore] = useState<number>(0);
  const [wheelchairOnly, setWheelchairOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'safety' | 'priceAsc'>('popular');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(false);

  const categories: Array<{ id: PlaceCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: 'All Places', icon: Layers },
    { id: 'attraction', label: 'Attractions', icon: Compass },
    { id: 'historical', label: 'Heritage & Forts', icon: Landmark },
    { id: 'food', label: 'Food & Cafes', icon: UtensilsCrossed },
    { id: 'park', label: 'Parks & Nature', icon: TreePine },
    { id: 'hotel', label: 'Hotels & Stay', icon: Building2 },
  ];

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q) || (p.marathiName && p.marathiName.toLowerCase().includes(q));
        const matchesNeighborhood = p.neighborhood.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesNeighborhood && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // Price filter
      if (priceFilter === 'free' && p.estimatedCost !== 0) return false;
      if (priceFilter === 'budget' && (p.estimatedCost > 200 || p.estimatedCost === 0)) return false;
      if (priceFilter === 'mid' && (p.estimatedCost <= 200 || p.estimatedCost > 3000)) return false;
      if (priceFilter === 'luxury' && p.estimatedCost <= 3000) return false;

      // Safety filter
      if (minSafetyScore > 0 && p.safetyScore < minSafetyScore) return false;

      // Accessibility filter
      if (wheelchairOnly && !p.wheelchairAccessible) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'safety') return b.safetyScore - a.safetyScore;
      if (sortBy === 'priceAsc') return a.estimatedCost - b.estimatedCost;
      // Default: popular
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.rating - a.rating;
    });
  }, [places, selectedCategory, searchQuery, priceFilter, minSafetyScore, wheelchairOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceFilter('all');
    setMinSafetyScore(0);
    setWheelchairOnly(false);
    setSortBy('popular');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategory !== 'all' || 
    priceFilter !== 'all' || 
    minSafetyScore > 0 || 
    wheelchairOnly;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Search Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Pune Smart City Explorer • 16+ Verified Heritage & Cultural Hotspots
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Discover Pune with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-400">
              Verified Safety & Smart Context
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Explore authentic historical fortifications, world-famous Irani cafes, peaceful lush parks, and top-tier stays with side-by-side safety ratings, crowd density, and transit proximity.
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search landmarks, cafes, misal, forts, or neighborhoods (e.g. 'Shaniwar', 'FC Road', 'Kayani')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg mr-1 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  showFiltersDrawer || hasActiveFilters
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-teal-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
              {cat.id === 'all' && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {places.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Expandable Filter & Sorting Drawer */}
      {showFiltersDrawer && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Fine-tune Exploration Criteria</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Price Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Budget Tier</label>
              <select
                value={priceFilter}
                onChange={(e: any) => setPriceFilter(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="all">All Budgets</option>
                <option value="free">Free Admission Only</option>
                <option value="budget">Budget Friendly (Under ₹200)</option>
                <option value="mid">Mid-Range (₹200 - ₹3,000)</option>
                <option value="luxury">Luxury / 5-Star (₹3,000+)</option>
              </select>
            </div>

            {/* Safety Score Minimum */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Minimum Safety Score</label>
              <select
                value={minSafetyScore}
                onChange={(e) => setMinSafetyScore(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value={0}>Any Safety Rating</option>
                <option value={8.5}>8.5+ High Safety Index</option>
                <option value={9.0}>9.0+ Superior Ward Safety</option>
                <option value={9.5}>9.5+ Maximum Security</option>
              </select>
            </div>

            {/* Sort by */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Sort Results By</label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="popular">Most Popular & Recommended</option>
                <option value="rating">Highest Traveler Rating</option>
                <option value="safety">Highest Safety Score</option>
                <option value="priceAsc">Price (Lowest to Highest)</option>
              </select>
            </div>

            {/* Accessibility Checkbox */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={wheelchairOnly}
                  onChange={(e) => setWheelchairOnly(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Accessibility className="w-3.5 h-3.5 text-indigo-600" />
                  Wheelchair Accessible
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredPlaces.length}</span> places
          {hasActiveFilters && <span> matching your custom filters</span>}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No places found matching your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Places", or removing strict safety or price filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            const isCompared = comparedPlaceIds.includes(place.id);
            const isInPlanner = plannerPlaceIds.includes(place.id);

            return (
              <div
                key={place.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/40 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Place Card Image Container */}
                <div 
                  className="relative h-48 w-full overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => onSelectPlace(place)}
                >
                  <PlaceImage
                    place={place}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    showAttribution={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs border border-white/20">
                      {place.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
                      {place.estimatedCost === 0 ? 'Free Entry' : `₹${place.estimatedCost}`}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-semibold text-teal-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {place.neighborhood}
                    </p>
                    <h3 className="text-lg font-extrabold leading-snug line-clamp-1">
                      {place.name}
                    </h3>
                  </div>
                </div>

                {/* Place Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  {/* Scores Row */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-extrabold text-slate-900">{place.rating}</span>
                      <span className="text-[10px] text-slate-400">({place.reviewCount})</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>{place.safetyScore}/10 Safe</span>
                    </div>
                  </div>

                  {/* Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {place.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {place.wheelchairAccessible && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 flex items-center gap-0.5" title="Wheelchair Accessible">
                        <Accessibility className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => onSelectPlace(place)}
                      className="col-span-2 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onToggleCompare(place)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center transition-colors ${
                        isCompared
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                      title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onAddToPlanner(place)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center transition-colors ${
                        isInPlanner
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                      }`}
                      title={isInPlanner ? 'In your trip plan' : 'Add to trip planner'}
                    >
                      {isInPlanner ? <Check className="w-4 h-4 text-emerald-700" /> : <Plus className="w-4 h-4 text-teal-700" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
