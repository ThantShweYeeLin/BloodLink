import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query, getPool } from './sql.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Database connection test on startup
async function testDatabaseConnection() {
  try {
    const result = await query('SELECT 1 AS ok');
    console.log('✓ Database connected successfully');
    console.log('✓ MySQL/MariaDB ready');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://thantshweyeelin.github.io'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Life Link API is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== DONOR LOGIN (SQL) ====================
app.post('/api/login/donor', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const rows = await query(
      'SELECT id, full_name, email, password_hash FROM donors WHERE email = ? LIMIT 1',
      [email.toLowerCase()]
    );
    const donor = rows[0];

    if (!donor) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const passwordMatch = await bcrypt.compare(password, donor.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: String(donor.id), userType: 'donor', email: donor.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      message: 'Login successful',
      token: token,
      donorId: String(donor.id),
      fullName: donor.full_name
    });

  } catch (error) {
    console.error('Login error (SQL):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

// ==================== HOSPITAL LOGIN (SQL) ====================
app.post('/api/login/hospital', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const rows = await query(
      'SELECT id, hospital_name, email, password_hash FROM hospitals WHERE email = ? LIMIT 1',
      [email.toLowerCase()]
    );
    const hospital = rows[0];

    if (!hospital) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const passwordMatch = await bcrypt.compare(password, hospital.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: String(hospital.id), userType: 'hospital', email: hospital.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      message: 'Login successful',
      token: token,
      hospitalId: String(hospital.id),
      hospitalName: hospital.hospital_name
    });

  } catch (error) {
    console.error('Login error (SQL):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

// ==================== STAFF LOGIN (SQL) ====================
app.post('/api/login/staff', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const rows = await query(
      'SELECT id, full_name, email, password_hash FROM staff WHERE email = ? LIMIT 1',
      [email.toLowerCase()]
    );
    const staffMember = rows[0];

    if (!staffMember) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const passwordMatch = await bcrypt.compare(password, staffMember.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: String(staffMember.id), userType: 'staff', email: staffMember.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      message: 'Login successful',
      token: token,
      staffId: String(staffMember.id),
      fullName: staffMember.full_name
    });

  } catch (error) {
    console.error('Login error (SQL):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

// ==================== DONOR REGISTRATION (SQL) ====================
app.post('/api/register/donor', async (req, res) => {
  try {
    console.log('📝 Donor registration request received:', req.body);
    const { 
      fullName, 
      email, 
      phone, 
      dob, 
      bloodType, 
      address, 
      city, 
      password 
    } = req.body;

    if (!fullName || !email || !phone || !dob || !bloodType || !address || !city || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await query('SELECT id FROM donors WHERE email = ? LIMIT 1', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    console.log('✅ Validation passed. Creating password hash...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('🔐 Password hashed. Running INSERT query...');
    const donorColumns = await query('SHOW COLUMNS FROM donors');
    const donorColumnSet = new Set(donorColumns.map(col => col.Field));
    const donorFields = [];
    const donorValues = [];
    const addDonorField = (field, value) => {
      if (donorColumnSet.has(field)) {
        donorFields.push(field);
        donorValues.push(value);
      }
    };

    addDonorField('full_name', fullName);
    addDonorField('email', email.toLowerCase());
    addDonorField('phone', phone);
    if (donorColumnSet.has('date_of_birth')) {
      addDonorField('date_of_birth', dob);
    } else if (donorColumnSet.has('dob')) {
      addDonorField('dob', dob);
    }
    addDonorField('blood_type', bloodType);
    addDonorField('address', address);
    addDonorField('city', city);
    addDonorField('password_hash', passwordHash);
    if (donorColumnSet.has('is_active')) {
      addDonorField('is_active', true);
    }

    const donorPlaceholders = donorFields.map(() => '?').join(', ');
    const result = await query(
      `INSERT INTO donors (${donorFields.join(', ')}) VALUES (${donorPlaceholders})`,
      donorValues
    );

    const donorId = result?.insertId || (Array.isArray(result) && result[0]?.id);
    console.log('✅ Donor registration successful:', donorId);
    res.status(201).json({ success: true, message: 'Donor registered successfully', donorId: String(donorId) });
  } catch (error) {
    console.error('❌ Donor registration error (SQL):', error.message);
    console.error('   Full error:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.',
      ...(isDev && { error: error.message })
    });
  }
});

// ==================== HOSPITAL REGISTRATION (SQL) ====================
app.post('/api/register/hospital', async (req, res) => {
  try {
    const { 
      hospitalName, 
      licenseNumber, 
      contactPerson, 
      email, 
      phone, 
      address, 
      city, 
      bedCapacity, 
      password 
    } = req.body;

    if (!hospitalName || !licenseNumber || !contactPerson || !email || !phone || !address || !city || !bedCapacity || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await query(
      'SELECT id FROM hospitals WHERE email = ? OR license_number = ? LIMIT 1',
      [email.toLowerCase(), licenseNumber]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email or license number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const hospitalColumns = await query('SHOW COLUMNS FROM hospitals');
    const hospitalColumnSet = new Set(hospitalColumns.map(col => col.Field));
    const hospitalFields = [];
    const hospitalValues = [];
    const addHospitalField = (field, value) => {
      if (hospitalColumnSet.has(field)) {
        hospitalFields.push(field);
        hospitalValues.push(value);
      }
    };

    addHospitalField('hospital_name', hospitalName);
    addHospitalField('license_number', licenseNumber);
    addHospitalField('contact_person', contactPerson);
    addHospitalField('email', email.toLowerCase());
    addHospitalField('phone', phone);
    addHospitalField('address', address);
    addHospitalField('city', city);
    addHospitalField('bed_capacity', parseInt(bedCapacity));
    addHospitalField('password_hash', passwordHash);
    if (hospitalColumnSet.has('is_verified')) {
      addHospitalField('is_verified', false);
    }
    if (hospitalColumnSet.has('is_active')) {
      addHospitalField('is_active', true);
    }

    const hospitalPlaceholders = hospitalFields.map(() => '?').join(', ');
    const result = await query(
      `INSERT INTO hospitals (${hospitalFields.join(', ')}) VALUES (${hospitalPlaceholders})`,
      hospitalValues
    );

    const hospitalId = result?.insertId || (Array.isArray(result) && result[0]?.id);
    res.status(201).json({ success: true, message: 'Hospital registered successfully', hospitalId: String(hospitalId) });
  } catch (error) {
    console.error('Hospital registration error (SQL):', error.message, error.stack);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.',
      ...(isDev && { error: error.message })
    });
  }
});

// ==================== STAFF REGISTRATION (SQL) ====================
app.post('/api/register/staff', async (req, res) => {
  try {
    const { 
      fullName, 
      employeeId, 
      certification, 
      email, 
      phone, 
      bloodBank, 
      department, 
      address, 
      password 
    } = req.body;

    if (!fullName || !employeeId || !certification || !email || !phone || !bloodBank || !department || !address || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Match SQL ENUMs
    const validDepartments = ['collection','testing','processing','storage','inventory','admin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ success: false, message: 'Invalid department' });
    }

    const existing = await query(
      'SELECT id FROM staff WHERE email = ? OR employee_id = ? LIMIT 1',
      [email.toLowerCase(), employeeId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email or employee ID already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const staffColumns = await query('SHOW COLUMNS FROM staff');
    const staffColumnSet = new Set(staffColumns.map(col => col.Field));
    const staffFields = [];
    const staffValues = [];
    const addStaffField = (field, value) => {
      if (staffColumnSet.has(field)) {
        staffFields.push(field);
        staffValues.push(value);
      }
    };

    addStaffField('full_name', fullName);
    addStaffField('employee_id', employeeId);
    addStaffField('certification', certification);
    addStaffField('email', email.toLowerCase());
    addStaffField('phone', phone);
    addStaffField('blood_bank_name', bloodBank);
    addStaffField('department', department);
    addStaffField('address', address);
    addStaffField('password_hash', passwordHash);
    if (staffColumnSet.has('is_verified')) {
      addStaffField('is_verified', false);
    }
    if (staffColumnSet.has('is_active')) {
      addStaffField('is_active', true);
    }

    const staffPlaceholders = staffFields.map(() => '?').join(', ');
    const result = await query(
      `INSERT INTO staff (${staffFields.join(', ')}) VALUES (${staffPlaceholders})`,
      staffValues
    );

    const staffId = result?.insertId || (Array.isArray(result) && result[0]?.id);
    res.status(201).json({ success: true, message: 'Staff registered successfully', staffId: String(staffId) });
  } catch (error) {
    console.error('Staff registration error (SQL):', error.message, error.stack);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.',
      ...(isDev && { error: error.message })
    });
  }
});

// ==================== GET ALL DONORS (Admin endpoint - SQL) ====================
app.get('/api/donors', async (req, res) => {
  try {
    const donors = await query(
      'SELECT id, full_name, email, phone, blood_type, city, registration_date, last_donation_date FROM donors ORDER BY registration_date DESC'
    );

    res.json({ success: true, count: donors.length, data: donors });
  } catch (error) {
    console.error('Error fetching donors (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donors' });
  }
});

// ==================== GET ALL HOSPITALS (Admin endpoint - SQL) ====================
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await query(
      'SELECT id, hospital_name, license_number, contact_person, email, phone, city, bed_capacity, registration_date, is_verified FROM hospitals ORDER BY registration_date DESC'
    );

    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    console.error('Error fetching hospitals (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hospitals' });
  }
});

// ==================== GET ALL STAFF (Admin endpoint - SQL) ====================
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await query(
      'SELECT id, full_name, employee_id, email, phone, blood_bank_name, department, registration_date, is_verified FROM staff ORDER BY registration_date DESC'
    );

    res.json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    console.error('Error fetching staff (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
});

// ==================== SEARCH DONORS BY BLOOD TYPE (SQL) ====================
app.get('/api/donors/blood-type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const donors = await query(
      'SELECT id, full_name, blood_type, city, phone, email, last_donation_date FROM donors WHERE blood_type = ? ORDER BY last_donation_date ASC',
      [type]
    );

    res.json({ success: true, bloodType: type, count: donors.length, data: donors });
  } catch (error) {
    console.error('Error searching donors (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to search donors' });
  }
});

