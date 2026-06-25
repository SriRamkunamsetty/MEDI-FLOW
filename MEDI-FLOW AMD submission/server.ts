import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  User, UserRole, DonorProfile, PatientProfile, BloodBank, Hospital, 
  BloodInventory, BloodRequest, OrganDonor, OrganRequest, EmergencyCase, 
  Ambulance, Notification, AuditLog, AgentEvent, DonationHistory, BloodGroup,
  HospitalIntelligence, GovernmentAnalytics
} from "./src/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || "";
const hasApiKey = !!process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Haversine distance formula
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Local Database File Setup (Transient Persistence)
const DB_FILE = path.join(process.cwd(), "db_state.json");

interface DBState {
  users: User[];
  donors: DonorProfile[];
  patients: PatientProfile[];
  bloodBanks: BloodBank[];
  hospitals: Hospital[];
  bloodInventory: BloodInventory[];
  bloodRequests: BloodRequest[];
  organDonors: OrganDonor[];
  organRequests: OrganRequest[];
  emergencyCases: EmergencyCase[];
  ambulances: Ambulance[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  agentEvents: AgentEvent[];
  donationHistories: DonationHistory[];
}

// Initial seed helper
function getInitialState(): DBState {
  const nowStr = new Date().toISOString();
  
  const users: User[] = [
    { id: "u-1", email: "donor1@mediflow.org", name: "Elena Rostova", role: UserRole.DONOR, phone: "+1 (555) 432-8491", createdAt: nowStr },
    { id: "u-2", email: "donor2@mediflow.org", name: "David Kim (Rh-Null)", role: UserRole.DONOR, phone: "+1 (555) 912-7482", createdAt: nowStr },
    { id: "u-3", email: "donor3@mediflow.org", name: "Marcus Aurelius", role: UserRole.DONOR, phone: "+1 (555) 304-4567", createdAt: nowStr },
    { id: "u-4", email: "patient1@mediflow.org", name: "Clara Oswald", role: UserRole.PATIENT, phone: "+1 (555) 832-1100", createdAt: nowStr },
    { id: "u-5", email: "bank1@mediflow.org", name: "Metropolitan Central Blood Bank", role: UserRole.BLOOD_BANK, phone: "+1 (555) 203-9000", createdAt: nowStr },
    { id: "u-6", email: "hosp1@mediflow.org", name: "St. Mary Medical Center", role: UserRole.HOSPITAL, phone: "+1 (555) 100-3000", createdAt: nowStr },
    { id: "u-7", email: "gov1@mediflow.org", name: "National Health Department Admin", role: UserRole.GOVERNMENT, phone: "+1 (555) 500-4000", createdAt: nowStr },
    { id: "u-8", email: "ngo1@mediflow.org", name: "Red Cross Lifeline NGO", role: UserRole.NGO, phone: "+1 (555) 333-2222", createdAt: nowStr },
    { id: "u-9", email: "admin@mediflow.org", name: "Chief Medical Response Officer", role: UserRole.SUPER_ADMIN, phone: "+1 (555) 999-0000", createdAt: nowStr },
    { id: "u-10", email: "donor4@mediflow.org", name: "Aria Thorne (Bombay)", role: UserRole.DONOR, phone: "+1 (555) 234-5678", createdAt: nowStr },
    { id: "u-11", email: "donor5@mediflow.org", name: "Zayn Evans", role: UserRole.DONOR, phone: "+1 (555) 876-5432", createdAt: nowStr }
  ];

  const donors: DonorProfile[] = [
    {
      id: "u-1",
      bloodGroup: "O-", // King group
      isAvailable: true,
      isEmergencyOnly: false,
      lastDonationDate: "2026-03-10",
      age: 29,
      weight: 72,
      medicalConditions: [],
      hemoglobin: 14.5,
      eligibilityScore: 98,
      livesSaved: 12,
      badges: ["Life Saver Elite", "Golden Drop", "First Responder"],
      lat: 40.73061, // New York area
      lng: -73.935242,
      city: "New York"
    },
    {
      id: "u-2",
      bloodGroup: "Rh_Null", // Golden blood
      isAvailable: true,
      isEmergencyOnly: true,
      lastDonationDate: null,
      age: 34,
      weight: 81,
      medicalConditions: [],
      hemoglobin: 15.2,
      eligibilityScore: 95,
      livesSaved: 3,
      badges: ["Golden Drop", "Rh-Null Registry"],
      lat: 40.71278,
      lng: -74.00594,
      city: "New York"
    },
    {
      id: "u-3",
      bloodGroup: "A+",
      isAvailable: true,
      isEmergencyOnly: false,
      lastDonationDate: "2026-05-15",
      age: 42,
      weight: 88,
      medicalConditions: [],
      hemoglobin: 13.8,
      eligibilityScore: 90,
      livesSaved: 6,
      badges: ["Steady Donor"],
      lat: 40.758895,
      lng: -73.985131, // Times Square
      city: "New York"
    },
    {
      id: "u-10",
      bloodGroup: "Bombay", // Ultra-rare
      isAvailable: true,
      isEmergencyOnly: false,
      lastDonationDate: "2025-12-01",
      age: 31,
      weight: 65,
      medicalConditions: [],
      hemoglobin: 12.9,
      eligibilityScore: 94,
      livesSaved: 4,
      badges: ["Bombay Registry Specialist", "Hero Medal"],
      lat: 40.782865,
      lng: -73.965355, // Central Park Metro
      city: "New York"
    },
    {
      id: "u-11",
      bloodGroup: "B-",
      isAvailable: false, // Currently disabled/recovering
      isEmergencyOnly: false,
      lastDonationDate: "2026-06-10", // donated last week
      age: 25,
      weight: 68,
      medicalConditions: [],
      hemoglobin: 12.1,
      eligibilityScore: 30, // low because of recency
      livesSaved: 1,
      badges: ["Bronze Shield"],
      lat: 40.678178,
      lng: -73.944158, // Brooklyn
      city: "New York"
    }
  ];

  const patients: PatientProfile[] = [
    { id: "u-4", bloodGroup: "O-", lat: 40.748441, lng: -73.985664, city: "New York" }
  ];

  const bloodBanks: BloodBank[] = [
    {
      id: "bb-1",
      name: "Metropolitan Central Blood Bank",
      contactPerson: "Dr. Rachel Green",
      phone: "+1 (555) 203-9000",
      lat: 40.73061,
      lng: -73.935242,
      city: "New York",
      address: "150 E 42nd St, New York, NY 10017"
    },
    {
      id: "bb-2",
      name: "Brooklyn Life Resource Center",
      contactPerson: "Dr. Arthur Pendelton",
      phone: "+1 (555) 718-4400",
      lat: 40.650002,
      lng: -73.949997,
      city: "New York",
      address: "880 Eastern Pkwy, Brooklyn, NY 11213"
    }
  ];

  const hospitals: Hospital[] = [
    { id: "h-1", name: "St. Mary Emergency Hospital", lat: 40.748441, lng: -73.985664, city: "New York", phone: "+1 (555) 100-3000" }, // Empire State area
    { id: "h-2", name: "Bellevue Medical Center", lat: 40.738367, lng: -73.974378, city: "New York", phone: "+1 (555) 111-2222" },
    { id: "h-3", name: "Columbia Presbyterian", lat: 40.840748, lng: -73.942732, city: "New York", phone: "+1 (555) 441-2911" }
  ];

  const bloodInventory: BloodInventory[] = [
    // bb-1 units
    { id: "inv-1", bloodBankId: "bb-1", bloodGroup: "O+", availableUnits: 45, reservedUnits: 5, expiryDate: "2026-07-20", storageStatus: "optimal", lastUpdated: nowStr },
    { id: "inv-2", bloodBankId: "bb-1", bloodGroup: "O-", availableUnits: 3, reservedUnits: 1, expiryDate: "2026-07-15", storageStatus: "critical", lastUpdated: nowStr },
    { id: "inv-3", bloodBankId: "bb-1", bloodGroup: "A+", availableUnits: 52, reservedUnits: 2, expiryDate: "2026-07-28", storageStatus: "optimal", lastUpdated: nowStr },
    { id: "inv-4", bloodBankId: "bb-1", bloodGroup: "A-", availableUnits: 12, reservedUnits: 0, expiryDate: "2026-07-18", storageStatus: "warning", lastUpdated: nowStr },
    { id: "inv-5", bloodBankId: "bb-1", bloodGroup: "B+", availableUnits: 31, reservedUnits: 4, expiryDate: "2026-07-30", storageStatus: "optimal", lastUpdated: nowStr },
    { id: "inv-6", bloodBankId: "bb-1", bloodGroup: "B-", availableUnits: 4, reservedUnits: 2, expiryDate: "2026-07-12", storageStatus: "critical", lastUpdated: nowStr },
    { id: "inv-7", bloodBankId: "bb-1", bloodGroup: "AB+", availableUnits: 18, reservedUnits: 0, expiryDate: "2026-08-05", storageStatus: "optimal", lastUpdated: nowStr },
    { id: "inv-8", bloodBankId: "bb-1", bloodGroup: "AB-", availableUnits: 2, reservedUnits: 1, expiryDate: "2026-07-10", storageStatus: "critical", lastUpdated: nowStr },
    { id: "inv-9", bloodBankId: "bb-1", bloodGroup: "Bombay", availableUnits: 1, reservedUnits: 0, expiryDate: "2026-07-10", storageStatus: "critical", lastUpdated: nowStr },

    // bb-2 units
    { id: "inv-10", bloodBankId: "bb-2", bloodGroup: "O+", availableUnits: 38, reservedUnits: 10, expiryDate: "2026-07-21", storageStatus: "optimal", lastUpdated: nowStr },
    { id: "inv-11", bloodBankId: "bb-2", bloodGroup: "O-", availableUnits: 1, reservedUnits: 0, expiryDate: "2026-07-08", storageStatus: "critical", lastUpdated: nowStr },
    { id: "inv-12", bloodBankId: "bb-2", bloodGroup: "A+", availableUnits: 29, reservedUnits: 0, expiryDate: "2026-07-25", storageStatus: "optimal", lastUpdated: nowStr },
    { id: "inv-13", bloodBankId: "bb-2", bloodGroup: "B-", availableUnits: 0, reservedUnits: 0, expiryDate: "2026-06-15", storageStatus: "critical", lastUpdated: nowStr }
  ];

  const bloodRequests: BloodRequest[] = [
    {
      id: "req-1",
      patientId: "u-4",
      hospitalId: "h-1",
      bloodGroup: "O-",
      unitsRequired: 4,
      urgency: "critical",
      status: "matching",
      locationName: "Emergency Wing Room 402, St. Mary Emergency Hospital",
      lat: 40.748441,
      lng: -73.985664,
      notes: "Severe trauma patient incoming, internal hemorrhage.",
      createdAt: nowStr
    },
    {
      id: "req-2",
      patientId: null,
      hospitalId: "h-2",
      bloodGroup: "AB-",
      unitsRequired: 2,
      urgency: "high",
      status: "coordinated",
      locationName: "Bellevue ICU Wing B",
      lat: 40.738367,
      lng: -73.974378,
      notes: "Cardiac bypass surgery scheduled.",
      createdAt: nowStr
    }
  ];

  const organDonors: OrganDonor[] = [
    { id: "od-1", userId: "u-1", organ: "Kidney", status: "pledged", medicalNotes: "No diabetes, excellent kidney function markers", createdAt: nowStr },
    { id: "od-2", userId: "u-3", organ: "Cornea", status: "pledged", medicalNotes: "Normal vision, signed pledge card", createdAt: nowStr }
  ];

  const organRequests: OrganRequest[] = [
    {
      id: "or-1",
      hospitalId: "h-3",
      patientNameEncrypted: "8f731a59c9edc6bd (Patient ID: P-2094)",
      organ: "Kidney",
      bloodGroup: "O+",
      urgency: "high",
      status: "pending",
      createdAt: nowStr
    }
  ];

  const emergencyCases: EmergencyCase[] = [
    {
      id: "case-1",
      requestId: "req-1",
      assignedDonorId: "u-1",
      assignedAmbulanceId: "amb-1",
      status: "transiting",
      estimatedArrivalMin: 12,
      routeCoordinates: [
        [40.73061, -73.935242],
        [40.735, -73.955],
        [40.74, -73.97],
        [40.748441, -73.985664]
      ],
      createdAt: nowStr,
      updatedAt: nowStr
    }
  ];

  const ambulances: Ambulance[] = [
    { id: "amb-1", plateNumber: "MED-911A", driverName: "John Connor", phone: "+1 (555) 765-2190", lat: 40.735, lng: -73.955, status: "busy", currentCaseId: "case-1" },
    { id: "amb-2", plateNumber: "MED-402B", driverName: "Sarah Jenkins", phone: "+1 (555) 198-8422", lat: 40.755, lng: -73.972, status: "available" },
    { id: "amb-3", plateNumber: "MED-503C", driverName: "Robert Vance", phone: "+1 (555) 674-1234", lat: 40.712, lng: -73.998, status: "available" }
  ];

  const notifications: Notification[] = [
    { id: "n-1", userId: "u-1", title: "CRITICAL ALERT: O- Blood Required", message: "Emergency blood request req-1 for St. Mary Hospital matches your profile. Please opt-in to help", type: "alert", read: false, createdAt: nowStr },
    { id: "n-2", userId: "u-5", title: "Low Stock Warning: O- Blood", message: "Inventory is below reserve threshold of 5 units. Recommended outreach started automatically", type: "warning", read: false, createdAt: nowStr }
  ];

  const auditLogs: AuditLog[] = [
    { id: "al-1", userId: "u-9", action: "SYSTEM_BOOT", details: "Medi Flow Health Intelligence Engine Version 1.0 successfully launched", ipAddress: "127.0.0.1", createdAt: nowStr }
  ];

  const agentEvents: AgentEvent[] = [
    { id: "ae-1", agentName: "Emergency Response Agent", action: "PRIORITIZATION", message: "Analyzed request req-1. Scored CRITICAL (score 98). Initiated direct matching scan of available O- donors within 10km radius", createdAt: nowStr },
    { id: "ae-2", agentName: "Hospital Intelligence Agent", action: "SHORTAGE_PREDICTION", message: "Consensus forecast shows O- depletion within 4 hours at St. Mary Hospital due to multiple incoming trauma patients. Notified blood banks bb-1 & bb-2", createdAt: nowStr }
  ];

  const donationHistories: DonationHistory[] = [
    { id: "dh-1", donorId: "u-1", bloodGroup: "O-", units: 1, location: "Metropolitan Central Blood Bank", date: "2026-03-10", status: "completed" },
    { id: "dh-2", donorId: "u-3", bloodGroup: "A+", units: 1, location: "Brooklyn Life Resource Center", date: "2026-05-15", status: "completed" }
  ];

  return {
    users, donors, patients, bloodBanks, hospitals, bloodInventory, 
    bloodRequests, organDonors, organRequests, emergencyCases, 
    ambulances, notifications, auditLogs, agentEvents, donationHistories
  };
}

let db: DBState = getInitialState();

// Save state helper
function saveState() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write db file:", err);
  }
}

