import { query } from './sql.js';

(async () => {
  try {
    console.log('Updating all "approved" status to "fulfilled"...');
    
    // Update blood_requests table
    const result = await query(
      "UPDATE blood_requests SET status = 'fulfilled' WHERE status = 'approved'",
      []
    );
    
    console.log(`✓ Updated ${result.affectedRows || 0} records in blood_requests table`);
    console.log('✓ All "approved" statuses have been changed to "fulfilled"');
    
    process.exit(0);
  } catch (err) {
    console.error('Error updating database:', err);
    process.exit(1);
  }
})();