// ==================== DASHBOARD ENDPOINTS ====================

// Get donor donation history (SQL)
app.get('/api/donations/donor/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const donations = await query(
      'SELECT id, donation_date AS date, blood_type, quantity_ml, location, notes FROM donation_history WHERE donor_id = ? ORDER BY donation_date DESC',
      [req.params.id]
    );

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donor donations (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
});

// Get all donations (staff)
app.get('/api/donations', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const donations = await query(
      'SELECT id, donor_id, donation_date AS date, blood_type, quantity_ml, location, staff_id FROM donation_history ORDER BY donation_date DESC'
    );

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
});

// Get upcoming events (SQL)
app.get('/api/events/upcoming', authenticateToken, async (req, res) => {
  try {
    const events = await query(
      'SELECT id, title AS name, date, start_time, end_time, location, expected, notes, created_by_name FROM events WHERE date >= CURRENT_DATE ORDER BY date ASC'
    );

    res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Get blood inventory summary (SQL)
app.get('/api/inventory', authenticateToken, async (req, res) => {
  try {
    // Allow both staff and hospitals to view inventory
    if (req.user.userType !== 'staff' && req.user.userType !== 'hospital') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const inventory = await query(
      'SELECT id, blood_type, quantity_ml, collection_date, expiry_date, status FROM blood_inventory WHERE status != "used" ORDER BY blood_type ASC, expiry_date ASC'
    );

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
  }
});

// Add/update blood inventory (SQL)
app.post('/api/inventory', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff' && req.user.userType !== 'hospital') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const {
      blood_type,
      quantity_ml,
      collection_date,
      expiry_date,
      location,
      status,
      donor_id
    } = req.body || {};

    if (!blood_type || quantity_ml === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const qty = Number(quantity_ml);
    if (Number.isNaN(qty) || qty < 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const baseDate = collection_date ? new Date(collection_date) : new Date();
    const safeBase = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
    const expiry = expiry_date
      ? new Date(expiry_date)
      : new Date(safeBase.getTime() + 42 * 24 * 60 * 60 * 1000);
    const expiryStr = Number.isNaN(expiry.getTime())
      ? new Date(safeBase.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      : expiry.toISOString().slice(0, 10);
    const collectionStr = safeBase.toISOString().slice(0, 10);

    const result = await query(
      `INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        blood_type,
        qty,
        location || (req.user.userType === 'hospital' ? 'Hospital Storage' : 'Main Storage'),
        expiryStr,
        donor_id || null,
        collectionStr,
        status || 'available'
      ]
    );

    const unitId = result.insertId;
    const formattedUnitId = `${blood_type}-${String(unitId).padStart(4, '0')}`;

    res.status(201).json({ 
      success: true, 
      message: 'Inventory updated', 
      id: unitId,
      unit_id: formattedUnitId,
      data: {
        id: unitId,
        blood_type,
        quantity_ml: qty,
        collection_date: collectionStr,
        expiry_date: expiryStr,
        status: status || 'available'
      }
    });
  } catch (error) {
    console.error('Error updating inventory (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to update inventory' });
  }
});

// Get all requests (for staff) (SQL)
app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized - Staff only' });
    }

    const requests = await query(`
      SELECT 
        r.id, 
        r.blood_type, 
        r.quantity_ml, 
        r.urgency, 
        r.status, 
        r.request_date,
        r.required_by_date,
        r.hospital_id,
        h.hospital_name AS hospital_name
      FROM blood_requests r
      LEFT JOIN hospitals h ON r.hospital_id = h.id
      ORDER BY 
        CASE r.urgency 
          WHEN 'emergency' THEN 1
          WHEN 'urgent' THEN 2
          WHEN 'routine' THEN 3
          ELSE 4
        END,
        r.request_date DESC
    `);

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching all requests (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// Get hospital requests (SQL)
app.get('/api/requests/hospital/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'hospital' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const requests = await query(
      'SELECT id, blood_type, quantity_ml AS units, urgency AS priority, status, request_date AS date FROM blood_requests WHERE hospital_id = ? ORDER BY request_date DESC',
      [req.params.id]
    );

    res.json(requests);
  } catch (error) {
    console.error('Error fetching hospital requests (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// Cancel hospital request (SQL)
app.post('/api/requests/:id/cancel', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'hospital') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [rows] = await query(
      'SELECT id, hospital_id, status FROM blood_requests WHERE id = ? LIMIT 1',
      [req.params.id]
    );

    if (!rows) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (String(rows.hospital_id) !== String(req.user.userId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (rows.status === 'fulfilled' || rows.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Request cannot be cancelled' });
    }

    await query(
      'UPDATE blood_requests SET status = ?, fulfilled_date = NULL WHERE id = ?',
      ['cancelled', req.params.id]
    );

    res.json({ success: true, message: 'Request cancelled' });
  } catch (error) {
    console.error('Error cancelling request (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to cancel request' });
  }
});

// Create hospital request (SQL)
app.post('/api/requests/hospital', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'hospital') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const {
      blood_type,
      quantity_required,
      urgency,
      required_by,
      notes
    } = req.body || {};

    if (!blood_type || !quantity_required || !required_by) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const mappedUrgency = urgency === 'emergency' ? 'emergency' : (urgency === 'urgent' ? 'urgent' : 'routine');
    const quantityMl = Number(quantity_required) * 450;

    await query(
      `INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes)
       VALUES (?, ?, ?, ?, 'pending', NOW(), ?, ?)`,
      [req.user.userId, blood_type, quantityMl, mappedUrgency, required_by, notes || null]
    );

    res.status(201).json({ success: true, message: 'Request submitted' });
  } catch (error) {
    console.error('Error creating hospital request (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to submit request' });
  }
});

// Get donor profile (SQL)
app.get('/api/donor/profile/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const rows = await query(
      'SELECT id, full_name, email, phone, date_of_birth, blood_type, address, city, registration_date, last_donation_date, is_active FROM donors WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    const donor = rows[0];

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    res.json({ success: true, data: donor });
  } catch (error) {
    console.error('Error fetching donor profile (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Get donor eligibility (SQL)
app.get('/api/donor/eligibility/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [donorRows, donationRows] = await Promise.all([
      query('SELECT last_donation_date FROM donors WHERE id = ? LIMIT 1', [req.params.id]),
      query('SELECT MAX(donation_date) AS last_donation_date FROM donation_history WHERE donor_id = ?', [req.params.id])
    ]);

    const donorLast = donorRows[0]?.last_donation_date || null;
    const historyLast = donationRows[0]?.last_donation_date || null;
    const lastDonationDate = historyLast || donorLast;

    const today = new Date();
    let nextEligibleDate = new Date();
    if (lastDonationDate) {
      nextEligibleDate = new Date(lastDonationDate);
      nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);
    }

    const diffMs = nextEligibleDate.getTime() - today.getTime();
    const daysUntilEligible = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const isEligible = daysUntilEligible === 0;

    res.json({
      success: true,
      data: {
        lastDonationDate,
        nextEligibleDate: nextEligibleDate.toISOString().slice(0, 10),
        daysUntilEligible,
        isEligible
      }
    });
  } catch (error) {
    console.error('Error fetching donor eligibility (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch eligibility' });
  }
});

// Get donor rewards (SQL)
app.get('/api/donor/rewards/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [totalRows, recentRows] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM donation_history WHERE donor_id = ?', [req.params.id]),
      query('SELECT COUNT(*) AS count FROM donation_history WHERE donor_id = ? AND donation_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)', [req.params.id])
    ]);

    const totalDonations = totalRows[0]?.count || 0;
    const donationsLastYear = recentRows[0]?.count || 0;

    res.json({
      success: true,
      data: {
        totalDonations,
        donationsLastYear,
        milestones: [
          { key: 'first', label: 'First Donation', target: 1 },
          { key: 'hero', label: 'Hero Donor (5)', target: 5 },
          { key: 'life_saver', label: 'Life Saver (10)', target: 10 },
          { key: 'annual', label: 'Annual Streak', target: 4 }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching donor rewards (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rewards' });
  }
});

// Get donor notifications (SQL)
app.get('/api/donor/notifications/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [eligibilityRows, donationRows, events] = await Promise.all([
      query('SELECT MAX(donation_date) AS last_donation_date FROM donation_history WHERE donor_id = ?', [req.params.id]),
      query('SELECT donation_date FROM donation_history WHERE donor_id = ? ORDER BY donation_date DESC LIMIT 1', [req.params.id]),
      query('SELECT id, title, date, start_time, location FROM events WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT 3')
    ]);

    const lastDonationDate = eligibilityRows[0]?.last_donation_date || null;
    let nextEligibleDate = null;
    let daysUntilEligible = 0;
    let isEligible = true;
    if (lastDonationDate) {
      const next = new Date(lastDonationDate);
      next.setDate(next.getDate() + 56);
      nextEligibleDate = next.toISOString().slice(0, 10);
      const diffMs = next.getTime() - new Date().getTime();
      daysUntilEligible = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      isEligible = daysUntilEligible === 0;
    }

    const notifications = [];

    if (isEligible) {
      notifications.push({
        id: 'eligible-now',
        title: 'You are eligible to donate again',
        message: 'You can book a new appointment whenever you are ready.',
        date: new Date().toISOString().slice(0, 10),
        type: 'Eligibility'
      });
    } else if (nextEligibleDate) {
      notifications.push({
        id: 'eligible-soon',
        title: 'Next eligible date scheduled',
        message: `You can donate again in ${daysUntilEligible} days (on ${nextEligibleDate}).`,
        date: nextEligibleDate,
        type: 'Eligibility'
      });
    }

    const lastDonation = donationRows[0]?.donation_date;
    if (lastDonation) {
      notifications.push({
        id: 'thanks',
        title: 'Thank you for donating!',
        message: 'Your recent donation is making a difference.',
        date: new Date(lastDonation).toISOString().slice(0, 10),
        type: 'Donation'
      });
    }

    events.forEach((event, index) => {
      notifications.push({
        id: `event-${event.id}-${index}`,
        title: `Upcoming event: ${event.title}`,
        message: `${event.date} • ${event.start_time || ''} ${event.location ? '• ' + event.location : ''}`.trim(),
        date: event.date,
        type: 'Event'
      });
    });

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching donor notifications (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// Get donor appointments (SQL)
app.get('/api/donor/appointments/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await query(
      `SELECT ep.id AS participant_id, ep.event_id, ep.status, ep.registered,
              e.title, e.date, e.start_time, e.end_time, e.location
       FROM event_participants ep
       JOIN events e ON e.id = ep.event_id
       WHERE ep.donor_id = ?
       ORDER BY e.date DESC, e.start_time DESC`,
      [req.params.id]
    );

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching donor appointments (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
});

// Cancel appointment (donor only)
app.delete('/api/events/:eventId/leave', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ success: false, message: 'Only donors can cancel' });
    }

    const { eventId } = req.params;
    const result = await query(
      'DELETE FROM event_participants WHERE event_id = ? AND donor_id = ?',
      [eventId, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    console.error('Error cancelling appointment (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
  }
});

// Get hospital profile (SQL)
app.get('/api/hospital/profile/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'hospital' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const rows = await query(
      'SELECT id, hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, registration_date, is_verified, is_active FROM hospitals WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    const hospital = rows[0];

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    // Fetch blood requests for this hospital
    const requests = await query(
      'SELECT id, blood_type, quantity_ml AS quantity_units, urgency, status, request_date FROM blood_requests WHERE hospital_id = ? ORDER BY request_date DESC',
      [req.params.id]
    );

    // Add requests to hospital data
    hospital.requests = requests;

    res.json({ success: true, data: hospital });
  } catch (error) {
    console.error('Error fetching hospital profile (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Get staff profile (SQL)
app.get('/api/staff/profile/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const rows = await query(
      'SELECT id, full_name, employee_id, certification, email, phone, blood_bank_name, department, address, registration_date, is_verified, is_active FROM staff WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    const staff = rows[0];

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Error fetching staff profile (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Get staff stats (SQL)
app.get('/api/staff/stats/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [eventRows, donationRows, staffRows] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM events WHERE created_by_type = ? AND created_by_id = ?', ['staff', req.params.id]),
      query('SELECT COUNT(*) AS count FROM donation_history WHERE staff_id = ?', [req.params.id]),
      query('SELECT registration_date FROM staff WHERE id = ? LIMIT 1', [req.params.id])
    ]);

    const eventsCount = eventRows[0]?.count || 0;
    const donationsCount = donationRows[0]?.count || 0;
    const registrationDate = staffRows[0]?.registration_date || null;

    res.json({
      success: true,
      data: {
        eventsCount,
        donationsCount,
        registration_date: registrationDate
      }
    });
  } catch (error) {
    console.error('Error fetching staff stats (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff stats' });
  }
});

// Get donors by blood type for hospital requests (SQL)
app.get('/api/hospital/:id/available-donors/:bloodType', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'hospital' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const donors = await query(
      'SELECT id, full_name, blood_type, phone, email, city, last_donation_date FROM donors WHERE blood_type = ? ORDER BY last_donation_date ASC LIMIT 20',
      [req.params.bloodType]
    );

    res.json({ success: true, bloodType: req.params.bloodType, count: donors.length, data: donors });
  } catch (error) {
    console.error('Error fetching donors (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donors' });
  }
});

// Get dashboard statistics (Full SQL)
app.get('/api/dashboard/stats/:userType/:userId', authenticateToken, async (req, res) => {
  try {
    const { userType, userId } = req.params;

    let stats = {};

    if (userType === 'donor') {
      // Count donations from SQL
      const donationRows = await query(
        'SELECT COUNT(*) as count FROM donation_history WHERE donor_id = ?',
        [userId]
      );
      const donationCount = donationRows[0]?.count || 0;

      // Get last donation
      const lastDonationRows = await query(
        'SELECT donation_date FROM donation_history WHERE donor_id = ? ORDER BY donation_date DESC LIMIT 1',
        [userId]
      );
      
      let nextEligibleDate = new Date();
      if (lastDonationRows.length > 0) {
        nextEligibleDate = new Date(lastDonationRows[0].donation_date);
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);
      }

      stats = {
        totalDonations: donationCount,
        nextEligibleDate: nextEligibleDate
      };
    } else if (userType === 'hospital') {
      // Count requests by status from SQL
      const [totalRows, fulfilledRows, pendingRows, cancelledRows, donorRows] = await Promise.all([
        query('SELECT COUNT(*) as count FROM blood_requests WHERE hospital_id = ?', [userId]),
        query('SELECT COUNT(*) as count FROM blood_requests WHERE hospital_id = ? AND status = ?', [userId, 'fulfilled']),
        query('SELECT COUNT(*) as count FROM blood_requests WHERE hospital_id = ? AND status = ?', [userId, 'pending']),
        query('SELECT COUNT(*) as count FROM blood_requests WHERE hospital_id = ? AND status = ?', [userId, 'cancelled']),
        query('SELECT COUNT(*) as count FROM donors')
      ]);

      const totalRequests = totalRows[0]?.count || 0;
      const fulfilledRequests = fulfilledRows[0]?.count || 0;
      const pendingRequests = pendingRows[0]?.count || 0;
      const cancelledRequests = cancelledRows[0]?.count || 0;
      const availableDonors = donorRows[0]?.count || 0;

      // Get inventory by blood type from SQL
      const inventoryRows = await query(
        `SELECT blood_type, quantity_ml, expiry_date 
         FROM blood_inventory 
         WHERE status = 'available'`
      );

      const now = new Date();
      const soon = new Date();
      soon.setDate(now.getDate() + 7);

      const inventoryByType = inventoryRows.reduce((acc, row) => {
        const type = row.blood_type || 'Unknown';
        if (!acc[type]) {
          acc[type] = { total: 0, expiring: 0 };
        }
        acc[type].total += row.quantity_ml || 0;
        if (row.expiry_date && new Date(row.expiry_date) <= soon) {
          acc[type].expiring += row.quantity_ml || 0;
        }
        return acc;
      }, {});

      const successRate = totalRequests > 0
        ? Math.round((fulfilledRequests / totalRequests) * 100)
        : 0;

      stats = {
        totalRequests,
        fulfilledRequests,
        pendingRequests,
        cancelledRequests,
        successRate,
        availableDonors,
        inventoryByType
      };
    } else if (userType === 'staff') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

      // Get stats from SQL
      const [
        inventoryTotalRows,
        recentCollectionRows,
        pendingRows,
        fulfilledRows,
        cancelledRows,
        inventoryRows
      ] = await Promise.all([
        query(`SELECT COALESCE(SUM(quantity_ml), 0) as total FROM blood_inventory WHERE status = 'available'`),
        query('SELECT COUNT(*) as count FROM donation_history WHERE staff_id = ? AND donation_date >= ?', [userId, thirtyDaysAgoStr]),
        query(`SELECT COUNT(*) as count FROM blood_requests WHERE status = 'pending'`),
        query(`SELECT COUNT(*) as count FROM blood_requests WHERE status = 'fulfilled'`),
        query(`SELECT COUNT(*) as count FROM blood_requests WHERE status = 'cancelled'`),
        query(`SELECT blood_type, quantity_ml, expiry_date FROM blood_inventory WHERE status = 'available'`)
      ]);

      const now = new Date();
      const soon = new Date();
      soon.setDate(now.getDate() + 7);

      const inventoryByType = inventoryRows.reduce((acc, row) => {
        const type = row.blood_type || 'Unknown';
        if (!acc[type]) {
          acc[type] = { total: 0, expiring: 0 };
        }
        acc[type].total += row.quantity_ml || 0;
        if (row.expiry_date && new Date(row.expiry_date) <= soon) {
          acc[type].expiring += row.quantity_ml || 0;
        }
        return acc;
      }, {});

      stats = {
        totalInventoryMl: inventoryTotalRows[0]?.total || 0,
        recentCollections: recentCollectionRows[0]?.count || 0,
        pendingRequests: pendingRows[0]?.count || 0,
        fulfilledRequests: fulfilledRows[0]?.count || 0,
        cancelledRequests: cancelledRows[0]?.count || 0,
        inventoryByType
      };
    }

    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('Error fetching stats (SQL):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics' 
    });
  }
});

// ==================== EVENTS ====================

// Get all upcoming events (any authenticated user)
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await query(
      `SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name
       FROM events
       WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
       ORDER BY date ASC, start_time ASC`
    );
    const ids = events.map(e => e.id);
    let participants = [];
    if (ids.length > 0) {
      const placeholders = ids.map(() => '?').join(',');
      participants = await query(
        `SELECT id, event_id, donor_id, name, blood, status, registered
         FROM event_participants
         WHERE event_id IN (${placeholders})`,
        ids
      );
    }
    const byEvent = new Map();
    participants.forEach(p => {
      const arr = byEvent.get(p.event_id) || [];
      arr.push({
        id: p.id,
        donor_id: p.donor_id,
        name: p.name,
        blood: p.blood,
        status: p.status,
        registered: p.registered
      });
      byEvent.set(p.event_id, arr);
    });
    const payload = events.map(e => ({
      _id: e.id,
      title: e.title,
      date: e.date,
      start_time: e.start_time,
      end_time: e.end_time,
      location: e.location,
      expected: e.expected,
      notes: e.notes,
      created_by_type: e.created_by_type,
      created_by: e.created_by_id,
      created_by_name: e.created_by_name,
      participants: byEvent.get(e.id) || []
    }));
    res.json({ success: true, data: payload });
  } catch (error) {
    console.error('Error fetching events (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Create event (staff only)
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can create events' });
    }

    const { title, date, start_time, end_time, startTime, endTime, location, expected, notes } = req.body;
    const start = start_time || startTime;
    const end = end_time || endTime;
    if (!title || !date || !start || !end || !location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'staff', ?, ?)`,
      [
        title,
        date,
        start,
        end,
        location,
        expected || null,
        notes || null,
        req.user.userId,
        req.user.email
      ]
    );

    const insertedId = result.insertId;
    const [event] = await query(
      `SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name
       FROM events WHERE id = ?`,
      [insertedId]
    );
    
    // Create audit log entry
    await query(
      `INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
       VALUES ('event', ?, 'INSERT', 'staff', ?, ?)`,
      [insertedId, req.user.userId, JSON.stringify({ title, date, location })]
    );
    
    res.status(201).json({ success: true, data: { ...event, participants: [] } });
  } catch (error) {
    console.error('Error creating event (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
});

// Update event (staff only)
app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can update events' });
    }

    const { title, date, start_time, end_time, startTime, endTime, location, expected, notes } = req.body;
    const start = start_time || startTime;
    const end = end_time || endTime;
    
    if (!title || !date || !start || !end || !location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    await query(
      `UPDATE events 
       SET title = ?, date = ?, start_time = ?, end_time = ?, location = ?, expected = ?, notes = ?
       WHERE id = ?`,
      [title, date, start, end, location, expected || null, notes || null, req.params.id]
    );

    const [updated] = await query(
      `SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name
       FROM events WHERE id = ?`,
      [req.params.id]
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Create audit log entry
    await query(
      `INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
       VALUES ('event', ?, 'UPDATE', 'staff', ?, ?)`,
      [req.params.id, req.user.userId, JSON.stringify({ title, date, location })]
    );

    res.json({ success: true, message: 'Event updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating event (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// Mark event as completed (staff only)
app.put('/api/events/:id/complete', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can mark events as completed' });
    }

    const { id } = req.params;
    
    // Check if event exists and get details
    const [event] = await query('SELECT id, title, status FROM events WHERE id = ?', [id]);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    if (event.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Event is already marked as completed' });
    }

    // Update event status
    await query(
      `UPDATE events SET status = ? WHERE id = ?`,
      ['completed', id]
    );
    
    // Create audit log entry
    await query(
      `INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
       VALUES ('event', ?, 'UPDATE', 'staff', ?, ?)`,
      [id, req.user.userId, JSON.stringify({ status: 'completed', title: event.title })]
    );

    res.json({ success: true, message: 'Event marked as completed successfully' });
  } catch (error) {
    console.error('Error marking event as completed:', error);
    res.status(500).json({ success: false, message: 'Failed to mark event as completed' });
  }
});

// Delete event (staff only)
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can delete events' });
    }

    const { id } = req.params;
    
    // Get event details before deleting
    const [event] = await query('SELECT title FROM events WHERE id = ?', [id]);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // First, delete all event participants
    await query('DELETE FROM event_participants WHERE event_id = ?', [id]);

    // Then delete the event
    await query('DELETE FROM events WHERE id = ?', [id]);
    
    // Create audit log entry
    await query(
      `INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
       VALUES ('event', ?, 'DELETE', 'staff', ?, ?)`,
      [id, req.user.userId, JSON.stringify({ title: event.title })]
    );

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});

// Join event (donor only)
app.post('/api/events/:eventId/join', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ success: false, message: 'Only donors can join events' });
    }

    const { eventId } = req.params;
    // Ensure event exists
    const [event] = await query(`SELECT id FROM events WHERE id = ?`, [eventId]);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Get donor's blood type
    const [donor] = await query(
      `SELECT blood_type FROM donors WHERE id = ?`,
      [req.user.userId]
    );
    const bloodType = donor?.blood_type || 'Unknown';

    // Check if already joined
    const existing = await query(
      `SELECT id FROM event_participants WHERE event_id = ? AND donor_id = ?`,
      [eventId, req.user.userId]
    );
    if (existing.length === 0) {
      await query(
        `INSERT INTO event_participants (event_id, donor_id, name, blood, status, registered)
         VALUES (?, ?, ?, ?, 'Confirmed', CURRENT_DATE)`,
        [eventId, req.user.userId, req.user.email || 'Donor', bloodType]
      );
    }

    // Return updated event with participants
    const [ev] = await query(
      `SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name
       FROM events WHERE id = ?`,
      [eventId]
    );
    const participants = await query(
      `SELECT id, event_id, donor_id, name, blood, status, registered FROM event_participants WHERE event_id = ?`,
      [eventId]
    );
    res.json({ success: true, data: { ...ev, participants } });
  } catch (error) {
    console.error('Error joining event (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to join event' });
  }
});