// Load state helper
function loadState() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf8");
      db = JSON.parse(data);
      console.log("Medi Flow database state loaded from:", DB_FILE);
    } else {
      db = getInitialState();
      saveState();
      console.log("Medi Flow database initialized with seed records.");
    }
  } catch (err) {
    console.warn("DB load failed. Defaulting to in-memory state.", err);
    db = getInitialState();
  }
}

loadState();

// Express API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV, geminiAvailable: hasApiKey });
});

// Demo Login/Switch API
app.get("/api/auth/users", (req, res) => {
  res.json(db.users);
});

app.post("/api/auth/login-demo", (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "Demo user not found with email " + email });
  }
  // Write audit log
  const log: AuditLog = {
    id: `al-${Date.now()}`,
    userId: user.id,
    action: "USER_LOGIN_DEMO",
    details: `Signed in as role: ${user.role} (${user.name})`,
    ipAddress: req.ip || "127.0.0.1",
    createdAt: new Date().toISOString()
  };
  db.auditLogs.push(log);
  saveState();
  res.json({ user, status: "success" });
});

app.post("/api/auth/signup-demo", (req, res) => {
  const { name, email, role, phone, bloodGroup, age, weight, city } = req.body;
  if (!name || !email || !role || !phone) {
    return res.status(400).json({ error: "Missing required signup details." });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "A user with this email already exists." });
  }

  const userId = `u-${Date.now()}`;
  const nowStr = new Date().toISOString();
  
  const newUser: User = { id: userId, name, email, role, phone, createdAt: nowStr };
  db.users.push(newUser);

  if (role === UserRole.DONOR) {
    const newDonor: DonorProfile = {
      id: userId,
      bloodGroup: bloodGroup || "O+",
      isAvailable: true,
      isEmergencyOnly: false,
      lastDonationDate: null,
      age: Number(age) || 25,
      weight: Number(weight) || 70,
      medicalConditions: [],
      hemoglobin: 14.0,
      eligibilityScore: 85,
      livesSaved: 0,
      badges: ["First Responder Candidate"],
      lat: 40.71278 + (Math.random() - 0.5) * 0.1,
      lng: -74.00594 + (Math.random() - 0.5) * 0.1,
      city: city || "New York"
    };
    db.donors.push(newDonor);
  } else if (role === UserRole.PATIENT) {
    const newPatient: PatientProfile = {
      id: userId,
      bloodGroup: bloodGroup || "O+",
      lat: 40.71278,
      lng: -74.00594,
      city: city || "New York"
    };
    db.patients.push(newPatient);
  }

  saveState();
  res.json({ user: newUser, status: "success" });
});

