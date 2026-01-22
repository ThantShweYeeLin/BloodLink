import mongoose from 'mongoose';

// ==================== DONOR SCHEMA ====================
const donorSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  blood_type: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: true
  },
  password_hash: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  date_of_birth: {
    type: Date
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  last_donation_date: {
    type: Date
  },
  is_verified: {
    type: Boolean,
    default: false
  }
});

// ==================== HOSPITAL SCHEMA ====================
const hospitalSchema = new mongoose.Schema({
  hospital_name: {
    type: String,
    required: true,
    trim: true
  },
  license_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contact_person: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  bed_capacity: {
    type: Number,
    default: 0
  },
  password_hash: {
    type: String,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  registration_date: {
    type: Date,
    default: Date.now
  }
});

// ==================== STAFF SCHEMA ====================
const staffSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  employee_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  certification: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    enum: ['blood_bank', 'donation_center', 'transfusion', 'testing', 'admin'],
    required: true
  },
  blood_bank_name: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  registration_date: {
    type: Date,
    default: Date.now
  }
});

// ==================== BLOOD INVENTORY SCHEMA ====================
const bloodInventorySchema = new mongoose.Schema({
  blood_type: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: true
  },
  quantity_ml: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'expired', 'discarded'],
    default: 'available'
  },
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor'
  },
  expiry_date: {
    type: Date,
    required: true
  },
  collection_date: {
    type: Date,
    default: Date.now
  },
  blood_bank_id: {
    type: String,
    trim: true
  }
});

// ==================== BLOOD REQUEST SCHEMA ====================
const bloodRequestSchema = new mongoose.Schema({
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  blood_type: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: true
  },
  quantity_ml: {
    type: Number,
    required: true
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'critical'],
    default: 'routine'
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled', 'expired'],
    default: 'pending'
  },
  required_by_date: {
    type: Date
  },
  request_date: {
    type: Date,
    default: Date.now
  },
  fulfilled_date: {
    type: Date
  }
});

// ==================== DONATION HISTORY SCHEMA ====================
const donationHistorySchema = new mongoose.Schema({
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  donation_date: {
    type: Date,
    default: Date.now
  },
  quantity_ml: {
    type: Number,
    required: true
  },
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  blood_bank_name: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
});

// ==================== AUDIT LOG SCHEMA ====================
const auditLogSchema = new mongoose.Schema({
  table_name: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    enum: ['INSERT', 'UPDATE', 'DELETE'],
    required: true
  },
  user_type: {
    type: String,
    enum: ['donor', 'hospital', 'staff', 'admin'],
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// ==================== EVENT SCHEMA ====================
const eventParticipantSchema = new mongoose.Schema({
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  blood: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Tentative'],
    default: 'Confirmed'
  },
  registered: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String,
    required: true,
    trim: true
  },
  end_time: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  expected: {
    type: Number
  },
  notes: {
    type: String,
    trim: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created_by_type: {
    type: String,
    enum: ['staff', 'hospital', 'admin'],
    required: true
  },
  created_by_name: {
    type: String,
    trim: true
  },
  participants: [eventParticipantSchema],
  created_at: {
    type: Date,
    default: Date.now
  }
});
eventSchema.index({ date: 1, start_time: 1 });

// Create and export models
export const Donor = mongoose.model('Donor', donorSchema);
export const Hospital = mongoose.model('Hospital', hospitalSchema);
export const Staff = mongoose.model('Staff', staffSchema);
export const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema);
export const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
export const DonationHistory = mongoose.model('DonationHistory', donationHistorySchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export const Event = mongoose.model('Event', eventSchema);