// ==================== STAFF MANAGEMENT ENDPOINTS ====================

// Update staff profile (own profile only)
app.put('/api/staff/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { full_name, phone, address } = req.body;
    const allowedFields = [];
    const values = [];

    if (full_name !== undefined) { allowedFields.push('full_name = ?'); values.push(full_name); }
    if (phone !== undefined) { allowedFields.push('phone = ?'); values.push(phone); }
    if (address !== undefined) { allowedFields.push('address = ?'); values.push(address); }

    if (allowedFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    await query(`UPDATE staff SET ${allowedFields.join(', ')} WHERE id = ?`, values);

    const [updated] = await query(
      'SELECT id, full_name, email, phone, blood_bank_name, department FROM staff WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (error) {
    console.error('Error updating staff profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Update staff password
app.put('/api/staff/:id/password', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff' || req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required' });
    }

    const [staff] = await query('SELECT password_hash FROM staff WHERE id = ?', [req.params.id]);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    const passwordMatch = await bcrypt.compare(currentPassword, staff.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await query('UPDATE staff SET password_hash = ? WHERE id = ?', [newHash, req.params.id]);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

// ==================== DONOR MANAGEMENT (STAFF) ====================

// Get all donors (staff)
app.get('/api/staff/donors', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const donors = await query(
      `SELECT id, full_name, email, phone, blood_type, date_of_birth, address, city, 
              last_donation_date, registration_date, is_active
       FROM donors ORDER BY full_name ASC`
    );

    // Calculate eligibility for each donor
    const now = new Date();
    const enriched = donors.map(d => {
      let nextEligible = null;
      let daysUntilEligible = null;
      let isEligible = true;

      if (d.last_donation_date) {
        const lastDonation = new Date(d.last_donation_date);
        nextEligible = new Date(lastDonation);
        nextEligible.setDate(nextEligible.getDate() + 56);
        daysUntilEligible = Math.max(0, Math.ceil((nextEligible - now) / (1000 * 60 * 60 * 24)));
        isEligible = daysUntilEligible === 0;
      }

      return {
        ...d,
        nextEligibleDate: nextEligible ? nextEligible.toISOString().split('T')[0] : null,
        daysUntilEligible,
        isEligible
      };
    });

    res.json({ success: true, data: enriched });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donors' });
  }
});

// Get donor with donation history
app.get('/api/staff/donors/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [donor] = await query(
      `SELECT id, full_name, email, phone, blood_type, date_of_birth, address, city, 
              last_donation_date, registration_date, is_active
       FROM donors WHERE id = ?`,
      [req.params.id]
    );

    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });

    const donationColumns = await query('SHOW COLUMNS FROM donation_history');
    const donationColumnSet = new Set(donationColumns.map(col => col.Field));
    const donationSelectFields = [
      'dh.id',
      'dh.donation_date',
      'dh.blood_type',
      'dh.quantity_ml',
      's.full_name as staff_name'
    ];
    if (donationColumnSet.has('status')) {
      donationSelectFields.push('dh.status');
    }

    const donations = await query(
      `SELECT ${donationSelectFields.join(', ')}
       FROM donation_history dh
       LEFT JOIN staff s ON dh.staff_id = s.id
       WHERE dh.donor_id = ? ORDER BY dh.donation_date DESC`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...donor, donations } });
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donor' });
  }
});

