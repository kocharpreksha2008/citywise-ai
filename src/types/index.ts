export type PlaceCategory = 'attraction' | 'food' | 'hotel' | 'park' | 'historical';

export interface Place {
  id: string;
  name: string;
  marathiName?: string;
  category: PlaceCategory;
  description: string;
  longDescription: string;
  address: string;
  neighborhood: string;
  coordinates: [number, number]; // [latitude, longitude]
  priceLevel: 'Free' | '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  estimatedCost: number; // in INR
  rating: number; // 0 - 5.0
  reviewCount: number;
  cleanlinessScore: number; // 0 - 10
  accessibilityScore: number; // 0 - 10
  safetyScore: number; // 0 - 10
  safetyNotes: string;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  openingHours: string;
  tags: string[];
  imageUrl: string;
  imageAlt?: string;
  imageSourceAttribution?: string;
  photoUnavailable?: boolean;
  highlights: string[];
  bestTimeToVisit: string;
  metroNearby?: string;
  wheelchairAccessible: boolean;
  isPopular?: boolean;
}

export type IncidentCategory = 
  | 'Harassment/Safety' 
  | 'Road/Traffic' 
  | 'Lighting/Infrastructure' 
  | 'Theft/Pickpocketing' 
  | 'Civic/Sanitation' 
  | 'General Concern';

export type IncidentSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';

export type IncidentStatus = 
  | 'Verified by Ward Team' 
  | 'Community Reported' 
  | 'Under Investigation' 
  | 'Resolved';

export interface SafetyIncident {
  id: string;
  title: string;
  category: IncidentCategory;
  locationName: string;
  neighborhood: string;
  coordinates: [number, number];
  description: string;
  timestamp: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  upvotes: number;
  hasUpvoted?: boolean;
  reportedBy: string;
}

export interface WeatherData {
  city: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKmH: number;
  aqi: number;
  aqiLabel: 'Good' | 'Moderate' | 'Poor' | 'Hazardous';
  uvIndex: number;
  forecast: Array<{
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
  }>;
  lastUpdated: string;
}

export interface TrafficCorridor {
  id: string;
  name: string;
  stretch: string;
  congestion: 'Normal' | 'Moderate' | 'Heavy';
  avgSpeedKmH: number;
  delayMinutes: number;
  statusText: string;
  lastUpdated: string;
}

export interface CivicAlert {
  id: string;
  type: 'Advisory' | 'Transit' | 'Infrastructure' | 'Weather Alert';
  title: string;
  detail: string;
  authority: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Urgent';
}

export interface ItineraryItem {
  id: string;
  placeId: string;
  day: number;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  customNotes?: string;
  customCostEstimate?: number;
}
