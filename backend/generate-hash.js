import bcryptjs from 'bcryptjs';

const password = 'password123';

async function generateHash() {
  const hash = await bcryptjs.hash(password, 10);
  console.log('Hash for "password123":');
  console.log(hash);
  
  // Verify it works
  const matches = await bcryptjs.compare(password, hash);
  console.log('\nVerification:', matches ? 'PASS ✓' : 'FAIL ✗');
}

generateHash();