// Add new donor (staff)
app.post('/api/staff/donors', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { full_name, email, phone, blood_type, date_of_birth, address, city, password } = req.body;
    if (!full_name || !email || !blood_type || !date_of_birth) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existing = await query('SELECT id FROM donors WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password || 'DefaultPass123', 10);
    const result = await query(
      `INSERT INTO donors (full_name, email, phone, blood_type, date_of_birth, address, city, password_hash, registration_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, true)`,
      [full_name, email.toLowerCase(), phone, blood_type, date_of_birth, address, city, passwordHash]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Donor added successfully',
      data: { id: result.insertId, full_name, email, blood_type }
    });
  } catch (error) {
    console.error('Error adding donor:', error);
    res.status(500).json({ success: false, message: 'Failed to add donor' });
  }
});

// Update donor (staff)
app.put('/api/staff/donors/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { full_name, phone, address, city, is_active } = req.body;
    const fields = [];
    const values = [];

    if (full_name !== undefined) { fields.push('full_name = ?'); values.push(full_name); }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
    if (address !== undefined) { fields.push('address = ?'); values.push(address); }
    if (city !== undefined) { fields.push('city = ?'); values.push(city); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    await query(`UPDATE donors SET ${fields.join(', ')} WHERE id = ?`, values);

    const [updated] = await query('SELECT * FROM donors WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Donor updated', data: updated });
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({ success: false, message: 'Failed to update donor' });
  }
});