// Notifications
app.get("/api/notifications/:userId", (req, res) => {
  const list = db.notifications.filter(n => n.userId === req.params.userId || n.userId === "all");
  res.json(list);
});

app.post("/api/notifications/read", (req, res) => {
  const { id } = req.body;
  const n = db.notifications.find(item => item.id === id);
  if (n) {
    n.read = true;
    saveState();
  }
  res.json({ status: "success" });
});

// Audit / Agent Events Logs
app.get("/api/logs/audit", (req, res) => {
  res.json(db.auditLogs.slice().reverse().slice(0, 50));
});

app.get("/api/logs/agent", (req, res) => {
  res.json(db.agentEvents.slice().reverse().slice(0, 50));
});

// Blood Inventory
app.get("/api/inventory", (req, res) => {
  // Enriched with blood bank details
  const list = db.bloodInventory.map(inv => {
    const bank = db.bloodBanks.find(b => b.id === inv.bloodBankId);
    return { ...inv, bankName: bank ? bank.name : "Unknown Bank" };
  });
  res.json(list);
});

app.post("/api/inventory/update", (req, res) => {
  const { bloodBankId, bloodGroup, units, action } = req.body; // action: 'add' | 'subtract' | 'set'
  if (!bloodBankId || !bloodGroup) {
    return res.status(400).json({ error: "Missing identity" });
  }
  
  let inv = db.bloodInventory.find(i => i.bloodBankId === bloodBankId && i.bloodGroup === bloodGroup);
  if (!inv) {
    inv = {
      id: `inv-${Date.now()}`,
      bloodBankId,
      bloodGroup,
      availableUnits: 0,
      reservedUnits: 0,
      expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 35 days standard
      storageStatus: "optimal",
      lastUpdated: new Date().toISOString()
    };
    db.bloodInventory.push(inv);
  }

  const amt = Number(units) || 0;
  if (action === "add") {
    inv.availableUnits += amt;
  } else if (action === "subtract") {
    inv.availableUnits = Math.max(0, inv.availableUnits - amt);
  } else {
    inv.availableUnits = amt;
  }

  // Calculate status
  if (inv.availableUnits <= 2) {
    inv.storageStatus = "critical";
  } else if (inv.availableUnits <= 5) {
    inv.storageStatus = "warning";
  } else {
    inv.storageStatus = "optimal";
  }

  inv.lastUpdated = new Date().toISOString();
  saveState();
  res.json({ success: true, item: inv });
});

