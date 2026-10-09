import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  Navigation2, 
  Layers, 
  Search, 
  Info,
  Star,
  ExternalLink,
  Plus,
  Check,
  Eye,
  Filter
} from 'lucide-react';
import { Place, SafetyIncident } from '../types';
import { PUNE_COORDINATES } from '../data/mockData';

interface InteractiveMapProps {
  places: Place[];
  incidents: SafetyIncident[];
  onSelectPlace: (place: Place) => void;
  onAddToPlanner: (place: Place) => void;
  plannerPlaceIds: string[];
  initialCenterPlace?: Place | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  incidents,
  onSelectPlace,
  onAddToPlanner,
  plannerPlaceIds,
  initialCenterPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const placesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const incidentsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showPlaces, setShowPlaces] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeItem, setActiveItem] = useState<Place | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const center = initialCenterPlace ? initialCenterPlace.coordinates : PUNE_COORDINATES;
      const zoom = initialCenterPlace ? 15 : 13;

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      placesLayerGroupRef.current = L.layerGroup().addTo(map);
      incidentsLayerGroupRef.current = L.layerGroup().addTo(map);
      corridorsLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Center on initial place if provided and updated
  useEffect(() => {
    if (mapInstanceRef.current && initialCenterPlace) {
      mapInstanceRef.current.setView(initialCenterPlace.coordinates, 15, { animate: true });
      setActiveItem(initialCenterPlace);
    }
  }, [initialCenterPlace]);

  // Update Place Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const placesLayer = placesLayerGroupRef.current;
    if (!map || !placesLayer) return;

    placesLayer.clearLayers();

    if (!showPlaces) return;

    const filtered = places.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.neighborhood.toLowerCase().includes(q);
      }
      return true;
    });

    const categoryPinColors: Record<string, { bg: string; border: string; iconLetter: string }> = {
      historical: { bg: '#0f172a', border: '#38bdf8', iconLetter: '🏛️' },
      food: { bg: '#d97706', border: '#fef08a', iconLetter: '🍽️' },
      park: { bg: '#059669', border: '#a7f3d0', iconLetter: '🌳' },
      attraction: { bg: '#4f46e5', border: '#c7d2fe', iconLetter: '✨' },
      hotel: { bg: '#e11d48', border: '#fecdd3', iconLetter: '🏨' },
    };

    filtered.forEach((place) => {
      const pinConfig = categoryPinColors[place.category] || { bg: '#0f172a', border: '#ffffff', iconLetter: '📍' };

      const customIcon = L.divIcon({
        className: 'custom-citywise-marker',
        html: `
          <div style="
            background: ${pinConfig.bg};
            border: 2px solid ${pinConfig.border};
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 14px;
            ">${pinConfig.iconLetter}</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
      });

      const marker = L.marker(place.coordinates, { icon: customIcon });

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; max-width: 260px; padding: 2px;">
          <img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #334155;">
              ${place.category}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #047857; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">
              🛡️ ${place.safetyScore}/10 Safe
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">${place.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">📍 ${place.neighborhood}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 600; color: #334155; margin-bottom: 8px; border-top: 1px solid #f1f5f9; padding-top: 6px;">
            <span>★ ${place.rating} (${place.reviewCount})</span>
            <span>${place.estimatedCost === 0 ? 'Free' : `₹${place.estimatedCost}`}</span>
          </div>
          <button id="marker-btn-${place.id}" style="
            width: 100%;
            background: #0f172a;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            padding: 6px 10px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
          ">
            Open Full Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setActiveItem(place);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`marker-btn-${place.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectPlace(place);
          };
        }
      });

      placesLayer.addLayer(marker);
    });
  }, [places, showPlaces, selectedCategory, searchFilter, onSelectPlace]);

  // Update Incident Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const incidentsLayer = incidentsLayerGroupRef.current;
    if (!map || !incidentsLayer) return;

    incidentsLayer.clearLayers();

    if (!showIncidents) return;

    incidents.forEach((inc) => {
      const isHigh = inc.severity === 'High' || inc.severity === 'Critical';
      const color = isHigh ? '#dc2626' : '#d97706';

      const incidentIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: `
          <div style="
            background: ${color};
            border: 2px solid #ffffff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
            cursor: pointer;
          ">
            <span style="font-size: 13px;">⚠️</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker(inc.coordinates, { icon: incidentIcon });

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px; max-width: 240px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: ${isHigh ? '#fee2e2' : '#fef3c7'}; color: ${isHigh ? '#991b1b' : '#92400e'}; padding: 2px 6px; border-radius: 4px;">
              ${inc.severity} Severity
            </span>
            <span style="font-size: 10px; color: #64748b;">${inc.timestamp}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">${inc.title}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">${inc.description}</p>
          <div style="font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            Status: <strong>${inc.status}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      incidentsLayer.addLayer(marker);
    });
  }, [incidents, showIncidents]);

  // Safe Zones & Corridors
  useEffect(() => {
    const map = mapInstanceRef.current;
    const corridorsLayer = corridorsLayerGroupRef.current;
    if (!map || !corridorsLayer) return;

    corridorsLayer.clearLayers();

    if (!showSafeZones) return;

    // FC Road & Deccan Student Safe Corridor
    const fcRoadCorridor = L.polyline(
      [
        [18.5160, 73.8415],
        [18.5226, 73.8413],
        [18.5300, 73.8410],
      ],
      {
        color: '#0d9488',
        weight: 6,
        opacity: 0.65,
        dashArray: '8, 8',
      }
    ).bindPopup('<strong>Patrolled Safe Corridor: FC Road</strong><br/>High illumination & police beat marshal presence.');
    corridorsLayer.addLayer(fcRoadCorridor);

    // Koregaon Park Walk Zone
    const kpZone = L.circle([18.5362, 73.8942], {
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: 0.15,
      radius: 650,
    }).bindPopup('<strong>Koregaon Park Green & Pedestrian Zone</strong><br/>Eco-park tranquility & guarded enclave.');
    corridorsLayer.addLayer(kpZone);

    // Mandai / Old City Heritage Perimeter
    const heritageZone = L.circle([18.5196, 73.8553], {
      color: '#6366f1',
      fillColor: '#818cf8',
      fillOpacity: 0.12,
      radius: 500,
    }).bindPopup('<strong>Old Pune Cultural Core (Shaniwar Wada & Mandai)</strong><br/>High foot traffic; watch valuables in crowded lanes.');
    corridorsLayer.addLayer(heritageZone);
  }, [showSafeZones]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(PUNE_COORDINATES, 13, { animate: true });
    }
  };

  const handlePanToPlace = (place: Place) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(place.coordinates, 16, { animate: true });
      setActiveItem(place);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5" />
            Layers:
          </span>

          <button
            onClick={() => setShowPlaces(!showPlaces)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              showPlaces
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Places ({places.length})
          </button>

          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              showIncidents
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Safety Alerts ({incidents.length})
          </button>

          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              showSafeZones
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Safe Zones & Corridors
          </button>
        </div>

        {/* Recenter & Map Info */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleRecenter}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Navigation2 className="w-3.5 h-3.5 text-teal-600" />
            Reset to Pune Center
          </button>
        </div>
      </div>

      {/* Main Map Canvas and Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-3 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md relative h-[560px] sm:h-[620px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-lg text-[11px] max-w-xs space-y-1.5 pointer-events-auto hidden sm:block">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
              <span>Map Key</span>
              <span className="text-[10px] text-teal-600 font-semibold">OpenStreetMap</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" /> Historical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Food & Dining
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Nature / Parks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Attractions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Hotels
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Safety Incident
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar: Interactive Place Pan List */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col h-[560px] sm:h-[620px]">
          <div className="mb-3 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Quick Navigation</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold">
                {places.length} Spots
              </span>
            </h3>

            {/* Quick Filter Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Find landmark on map..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
              {['all', 'historical', 'food', 'park', 'attraction', 'hotel'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2 py-1 rounded-md capitalize font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === c
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Place List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {places
              .filter((p) => {
                if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
                if (searchFilter.trim()) {
                  return p.name.toLowerCase().includes(searchFilter.toLowerCase());
                }
                return true;
              })
              .map((place) => {
                const isSelected = activeItem?.id === place.id;
                const isInPlanner = plannerPlaceIds.includes(place.id);

                return (
                  <div
                    key={place.id}
                    className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                    onClick={() => handlePanToPlace(place)}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                            {place.category}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">
                            {place.safetyScore}/10
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 truncate">{place.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{place.neighborhood}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-teal-100 flex items-center justify-between gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlace(place);
                          }}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Details
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToPlanner(place);
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                            isInPlanner
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-teal-100 hover:bg-teal-200 text-teal-900'
                          }`}
                        >
                          {isInPlanner ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          {isInPlanner ? 'Planned' : 'Add to Plan'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
