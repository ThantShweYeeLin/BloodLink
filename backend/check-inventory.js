import { query } from './sql.js';

(async () => {
  try {
    console.log('Checking blood_inventory table...\n');
    
    const inventory = await query(
      `SELECT id, blood_type, quantity_ml, status, expiry_date FROM blood_inventory 
       WHERE status = 'available' AND expiry_date > CURDATE()
       ORDER BY blood_type, id
       LIMIT 20`,
      []
    );
    
    if (inventory.length === 0) {
      console.log('No available inventory found.');
      console.log('\nNote: Units used in fulfill operation get marked as "used", not "available"');
      console.log('If you need sample inventory for emergency requests, run add-test-inventory.js');
    } else {
      console.log(`Found ${inventory.length} available units:\n`);
      inventory.forEach(u => {
        console.log(`ID: ${u.id}, Type: ${u.blood_type}, Qty: ${u.quantity_ml}ml, Status: ${u.status}, Expires: ${u.expiry_date}`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