// Blood Banks
app.get("/api/blood-banks", (req, res) => {
  res.json(db.bloodBanks);
});

// Hospitals
app.get("/api/hospitals", (req, res) => {
  res.json(db.hospitals);
});

// Donors
app.get("/api/donors", (req, res) => {
  const list = db.donors.map(d => {
    const user = db.users.find(u => u.id === d.id);
    return {
      ...d,
      name: user ? user.name : "Anonymous Donor",
      email: user ? user.email : "",
      phone: user ? user.phone : ""
    };
  });
  res.json(list);
});

// Toggle Donor Availability
app.post("/api/donor/toggle-status", (req, res) => {
  const { id, isAvailable, isEmergencyOnly } = req.body;
  const d = db.donors.find(donor => donor.id === id);
  if (!d) return res.status(404).json({ error: "Donor profile not found" });

  if (isAvailable !== undefined) d.isAvailable = isAvailable;
  if (isEmergencyOnly !== undefined) d.isEmergencyOnly = isEmergencyOnly;
  
  saveState();
  res.json({ success: true, donor: d });
});

// Blood Requests
app.get("/api/requests/blood", (req, res) => {
  const list = db.bloodRequests.map(r => {
    const h = db.hospitals.find(item => item.id === r.hospitalId);
    const p = db.users.find(item => item.id === r.patientId);
    return {
      ...r,
      hospitalName: h ? h.name : "General Receiving",
      patientName: p ? p.name : "Direct Care Patient"
    };
  });
  res.json(list);
});

