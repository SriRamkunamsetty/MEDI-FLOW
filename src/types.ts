/**
 * MEDI FLOW Shared Types & Models
 * Production-grade database-aligned models
 */

export enum UserRole {
  DONOR = "donor",
  PATIENT = "patient",
  BLOOD_BANK = "blood_bank",
  HOSPITAL = "hospital",
  NGO = "ngo",
  GOVERNMENT = "government",
  SUPER_ADMIN = "super_admin"
}

export type BloodGroup = "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "Bombay" | "Rh_Null";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  createdAt: string;
}

export interface DonorProfile {
  id: string; // matches User.id
  bloodGroup: BloodGroup;
  isAvailable: boolean;
  isEmergencyOnly: boolean;
  lastDonationDate: string | null;
  age: number;
  weight: number;
  medicalConditions: string[];
  hemoglobin: number;
  eligibilityScore: number; // 0-100
  livesSaved: number;
  badges: string[];
  lat: number;
  lng: number;
  city: string;
}

export interface PatientProfile {
  id: string; // matches User.id
  bloodGroup: BloodGroup | null;
  lat: number;
  lng: number;
  city: string;
}

export interface BloodBank {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  lat: number;
  lng: number;
  city: string;
  address: string;
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  phone: string;
}

export interface BloodInventory {
  id: string;
  bloodBankId: string;
  bloodGroup: BloodGroup;
  availableUnits: number;
  reservedUnits: number;
  expiryDate: string;
  storageStatus: "optimal" | "warning" | "critical";
  lastUpdated: string;
}

export interface BloodRequest {
  id: string;
  patientId: string | null;
  hospitalId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  urgency: "critical" | "high" | "normal";
  status: "pending" | "matching" | "coordinated" | "completed" | "expired";
  locationName: string;
  lat: number;
  lng: number;
  notes?: string;
  createdAt: string;
}

export interface OrganDonor {
  id: string;
  userId: string; // donor user id
  organ: "Kidney" | "Liver" | "Heart" | "Lung" | "Pancreas" | "Cornea";
  status: "pledged" | "matched" | "completed";
  medicalNotes: string;
  createdAt: string;
}

export interface OrganRequest {
  id: string;
  hospitalId: string;
  patientNameEncrypted: string; // Never expose sensitive donor/recipient info
  organ: "Kidney" | "Liver" | "Heart" | "Lung" | "Pancreas" | "Cornea";
  bloodGroup: BloodGroup;
  urgency: "critical" | "high" | "normal";
  status: "pending" | "matched" | "completed";
  createdAt: string;
}

export interface EmergencyCase {
  id: string;
  requestId: string;
  assignedDonorId?: string;
  assignedAmbulanceId?: string;
  status: "active" | "transiting" | "delivered" | "completed";
  estimatedArrivalMin: number;
  routeCoordinates?: [number, number][]; // visual simulation coordinates
  createdAt: string;
  updatedAt: string;
}

export interface Ambulance {
  id: string;
  plateNumber: string;
  driverName: string;
  phone: string;
  lat: number;
  lng: number;
  status: "available" | "busy" | "offline";
  currentCaseId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "alert" | "info" | "success" | "warning";
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface AgentEvent {
  id: string;
  agentName: "Emergency Response Agent" | "Hospital Intelligence Agent" | "Government Analytics Agent";
  action: string;
  message: string;
  createdAt: string;
}

export interface DonationHistory {
  id: string;
  donorId: string;
  bloodGroup: BloodGroup;
  units: number;
  location: string;
  date: string;
  status: "completed" | "scheduled";
}

// AI Engine output interfaces
export interface DonorMatchScore {
  donorId: string;
  donorName: string;
  phone: string;
  bloodGroup: BloodGroup;
  matchScore: number; // percentage
  estimatedArrivalMin: number;
  reliabilityScore: number; // percentage
  distanceKm: number;
}

export interface ShortagePrediction {
  bloodGroup: BloodGroup;
  historicalConsumption: number;
  predictedDemandNextWeek: number;
  currentStock: number;
  riskLevel: "safe" | "warning" | "critical";
  recommendation: string;
}

export interface HospitalIntelligence {
  hospitalId: string;
  hospitalName: string;
  consumptionRate: number; // units/day
  emergencyLoadIndex: number; // 0-100%
  predictedShortageTimeHours: number;
  recommendedAction: string;
}

export interface GovernmentAnalytics {
  totalDonors: number;
  totalLivesSaved: number;
  shortageHeatmapData: { city: string; bloodGroup: BloodGroup; shortageLevel: "low" | "medium" | "high"; lat: number; lng: number }[];
  regionalShortages: string[];
  recommendations: string[];
}