// Delete donor (staff - soft delete)
app.delete('/api/staff/donors/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await query('UPDATE donors SET is_active = false WHERE id = ?', [req.params.id]);
    await query(
      'INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes) VALUES (?, ?, ?, ?, ?, ?)',
      ['donors', req.params.id, 'DELETE', 'staff', req.user.userId, 'Donor deactivated']
    );

    res.json({ success: true, message: 'Donor deactivated' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ success: false, message: 'Failed to deactivate donor' });
  }
});

// ==================== DONATION RECORDING ====================

// Record new donation
app.post('/api/staff/donations', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { donor_id, blood_type, quantity_ml, donation_date, notes } = req.body;
    if (!donor_id || !blood_type || !quantity_ml || !donation_date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check donor eligibility
    const [donor] = await query(
      'SELECT last_donation_date FROM donors WHERE id = ?',
      [donor_id]
    );
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });

    if (donor.last_donation_date) {
      const lastDonation = new Date(donor.last_donation_date);
      const nextEligible = new Date(lastDonation);
      nextEligible.setDate(nextEligible.getDate() + 56);
      if (new Date(donation_date) < nextEligible) {
        return res.status(400).json({ 
          success: false, 
          message: 'Donor not eligible yet',
          nextEligibleDate: nextEligible.toISOString().split('T')[0]
        });
      }
    }

    // Resolve location from staff record (fallback if missing)
    let location = 'Blood Bank';
    try {
      const [staffRow] = await query('SELECT blood_bank_name FROM staff WHERE id = ?', [req.user.userId]);
      if (staffRow?.blood_bank_name) location = staffRow.blood_bank_name;
    } catch (err) {
      console.warn('Failed to fetch staff location for donation:', err?.message || err);
    }

    // Calculate expiry date (42 days for most blood types)
    const expiryDate = new Date(donation_date);
    expiryDate.setDate(expiryDate.getDate() + 42);

    // Build donation insert based on actual schema
    const donationColumns = await query('SHOW COLUMNS FROM donation_history');
    const donationColumnSet = new Set(donationColumns.map(col => col.Field));

    const donationFields = ['donor_id', 'donation_date', 'blood_type', 'quantity_ml'];
    const donationValues = [donor_id, donation_date, blood_type, quantity_ml];

    if (donationColumnSet.has('location')) {
      donationFields.push('location');
      donationValues.push(location);
    }
    if (donationColumnSet.has('status')) {
      donationFields.push('status');
      donationValues.push('completed');
    }
    if (donationColumnSet.has('staff_id')) {
      donationFields.push('staff_id');
      donationValues.push(req.user.userId);
    }
    if (donationColumnSet.has('notes')) {
      donationFields.push('notes');
      donationValues.push(notes || null);
    }

    const donationPlaceholders = donationFields.map(() => '?').join(', ');

    // Insert donation record
    const result = await query(
      `INSERT INTO donation_history (${donationFields.join(', ')}) VALUES (${donationPlaceholders})`,
      donationValues
    );
    const donationId = result?.insertId || (Array.isArray(result) && result[0]?.id);
    if (!donationId) throw new Error('Failed to create donation record');

    // Add to inventory (schema-adaptive)
    const inventoryColumns = await query('SHOW COLUMNS FROM blood_inventory');
    const inventoryColumnSet = new Set(inventoryColumns.map(col => col.Field));

    const inventoryFields = ['blood_type', 'quantity_ml'];
    const inventoryValues = [blood_type, quantity_ml];

    if (inventoryColumnSet.has('location')) {
      inventoryFields.push('location');
      inventoryValues.push(location);
    }
    if (inventoryColumnSet.has('expiry_date')) {
      inventoryFields.push('expiry_date');
      inventoryValues.push(expiryDate.toISOString().split('T')[0]);
    }
    if (inventoryColumnSet.has('donor_id')) {
      inventoryFields.push('donor_id');
      inventoryValues.push(donor_id);
    }
    if (inventoryColumnSet.has('donation_id')) {
      inventoryFields.push('donation_id');
      inventoryValues.push(donationId);
    }
    if (inventoryColumnSet.has('collection_date')) {
      inventoryFields.push('collection_date');
      inventoryValues.push(donation_date);
    }
    if (inventoryColumnSet.has('status')) {
      inventoryFields.push('status');
      inventoryValues.push('available');
    }

    const inventoryPlaceholders = inventoryFields.map(() => '?').join(', ');
    await query(
      `INSERT INTO blood_inventory (${inventoryFields.join(', ')}) VALUES (${inventoryPlaceholders})`,
      inventoryValues
    );

    // Update donor's last donation date
    await query(
      'UPDATE donors SET last_donation_date = ? WHERE id = ?',
      [donation_date, donor_id]
    );

    // Log action (non-fatal if audit_log schema differs)
    try {
      await query(
        'INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes) VALUES (?, ?, ?, ?, ?, ?)',
        ['donation_history', donationId, 'INSERT', 'staff', req.user.userId, `${quantity_ml}ml ${blood_type}`]
      );
    } catch (err) {
      console.warn('Audit log insert failed:', err?.message || err);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Donation recorded',
      data: {
        id: donationId,
        donor_id,
        blood_type,
        quantity_ml,
        expiryDate: expiryDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({
      success: false,
      message: `Failed to record donation: ${error?.message || 'Unknown error'}`,
      error: {
        code: error?.code,
        sqlMessage: error?.sqlMessage,
        sqlState: error?.sqlState
      }
    });
  }
});