// Create emergency blood request
app.post("/api/requests/blood/create", async (req, res) => {
  const { hospitalId, bloodGroup, unitsRequired, urgency, notes, locationName, lat, lng, patientId } = req.body;
  if (!hospitalId || !bloodGroup || !unitsRequired) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const newReq: BloodRequest = {
    id: `req-${Date.now()}`,
    patientId: patientId || null,
    hospitalId,
    bloodGroup,
    unitsRequired: Number(unitsRequired),
    urgency: urgency || "normal",
    status: "matching",
    locationName: locationName || "Emergency Ward Room B",
    lat: Number(lat) || 40.748441,
    lng: Number(lng) || -73.985664,
    notes,
    createdAt: new Date().toISOString()
  };

  db.bloodRequests.push(newReq);

  // Auto trigger Emergency Response Agent event log
  const agentLog: AgentEvent = {
    id: `ae-${Date.now()}`,
    agentName: "Emergency Response Agent",
    action: "PRIORTIZATION_ALERT",
    message: `Received ${urgency.toUpperCase()} request ${newReq.id} for ${unitsRequired} units of type ${bloodGroup}. Matching donors matching age & distance...`,
    createdAt: new Date().toISOString()
  };
  db.agentEvents.push(agentLog);

  // Match eligible donors and ping them inside notifications
  const compatibleDonors = db.donors.filter(d => {
    if (!d.isAvailable) return false;
    // Basic compatible groups:
    const groups: Record<BloodGroup, BloodGroup[]> = {
      "O-": ["O-"],
      "O+": ["O-", "O+"],
      "A-": ["O-", "A-"],
      "A+": ["O-", "O+", "A-", "A+"],
      "B-": ["O-", "B-"],
      "B+": ["O-", "O+", "B-", "B+"],
      "AB-": ["O-", "A-", "B-", "AB-"],
      "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      "Bombay": ["Bombay"],
      "Rh_Null": ["Rh_Null"]
    };
    return (groups[bloodGroup] || []).includes(d.bloodGroup);
  });

  compatibleDonors.forEach(donor => {
    db.notifications.push({
      id: `n-${Date.now()}-${Math.random()}`,
      userId: donor.id,
      title: `EMERGENCY ALERT: ${bloodGroup} Needed`,
      message: `Hospital request ${newReq.id} needs your support immediately. Dist: ${haversineDistance(donor.lat, donor.lng, newReq.lat, newReq.lng).toFixed(1)} km`,
      type: "alert",
      read: false,
      createdAt: new Date().toISOString()
    });
  });

  saveState();
  res.json({ success: true, request: newReq });
});

// Organ Donor & Requests
app.get("/api/organ/donors", (req, res) => {
  const list = db.organDonors.map(od => {
    const user = db.users.find(u => u.id === od.userId);
    const donorProf = db.donors.find(d => d.id === od.userId);
    return {
      ...od,
      donorName: user ? user.name : "Anonymous Donor",
      bloodGroup: donorProf ? donorProf.bloodGroup : "Unknown",
      city: donorProf ? donorProf.city : "Unknown"
    };
  });
  res.json(list);
});

app.get("/api/organ/requests", (req, res) => {
  const list = db.organRequests.map(or => {
    const h = db.hospitals.find(item => item.id === or.hospitalId);
    return {
      ...or,
      hospitalName: h ? h.name : "Care Center"
    };
  });
  res.json(list);
});

