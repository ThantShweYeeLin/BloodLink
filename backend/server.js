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
    const result = await query('SELECT NOW() as current_time');
    console.log('✓ Database connected successfully');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
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
    message: 'BloodLink API is running',
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

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO donors (full_name, email, phone, date_of_birth, blood_type, address, city, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [fullName, email.toLowerCase(), phone, dob, bloodType, address, city, passwordHash]
    );

    res.status(201).json({ success: true, message: 'Donor registered successfully', donorId: String(result[0].id) });
  } catch (error) {
    console.error('Donor registration error (SQL):', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
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

    const result = await query(
      `INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [hospitalName, licenseNumber, contactPerson, email.toLowerCase(), phone, address, city, parseInt(bedCapacity), passwordHash]
    );

    res.status(201).json({ success: true, message: 'Hospital registered successfully', hospitalId: String(result[0].id) });
  } catch (error) {
    console.error('Hospital registration error (SQL):', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
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

    const result = await query(
      `INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [fullName, employeeId, certification, email.toLowerCase(), phone, bloodBank, department, address, passwordHash]
    );

    res.status(201).json({ success: true, message: 'Staff registered successfully', staffId: String(result[0].id) });
  } catch (error) {
    console.error('Staff registration error (SQL):', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
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
       WHERE date >= CURRENT_DATE - INTERVAL '1 day'
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

    const insertedId = result[0].id;
    const [event] = await query(
      `SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name
       FROM events WHERE id = ?`,
      [insertedId]
    );
    res.status(201).json({ success: true, data: { ...event, participants: [] } });
  } catch (error) {
    console.error('Error creating event (SQL):', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
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

    // Check if already joined
    const existing = await query(
      `SELECT id FROM event_participants WHERE event_id = ? AND donor_id = ?`,
      [eventId, req.user.userId]
    );
    if (existing.length === 0) {
      await query(
        `INSERT INTO event_participants (event_id, donor_id, name, blood, status, registered)
         VALUES (?, ?, ?, ?, 'Confirmed', CURRENT_DATE)`,
        [eventId, req.user.userId, req.user.email || 'Donor', 'Unknown']
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

    const donations = await query(
      `SELECT id, donation_date, blood_type, quantity_ml, status FROM donation_history 
       WHERE donor_id = ? ORDER BY donation_date DESC`,
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, true) RETURNING id`,
      [full_name, email.toLowerCase(), phone, blood_type, date_of_birth, address, city, passwordHash]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Donor added successfully',
      data: { id: result[0].id, full_name, email, blood_type }
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
      'INSERT INTO audit_log (action, entity_type, entity_id, staff_id, changes) VALUES (?, ?, ?, ?, ?)',
      ['DELETE', 'donor', req.params.id, req.user.userId, 'Donor deactivated']
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

    const { donor_id, blood_type, quantity_ml, donation_date } = req.body;
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

    // Calculate expiry date (42 days for most blood types)
    const expiryDate = new Date(donation_date);
    expiryDate.setDate(expiryDate.getDate() + 42);

    // Insert donation record
    const result = await query(
      `INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, status, staff_id)
       VALUES (?, ?, ?, ?, 'completed', ?) RETURNING id`,
      [donor_id, donation_date, blood_type, quantity_ml, req.user.userId]
    );

    // Add to inventory
    await query(
      `INSERT INTO blood_inventory (blood_type, quantity_ml, donation_id, expiry_date, status)
       VALUES (?, ?, ?, ?, 'available')`,
      [blood_type, quantity_ml, result[0].id, expiryDate.toISOString().split('T')[0]]
    );

    // Update donor's last donation date
    await query(
      'UPDATE donors SET last_donation_date = ? WHERE id = ?',
      [donation_date, donor_id]
    );

    // Log action
    await query(
      'INSERT INTO audit_log (action, entity_type, entity_id, staff_id, changes) VALUES (?, ?, ?, ?, ?)',
      ['CREATE', 'donation', result[0].id, req.user.userId, `${quantity_ml}ml ${blood_type}`]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Donation recorded',
      data: {
        id: result[0].id,
        donor_id,
        blood_type,
        quantity_ml,
        expiryDate: expiryDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({ success: false, message: 'Failed to record donation' });
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
      'INSERT INTO audit_log (action, entity_type, entity_id, staff_id, changes) VALUES (?, ?, ?, ?, ?)',
      ['UPDATE', 'inventory', req.params.id, req.user.userId, `Status changed to ${status}`]
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

    const { quantity_fulfilled, notes } = req.body;
    if (!quantity_fulfilled) {
      return res.status(400).json({ success: false, message: 'Quantity fulfilled required' });
    }

    const [request] = await query(
      'SELECT blood_type, quantity_required FROM blood_requests WHERE id = ?',
      [req.params.id]
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    const status = quantity_fulfilled >= request.quantity_required ? 'fulfilled' : 'partial';
    await query(
      'UPDATE blood_requests SET status = ?, quantity_fulfilled = ?, fulfilled_date = CURRENT_TIMESTAMP, notes = ? WHERE id = ?',
      [status, quantity_fulfilled, notes || null, req.params.id]
    );

    await query(
      'INSERT INTO audit_log (action, entity_type, entity_id, staff_id, changes) VALUES (?, ?, ?, ?, ?)',
      ['UPDATE', 'request', req.params.id, req.user.userId, `Fulfilled ${quantity_fulfilled}ml`]
    );

    const [updated] = await query('SELECT * FROM blood_requests WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Request fulfilled', data: updated });
  } catch (error) {
    console.error('Error fulfilling request:', error);
    res.status(500).json({ success: false, message: 'Failed to fulfill request' });
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysStr = thirtyDaysAgo.toISOString().split('T')[0];

    const [
      totalDonors,
      recentDonations,
      totalInventory,
      requestStats,
      bloodTypeStats
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM donors WHERE is_active = true'),
      query(`SELECT COUNT(*) as count FROM donation_history WHERE donation_date >= ?`, [thirtyDaysStr]),
      query(`SELECT SUM(quantity_ml) as total FROM blood_inventory WHERE status = 'available'`),
      query(`SELECT status, COUNT(*) as count FROM blood_requests GROUP BY status`),
      query(`SELECT blood_type, SUM(quantity_ml) as total FROM blood_inventory WHERE status = 'available' GROUP BY blood_type`)
    ]);

    const reports = {
      totalDonors: totalDonors[0]?.count || 0,
      recentDonations: recentDonations[0]?.count || 0,
      totalInventory: totalInventory[0]?.total || 0,
      requestsByStatus: requestStats.reduce((acc, r) => { acc[r.status] = r.count; return acc; }, {}),
      inventoryByBloodType: bloodTypeStats.reduce((acc, b) => { acc[b.blood_type] = b.total; return acc; }, {})
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
      `SELECT id, action, table_name, record_id, user_type, user_id, changes, timestamp as created_at
       FROM audit_log
       ORDER BY timestamp DESC
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
  console.log('\n🩸 BloodLink API Server');
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