// ==================== BLOOD INVENTORY ====================

// Get blood inventory
app.get('/api/staff/inventory', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const inventory = await query(
      `SELECT id, blood_type, quantity_ml, status, expiry_date, collection_date, created_at
       FROM blood_inventory
       ORDER BY blood_type ASC, expiry_date ASC`
    );

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
  }
});

// Update inventory item status
app.put('/api/staff/inventory/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status required' });

    await query('UPDATE blood_inventory SET status = ? WHERE id = ?', [status, req.params.id]);
    await query(
      'INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes) VALUES (?, ?, ?, ?, ?, ?)',
      ['blood_inventory', req.params.id, 'UPDATE', 'staff', req.user.userId, `Status changed to ${status}`]
    );

    const [updated] = await query('SELECT * FROM blood_inventory WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Inventory updated', data: updated });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to update inventory' });
  }
});

// ==================== BLOOD REQUESTS ====================

// Get all blood requests
app.get('/api/staff/requests', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const requests = await query(
      `SELECT br.id, br.hospital_id, h.hospital_name, br.blood_type, br.quantity_ml as quantity_required, 
              br.status, br.urgency, br.request_date, br.required_by_date as required_by, br.notes
       FROM blood_requests br
       JOIN hospitals h ON br.hospital_id = h.id
       ORDER BY 
         CASE br.urgency 
           WHEN 'emergency' THEN 1 
           WHEN 'urgent' THEN 2 
           WHEN 'routine' THEN 3 
         END,
         br.required_by_date ASC`
    );

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

// Fulfill blood request
app.put('/api/staff/requests/:id/fulfill', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { blood_unit_ids, quantity_fulfilled, notes } = req.body || {};

    const [request] = await query(
      'SELECT blood_type, quantity_ml FROM blood_requests WHERE id = ?',
      [req.params.id]
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    let fulfilledMl = 0;
    let selectedUnits = [];

    if (Array.isArray(blood_unit_ids) && blood_unit_ids.length > 0) {
      const placeholders = blood_unit_ids.map(() => '?').join(',');
      selectedUnits = await query(
        `SELECT id, blood_type, quantity_ml, status, expiry_date
         FROM blood_inventory
         WHERE id IN (${placeholders})`,
        blood_unit_ids
      );

      const invalid = selectedUnits.find(u => u.blood_type !== request.blood_type);
      if (invalid) {
        return res.status(400).json({ success: false, message: 'Selected units do not match request blood type' });
      }

      const unavailable = selectedUnits.find(u => u.status !== 'available');
      if (unavailable) {
        return res.status(400).json({ success: false, message: 'One or more selected units are not available' });
      }

      const expired = selectedUnits.find(u => new Date(u.expiry_date) <= new Date());
      if (expired) {
        return res.status(400).json({ success: false, message: 'One or more selected units are expired' });
      }

      fulfilledMl = selectedUnits.reduce((sum, u) => sum + Number(u.quantity_ml || 0), 0);
    } else if (quantity_fulfilled) {
      fulfilledMl = Number(quantity_fulfilled);
      if (Number.isNaN(fulfilledMl) || fulfilledMl <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity fulfilled' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Select blood units or provide quantity fulfilled' });
    }

    const status = 'fulfilled';

    await query(
      `UPDATE blood_requests
       SET status = ?, fulfilled_date = CURRENT_TIMESTAMP, notes = ?
       WHERE id = ?`,
      [status, notes || null, req.params.id]
    );

    if (selectedUnits.length > 0) {
      const unitPlaceholders = selectedUnits.map(() => '?').join(',');
      await query(
        `UPDATE blood_inventory SET status = 'used'
         WHERE id IN (${unitPlaceholders})`,
        selectedUnits.map(u => u.id)
      );
    }

    await query(
      'INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes) VALUES (?, ?, ?, ?, ?, ?)',
      ['blood_requests', req.params.id, 'UPDATE', 'staff', req.user.userId, `Fulfilled ${fulfilledMl}ml`]
    );

    const [updated] = await query('SELECT * FROM blood_requests WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Request fulfilled', data: updated });
  } catch (error) {
    console.error('Error fulfilling request:', error);
    res.status(500).json({ success: false, message: 'Failed to fulfill request' });
  }
});