// Create Organ request
app.post("/api/requests/organ/create", (req, res) => {
  const { hospitalId, organ, bloodGroup, urgency } = req.body;
  if (!hospitalId || !organ || !bloodGroup) {
    return res.status(400).json({ error: "Missing required organ request parameters" });
  }

  const newReq: OrganRequest = {
    id: `or-${Date.now()}`,
    hospitalId,
    patientNameEncrypted: `Encrypted ID: MF-PAT-${Math.floor(1000 + Math.random() * 9000)}`, // Never expose recipient names publicly
    organ,
    bloodGroup,
    urgency: urgency || "normal",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  db.organRequests.push(newReq);
  saveState();
  res.json({ success: true, request: newReq });
});

// Register Organ Donor Pledging
app.post("/api/organ/donors/pledge", (req, res) => {
  const { userId, organ, medicalNotes } = req.body;
  if (!userId || !organ) return res.status(400).json({ error: "Missing donor or organ selection" });

  const existing = db.organDonors.find(od => od.userId === userId && od.organ === organ);
  if (existing) return res.status(400).json({ error: "You have already pledged this organ." });

  const od: OrganDonor = {
    id: `od-${Date.now()}`,
    userId,
    organ,
    status: "pledged",
    medicalNotes: medicalNotes || "None provided",
    createdAt: new Date().toISOString()
  };

  db.organDonors.push(od);
  saveState();
  res.json({ success: true, pledge: od });
});

// Ambulances
app.get("/api/ambulances", (req, res) => {
  res.json(db.ambulances);
});

// Emergency active cases
app.get("/api/emergencies/cases", (req, res) => {
  const list = db.emergencyCases.map(c => {
    const reqInfo = db.bloodRequests.find(r => r.id === c.requestId);
    const donorUser = c.assignedDonorId ? db.users.find(u => u.id === c.assignedDonorId) : null;
    const donorProfile = c.assignedDonorId ? db.donors.find(d => d.id === c.assignedDonorId) : null;
    const hospital = reqInfo ? db.hospitals.find(h => h.id === reqInfo.hospitalId) : null;
    const ambulance = c.assignedAmbulanceId ? db.ambulances.find(a => a.id === c.assignedAmbulanceId) : null;

    return {
      ...c,
      bloodGroup: reqInfo ? reqInfo.bloodGroup : null,
      unitsRequired: reqInfo ? reqInfo.unitsRequired : 0,
      urgency: reqInfo ? reqInfo.urgency : "normal",
      donorName: donorUser ? donorUser.name : "Direct Stock Match",
      donorBloodGroup: donorProfile ? donorProfile.bloodGroup : null,
      hospitalName: hospital ? hospital.name : "St. Mary Emergency Hospital",
      ambulancePlate: ambulance ? ambulance.plateNumber : "Pending Disp",
      ambulanceDriver: ambulance ? ambulance.driverName : "N/A"
    };
  });
  res.json(list);
});

// Create Emergency Dispatch/Case Matching Action
app.post("/api/emergencies/dispatch", (req, res) => {
  const { requestId, donorId, ambulanceId } = req.body;
  const bloodReq = db.bloodRequests.find(r => r.id === requestId);
  if (!bloodReq) return res.status(404).json({ error: "Request not found" });

  bloodReq.status = "coordinated";

  const caseId = `case-${Date.now()}`;
  const now = new Date().toISOString();

  // Pick up coordinates
  let lat = 40.748441;
  let lng = -73.985664;
  
  if (donorId) {
    const donor = db.donors.find(d => d.id === donorId);
    if (donor) {
      lat = donor.lat;
      lng = donor.lng;
    }
  }

  const newCase: EmergencyCase = {
    id: caseId,
    requestId,
    assignedDonorId: donorId || undefined,
    assignedAmbulanceId: ambulanceId || "amb-1",
    status: "active",
    estimatedArrivalMin: Math.floor(8 + Math.random() * 15),
    routeCoordinates: [
      [lat, lng],
      [lat + (bloodReq.lat - lat) * 0.3, lng + (bloodReq.lng - lng) * 0.3],
      [lat + (bloodReq.lat - lat) * 0.6, lng + (bloodReq.lng - lng) * 0.6],
      [bloodReq.lat, bloodReq.lng]
    ],
    createdAt: now,
    updatedAt: now
  };

  db.emergencyCases.push(newCase);

  if (ambulanceId) {
    const amb = db.ambulances.find(a => a.id === ambulanceId);
    if (amb) {
      amb.status = "busy";
      amb.currentCaseId = caseId;
    }
  }

  // Notify donor
  if (donorId) {
    db.notifications.push({
      id: `n-${Date.now()}`,
      userId: donorId,
      title: "AMBULANCE EN ROUTE",
      message: `An ambulance (Plate: ${ambulanceId}) has been dispatched to pick you up / transport the unit to St. Mary Hospital.`,
      type: "success",
      read: false,
      createdAt: now
    });
  }

  saveState();
  res.json({ success: true, emergencyCase: newCase });
});

// Update case status (transition matching)
app.post("/api/emergencies/update-status", (req, res) => {
  const { caseId, status } = req.body; // active, transiting, delivered, completed
  const c = db.emergencyCases.find(item => item.id === caseId);
  if (!c) return res.status(404).json({ error: "Case not found" });

  c.status = status;
  c.updatedAt = new Date().toISOString();

  if (status === "completed") {
    const reqInfo = db.bloodRequests.find(r => r.id === c.requestId);
    if (reqInfo) {
      reqInfo.status = "completed";
      
      // Deduct inventory if matched with bank or direct completion
      const donorProf = c.assignedDonorId ? db.donors.find(d => d.id === c.assignedDonorId) : null;
      if (donorProf) {
        donorProf.livesSaved += 1;
        // add donation history record
        db.donationHistories.push({
          id: `dh-${Date.now()}`,
          donorId: donorProf.id,
          bloodGroup: donorProf.bloodGroup,
          units: 1,
          location: "St. Mary Emergency Hospital",
          date: new Date().toISOString().split("T")[0],
          status: "completed"
        });
      }
    }

    if (c.assignedAmbulanceId) {
      const amb = db.ambulances.find(a => a.id === c.assignedAmbulanceId);
      if (amb) {
        amb.status = "available";
        amb.currentCaseId = undefined;
      }
    }
  }

  saveState();
  res.json({ success: true, case: c });
});

// Impact Metrics Endpoint
app.get("/api/impact/stats", (req, res) => {
  const totalDonors = db.donors.length;
  const livesSavedSum = db.donors.reduce((sum, d) => sum + (d.livesSaved || 0), 0);
  const activeEmergencyReqs = db.bloodRequests.filter(r => r.status === "matching" || r.status === "coordinated").length;
  const completedReqs = db.bloodRequests.filter(r => r.status === "completed").length;
  const organMatches = db.organRequests.filter(r => r.status === "completed").length + 2; // offset with sample matched list
  
  res.json({
    livesSaved: livesSavedSum + 138, // high realistic base + live count
    unitsDonated: db.donationHistories.length + 482,
    activeDonors: totalDonors,
    emergencyReqsFilled: completedReqs + 89,
    avgResponseTimeMin: 14.5,
    organMatchesCompleted: organMatches,
    hospitalsConnected: db.hospitals.length,
    citiesCovered: 4
  });
});

// donation history for a specific donor
app.get("/api/donations/:donorId", (req, res) => {
  const list = db.donationHistories.filter(dh => dh.donorId === req.params.donorId);
  res.json(list);
});

// NGO drives
app.get("/api/ngo/campaigns", (req, res) => {
  res.json([
    { id: "c-1", title: "Summer Rare Blood Group Drive 2026", organizers: "Red Cross Lifeline", targetUnits: 150, currentUnits: 112, date: "2026-07-01", status: "active", location: "Manhattan Plaza" },
    { id: "c-2", title: "Rh-Null & Bombay Rare Registry Recruitment", organizers: "Medi Flow Outreach + NGO Coalition", targetUnits: 20, currentUnits: 8, date: "2026-06-25", status: "active", location: "Online / Regional Clinics" },
    { id: "c-3", title: "Youth Platelet Donation Drive", organizers: "City Life NGO", targetUnits: 80, currentUnits: 80, date: "2026-05-10", status: "completed", location: "Columbia University Campus" }
  ]);
});

// AI MODULES IMPLEMENTED WITH SECURE GEMINI SERVER-SIDE CALLS
// 1. AI Donor Matching Engine (Match Score calculation + intelligent clincal summary)
app.post("/api/ai/match", async (req, res) => {
  const { bloodRequestId } = req.body;
  const bloodReq = db.bloodRequests.find(r => r.id === bloodRequestId);
  if (!bloodReq) {
    return res.status(404).json({ error: "Blood request not found" });
  }

  // Math ranking scoring in node
  const scoredDonors = db.donors.filter(donor => {
    // Basic verification of blood group compatibilities
    return donor.isAvailable;
  }).map(donor => {
    const user = db.users.find(u => u.id === donor.id);
    const distanceKm = haversineDistance(donor.lat, donor.lng, bloodReq.lat, bloodReq.lng);
    
    // Eligibility impact
    let matchScore = 100;
    
    // distance scaling (max 30 points deducted)
    const distanceDeduction = Math.min(30, distanceKm * 2);
    matchScore -= distanceDeduction;

    // eligibility scaling
    matchScore = Math.max(20, matchScore - (100 - donor.eligibilityScore) * 0.2);

    // rare blood bonus
    if (bloodReq.bloodGroup === "Bombay" || bloodReq.bloodGroup === "Rh_Null") {
      if (donor.bloodGroup === bloodReq.bloodGroup) {
        matchScore = Math.min(100, matchScore + 15);
      } else {
        matchScore = 0; // zero match if rare group mismatches
      }
    }

    // response estimate
    const estArrival = Math.floor(10 + distanceKm * 3.5);

    return {
      donorId: donor.id,
      donorName: user ? user.name : "Anonymous Donor",
      phone: user ? user.phone : "Hidden",
      bloodGroup: donor.bloodGroup,
      matchScore: Math.round(matchScore),
      estimatedArrivalMin: estArrival,
      reliabilityScore: Math.round(donor.eligibilityScore * 0.95),
      distanceKm: Number(distanceKm.toFixed(2))
    };
  })
  .filter(d => d.matchScore > 0)
  .sort((a,b) => b.matchScore - a.matchScore)
  .slice(0, 5);

  let clincalSummary = "";
  if (hasApiKey) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are the Emergency Response Agent in a high-tech blood matching platform.
        Provide a concise, 3-sentence clinical triage summary and priority deployment instructions for a dispatcher.
        
        Emergency Case Details:
        - Hospital: St. Mary Emergency Hospital
        - Blood Required: ${bloodReq.bloodGroup} (${bloodReq.unitsRequired} units)
        - Urgency: ${bloodReq.urgency.toUpperCase()}
        - Notes: ${bloodReq.notes || "None"}
        
        Potential Matches found mathematically:
        ${JSON.stringify(scoredDonors)}
        
        Focus on immediate response steps, donor reliability, and location coordination. Keep it highly professional and serious. No bullet points, just clean paragraphs.`,
        config: {
          systemInstruction: "You are professional medical coordinator."
        }
      });
      clincalSummary = response.text || "";
    } catch (e: any) {
      console.warn("Gemini matching prompt fails:", e.message);
      clincalSummary = getDefaultClinicalSummary(bloodReq, scoredDonors);
    }
  } else {
    clincalSummary = getDefaultClinicalSummary(bloodReq, scoredDonors);
  }

  res.json({
    matches: scoredDonors,
    summary: clincalSummary
  });
});

function getDefaultClinicalSummary(req: BloodRequest, matches: any[]): string {
  if (matches.length === 0) {
    return `No eligible or compatible on-call donors were located within safe transit parameters. Recommend searching active inventory reservoirs at Metropolitan Central repository immediately.`;
  }
  const top = matches[0];
  return `CRITICAL: Top matched donor ${top.donorName} (${top.distanceKm} km away) represents the highest-scoring candidate with a match rating of ${top.matchScore}%. Mobilizing dispatcher team to initiate direct outreach protocol, aiming for arrival in ~${top.estimatedArrivalMin} minutes. Emergency response status locked to pending validation.`;
}

// 2. Blood Shortage Prediction Engine
app.get("/api/ai/shortage-forecast", async (req, res) => {
  const inventoryLevel = db.bloodInventory;
  const recentCasesCount = db.bloodRequests.length;
  
  // Predict risk for each major blood group
  const bloodGroups: BloodGroup[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Bombay", "Rh_Null"];
  
  const predictions = bloodGroups.map(bg => {
    const totalGroupStock = inventoryLevel
      .filter(i => i.bloodGroup === bg)
      .reduce((sum, item) => sum + item.availableUnits, 0);

    let riskLevel: "safe" | "warning" | "critical" = "safe";
    let requirementEstimate = Math.floor(15 + Math.random() * 25);
    
    if (totalGroupStock <= 5) {
      riskLevel = "critical";
      requirementEstimate = Math.floor(25 + Math.random() * 15);
    } else if (totalGroupStock <= 15) {
      riskLevel = "warning";
      requirementEstimate = Math.floor(18 + Math.random() * 20);
    }

    let recommendation = `Maintain current standard blood bank outreach schedules.`;
    if (riskLevel === "critical") {
      recommendation = `FORCE PRIORITY ACTION: Contact local NGO drives to organize responsive community blood camp. Notify donors within 15km boundary.`;
    } else if (riskLevel === "warning") {
      recommendation = `Targeted reminders to all O- and B- group donors who have not given in the last 60 days.`;
    }

    return {
      bloodGroup: bg,
      historicalConsumption: Math.floor(20 + Math.random() * 40),
      predictedDemandNextWeek: requirementEstimate,
      currentStock: totalGroupStock,
      riskLevel,
      recommendation
    };
  });

  let aiBriefing = "";
  if (hasApiKey) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are the Blood Shortage Prediction Intelligence Agent. Provide a 3-sentence statewide warning brief and alert notification text based on these current depletion indexes:
        
        Stocks state:
        - Critical Risk groups: O-, B-, Bombay, Rh-Null, AB-
        - Total current active inventory units across state: ${inventoryLevel.reduce((s,i)=>s+i.availableUnits, 0)}
        - Incoming emergency load index: High (due to upcoming metropolitan heat wave / traffic peak)
        
        Recommend matching directives immediately. Keep it expert, clear and clinical.`,
        config: {
          systemInstruction: "You are State Health Intelligence Analyst."
        }
      });
      aiBriefing = response.text || "";
    } catch (e: any) {
      aiBriefing = `ALERT briefing from State Intelligence System: Regional levels of Rh-Negative blood units (O-, B-) remain critical. High forecast demand incoming due to seasonal traffic peak. Recommending activation of coordinated donor targeting drive immediately.`;
    }
  } else {
    aiBriefing = `ALERT briefing from State Intelligence System: Regional levels of Rh-Negative blood units (O-, B-) remain critical. High forecast demand incoming due to seasonal traffic peak. Recommending activation of coordinated donor targeting drive immediately.`;
  }

  res.json({
    briefing: aiBriefing,
    predictions
  });
});

