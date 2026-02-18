import { query } from './sql.js';

async function addTestInventory() {
  try {
    console.log('Adding test blood inventory data...\n');

    const [{ count }] = await query('SELECT COUNT(*) AS count FROM blood_inventory');
    const currentCount = Number(count) || 0;
    if (currentCount >= 60) {
      console.log('✅ Inventory already has plenty of data. Skipping insert.\n');
      process.exit(0);
    }

    const insertQuery = `
      INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status)
      VALUES
        ('A+', 450, 'Storage Unit A1', '2026-02-15', 1, '2026-01-05', 'available'),
        ('A+', 450, 'Storage Unit A2', '2026-02-20', NULL, '2026-01-10', 'available'),
        ('A-', 450, 'Storage Unit A3', '2026-02-01', 1, '2025-12-30', 'available'),
        ('A-', 450, 'Storage Unit A4', '2026-02-12', NULL, '2026-01-02', 'available'),
        ('A-', 450, 'Storage Unit A5', '2026-02-18', NULL, '2026-01-08', 'available'),
        ('B+', 450, 'Storage Unit B1', '2026-03-01', NULL, '2026-01-12', 'available'),
        ('B+', 450, 'Storage Unit B2', '2026-02-10', NULL, '2026-01-08', 'available'),
        ('B+', 450, 'Storage Unit B3', '2026-02-26', NULL, '2026-01-14', 'available'),
        ('B+', 450, 'Storage Unit B4', '2026-02-12', NULL, '2026-01-11', 'reserved'),
        ('B-', 450, 'Storage Unit B5', '2026-02-05', NULL, '2026-01-07', 'available'),
        ('B-', 450, 'Storage Unit B6', '2026-02-18', NULL, '2026-01-09', 'available'),
        ('B-', 450, 'Storage Unit B7', '2026-02-22', NULL, '2026-01-12', 'available'),
        ('B-', 450, 'Storage Unit B8', '2026-02-28', NULL, '2026-01-16', 'available'),
        ('B-', 450, 'Storage Unit B9', '2026-03-04', NULL, '2026-01-19', 'available'),
        ('B-', 450, 'Storage Unit B10', '2026-03-08', NULL, '2026-01-21', 'available'),
        ('O+', 450, 'Storage Unit C1', '2026-02-28', NULL, '2026-01-15', 'available'),
        ('O+', 450, 'Storage Unit C2', '2026-03-05', NULL, '2026-01-18', 'available'),
        ('O+', 450, 'Storage Unit C3', '2026-02-20', NULL, '2026-01-10', 'available'),
        ('O+', 450, 'Storage Unit C4', '2026-02-24', NULL, '2026-01-12', 'available'),
        ('O+', 450, 'Storage Unit C5', '2026-03-01', NULL, '2026-01-16', 'available'),
        ('O+', 450, 'Storage Unit C6', '2026-03-06', NULL, '2026-01-20', 'available'),
        ('O-', 450, 'Storage Unit C7', '2026-02-25', NULL, '2026-01-13', 'available'),
        ('O-', 450, 'Storage Unit C8', '2026-03-02', NULL, '2026-01-17', 'available'),
        ('O-', 450, 'Storage Unit C9', '2026-03-07', NULL, '2026-01-22', 'available'),
        ('AB+', 450, 'Storage Unit D1', '2026-02-18', NULL, '2026-01-09', 'available'),
        ('AB+', 450, 'Storage Unit D2', '2026-03-03', NULL, '2026-01-18', 'available'),
        ('AB+', 450, 'Storage Unit D3', '2026-03-09', NULL, '2026-01-24', 'available'),
        ('AB-', 450, 'Storage Unit D4', '2026-01-23', NULL, '2025-12-29', 'available'),
        ('AB-', 450, 'Storage Unit D5', '2026-02-14', NULL, '2026-01-05', 'available'),
        ('AB-', 450, 'Storage Unit D6', '2026-03-06', NULL, '2026-01-22', 'available'),
        ('A+', 450, 'Storage Unit A6', '2026-01-18', NULL, '2025-12-25', 'expired'),
        ('O+', 450, 'Storage Unit C10', '2026-01-19', NULL, '2025-12-26', 'expired')
    `;

    const result = await query(insertQuery);
    const insertedCount = result?.affectedRows || 0;
    console.log('✅ Successfully inserted', insertedCount, 'blood inventory records\n');

    // Display the data
    console.log('📋 Inventory Summary:');
    console.log('═══════════════════════════════════════════════════════════');
    
    const summary = await query(`
      SELECT 
        blood_type,
        COUNT(*) as total_units,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN expiry_date < CURRENT_DATE THEN 1 ELSE 0 END) as expired,
        SUM(CASE WHEN expiry_date >= CURRENT_DATE AND expiry_date < DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY) THEN 1 ELSE 0 END) as expiring_soon
      FROM blood_inventory
      GROUP BY blood_type
      ORDER BY blood_type;
    `);

    console.table(summary);

    console.log('\n📊 All Inventory Records:');
    console.log('═══════════════════════════════════════════════════════════');
    
    const allRecords = await query(`
      SELECT 
        id,
        blood_type,
        quantity_ml,
        expiry_date,
        CASE 
          WHEN expiry_date < CURRENT_DATE THEN '🔴 EXPIRED'
          WHEN expiry_date < DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY) THEN '🟡 EXPIRING SOON'
          ELSE '🟢 GOOD'
        END as condition_label,
        status
      FROM blood_inventory
      ORDER BY blood_type, expiry_date;
    `);

    console.table(allRecords);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test inventory:', error.message);
    process.exit(1);
  }
}

addTestInventory();
