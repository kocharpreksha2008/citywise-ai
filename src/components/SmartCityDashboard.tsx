import React, { useState } from 'react';
import { 
  Activity, 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  Car, 
  Train, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Info, 
  Sparkles, 
  RotateCw, 
  Navigation,
  Compass
} from 'lucide-react';
import { 
  MOCK_WEATHER_DATA, 
  MOCK_TRAFFIC_CORRIDORS, 
  MOCK_CIVIC_ALERTS, 
  EMERGENCY_CONTACTS 
} from '../data/mockData';

export const SmartCityDashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer / Notice Strip */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">
            Notice: Curated Smart City Demonstration Datasets
          </p>
          <p className="text-amber-800 leading-relaxed">
            In compliance with hackathon transparency guidelines, when external government sensors or live city telemetry APIs are restricted or offline, CityWise AI visualizes realistic simulated baselines for Pune. All feeds below are clearly marked as <strong>[Sample Data]</strong>.
          </p>
        </div>
      </div>

      {/* Top Header with Refresh Button */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Pune Smart City Telemetry Pulse
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
              Sample Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time environmental atmospheric monitors, arterial traffic transit flow, and civic announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Refreshed: {lastRefreshedTime}</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Weather & Environmental AQI Widget */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-teal-400" />
              <span className="text-sm font-bold text-slate-200">
                Weather & Air Quality Station • Shivajinagar Observatory
              </span>
            </div>
            <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-800">
              [Sample Sensor Feed]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Temperature */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight">
                  {MOCK_WEATHER_DATA.tempC}°
                </span>
                <span className="text-xl text-teal-300 font-bold">C</span>
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {MOCK_WEATHER_DATA.condition}
              </p>
              <p className="text-xs text-slate-400">
                Pune Metropolitan Region, Maharashtra
              </p>
            </div>

            {/* Microclimate stats */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity
                </span>
                <span className="text-base font-bold">{MOCK_WEATHER_DATA.humidity}%</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-teal-400" /> Wind
                </span>
                <span className="text-base font-bold">{MOCK_WEATHER_DATA.windKmH} km/h</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> UV Index
                </span>
                <span className="text-base font-bold">{MOCK_WEATHER_DATA.uvIndex} (Moderate)</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Air Quality
                </span>
                <span className="text-base font-bold text-emerald-300">AQI {MOCK_WEATHER_DATA.aqi}</span>
              </div>
            </div>

            {/* AQI Health Guidance Box */}
            <div className="p-4 rounded-2xl bg-teal-900/40 border border-teal-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  AQI Assessment
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {MOCK_WEATHER_DATA.aqiLabel}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Air quality is acceptable for outdoor sightseeing and trekking. Sensitive groups may experience slight respiratory irritation in heavy traffic junctions like Swargate.
              </p>
            </div>
          </div>

          {/* 5-Day Forecast Row */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              5-Day Outlook [Demo Forecast]
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {MOCK_WEATHER_DATA.forecast.map((fc, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <p className="font-bold text-slate-300 mb-1">{fc.day}</p>
                  <p className="text-[11px] text-teal-300 mb-1">{fc.condition}</p>
                  <p className="font-extrabold text-sm">
                    {fc.tempHigh}° <span className="text-slate-400 font-normal">/ {fc.tempLow}°</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Traffic Corridors & Pune Metro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Arteries Monitor */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Major Arterial Traffic Corridors
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              [Sample Live Speeds]
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_TRAFFIC_CORRIDORS.map((corridor) => {
              const isHeavy = corridor.congestion === 'Heavy';
              const isMod = corridor.congestion === 'Moderate';

              return (
                <div
                  key={corridor.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        {corridor.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{corridor.stretch}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                      isHeavy
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isMod
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {corridor.congestion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="font-semibold">
                      Avg Speed: <span className="text-slate-900">{corridor.avgSpeedKmH} km/h</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {corridor.delayMinutes > 0 ? `+${corridor.delayMinutes} min delay` : 'No delay'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 italic">
                    "{corridor.statusText}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pune Metro & Transit Hub */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Train className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Maha Metro Pune Transit Lines
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Operational
              </span>
            </div>

            <div className="space-y-4 pt-3">
              {/* Purple Line */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-600 shadow-xs" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Line 1 (Purple): PCMC ↔ Civil Court ↔ Swargate
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700">7.5 Min Headway</span>
                </div>
                <p className="text-xs text-slate-600">
                  Key Stations: Shivajinagar, Mandai, Swargate. Connects northern industrial hub to central heritage core.
                </p>
                <div className="text-[11px] font-semibold text-indigo-900">
                  Fares: ₹10 - ₹35 • Hours: 6:00 AM - 10:00 PM
                </div>
              </div>

              {/* Aqua Line */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-600 shadow-xs" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Line 2 (Aqua): Vanaz ↔ Civil Court ↔ Ramwadi
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-teal-700">10 Min Headway</span>
                </div>
                <p className="text-xs text-slate-600">
                  Key Stations: Deccan Gymkhana, Sambhaji Garden, Ruby Hall Clinic, Kalyani Nagar. Ideal for college & cafe corridors.
                </p>
                <div className="text-[11px] font-semibold text-teal-900">
                  Fares: ₹10 - ₹30 • Hours: 6:00 AM - 10:30 PM
                </div>
              </div>
            </div>
          </div>

          {/* Quick PMPML Bus Note */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>PMPML City Buses:</strong> Unlimited 1-day pass available at Swargate & Pune Station kiosks for ₹50. E-buses running on all major arterial routes.
            </span>
          </div>
        </div>
      </div>

      {/* Municipal Civic Bulletins Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Pune Municipal Corporation (PMC) Civic Advisories
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            [Sample Municipal Bulletins]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_CIVIC_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    {alert.type}
                  </span>
                  <span className="text-slate-400">{alert.timestamp}</span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.detail}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                Source: {alert.authority}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