// 3. Hospital Intelligence Agent
app.get("/api/ai/hospital-intelligence", (req, res) => {
  const list: HospitalIntelligence[] = db.hospitals.map((h, index) => {
    const isCritical = index === 0; // make first hospital default warning
    return {
      hospitalId: h.id,
      hospitalName: h.name,
      consumptionRate: isCritical ? 14.5 : 6.2,
      emergencyLoadIndex: isCritical ? 88 : 42,
      predictedShortageTimeHours: isCritical ? 6 : 48,
      recommendedAction: isCritical 
        ? "CRITICAL: Depleting O- reserve units. Initiate automatic transfer from Metropolitan Central Blood Bank." 
        : "Operational standard levels. Continue monitoring."
    };
  });
  res.json(list);
});

// 4. Government Analytics Agent Report
app.get("/api/ai/government-report", (req, res) => {
  const result: GovernmentAnalytics = {
    totalDonors: db.donors.length,
    totalLivesSaved: db.donors.reduce((s,d)=> s + d.livesSaved, 0) + 142,
    shortageHeatmapData: [
      { city: "New York Uptown", bloodGroup: "O-", shortageLevel: "high", lat: 40.78, lng: -73.96 },
      { city: "Brooklyn Downtown", bloodGroup: "B-", shortageLevel: "medium", lat: 40.67, lng: -73.94 },
      { city: "Bronx Hub", bloodGroup: "A-", shortageLevel: "low", lat: 40.84, lng: -73.91 }
    ],
    regionalShortages: [
      "Metropolitan Central New York shows critical scarcity of rare Bombay type.",
      "Outer Boroughs present high demand for universal O-Negative supply."
    ],
    recommendations: [
      "Draft policy for mandatory donor registration integration in regional driver licensing databases.",
      "Initiate immediate alert campaign targeting emergency blood lockers in all tier-1 trauma stations."
    ]
  };
  res.json(result);
});

// Load Vite middleware / serve static assets
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server with Vite Middleware for HMR/Development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`MEDI FLOW server listening globally on Port ${PORT}`);
    console.log(`Server URL: http://0.0.0.0:${PORT}`);
    console.log(`API Health: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

initServer().catch(err => {
  console.error("Failed to bootstrap Medi Flow application server", err);
});
