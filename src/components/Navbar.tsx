import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  ArrowLeftRight, 
  Activity, 
  Bot, 
  CalendarDays, 
  PhoneCall, 
  Sparkles,
  X,
  Copy,
  Check
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  compareCount: number;
  plannerCount: number;
  safetyAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  compareCount,
  plannerCount,
  safetyAlertsCount,
}) => {
  const [showSosModal, setShowSosModal] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const navItems = [
    { id: 'explore', label: 'City Explorer', icon: Compass },
    { id: 'map', label: 'Interactive Map', icon: MapPin },
    { id: 'safety', label: 'Safety Hub', icon: ShieldAlert, badge: safetyAlertsCount },
    { id: 'compare', label: 'Compare Places', icon: ArrowLeftRight, badge: compareCount },
    { id: 'smart-city', label: 'Smart City Pulse', icon: Activity },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, isAi: true },
    { id: 'planner', label: 'Trip Planner', icon: CalendarDays, badge: plannerCount },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top Hackathon Demo Notice Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-teal-200 px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30 text-[11px]">
              <Sparkles className="w-3 h-3 text-teal-400" />
              College Hackathon Prototype
            </span>
            <span className="text-slate-300">
              Pune Smart City Edition • Curated Demo Datasets & Live AI Guidance
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Sample metrics clearly labeled</span>
            <button
              onClick={() => setShowSosModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] transition-colors shadow-xs"
            >
              <PhoneCall className="w-3 h-3" />
              Emergency Helplines
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => setActiveTab('explore')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    CityWise <span className="text-teal-600">AI</span>
                  </span>
                  <span className="hidden md:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Pune
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Explore Smart. Travel Safe.
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.isAi && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded text-[10px] bg-teal-500/20 text-teal-600 font-bold border border-teal-500/30">
                        AI
                      </span>
                    )}
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                        isActive ? 'bg-teal-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSosModal(true)}
                className="lg:hidden p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1"
                title="Emergency Helplines"
              >
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">SOS</span>
              </button>

              <button
                onClick={() => setActiveTab('planner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeTab === 'planner'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">My Itinerary</span>
                <span className="w-5 h-5 rounded-full bg-white/90 text-teal-900 text-[11px] flex items-center justify-center font-bold">
                  {plannerCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Scroll */}
        <div className="lg:hidden border-t border-slate-200/80 bg-slate-50/80 px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-teal-400 text-slate-950' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Emergency Helpline Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowSosModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pune Emergency & Safety Helplines</h3>
                <p className="text-xs text-slate-500">Official Municipal & Police emergency contact lines</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {EMERGENCY_CONTACTS.map((item) => (
                <div 
                  key={item.number}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${item.number}`}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs transition-colors"
                    >
                      {item.number}
                    </a>
                    <button
                      onClick={() => handleCopy(item.number)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                      title="Copy number"
                    >
                      {copiedNumber === item.number ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <strong>Hackathon Demo Note:</strong> This application does not replace direct telecommunication emergency dispatch. In any immediate crisis, always call <strong>112</strong> directly from your phone.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