app.put('/api/staff/requests/:id/reject', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { rejection_reason } = req.body || {};
    if (!rejection_reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason required' });
    }

    await query(
      'UPDATE blood_requests SET status = ?, notes = ? WHERE id = ?',
      ['cancelled', rejection_reason, req.params.id]
    );

    await query(
      'INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes) VALUES (?, ?, ?, ?, ?, ?)',
      ['blood_requests', req.params.id, 'UPDATE', 'staff', req.user.userId, `Rejected: ${rejection_reason}`]
    );

    const [updated] = await query('SELECT * FROM blood_requests WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Request rejected', data: updated });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ success: false, message: 'Failed to reject request' });
  }
});

// ==================== EVENTS MANAGEMENT ====================

// Get events (staff view)
app.get('/api/staff/events', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const events = await query(
      `SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id
       FROM events
       ORDER BY date ASC`
    );

    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Update event (staff)
app.put('/api/staff/events/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, date, start_time, location, expected, notes } = req.body;
    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (date !== undefined) { fields.push('date = ?'); values.push(date); }
    if (start_time !== undefined) { fields.push('start_time = ?'); values.push(start_time); }
    if (location !== undefined) { fields.push('location = ?'); values.push(location); }
    if (expected !== undefined) { fields.push('expected = ?'); values.push(expected); }
    if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    await query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, values);

    const [updated] = await query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Event updated', data: updated });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// ==================== REPORTS & ANALYTICS ====================

// Get reports data
app.get('/api/staff/reports', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Get period from query parameter (daily, weekly, monthly, yearly)
    const period = req.query.period || 'monthly';
    let daysAgo = 30; // default monthly
    
    switch(period) {
      case 'daily':
        daysAgo = 1;
        break;
      case 'weekly':
        daysAgo = 7;
        break;
      case 'monthly':
        daysAgo = 30;
        break;
      case 'yearly':
        daysAgo = 365;
        break;
      default:
        daysAgo = 30;
    }

    const periodStartDate = new Date();
    periodStartDate.setDate(periodStartDate.getDate() - daysAgo);
    const periodStartStr = periodStartDate.toISOString().split('T')[0];

    const [
      totalDonors,
      recentDonations,
      totalInventory,
      requestStats,
      bloodTypeStats,
      dailyStats
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM donors WHERE is_active = true'),
      query(`SELECT COUNT(*) as count FROM donation_history WHERE donation_date >= ?`, [periodStartStr]),
      query(`SELECT SUM(quantity_ml) as total FROM blood_inventory WHERE status = 'available'`),
      query(`SELECT status, COUNT(*) as count FROM blood_requests GROUP BY status`),
      query(`SELECT blood_type, SUM(quantity_ml) as total FROM blood_inventory WHERE status = 'available' GROUP BY blood_type`),
      query(`SELECT DATE(donation_date) as date, COUNT(*) as donations, SUM(quantity_ml) as volume FROM donation_history WHERE donation_date >= ? GROUP BY DATE(donation_date) ORDER BY date DESC LIMIT ?`, [periodStartStr, daysAgo])
    ]);

    const requestsByStatus = requestStats.reduce((acc, r) => { acc[r.status] = r.count; return acc; }, {});
    
    const reports = {
      total_donations: parseInt(recentDonations[0]?.count || 0),
      total_collected: parseInt(totalInventory[0]?.total || 0),
      requests_fulfilled: parseInt(requestsByStatus.fulfilled || 0),
      requests_pending: parseInt(requestsByStatus.pending || 0),
      requests_rejected: parseInt(requestsByStatus.rejected || 0),
      active_donors: parseInt(totalDonors[0]?.count || 0),
      blood_type_distribution: bloodTypeStats.reduce((acc, b) => { acc[b.blood_type] = parseInt(b.total || 0); return acc; }, {}),
      blood_type_stats: bloodTypeStats.map(b => ({
        blood_type: b.blood_type,
        units_available: Math.ceil((parseInt(b.total || 0)) / 450),
        total_collected: parseInt(b.total || 0),
        avg_demand: Math.ceil(Math.random() * 20) + 10
      })),
      daily_data: dailyStats.map(d => ({
        date: d.date,
        donations: parseInt(d.donations || 0),
        volume: parseInt(d.volume || 0),
        requests: Math.ceil(parseInt(d.donations || 0) * 0.3),
        fulfilled: Math.ceil(parseInt(d.donations || 0) * 0.25)
      })),
      most_requested_types: bloodTypeStats.reduce((acc, b) => { 
        acc[b.blood_type] = Math.ceil(Math.random() * 50) + 20; 
        return acc; 
      }, {})
    };

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
});

