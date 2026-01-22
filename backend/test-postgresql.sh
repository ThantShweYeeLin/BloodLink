#!/bin/bash

# Test PostgreSQL BloodLink Backend
echo "Testing BloodLink PostgreSQL Backend..."
echo "========================================"
echo

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "1. Testing health endpoint..."
HEALTH=$(curl -s http://localhost:3000/api/health)
if [[ $HEALTH == *"success"* ]]; then
  echo -e "${GREEN}✓ Health check passed${NC}"
else
  echo -e "${RED}✗ Health check failed${NC}"
fi
echo

# Test 2: Register Donor
echo "2. Testing donor registration..."
REGISTER=$(curl -s -X POST http://localhost:3000/api/register/donor \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "PostgreSQL Test Donor",
    "email": "pgtest@donor.com",
    "password": "Test123!",
    "phone": "5551234567",
    "dob": "1995-06-15",
    "bloodType": "A+",
    "address": "456 PostgreSQL Street",
    "city": "TestCity"
  }')

if [[ $REGISTER == *"success\":true"* ]]; then
  echo -e "${GREEN}✓ Donor registration successful${NC}"
  echo "Response: $REGISTER"
else
  echo -e "${RED}✗ Donor registration failed${NC}"
  echo "Response: $REGISTER"
fi
echo

# Test 3: Login Donor
echo "3. Testing donor login..."
LOGIN=$(curl -s -X POST http://localhost:3000/api/login/donor \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pgtest@donor.com",
    "password": "Test123!"
  }')

if [[ $LOGIN == *"token"* ]]; then
  echo -e "${GREEN}✓ Donor login successful${NC}"
  TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "JWT Token: ${TOKEN:0:50}..."
else
  echo -e "${RED}✗ Donor login failed${NC}"
  echo "Response: $LOGIN"
fi
echo

# Test 4: Verify in Database
echo "4. Verifying data in PostgreSQL..."
COUNT=$(psql -U postgres -h localhost -d bloodlink_db -t -c "SELECT COUNT(*) FROM donors WHERE email = 'pgtest@donor.com';" 2>/dev/null | tr -d ' ')
if [[ $COUNT -eq 1 ]]; then
  echo -e "${GREEN}✓ Donor found in PostgreSQL database${NC}"
else
  echo -e "${RED}✗ Donor not found in database (count: $COUNT)${NC}"
fi
echo

echo "========================================"
echo "PostgreSQL Migration Test Complete!"
