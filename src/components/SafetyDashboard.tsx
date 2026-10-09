import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  ThumbsUp, 
  Clock, 
  MapPin, 
  Filter, 
  Search, 
  PhoneCall, 
  CheckCircle2, 
  X, 
  Info,
  Building,
  Lightbulb,
  Car,
  AlertOctagon
} from 'lucide-react';
import { SafetyIncident, IncidentCategory, IncidentSeverity, IncidentStatus } from '../types';
import { EMERGENCY_CONTACTS } from '../data/mockData';

interface SafetyDashboardProps {
  incidents: SafetyIncident[];
  onAddIncident: (incident: SafetyIncident) => void;
  onUpvoteIncident: (incidentId: string) => void;
}

export const SafetyDashboard: React.FC<SafetyDashboardProps> = ({
  incidents,
  onAddIncident,
  onUpvoteIncident,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportSuccessNotice, setReportSuccessNotice] = useState<boolean>(false);

  // New incident form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<IncidentCategory>('Lighting/Infrastructure');
  const [formLocation, setFormLocation] = useState('');
  const [formNeighborhood, setFormNeighborhood] = useState('Shivajinagar / JM Road');
  const [formDescription, setFormDescription] = useState('');
  const [formSeverity, setFormSeverity] = useState<IncidentSeverity>('Moderate');
  const [formReporter, setFormReporter] = useState('');

  // Neighborhood coordinate presets
  const neighborhoodCoords: Record<string, [number, number]> = {
    'Shivajinagar / JM Road': [18.5280, 73.8500],
    'Budhwar Peth / Mandai': [18.5150, 73.8550],
    'FC Road / Deccan': [18.5220, 73.8410],
    'Koregaon Park': [18.5360, 73.8940],
    'Kothrud': [18.5074, 73.8077],
    'Swargate': [18.5010, 73.8580],
    'Pune Camp / East St': [18.5150, 73.8760],
    'Donje / Sinhagad': [18.3700, 73.7600],
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchDesc = inc.description.toLowerCase().includes(q);
      const matchLoc = inc.locationName.toLowerCase().includes(q) || inc.neighborhood.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }
    return true;
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const coords = neighborhoodCoords[formNeighborhood] || [18.5204, 73.8567];

    const newIncident: SafetyIncident = {
      id: `inc-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      locationName: formLocation.trim() || formNeighborhood,
      neighborhood: formNeighborhood,
      coordinates: coords,
      description: formDescription.trim(),
      timestamp: 'Just now',
      status: 'Community Reported',
      severity: formSeverity,
      upvotes: 1,
      hasUpvoted: true,
      reportedBy: formReporter.trim() ? `${formReporter.trim()} (Citizen)` : 'Citizen Report',
    };

    onAddIncident(newIncident);
    setShowReportModal(false);
    setReportSuccessNotice(true);
    setTimeout(() => setReportSuccessNotice(false), 4500);

    // Reset Form
    setFormTitle('');
    setFormLocation('');
    setFormDescription('');
    setFormReporter('');
  };

  // Metrics
  const totalVerified = incidents.filter(i => i.status === 'Verified by Ward Team').length;
  const totalResolved = incidents.filter(i => i.status === 'Resolved').length;
  const resolutionPercentage = Math.round((totalResolved / incidents.length) * 100);

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'Verified by Ward Team':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><CheckCircle2 className="w-3 h-3" /> Verified by Ward</span>;
      case 'Resolved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'Under Investigation':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300"><Clock className="w-3 h-3" /> Under Investigation</span>;
      case 'Community Reported':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300"><Info className="w-3 h-3" /> Community Reported</span>;
    }
  };

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-red-700 text-white">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-300">High</span>;
      case 'Moderate':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">Moderate</span>;
      case 'Low':
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 border border-teal-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold">Pune Citizen Safety & Incident Hub</h2>
            <p className="text-xs text-slate-300">
              Crowdsourced community hazard reporting and ward verification dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Report Community Incident
        </button>
      </div>

      {/* Success notification if report just added */}
      {reportSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">
              Your safety report has been logged successfully and added to the city incident map!
            </span>
          </div>
          <button onClick={() => setReportSuccessNotice(false)} className="text-emerald-700 hover:text-emerald-950 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* High-Level Safety Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reports</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{incidents.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across 8 Pune city wards</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Cases</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-700">{totalVerified}</div>
          <p className="text-[11px] text-slate-500 mt-1">Confirmed by local ward marshals</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{resolutionPercentage}%</div>
          <p className="text-[11px] text-slate-500 mt-1">{totalResolved} hazards remediated</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Safety Index</span>
            <span className="text-xs font-bold text-teal-600">Pune Metro</span>
          </div>
          <div className="text-2xl font-black text-slate-900">8.9<span className="text-sm text-slate-400 font-normal">/10</span></div>
          <p className="text-[11px] text-teal-700 font-semibold mt-1">High Citizen Confidence</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports by title, street, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Quick Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
          >
            <option value="all">All Incident Categories</option>
            <option value="Lighting/Infrastructure">Lighting / Infrastructure</option>
            <option value="Harassment/Safety">Harassment & Safety</option>
            <option value="Road/Traffic">Road & Traffic Hazard</option>
            <option value="Theft/Pickpocketing">Theft / Pickpocketing</option>
            <option value="Civic/Sanitation">Civic & Sanitation</option>
            <option value="General Concern">General Safety Note</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full sm:w-auto text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Verified by Ward Team">Verified by Ward</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
            <option value="Community Reported">Community Reported</option>
          </select>
        </div>
      </div>

      {/* Incident Reports Feed */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-teal-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No incident reports match your criteria</h3>
            <p className="text-xs text-slate-500">Try loosening your category or severity filters.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            return (
              <div
                key={incident.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(incident.status)}
                    {getSeverityBadge(incident.severity)}
                    <span className="text-[11px] font-semibold text-slate-400">
                      • {incident.timestamp}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {incident.category}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {incident.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {incident.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {incident.locationName} ({incident.neighborhood})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Reported by: <span className="text-slate-600">{incident.reportedBy}</span>
                    </span>
                  </div>
                </div>

                {/* Right Upvote & Confirmation Interaction */}
                <div className="flex items-center md:flex-col gap-2 flex-shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <button
                    onClick={() => onUpvoteIncident(incident.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      incident.hasUpvoted
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${incident.hasUpvoted ? 'text-white' : 'text-slate-500'}`} />
                    <span>{incident.hasUpvoted ? 'Confirmed' : 'Confirm Hazard'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      incident.hasUpvoted ? 'bg-teal-800 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {incident.upvotes}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Citizen Safety Report</h3>
                <p className="text-xs text-slate-500">Help keep fellow students and travelers safe in Pune</p>
              </div>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Incident Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Flickering street light near Mandai Gate"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e: any) => setFormCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  >
                    <option value="Lighting/Infrastructure">Lighting/Infrastructure</option>
                    <option value="Harassment/Safety">Harassment/Safety</option>
                    <option value="Road/Traffic">Road/Traffic Hazard</option>
                    <option value="Theft/Pickpocketing">Theft/Pickpocketing</option>
                    <option value="Civic/Sanitation">Civic/Sanitation</option>
                    <option value="General Concern">General Concern</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Severity *</label>
                  <select
                    value={formSeverity}
                    onChange={(e: any) => setFormSeverity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  >
                    <option value="Low">Low - Informational</option>
                    <option value="Moderate">Moderate - Caution</option>
                    <option value="High">High - Prompt Action</option>
                    <option value="Critical">Critical - Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Neighborhood *</label>
                  <select
                    value={formNeighborhood}
                    onChange={(e) => setFormNeighborhood(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  >
                    {Object.keys(neighborhoodCoords).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Specific Landmark / Crossroad</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Metro Pillar 140"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue, time observed, and practical advice for pedestrians or vehicles..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Name / Alias (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Aniket P. or leave blank for Anonymous"
                  value={formReporter}
                  onChange={(e) => setFormReporter(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  All submitted reports immediately update the local prototype database and show on the Interactive Map with safety markers.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-sm"
                >
                  Post Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