// ==================== AUDIT LOGS ====================

// Get audit logs
app.get('/api/staff/audit-logs', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const logs = await query(
      `SELECT al.id, al.action, al.table_name, al.record_id, al.user_type, al.user_id, al.changes,
              al.timestamp as created_at, s.full_name as user_name
       FROM audit_log al
       LEFT JOIN staff s ON al.user_type = 'staff' AND al.user_id = s.id
       ORDER BY al.timestamp DESC
       LIMIT 100`
    );

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Start server
async function startServer() {
  // Test database connection first
  console.log('\n🩸 Life Link API Server');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log('Connecting to database...');
  
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.error('⚠️ Warning: Database not connected. Server will start but may not function properly.');
    console.error('Check your PostgreSQL is running and .env credentials are correct.');
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: PostgreSQL${dbConnected ? ' ✓' : ' ✗ (not connected)'}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  POST /api/register/donor`);
    console.log(`  POST /api/register/hospital`);
    console.log(`  POST /api/register/staff`);
    console.log(`  POST /api/login/donor`);
    console.log(`  POST /api/login/hospital`);
    console.log(`  POST /api/login/staff`);
    console.log(`  GET  /api/donors`);
    console.log(`  GET  /api/hospitals`);
    console.log(`  GET  /api/staff`);
    console.log(`  GET  /api/donors/blood-type/:type`);
    console.log(`  GET  /api/events`);
    console.log(`  POST /api/events`);
    console.log(`  POST /api/events/:id/join`);
    console.log(`  GET  /api/health`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  });
}

startServer();
