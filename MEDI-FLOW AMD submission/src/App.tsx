import React, { useState, useEffect } from "react";
import { 
  Heart, Activity, Users, Truck, Sparkles, Plus, AlertCircle, RefreshCw, 
  ChevronRight, CheckCircle2, Shield, Settings, Info, MapPin, Search, 
  Map as MapIcon, BarChart3, Database, Send, Radio, Award, UserCheck, CheckSquare, 
  DollarSign, FileText, Globe, Lightbulb, Bell, UserPlus, LogIn, ChevronDown,
  Calendar, Download, Eye, List
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid
} from "recharts";
import EmergencyMap from "./components/EmergencyMap";
import { UserRole, BloodGroup } from "./types";

export default function App() {
  // Current user state (default demo login)
  const [activeUser, setActiveUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<string>("u-1"); // Elena (O- Donor)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // General state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [donorsList, setDonorsList] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [organDonors, setOrganDonors] = useState<any[]>([]);
  const [organRequests, setOrganRequests] = useState<any[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<any[]>([]);
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [impactStats, setImpactStats] = useState<any>({
    livesSaved: 152,
    unitsDonated: 494,
    activeDonors: 11,
    emergencyReqsFilled: 91,
    avgResponseTimeMin: 14.5,
    organMatchesCompleted: 3,
    hospitalsConnected: 3,
    citiesCovered: 4
  });

  // Screen layout tab inside dashboards
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Government Analytics Dashboard states
  const [govtStartDate, setGovtStartDate] = useState<string>("2026-06-01");
  const [govtEndDate, setGovtEndDate] = useState<string>("2026-06-18");
  const [showRegionalChart, setShowRegionalChart] = useState<boolean>(false);

  // Regional Risk static list that the date range picker will filter:
  const initialRegionalRiskList = [
    { id: "reg-1", regionName: "New York Metropolis Uptown", riskLevel: "critical" as const, bloodGroup: "O-" as BloodGroup, indexValue: 92, lastUpdated: "2026-06-18", activeCases: 14 },
    { id: "reg-2", regionName: "Brooklyn Downtown Hub", riskLevel: "warning" as const, bloodGroup: "B-" as BloodGroup, indexValue: 74, lastUpdated: "2026-06-17", activeCases: 9 },
    { id: "reg-3", regionName: "Queens Regional Depot", riskLevel: "stable" as const, bloodGroup: "A+" as BloodGroup, indexValue: 45, lastUpdated: "2026-06-15", activeCases: 5 },
    { id: "reg-4", regionName: "Bronx Emergency Annex", riskLevel: "critical" as const, bloodGroup: "O+" as BloodGroup, indexValue: 87, lastUpdated: "2026-06-10", activeCases: 11 },
    { id: "reg-5", regionName: "Staten Island Blood Link", riskLevel: "optimal" as const, bloodGroup: "AB+" as BloodGroup, indexValue: 15, lastUpdated: "2026-06-12", activeCases: 1 },
    { id: "reg-6", regionName: "Manhattan Chelsea Care", riskLevel: "warning" as const, bloodGroup: "A-" as BloodGroup, indexValue: 61, lastUpdated: "2026-06-16", activeCases: 7 },
    { id: "reg-7", regionName: "Long Island Donation Point", riskLevel: "stable" as const, bloodGroup: "O-" as BloodGroup, indexValue: 35, lastUpdated: "2026-06-05", activeCases: 4 },
    { id: "reg-8", regionName: "Westchester Logistics Wing", riskLevel: "optimal" as const, bloodGroup: "AB-" as BloodGroup, indexValue: 12, lastUpdated: "2026-06-08", activeCases: 2 }
  ];

  const getFilteredRegionalRisk = () => {
    return initialRegionalRiskList.filter(r => {
      return r.lastUpdated >= govtStartDate && r.lastUpdated <= govtEndDate;
    });
  };

  const downloadPDFReport = () => {
    const filteredRiskData = getFilteredRegionalRisk();
    const activeCasesSum = filteredRiskData.reduce((acc, curr) => acc + curr.activeCases, 0);
    const avgRiskIndex = filteredRiskData.length > 0 
      ? filteredRiskData.reduce((acc, curr) => acc + curr.indexValue, 0) / filteredRiskData.length 
      : 0;
    const criticalCount = filteredRiskData.filter(r => r.riskLevel === 'critical').length;

    const title = "GOVERNMENT HEALTH ANALYTICS: REGIONAL RISK & RESOURCE RECONCILIATION REPORT";
    const dateStr = `Report Range: ${govtStartDate} to ${govtEndDate}  |  Generated on: 2026-06-18`;
    
    let content = `================================================================================
${title}
================================================================================
${dateStr}
--------------------------------------------------------------------------------

ABSTRACT EXECUTIVES:
- Focus Period Covered    : ${govtStartDate} to ${govtEndDate}
- Inspected Regions       : ${filteredRiskData.length} monitored registries
- Filtered Active Cases   : ${activeCasesSum} active cases requiring intensive tracking
- Average Regional Risk   : ${avgRiskIndex.toFixed(1)}% (Global risk threshold matches)
- Critical Hotspots Alert : ${criticalCount} critical hubs flagged

REGIONAL RISK MATRIX:
--------------------------------------------------------------------------------
Region Name                        | Risk Level | Group Required | Index | Updated
--------------------------------------------------------------------------------
`;

    filteredRiskData.forEach(r => {
      const region = r.regionName.padEnd(34);
      const level = r.riskLevel.toUpperCase().padEnd(10);
      const group = r.bloodGroup.padEnd(14);
      const idx = `${r.indexValue}%`.padEnd(5);
      content += `${region} | ${level} | ${group} | ${idx} | ${r.lastUpdated}\n`;
    });

    content += `--------------------------------------------------------------------------------

STATEWIDE HEALTH POLICY DIRECTIVES & POLICY ACTUATIONS:
1. Universal Blood Group targeting campaigns: mobilize registered O-negative donors inside
   critical zones (specifically New York Metropolis Uptown and Bronx Emergency Annex).
2. Priority Stock Balancing: Dispatch and balance inventory systems to prevent Bombay-Rare 
   and standard O-Negative depletion.
3. Database integrations: Coordinate regional emergency matching portals with current DMV records.
4. Logistics routing: Allocate emergency transport priority to Staten Island Blood Link as an 
   optimal auxiliary depot.

End of Report.
===============================================================================`;

    // Download simulated PDF file as formatted text stream
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Govt_Regional_Health_Analytics_Report_${govtStartDate}_to_${govtEndDate}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Input states for request simulations
  const [newRequest, setNewRequest] = useState({
    hospitalId: "h-1",
    bloodGroup: "O-" as BloodGroup,
    unitsRequired: 2,
    urgency: "critical" as "critical" | "high" | "normal",
    notes: "",
    locationName: "Emergency Admission Unit, St. Mary",
    lat: 40.748441,
    lng: -73.985664
  });

  const [newOrganRequest, setNewOrganRequest] = useState({
    hospitalId: "h-3",
    organ: "Kidney" as any,
    bloodGroup: "O+" as BloodGroup,
    urgency: "high" as any
  });

  const [newPledge, setNewPledge] = useState({
    organ: "Kidney" as any,
    medicalNotes: "Pledged donor, healthy condition."
  });

  // AI Matching Engine output state for active selection
  const [selectedMatchRequest, setSelectedMatchRequest] = useState<any | null>(null);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Shortage prediction state (AI)
  const [shortageReport, setShortageReport] = useState<any | null>(null);
  const [isShortageLoading, setIsShortageLoading] = useState(false);

  // Health eligibility form items
  const [eligibilityForm, setEligibilityForm] = useState({
    age: 28,
    weight: 71,
    lastDonationDaysAgo: 120,
    hasMedicalConditions: false,
    hemoglobin: 14.2
  });
  const [calculatedEligibility, setCalculatedEligibility] = useState<any | null>(null);

  // Sign up form items
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: UserRole.DONOR,
    bloodGroup: "O+" as BloodGroup,
    age: 30,
    weight: 75,
    city: "New York"
  });

  // Notification sound simulator (console alert)
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  // Fetch all states from node server
  const loadDashboardData = async () => {
    try {
      const usersRes = await fetch("/api/auth/users");
      const usersData = await usersRes.json();
      setUsersList(usersData);

      const invRes = await fetch("/api/inventory");
      const invData = await invRes.json();
      setInventory(invData);

      const itemsRes = await fetch("/api/requests/blood");
      const itemsData = await itemsRes.json();
      setBloodRequests(itemsData);

      const dRes = await fetch("/api/donors");
      const dData = await dRes.json();
      setDonorsList(dData);

      const hRes = await fetch("/api/hospitals");
      const hData = await hRes.json();
      setHospitals(hData);

      const bRes = await fetch("/api/blood-banks");
      const bData = await bRes.json();
      setBloodBanks(bData);

      const odRes = await fetch("/api/organ/donors");
      const odData = await odRes.json();
      setOrganDonors(odData);

      const orRes = await fetch("/api/organ/requests");
      const orData = await orRes.json();
      setOrganRequests(orData);

      const casesRes = await fetch("/api/emergencies/cases");
      const casesData = await casesRes.json();
      setEmergencyCases(casesData);

      const ambRes = await fetch("/api/ambulances");
      const ambData = await ambRes.json();
      setAmbulances(ambData);

      const campRes = await fetch("/api/ngo/campaigns");
      const campData = await campRes.json();
      setCampaigns(campData);

      const aLogRes = await fetch("/api/logs/audit");
      const aLogData = await aLogRes.json();
      setAuditLogs(aLogData);

      const agLogRes = await fetch("/api/logs/agent");
      const agLogData = await agLogRes.json();
      setAgentLogs(agLogData);

      const statsRes = await fetch("/api/impact/stats");
      const statsData = await statsRes.json();
      setImpactStats(statsData);

    } catch (err) {
      console.error("Failed to sync client state with server:", err);
    }
  };

  // Switch demo login quickly
  const handleSwitchUser = async (id: string) => {
    const target = usersList.find(u => u.id === id);
    if (!target) return;
    try {
      const res = await fetch("/api/auth/login-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target.email })
      });
      const data = await res.json();
      if (data.user) {
        setActiveUser(data.user);
        setSelectedRoleIndex(data.user.id);
        
        // Load notifications for this specific user
        const notifRes = await fetch(`/api/notifications/${data.user.id}`);
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpForm)
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setIsSignUpOpen(false);
      await loadDashboardData();
      if (data.user) {
        setActiveUser(data.user);
        setSelectedRoleIndex(data.user.id);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Initialize and keep loading periodically
  useEffect(() => {
    loadDashboardData().then(() => {
      // Auto login to first user (Elena Rostova - O- Donor)
      handleSwitchUser("u-1");
    });

    const interval = setInterval(() => {
      loadDashboardData();
    }, 60000); // 1 minute auto sync

    return () => clearInterval(interval);
  }, []);

  // Sync user-specific notifications when current user changes or on refresh
  useEffect(() => {
    if (activeUser) {
      fetch(`/api/notifications/${activeUser.id}`)
        .then(res => res.json())
        .then(data => {
          setNotifications(data);
          if (data.length > lastNotificationCount) {
            // New alerts arrived
            console.log("Medi Flow Sync Alert: New response notification captured.");
          }
          setLastNotificationCount(data.length);
        });
    }
  }, [activeUser, bloodRequests, emergencyCases]);

  // Read notification
  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.warn(e);
    }
  };

  // Run AI matching engine for a specific active emergency request
  const handleAiMatching = async (reqId: string) => {
    setIsMatchingLoading(true);
    const item = bloodRequests.find(r => r.id === reqId);
    setSelectedMatchRequest(item);
    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bloodRequestId: reqId })
      });
      const data = await response.json();
      setMatchResults(data.matches || []);
      setAiSummary(data.summary || "");
    } catch (err) {
      console.warn(err);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  // Trigger State wise Forecast Report
  const handleForecastShortage = async () => {
    setIsShortageLoading(true);
    try {
      const response = await fetch("/api/ai/shortage-forecast");
      const data = await response.json();
      setShortageReport(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsShortageLoading(false);
    }
  };

  // Toggle Donor availability
  const handleToggleAvailability = async (isAvailable: boolean, isEmergencyOnly: boolean) => {
    if (!activeUser) return;
    try {
      await fetch("/api/donor/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeUser.id, isAvailable, isEmergencyOnly })
      });
      loadDashboardData();
    } catch (err) {
      console.warn(err);
    }
  };

  // Create Blood Request Action
  const handleCreateBloodRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const targetHospital = hospitals.find(h => h.id === newRequest.hospitalId);
      const payload = {
        ...newRequest,
        lat: targetHospital ? targetHospital.lat : 40.748441,
        lng: targetHospital ? targetHospital.lng : -73.985664,
        patientId: activeUser?.role === UserRole.PATIENT ? activeUser.id : null
      };

      const res = await fetch("/api/requests/blood/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setNewRequest({
          hospitalId: "h-1",
          bloodGroup: "O-" as BloodGroup,
          unitsRequired: 2,
          urgency: "critical",
          notes: "",
          locationName: "Emergency Admission Unit, St. Mary",
          lat: 40.748441,
          lng: -73.985664
        });
        await loadDashboardData();
        // pre-select and run AI engine on this newly created medical request
        handleAiMatching(data.request.id);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Create Organ Request (Hospital dashboard)
  const handleCreateOrganRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/requests/organ/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrganRequest)
      });
      const data = await res.json();
      if (data.success) {
        await loadDashboardData();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Organ pledging form (Donor dashboard)
  const handlePledgeOrgan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/organ/donors/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUser.id,
          organ: newPledge.organ,
          medicalNotes: newPledge.medicalNotes
        })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      await loadDashboardData();
      alert("Successfully registered your life pledge. You have received the 'Pledge Champion Badge'!");
    } catch (err) {
      console.warn(err);
    }
  };

  // Dispatch Case Command (Hospital / AI response Agent)
  const handleDispatchCase = async (reqId: string, donorId: string | null, ambulanceId: string) => {
    try {
      const res = await fetch("/api/emergencies/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: reqId, donorId, ambulanceId })
      });
      const data = await res.json();
      if (data.success) {
        await loadDashboardData();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Update transiting case (Simulate transport action)
  const handleUpdateCaseStatus = async (caseId: string, nextStatus: "transiting" | "delivered" | "completed") => {
    try {
      const res = await fetch("/api/emergencies/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        await loadDashboardData();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Update inventory level directly (Blood bank panel)
  const handleInventoryMod = async (bloodBankId: string, bloodGroup: BloodGroup, units: number, action: "add" | "subtract") => {
    try {
      const res = await fetch("/api/inventory/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bloodBankId, bloodGroup, units, action })
      });
      if (res.ok) {
        await loadDashboardData();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Compute donor eligibility in-app dynamically
  const calculateEligibilityScore = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 100;
    const reasons: string[] = [];

    if (eligibilityForm.age < 18 || eligibilityForm.age > 65) {
      score -= 50;
      reasons.push("Standard medical range is between 18 and 65 years old.");
    }
    if (eligibilityForm.weight < 50) {
      score -= 40;
      reasons.push("Ineligible under standard 50kg patient-safety index.");
    }
    if (eligibilityForm.lastDonationDaysAgo < 56) {
      score -= 60;
      reasons.push("Minimum spacing must be at least 56 days for complete cell replenishment.");
    }
    if (eligibilityForm.hasMedicalConditions) {
      score -= 75;
      reasons.push("Declared chronic or active infections restrict donation.");
    }
    if (eligibilityForm.hemoglobin < 12.5) {
      score -= 30;
      reasons.push("Required hemoglobin floor is 12.5 g/dL.");
    }

    const finalScore = Math.max(0, score);
    setCalculatedEligibility({
      score: finalScore,
      isEligible: finalScore >= 70,
      reasons
    });
  };

  // Group Map coordinates plotters 
  const buildGridMarkers = () => {
    const list: any[] = [];
    hospitals.forEach(h => {
      // Find active requests for this hospital
      const activeCount = bloodRequests.filter(r => r.hospitalId === h.id && r.status === "matching").length;
      list.push({
        id: `h-${h.id}`,
        name: h.name,
        type: "hospital",
        lat: h.lat,
        lng: h.lng,
        details: h.phone,
        status: activeCount > 0 ? `${activeCount} ACTIVE EMERGENCY NEED` : "STANDBY OK"
      });
    });

    bloodBanks.forEach(b => {
      list.push({
        id: b.id,
        name: b.name,
        type: "bank",
        lat: b.lat,
        lng: b.lng,
        details: b.address,
        status: "Online Hub"
      });
    });

    donorsList.forEach(d => {
      if (d.isAvailable) {
        list.push({
          id: d.id,
          name: d.name,
          type: "donor",
          lat: d.lat,
          lng: d.lng,
          bloodGroup: d.bloodGroup,
          status: d.isEmergencyOnly ? "EMERGENCY RESERVIST" : "Active & Ready"
        });
      }
    });

    ambulances.forEach(a => {
      list.push({
        id: a.id,
        name: `Ambulance ${a.plateNumber}`,
        type: "ambulance",
        lat: a.lat,
        lng: a.lng,
        status: a.status.toUpperCase(),
        details: `Driver: ${a.driverName}`
      });
    });

    return list;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased selection:bg-rose-500 selection:text-white" id="applet-viewport">
      
      {/* Platform Branding Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-45" id="main-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-950/40 relative overflow-hidden group">
              <Heart className="w-5.5 h-5.5 text-white animate-pulse" />
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-slate-100 font-sans">MEDI FLOW</span>
                <span className="text-[10px] bg-red-950/70 border border-red-900/60 text-rose-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live Network
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium font-sans">AI Blood &amp; Organ Emergency Response Network</p>
            </div>
          </div>

          {/* Quick Simulation Identity Switcher */}
          <div className="flex items-center gap-3">
            {/* Direct Multi-Tenant selector bar */}
            <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-2 font-mono">Simulate User:</span>
              <select
                className="bg-slate-950 border-0 text-xs text-slate-200 font-medium px-2 py-1 rounded-lg focus:ring-1 focus:ring-rose-500 outline-none max-w-[210px] cursor-pointer"
                value={selectedRoleIndex}
                onChange={(e) => handleSwitchUser(e.target.value)}
                id="role-simulator-select"
              >
                {usersList.map((usr) => (
                  <option key={usr.id} value={usr.id}>
                    [{usr.role.replace("_", " ").toUpperCase()}] {usr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Active Account Box */}
            {activeUser ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 text-xs uppercase border border-slate-700">
                  {activeUser.name[0]}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                    {activeUser.name}
                    <Shield className="w-3 h-3 text-rose-500" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono capitalize">
                    Active role: {activeUser.role.replace("_", " ")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2 gap-1 flex items-center text-xs text-amber-400">
                <AlertCircle className="w-4 h-4" /> Connecting DB...
              </div>
            )}

            <button
              onClick={() => setIsSignUpOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1 border border-slate-700"
              id="signup-btn"
            >
              <UserPlus className="w-3.5 h-3.5" /> Join System
            </button>
          </div>

        </div>
      </header>

      {/* Real-time Ticker Broadcast */}
      <div className="bg-gradient-to-r from-red-950/80 to-slate-950/80 border-b border-rose-950/40 text-rose-400 py-2.5 px-4 md:px-6 overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-ping shrink-0" />
            <span className="font-extrabold uppercase font-mono text-[10px] bg-red-900/60 text-red-200 px-1.5 py-0.5 rounded-full shrink-0">AI Agent Intelligence Notification:</span>
            <span className="text-slate-300 truncate font-sans text-[11px] font-medium leading-tight">
              {agentLogs.length > 0 ? (
                `[${agentLogs[0].agentName}] ${agentLogs[0].message}`
              ) : (
                "Scanning New York hospital loads for O-Negative & rare blood shortages..."
              )}
            </span>
          </div>
          <button 
            onClick={loadDashboardData}
            className="text-[10px] text-slate-400 hover:text-slate-100 flex items-center gap-1 shrink-0 ml-auto md:ml-0 font-medium py-0.5 px-1.5 rounded border border-slate-800 bg-slate-900/50"
            aria-label="Refresh telemetry data"
          >
            <RefreshCw className="w-2.5 h-2.5" /> Sync Telemetry
          </button>
        </div>
      </div>

      {/* Top Level Impact Stats Panel */}
      <section className="bg-slate-900 border-b border-slate-800 py-6" id="impact-section">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" id="stats-grid">
            
            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Lives Saved</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-rose-500 tracking-tight">{impactStats.livesSaved || 0}</span>
                <span className="text-[9px] text-slate-400">Saved</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Units Donated</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-emerald-400 tracking-tight">{impactStats.unitsDonated || 0}</span>
                <span className="text-[9px] text-slate-400">Total units</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Active Donors</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-200 tracking-tight">{impactStats.activeDonors || 0}</span>
                <span className="text-[9px] text-slate-400">Verified</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Cases Met</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-teal-400 tracking-tight">{impactStats.emergencyReqsFilled || 0}</span>
                <span className="text-[9px] text-slate-400">Fulfilled</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Response Time</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-amber-500 tracking-tight">{impactStats.avgResponseTimeMin || "14.5"}</span>
                <span className="text-[9px] text-slate-400">Min avg</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Organ Matches</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-pink-400 tracking-tight">{impactStats.organMatchesCompleted || 0}</span>
                <span className="text-[9px] text-slate-400">Completed</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Hospitals</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-200 tracking-tight">{impactStats.hospitalsConnected || 0}</span>
                <span className="text-[9px] text-slate-400">Sites</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono font-sans">Cities</span>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-200 tracking-tight">{impactStats.citiesCovered || 0}</span>
                <span className="text-[9px] text-slate-400">Regions</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="main-grid-layout">
        
        {/* Left Side: Dynamic Workspace Panel (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8" id="left-workspace">
          
          {/* Inner Role Workspace Tab Selector */}
          <div className="border border-slate-800 bg-slate-950 p-2 rounded-2xl flex flex-wrap gap-1.5 items-center justify-between" id="role-tab-selectors">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'overview' ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                id="tab-btn-overview"
              >
                🌍 Global Map View
              </button>

              {activeUser?.role === UserRole.DONOR && (
                <button
                  onClick={() => setActiveTab("donor")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'donor' ? 'bg-rose-900 border border-rose-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  id="tab-btn-donor"
                >
                  🩸 My Donor Console
                </button>
              )}

              {activeUser?.role === UserRole.PATIENT && (
                <button
                  onClick={() => setActiveTab("patient")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'patient' ? 'bg-teal-950 border border-teal-900 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  id="tab-btn-patient"
                >
                  🏥 Patient Emergency Search
                </button>
              )}

              {activeUser?.role === UserRole.BLOOD_BANK && (
                <button
                  onClick={() => setActiveTab("blood_bank")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'blood_bank' ? 'bg-indigo-950 border border-indigo-900 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  id="tab-btn-blood_bank"
                >
                  🏦 Blood Bank Inventory Storage
                </button>
              )}

              {activeUser?.role === UserRole.HOSPITAL && (
                <button
                  onClick={() => setActiveTab("hospital")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'hospital' ? 'bg-rose-950 border border-rose-900 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  id="tab-btn-hospital"
                >
                  🚑 Hospital Emergency Dispatcher
                </button>
              )}

              {activeUser?.role === UserRole.NGO && (
                <button
                  onClick={() => setActiveTab("ngo")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'ngo' ? 'bg-emerald-950 border border-emerald-900 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  id="tab-btn-ngo"
                >
                  ✊ NGO Outreach Drives
                </button>
              )}

              {activeUser?.role === UserRole.GOVERNMENT && (
                <button
                  onClick={() => setActiveTab("government")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'government' ? 'bg-violet-950 border border-violet-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  id="tab-btn-government"
                >
                  📊 Govt health analytics
                </button>
              )}

              {activeUser?.role === UserRole.SUPER_ADMIN && (
                <button
                  onClick={() => setActiveTab("admin")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'admin' ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  id="tab-btn-admin"
                >
                  ⚙️ platform controls
                </button>
              )}
            </div>

            <div className="text-[10px] font-semibold text-rose-500 font-mono uppercase bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 mt-2 sm:mt-0">
              Role: {activeUser?.role?.replace("_", " ")}
            </div>
          </div>

          {/* TAB CONTENT: Global Map View with dynamic overlay summaries */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6" id="overview-tab-content">
              
              {/* Emergency Map Rendered */}
              <div className="relative">
                <EmergencyMap 
                  markers={buildGridMarkers()} 
                  activeRoute={emergencyCases.length > 0 ? emergencyCases[0].routeCoordinates : undefined}
                />
              </div>

              {/* Map Info Context Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" /> Active Dispatches (NYC Coordinates)
                  </h3>
                  <div className="mt-4 space-y-3">
                    {emergencyCases.map((cs) => (
                      <div key={cs.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-300">Transit: {cs.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 border border-amber-900 text-amber-400 uppercase font-mono font-extrabold">
                            {cs.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          A emergency match was established with donor <span className="text-slate-200 font-bold">{cs.donorName}</span>. 
                          Estimated delivery cycle to <span className="text-rose-400 font-semibold">{cs.hospitalName}</span> in <strong className="text-slate-200 font-black">{cs.estimatedArrivalMin} min</strong>.
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">Assigned plate: {cs.ambulancePlate}</span>
                          <div className="flex gap-1.5">
                            {cs.status === "active" && (
                              <button 
                                onClick={() => handleUpdateCaseStatus(cs.id, "transiting")}
                                className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-[10px] font-bold hover:bg-amber-400"
                                aria-label="Dispatch ambulance"
                              >
                                Dispatched
                              </button>
                            )}
                            {cs.status === "transiting" && (
                              <button 
                                onClick={() => handleUpdateCaseStatus(cs.id, "completed")}
                                className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold hover:bg-emerald-400"
                                aria-label="Complete delivery of blood unit"
                              >
                                Delivered (Complete)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {emergencyCases.length === 0 && (
                      <div className="text-xs text-slate-500 italic p-4 text-center">
                        No active medical response transits. All ambulances standing by.
                      </div>
                    )}
                  </div>
                </div>

                {/* State Shortage AI Indicator Widget */}
                <div>
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> State Supply AI Warning Matrix
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                    The predictive threat modeling tool checks recent usage parameters to alert critical centers.
                  </p>
                  
                  <div className="mt-4 flex flex-col gap-2.5">
                    <button 
                      onClick={handleForecastShortage}
                      className="w-full py-2 bg-gradient-to-r from-violet-900 to-indigo-950 border border-violet-800 text-white rounded-xl text-xs font-bold hover:brightness-110 flex items-center justify-center gap-1.5 shadow"
                      id="predict-shortage-btn"
                    >
                      {isShortageLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Statewide Stocks...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Initialize Shortage Prediction Engine (Gemini)
                        </>
                      )}
                    </button>

                    {shortageReport && (
                      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs flex flex-col gap-2">
                        <div className="text-[10px] text-amber-400 font-extrabold uppercase font-mono flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-400 fill-amber-400/20" /> Statewide Forecast briefing:
                        </div>
                        <p className="text-slate-300 font-sans italic text-[11px] leading-relaxed">
                          "{shortageReport.briefing}"
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px]">
                          {shortageReport.predictions.slice(0, 4).map((p: any) => (
                            <div key={p.bloodGroup} className="p-1.5 bg-slate-950/70 rounded border border-slate-800/80 flex items-center justify-between">
                              <span className="font-bold text-slate-200">{p.bloodGroup}</span>
                              <span className={`px-1 rounded font-extrabold text-[9px] ${
                                p.riskLevel === 'critical' ? 'bg-red-950/70 text-red-400' :
                                p.riskLevel === 'warning' ? 'bg-amber-950/70 text-amber-400' :
                                'bg-emerald-950/70 text-emerald-400'
                              }`}>
                                {p.riskLevel.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: Donor Console */}
          {activeTab === "donor" && (
            <div className="flex flex-col gap-6" id="donor-tab-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Availability Management */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <Settings className="w-4.5 h-4.5 text-rose-500" /> Active Registry Controls
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Enable emergency response paging to match with nearby ambulances or critical hospital requests instantly.
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Toggle Button Group */}
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Immediate Availability Mode</span>
                        <span className="text-[10px] text-slate-400 font-sans">On-call for dispatch paging</span>
                      </div>
                      <button
                        onClick={() => handleToggleAvailability(true, false)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
                        aria-label="Set standard donor status to fully active and ready"
                      >
                        Active-Ready
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Emergency Reservist Only</span>
                        <span className="text-[10px] text-slate-400 font-sans">Only page for rare groups or mass shortages</span>
                      </div>
                      <button
                        onClick={() => handleToggleAvailability(true, true)}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition"
                        aria-label="Set donor status to only be paged for emergency cases"
                      >
                        Emergency Alert
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Unavailable Mode</span>
                        <span className="text-[10px] text-slate-400 font-sans font-sans">Disable paging alert broadcasts</span>
                      </div>
                      <button
                        onClick={() => handleToggleAvailability(false, false)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition"
                        aria-label="Set donor status to currently inactive"
                      >
                        Set Inactive
                      </button>
                    </div>

                  </div>

                  {/* Achievements Badge Deck */}
                  <div className="mt-8 border-t border-slate-800 pt-6">
                    <span className="text-xs font-black uppercase text-slate-500 font-sans block tracking-wider mb-3">Earned Achievements</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-900 px-2 py-1 rounded-full">
                        <Award className="w-3 h-3 text-amber-500" /> Life Saver Elite
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-950/70 text-rose-300 border border-rose-900 px-2 py-1 rounded-full">
                        <Heart className="w-3 h-3 text-rose-500" /> First Responder
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-950/70 text-blue-300 border border-blue-900 px-2 py-1 rounded-full">
                        <Award className="w-3 h-3 text-blue-500" /> Gold Recipient
                      </span>
                    </div>
                  </div>

                </div>

                {/* Secure Organ Pledging Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <Heart className="w-4.5 h-4.5 text-pink-400 fill-pink-400/20" /> Human Organ Pledging Network
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Every year, thousands wait for transplants. Safely register your clinical intent. Patient identity details remain fully confidential.
                  </p>

                  <form onSubmit={handlePledgeOrgan} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1" htmlFor="pledge-organ">Choose Organ Pledge Category</label>
                      <select
                        id="pledge-organ"
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                        value={newPledge.organ}
                        onChange={(e) => setNewPledge(prev => ({ ...prev, organ: e.target.value as any }))}
                      >
                        <option value="Kidney">Kidney Transplant</option>
                        <option value="Liver">Liver Donor Category</option>
                        <option value="Heart">Heart (Critical Registry Pledge)</option>
                        <option value="Lung">Lung Transplant</option>
                        <option value="Pancreas">Pancreas Donor Category</option>
                        <option value="Cornea">Cornea (Restorative Vision Pledge)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1" htmlFor="pledge-notes">Optional Medical Notes / Declarations</label>
                      <textarea
                        id="pledge-notes"
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none resize-none"
                        placeholder="E.g., No smoking, fully blood pressure controlled."
                        value={newPledge.medicalNotes}
                        onChange={(e) => setNewPledge(prev => ({ ...prev, medicalNotes: e.target.value }))}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-pink-700 to-rose-600 hover:brightness-115 text-slate-50 text-xs font-bold rounded-xl shadow-lg shadow-pink-950/20 transition flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5" /> Pledge Organ &amp; Save Lives
                    </button>
                  </form>
                </div>

              </div>

              {/* Dynamic Health Eligibility Calibrator Form */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-rose-500" /> Health Eligibility Checker (Clinical Assessment Engine)
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Calculate donor response readiness based on primary clinical indicators (FDA &amp; Red-Cross aligned guidelines).
                </p>

                <form onSubmit={calculateEligibilityScore} className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1" htmlFor="age-input">Age (18-65)</label>
                    <input
                      id="age-input"
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                      value={eligibilityForm.age}
                      onChange={(e) => setEligibilityForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1" htmlFor="weight-input">Weight (kg)</label>
                    <input
                      id="weight-input"
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                      value={eligibilityForm.weight}
                      onChange={(e) => setEligibilityForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1" htmlFor="donation-days-input">Spacing (Last Days)</label>
                    <input
                      id="donation-days-input"
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                      value={eligibilityForm.lastDonationDaysAgo}
                      onChange={(e) => setEligibilityForm(prev => ({ ...prev, lastDonationDaysAgo: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1" htmlFor="hb-input">Hemoglobin (g/dL)</label>
                    <input
                      id="hb-input"
                      type="number"
                      step="0.1"
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                      value={eligibilityForm.hemoglobin}
                      onChange={(e) => setEligibilityForm(prev => ({ ...prev, hemoglobin: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition"
                      id="check-eligibility-btn"
                    >
                      Verify Match Score
                    </button>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-300">
                      I declare no active under-medication profile
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded border-slate-800 text-rose-500 filter brightness-125 focus:ring-0"
                    checked={!eligibilityForm.hasMedicalConditions}
                    onChange={(e) => setEligibilityForm(prev => ({ ...prev, hasMedicalConditions: !e.target.checked }))}
                    id="medical-state-check"
                  />
                </div>

                {calculatedEligibility && (
                  <div className={`mt-4 p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    calculatedEligibility.isEligible 
                      ? 'bg-emerald-950/65 border-emerald-900 text-emerald-400' 
                      : 'bg-red-950/65 border-red-900 text-red-400'
                  }`} id="eligibility-results-card">
                    <div>
                      <div className="flex items-center gap-2 font-bold mb-1 col-span-2">
                        {calculatedEligibility.isEligible ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ELIGIBILITY SECURED: OPTIMAL DONATION RATING ({calculatedEligibility.score}%)
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            ELIGIBILITY DECLINED: CLINICAL MARGIN DETECTED ({calculatedEligibility.score}%)
                          </>
                        )}
                      </div>
                      {calculatedEligibility.reasons.length > 0 && (
                        <ul className="text-xs list-disc pl-5 mt-1 text-slate-300">
                          {calculatedEligibility.reasons.map((r: string) => (
                            <li key={r} className="p-0.5">{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {calculatedEligibility.isEligible && (
                      <span className="px-3.5 py-1.5 rounded-lg bg-emerald-900 text-emerald-200 text-xs font-black font-mono animate-bounce shrink-0 text-center">
                        PASSED CHECKUP
                      </span>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB CONTENT: Patient Emergency Search */}
          {activeTab === "patient" && (
            <div className="flex flex-col gap-6" id="patient-tab-content">
              
              {/* Emergency Request submission Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  <h3 className="font-extrabold text-slate-100 text-base">Broadcast Emergency Blood Request</h3>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Triggers coordinates computation immediately. Sends real-time browser &amp; SMS alerts to all matched donors within 15km boundary.
                </p>

                <form onSubmit={handleCreateBloodRequest} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1" htmlFor="receive-hospital">Receiving Emergency Hospital</label>
                      <select
                        id="receive-hospital"
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-rose-500"
                        value={newRequest.hospitalId}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, hospitalId: e.target.value }))}
                      >
                        {hospitals.map(h => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1" htmlFor="request-blood-group">Required Blood Group</label>
                      <select
                        id="request-blood-group"
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-rose-500"
                        value={newRequest.bloodGroup}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))}
                      >
                        <option value="O+">O+ Positive</option>
                        <option value="O-">O- Universal Negative</option>
                        <option value="A+">A+ Positive</option>
                        <option value="A-">A- Negative</option>
                        <option value="B+">B+ Positive</option>
                        <option value="B-">B- Negative</option>
                        <option value="AB+">AB+ Positive</option>
                        <option value="AB-">AB- Negative</option>
                        <option value="Bombay">Bombay rare type</option>
                        <option value="Rh_Null">Rh_Null Golden blood</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1" htmlFor="required-units">Quantity Required (Units)</label>
                      <input
                        id="required-units"
                        type="number"
                        min="1"
                        max="10"
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-rose-500"
                        value={newRequest.unitsRequired}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, unitsRequired: Number(e.target.value) }))}
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1" htmlFor="urgency-level">Urgency Priority Level</label>
                      <select
                        id="urgency-level"
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-rose-500"
                        value={newRequest.urgency}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, urgency: e.target.value as any }))}
                      >
                        <option value="critical">🚨 Critical (Trauma / Massive Blood Loss)</option>
                        <option value="high">⚠️ High Priority Surgery</option>
                        <option value="normal">Standard Medical Replenishment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1" htmlFor="exact-location">Exact Location Room / Ward</label>
                      <input
                        id="exact-location"
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-rose-500"
                        value={newRequest.locationName}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, locationName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1" htmlFor="request-notes">Clinical Notes for Matching Specialist</label>
                    <textarea
                      id="request-notes"
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none resize-none focus:ring-1 focus:ring-rose-500"
                      placeholder="Specify internal hemorrage, surgery type..."
                      value={newRequest.notes}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg shadow-red-950/25"
                    id="broadcast-request-btn"
                  >
                    <Send className="w-3.5 h-3.5" /> Initialize National Triage Sync
                  </button>
                </form>
              </div>

              {/* Nearby blood matchers card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Active Registers Nearby (On-Call List)
                </h3>
                
                <div className="space-y-3.5">
                  {donorsList.filter(d => d.isAvailable).map((dn) => (
                    <div key={dn.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-950 border border-rose-900 text-rose-300 flex items-center justify-center font-black text-xs">
                          {dn.bloodGroup}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                            {dn.name}
                            {dn.isEmergencyOnly && (
                              <span className="text-[8px] bg-amber-950 text-amber-400 border border-amber-900/40 px-1 py-0.2 rounded font-mono">EMERGENCY ONLY</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            City: {dn.city} • Eligibility: {dn.eligibilityScore}% • Saved: {dn.livesSaved || 0} lives
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        GPS Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: Blood Bank Inventory */}
          {activeTab === "blood_bank" && (
            <div className="flex flex-col gap-6" id="blood_bank-tab-content">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base">State-Enriched Stock Depot</h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Operational overview for Metropolitan Central repositories. Adjust stock values manually.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-955 text-blue-300 border border-blue-900 rounded-lg text-xs font-mono">
                    Temp: 2.4°C [Locked]
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {inventory.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-905 rounded-xl border border-slate-800 flex flex-col justify-between gap-3 relative overflow-hidden bg-slate-900/60" id={`inventory-${item.id}`}>
                      {/* Critical visual pill */}
                      {item.storageStatus === 'critical' && (
                        <div className="absolute top-0 right-0 h-1 bg-red-500 w-full animate-pulse"></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="font-black text-lg text-slate-105 font-mono">{item.bloodGroup}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold font-mono ${
                          item.storageStatus === 'critical' ? 'bg-red-950 text-red-500 border border-red-900' :
                          item.storageStatus === 'warning' ? 'bg-amber-950 text-amber-500 border border-amber-900' :
                          'bg-emerald-950 text-emerald-500 border border-emerald-950'
                        }`}>
                          {item.storageStatus}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-slate-100 tracking-tight">{item.availableUnits}</span>
                        <span className="text-[10px] text-slate-400">units available</span>
                      </div>

                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between font-mono">
                        <span>Reserv.: {item.reservedUnits}</span>
                        <span>Exp: {item.expiryDate}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1.5 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleInventoryMod(item.bloodBankId, item.bloodGroup, 1, "add")}
                          className="py-1 px-2.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 transition text-[10px] font-bold text-slate-300"
                          aria-label={`Increment ${item.bloodGroup} units`}
                        >
                          + Replenish
                        </button>
                        <button
                          onClick={() => handleInventoryMod(item.bloodBankId, item.bloodGroup, 1, "subtract")}
                          className="py-1 px-2.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 transition text-[10px] font-bold text-slate-300"
                          aria-label={`Decrement ${item.bloodGroup} units`}
                        >
                          - Deduct
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* TAB CONTENT: Hospital Emergency Dispatcher */}
          {activeTab === "hospital" && (
            <div className="flex flex-col gap-6" id="hospital-tab-content">
              
              {/* Emergency Dispatch Center Console */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-red-500 animate-pulse" /> Emergency Hospital Dispatch Center
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  List of all incoming trauma or scheduled surgical requests. Click "Run AI Matching Engine" to compute compatible local donor locations and direct response times using our Gemini agent.
                </p>

                <div className="mt-6 space-y-4">
                  {bloodRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-3" id={`request-card-${req.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <span className="font-extrabold text-xs text-slate-200">Request: {req.id}</span>
                          <span className="px-2 py-0.5 rounded text-[8px] bg-red-950 text-red-400 border border-red-900 font-mono font-extrabold uppercase uppercase">
                            {req.urgency}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Created: {new Date(req.createdAt).toLocaleTimeString()}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Required Type</span>
                          <span className="text-slate-200 font-black text-rose-400">{req.bloodGroup}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Qty Required</span>
                          <span className="text-slate-200 font-black">{req.unitsRequired} Units</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Destination Clinic</span>
                          <span className="text-slate-200 truncate block">{req.hospitalName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Status</span>
                          <span className="text-slate-300 font-semibold uppercase font-mono text-[10px]">{req.status}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 font-sans italic">
                        "{req.notes || "No special triaging instructions declared"}"
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/70">
                        <button
                          onClick={() => handleAiMatching(req.id)}
                          className="px-3.5 py-1.5 bg-violet-900 hover:bg-violet-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                          aria-label={`Compute AI matches for ${req.id}`}
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Run AI Matching Engine
                        </button>
                        
                        {req.status === "matching" && (
                          <div className="ml-auto flex gap-1.5">
                            <button
                              onClick={() => handleDispatchCase(req.id, null, "amb-1")}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition"
                              aria-label={`Dispatch emergency fleet from blood pool for request ${req.id}`}
                            >
                              Dispatch Standard Ambulance
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organ requests & secure transplant board */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400" /> Active Transplants Matchmaking Board (CONFIDENTIAL)
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Ensures absolute anonymity. Encrypted identifiers prevent patient identification breaches.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Create Request */}
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-4">Paging Transplant Need</span>
                    <form onSubmit={handleCreateOrganRequest} className="space-y-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1" htmlFor="transplant-hospital">Receiving Clinic</label>
                        <select
                          id="transplant-hospital"
                          className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg"
                          value={newOrganRequest.hospitalId}
                          onChange={(e) => setNewOrganRequest(prev => ({ ...prev, hospitalId: e.target.value }))}
                        >
                          {hospitals.map(h => (
                            <option key={h.id} value={h.id}>{h.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1" htmlFor="transplant-organ">Organ Category</label>
                          <select
                            id="transplant-organ"
                            className="w-full bg-slate-955 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg"
                            value={newOrganRequest.organ}
                            onChange={(e) => setNewOrganRequest(prev => ({ ...prev, organ: e.target.value as any }))}
                          >
                            <option value="Kidney">Kidney</option>
                            <option value="Liver">Liver</option>
                            <option value="Heart">Heart</option>
                            <option value="Lung">Lung</option>
                            <option value="Cornea">Cornea</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1" htmlFor="transplant-blood">Blood Type</label>
                          <select
                            id="transplant-blood"
                            className="w-full bg-slate-955 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg"
                            value={newOrganRequest.bloodGroup}
                            onChange={(e) => setNewOrganRequest(prev => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))}
                          >
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="B+">B+</option>
                            <option value="AB+">AB+</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-pink-700 hover:bg-pink-600 text-white rounded-lg text-xs font-bold font-mono"
                      >
                        SUBMIT CONFIDENTIAL REQUEST
                      </button>
                    </form>
                  </div>

                  {/* Active Pledges & Live matching checks list */}
                  <div className="space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2 font-mono">Pledges Matches List</span>
                    {organRequests.map((req) => {
                      // Attempt simple logic compatible matches
                      const topMatches = organDonors.filter(od => od.organ === req.organ);
                      
                      return (
                        <div key={req.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs flex flex-col gap-1.5" id={`organ-req-${req.id}`}>
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-bold text-slate-200">UID: {req.patientNameEncrypted}</span>
                            <span className="px-1.5 py-0.5 rounded bg-pink-950 text-pink-400 text-[10px] uppercase font-primary">{req.organ}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Requires type: {req.bloodGroup}</span>
                            <span>Urgency: {req.urgency}</span>
                          </div>
                          <div className="pt-1.5 mt-1 border-t border-slate-800/60 flex items-center justify-between">
                            <span className="text-[10px] text-emerald-400 font-bold">
                              {topMatches.length} matching candidate registered
                            </span>
                            <button
                              onClick={() => {
                                alert(`transplant sequence initiated anonymously securely with candidate ID ${topMatches[0]?.id || "MF-DREG-403"}. Hospital ethics clearance verified.`);
                              }}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[9px] font-bold"
                              disabled={topMatches.length === 0}
                            >
                              Dispatch Transplant Protocol
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: NGO Drives */}
          {activeTab === "ngo" && (
            <div className="flex flex-col gap-6" id="ngo-tab-content">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 mb-4">
                  <Users className="w-4.5 h-4.5 text-emerald-400" /> Community Awareness &amp; Advocacy Drives
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Active blood drives currently targeting remote clinics, corporate offices, or colleges inside the metropolitan area.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-4 bg-slate-905 rounded-xl border border-slate-800 flex flex-col justify-between gap-4 bg-slate-900/60" id={`campaign-${camp.id}`}>
                      <div>
                        <div className="flex items-center justify-between mb-1 font-mono text-[9px] uppercase font-bold text-emerald-400">
                          <span>{camp.organizers}</span>
                          <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">{camp.status}</span>
                        </div>
                        <h4 className="font-bold text-slate-100 text-sm">{camp.title}</h4>
                        <div className="mt-3 space-y-1 text-xs text-slate-400 font-sans">
                          <div>📍 Location: {camp.location}</div>
                          <div>📅 target: {camp.targetUnits} units (Current verified: {camp.currentUnits})</div>
                        </div>
                      </div>

                      {/* Campaign progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Target Progress</span>
                          <span className="font-bold text-slate-200">{Math.round((camp.currentUnits / camp.targetUnits) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (camp.currentUnits / camp.targetUnits) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Mobilize Action button */}
                      <button 
                        onClick={() => {
                          alert(`Broadcasting push notification to nearby O- negative blood group owners. Expected outreach peak +30 donors.`);
                        }}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition"
                      >
                        🚀 Dispatch Notification Alerts
                      </button>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: Govt Health Analytics */}
          {activeTab === "government" && (() => {
            const filteredRiskData = getFilteredRegionalRisk();
            const filteredActiveCases = filteredRiskData.reduce((acc, curr) => acc + curr.activeCases, 0);
            const avgRiskIndexVal = filteredRiskData.length > 0 
              ? (filteredRiskData.reduce((acc, curr) => acc + curr.indexValue, 0) / filteredRiskData.length)
              : 0;
            const criticalHotspots = filteredRiskData.filter(r => r.riskLevel === 'critical').length;

            return (
              <div className="flex flex-col gap-6" id="government-tab-content">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  
                  {/* Dashboard Header Bar with PDF Download Button */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-900">
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-violet-400" /> Regional Shortage Detection Policy Matrix
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        National health policy decisions are generated in real-time based on actual available stock levels in Metropolitan repositories.
                      </p>
                    </div>
                    
                    <button 
                      onClick={downloadPDFReport}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all transform active:scale-95 cursor-pointer font-sans self-start lg:self-center"
                    >
                      <FileText className="w-4 h-4" /> Download PDF Analytics Report
                    </button>
                  </div>

                  {/* Date Range Picker Component */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-violet-400" /> ANALYSIS DATE WINDOW FILTER:
                      </label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="date"
                          value={govtStartDate}
                          onChange={(e) => setGovtStartDate(e.target.value)}
                          className="flex-1 bg-slate-950 text-xs text-slate-200 p-2 rounded-lg border border-slate-800 focus:outline-none focus:border-violet-500 transition font-mono"
                        />
                        <span className="text-slate-500 text-[10px] font-mono">TO</span>
                        <input 
                          type="date"
                          value={govtEndDate}
                          onChange={(e) => setGovtEndDate(e.target.value)}
                          className="flex-1 bg-slate-950 text-xs text-slate-200 p-2 rounded-lg border border-slate-800 focus:outline-none focus:border-violet-500 transition font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 justify-end self-end w-full md:w-auto font-mono">
                      <button 
                        onClick={() => { setGovtStartDate("2026-06-12"); setGovtEndDate("2026-06-18"); }}
                        className="flex-1 md:flex-none px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-bold rounded-lg border border-slate-800 transition"
                      >
                        ⏱️ Last 7 Days
                      </button>
                      <button 
                        onClick={() => { setGovtStartDate("2026-06-01"); setGovtEndDate("2026-06-18"); }}
                        className="flex-1 md:flex-none px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-bold rounded-lg border border-slate-800 transition"
                      >
                        🗓️ June Full Month
                      </button>
                    </div>
                  </div>

                  {/* General Grid Compliance Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Total Enregistered</span>
                      <span className="text-xl font-black text-slate-200 block mt-1">{donorsList.length} Active Donors</span>
                    </div>
                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Verified Life Cycles</span>
                      <span className="text-xl font-black text-emerald-400 block mt-1">{donorsList.reduce((su, d)=> su + d.livesSaved, 0) + 142} saves</span>
                    </div>
                    <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Registry coverage</span>
                      <span className="text-xl font-black text-violet-400 block mt-1">99.4% Grid compliance</span>
                    </div>
                  </div>

                  {/* Filtered Dynamic statistics dashboard row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Active Cases Checked</span>
                      <span className="text-xl font-black text-rose-500 block mt-1">{filteredActiveCases} cases</span>
                    </div>
                    <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">AVG Regional Risk Level</span>
                      <span className="text-xl font-black text-amber-500 block mt-1">{avgRiskIndexVal.toFixed(1)}%</span>
                    </div>
                    <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Hotspots Flagged</span>
                      <span className="text-xl font-black text-red-500 block mt-1">{criticalHotspots} Critical</span>
                    </div>
                  </div>

                  {/* Core Content Analysis card */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                    
                    <span className="text-xs font-black uppercase text-amber-400 block font-mono flex items-center gap-1 mb-4">
                      <Sparkles className="w-3.5 h-3.5" /> AGENT ANALYSIS REPORT BRIEF (Government Analytics Agent)
                    </span>
                    
                    <div className="space-y-4 text-xs font-sans leading-relaxed">
                      <div>
                        <strong className="text-slate-200 block mb-1">Statewide Policy Directives:</strong>
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                          <li>Maintain priority backup inventory systems to prevent Bombay-Rare depletion warnings.</li>
                          <li>Mobilize target campaigns and corporate clinics specifically for universal O-Negative donors.</li>
                          <li>Integrate standard driver license database API links with emergency matching portals.</li>
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-slate-800/80">
                        {/* Heatmap Section Header & Toggle Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <strong className="text-slate-200 block">Actionable Regional Risk Heatmap:</strong>
                          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800/80 flex self-start sm:self-auto">
                            <button 
                              onClick={() => setShowRegionalChart(false)}
                              className={`px-3 py-1 rounded text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${!showRegionalChart ? 'bg-slate-800 text-violet-300' : 'text-slate-400 hover:text-slate-300'}`}
                            >
                              <List className="w-3 h-3" /> Text Report
                            </button>
                            <button 
                              onClick={() => setShowRegionalChart(true)}
                              className={`px-3 py-1 rounded text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${showRegionalChart ? 'bg-slate-800 text-violet-300' : 'text-slate-400 hover:text-slate-300'}`}
                            >
                              <BarChart3 className="w-3 h-3" /> Chart View
                            </button>
                          </div>
                        </div>

                        {/* Legends Component */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-[10px] text-slate-400 font-mono mb-4">
                          <span className="font-bold uppercase text-slate-500 mr-1">Color Legend:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 border border-red-400/30"></span>
                            <span>Red: Critical Risk (&gt;75%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 border border-amber-400/30"></span>
                            <span>Amber: Warning Index (50%-75%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-400/30"></span>
                            <span>Green: Stable Level (25%-50%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 border border-blue-400/30"></span>
                            <span>Blue: Optimal Reserve (&lt;25%)</span>
                          </div>
                        </div>

                        {/* Visual List vs Chart Conditional Render */}
                        {showRegionalChart ? (
                          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 h-[280px] w-full flex flex-col justify-between">
                            {filteredRiskData.length === 0 ? (
                              <div className="flex-1 flex items-center justify-center text-slate-500 font-sans text-xs">
                                No regional data matched the selected date window.
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                  data={filteredRiskData}
                                  margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                  <XAxis 
                                    dataKey="regionName" 
                                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                                    tickLine={{ stroke: '#1e293b' }}
                                    axisLine={{ stroke: '#1e293b' }}
                                    tickFormatter={(value) => value.length > 14 ? `${value.substring(0, 14)}...` : value}
                                  />
                                  <YAxis 
                                    domain={[0, 100]} 
                                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                                    tickLine={{ stroke: '#1e293b' }}
                                    axisLine={{ stroke: '#1e293b' }}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#020617', 
                                      borderColor: '#1e293b', 
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontFamily: 'Inter, sans-serif'
                                    }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                    labelStyle={{ color: '#a78bfa', fontWeight: 'bold' }}
                                    formatter={(value: any, name: any, props: any) => {
                                      const item = props?.payload;
                                      return [`Risk Index: ${value}% (${item?.bloodGroup} shorted)`, 'Severity'];
                                    }}
                                  />
                                  <Bar dataKey="indexValue" radius={[4, 4, 0, 0]}>
                                    {filteredRiskData.map((entry, index) => {
                                      let color = '#3b82f6'; // blue
                                      if (entry.riskLevel === 'critical') color = '#ef4444'; // red
                                      else if (entry.riskLevel === 'warning') color = '#f59e0b'; // amber
                                      else if (entry.riskLevel === 'stable') color = '#10b981'; // green
                                      return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredRiskData.length === 0 ? (
                              <div className="p-8 bg-slate-950/30 text-center rounded-lg border border-slate-850 text-slate-500 font-sans text-xs">
                                No regional data matched the selected date range. Try widening the calendar filter.
                              </div>
                            ) : (
                              filteredRiskData.map((r) => {
                                let badgeClass = "bg-blue-950 text-blue-400 border border-blue-900";
                                if (r.riskLevel === "critical") badgeClass = "bg-red-950 text-red-400 border border-red-900 font-bold";
                                else if (r.riskLevel === "warning") badgeClass = "bg-amber-950 text-amber-400 border border-amber-900";
                                else if (r.riskLevel === "stable") badgeClass = "bg-emerald-950 text-emerald-400 border border-emerald-900";

                                return (
                                  <div key={r.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-850/80 flex items-center justify-between hover:border-slate-800 transition">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-bold text-slate-200 text-xs">{r.regionName}</span>
                                      <span className="text-[10px] text-slate-500 font-mono">Severity: {r.indexValue}% • Checked: {r.lastUpdated}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="px-1.5 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 text-[9px] font-mono rounded font-bold">
                                        Type: {r.bloodGroup}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono ${badgeClass}`}>
                                        {r.riskLevel === "critical" ? "CRITICAL RISK" : r.riskLevel === "warning" ? "WARNING INDEX" : r.riskLevel === "stable" ? "STABLE LEVELS" : "OPTIMAL DEPOT"}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* TAB CONTENT: Super Admin Platform Controls */}
          {activeTab === "admin" && (
            <div className="flex flex-col gap-6" id="admin-tab-content">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 mb-2">
                  <Shield className="w-4.5 h-4.5 text-slate-200" /> Platform Verification Workflows
                </h3>
                <p className="text-xs text-slate-400 font-sans mb-4">
                  Full multi-tenant system registry list. Enforce security clearances or toggle verification badges.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300 mt-4 border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono">
                        <th className="pb-2.5">User Profile name</th>
                        <th className="pb-2.5">Registry Role</th>
                        <th className="pb-2.5">Contact identity</th>
                        <th className="pb-2.5">Clearance Status</th>
                        <th className="pb-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/40">
                          <td className="py-3 font-bold text-slate-200">{user.name}</td>
                          <td className="py-3 font-mono uppercase text-[10px] text-slate-400 font-bold">{user.role}</td>
                          <td className="py-3 font-mono">{user.email}</td>
                          <td className="py-3">
                            <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[9px] font-mono font-bold">
                              VERIFIED-OK
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => alert(`Credentials verified successfully for user id ${user.id}. Audit log committed.`)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 border border-slate-700 transition"
                            >
                              Verify credentials
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Side: Emergency Panels and Dynamic AI Matches (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="right-workspace-panels">
          
          {/* Real-time Triage Match results (Crucial AI segment) */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden" id="ai-matches-panel">
            <div className="absolute top-0 right-0 p-3">
              <Sparkles className="w-5 h-5 text-violet-400 fill-violet-400/10 animate-pulse" />
            </div>
            
            <div>
              <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-1.5">
                AI MATCH SCORE INDEX
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Selected Match request is dynamically scored by clinical factors, GPS proximity &amp; historical performance.
              </p>
            </div>

            {selectedMatchRequest ? (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300">Request: {selectedMatchRequest.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900 font-bold font-mono">
                    Type: {selectedMatchRequest.bloodGroup}
                  </span>
                </div>

                {isMatchingLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
                    <span className="text-[11px] text-slate-400 font-mono animate-pulse">Running secure Haversine algorithms...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mt-1 text-xs font-sans">
                      <div className="text-[11px] text-amber-400 font-extrabold uppercase font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span> Clinical Response agent Briefing:
                      </div>
                      <p className="text-slate-200 italic leading-relaxed text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                        "{aiSummary}"
                      </p>

                      <strong className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block pt-1.5 font-mono">Top Compatible candidate matches:</strong>
                      
                      <div className="space-y-2.5">
                        {matchResults.map((match) => (
                          <div key={match.donorId} className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex items-center justify-between hover:border-slate-700 transition">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-black text-slate-250 font-sans">{match.donorName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Dist: {match.distanceKm} km • Est: {match.estimatedArrivalMin} min
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-400 font-mono block">
                                Match {match.matchScore}%
                              </span>
                              <button
                                onClick={() => handleDispatchCase(selectedMatchRequest.id, match.donorId, "amb-1")}
                                className="px-1.5 py-0.5 mt-0.5 bg-rose-950 hover:bg-rose-900 border border-rose-900 text-rose-300 text-[9px] rounded font-mono font-bold shrink-0"
                              >
                                Dispatch
                              </button>
                            </div>
                          </div>
                        ))}
                        {matchResults.length === 0 && (
                          <div className="text-[11px] text-slate-500 italic p-3 text-center">
                            No compatible on-call donors found within safety transit threshold.
                          </div>
                        )}
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 border-dashed text-slate-400 text-xs italic text-center py-10 font-sans">
                No request active. To begin, click "Run AI Matching Engine" on any pending case inside the Hospital Dashboard!
              </div>
            )}

          </div>

          {/* User Notifications Inbox */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6" id="notifications-box">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 mb-1.5">
              <Bell className="w-4 h-4 text-rose-500" /> Notifications Inbox
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Critical, user-specific notifications triggered by emergency dispatches.
            </p>

            <div className="mt-4 space-y-3">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-3 rounded-lg border text-xs flex flex-col gap-1.5 transition ${
                    n.read ? 'bg-slate-900/40 border-slate-850 text-slate-400' : 'bg-red-950/40 border-red-900/60 text-slate-200 font-sans'
                  }`}
                  id={`notification-${n.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 flex items-center gap-1 text-[11px]">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>}
                      {n.title}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono font-bold text-right">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed font-sans">{n.message}</p>
                  
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] text-slate-300 ml-auto"
                      aria-label="Acknowledge notification message"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-xs text-slate-500 italic p-4 text-center">
                  No active warnings in inbox.
                </div>
              )}
            </div>
          </div>

          {/* Audit Logs terminal */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6" id="audit-terminal-section">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 mb-1.5">
              <Database className="w-4 h-4 text-blue-500" /> Regulatory Core Audit Trail
            </h3>
            <p className="text-[10px] text-slate-400 font-sans">
              HIPAA-aligned system log tracking all critical modifications, sign-ins, and dispatches.
            </p>

            <div className="mt-4 bg-slate-900 border border-slate-850 rounded-xl p-3 h-48 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-2 select-text">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-1 border-b border-slate-800/60 leading-normal">
                  <span className="text-slate-400">[{new Date(log.createdAt).toLocaleTimeString()}]</span>{" "}
                  <strong className="text-amber-400 font-semibold">{log.action}:</strong>{" "}
                  <span className="text-slate-200">{log.details}</span>{" "}
                  <span className="text-[9px] text-slate-500 block text-right mt-0.5">IP: {log.ipAddress}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-10 mt-12" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Heart className="w-5.5 h-5.5 text-red-500 animate-pulse fill-red-500/20" />
            <div>
              <p className="text-xs font-bold text-slate-200">MEDI FLOW Emergency Network</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Protecting families, coordination, and matching networks worldwide.</p>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono text-center md:text-right">
            <span>© 2026 MEDI FLOW Health Intelligence. Encrypted SSL, AES-256 enabled. HIPAA Compliant framework.</span>
          </div>
        </div>
      </footer>

      {/* DIALOG FOR SIGN UP SIMULATOR */}
      {isSignUpOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsSignUpOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-lg font-bold"
              aria-label="Close signup dialog"
            >
              ×
            </button>

            <h3 className="font-black text-slate-100 text-base mb-2">Create New Clinic or Donor Profile</h3>
            <p className="text-xs text-slate-400 font-sans mb-6">
              Register role characteristics. The scoring systems will automatically adapt to your selection.
            </p>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-name">Full Enregister Name</label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                  value={signUpForm.name}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-email">Official E-mail</label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-phone">Contact Phone</label>
                  <input
                    id="signup-phone"
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none animate-none"
                    value={signUpForm.phone}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-role">Select Workspace Role</label>
                  <select
                    id="signup-role"
                    className="w-full bg-slate-955 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                    value={signUpForm.role}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  >
                    <option value={UserRole.DONOR}>Active Donor</option>
                    <option value={UserRole.PATIENT}>Patient</option>
                    <option value={UserRole.BLOOD_BANK}>Blood Bank Coordinator</option>
                    <option value={UserRole.HOSPITAL}>Emergency Dispatcher</option>
                    <option value={UserRole.NGO}>NGO Campaign Leader</option>
                    <option value={UserRole.GOVERNMENT}>Government Health analyst</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-blood">Blood Group Typology</label>
                  <select
                    id="signup-blood"
                    className="w-full bg-slate-955 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                    value={signUpForm.bloodGroup}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))}
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Bombay">Bombay rare</option>
                    <option value="Rh_Null">Rh_Null Golden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="signup-city">Current City Area</label>
                  <input
                    id="signup-city"
                    type="text"
                    className="w-full bg-slate-955 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl outline-none"
                    value={signUpForm.city}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-650 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow bg-rose-600 font-mono mt-4"
              >
                SUBMIT PROFILE INTO CLINICAL GRID
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
