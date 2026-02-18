import bcryptjs from 'bcryptjs';

const password = process.argv[2] || 'password123';

async function generateHash() {
  const hash = await bcryptjs.hash(password, 10);
  console.log(`Hash for "${password}":`);
  console.log(hash);
  
  // Verify it works
  const matches = await bcryptjs.compare(password, hash);
  console.log('\nVerification:', matches ? 'PASS ✓' : 'FAIL ✗');
}

generateHash();
