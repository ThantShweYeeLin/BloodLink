#!/bin/bash

# Quick Test Commands for BloodLink API
# =====================================

# Set your API endpoint
API="http://localhost:3000/api"

echo "🩸 BloodLink Quick API Tests"
echo "============================"
echo ""

# Check if server is running
if ! nc -z localhost 3000 2>/dev/null; then
  echo "❌ Server not running on port 3000!"
  echo "Start it with: cd backend && pnpm run dev"
  exit 1
fi

echo "✅ Server is running"
echo ""

# Test 1: Get all donors
echo "📋 Fetching all donors..."
curl -s "$API/donors" | python3 -m json.tool 2>/dev/null | head -20
echo ""

# Test 2: Get all hospitals  
echo "🏥 Fetching all hospitals..."
curl -s "$API/hospitals" | python3 -m json.tool 2>/dev/null | head -15
echo ""

# Test 3: Get all staff
echo "👨‍⚕️ Fetching all staff..."
curl -s "$API/staff" | python3 -m json.tool 2>/dev/null | head -15
echo ""

# Test 4: Login and get token
echo "🔐 Logging in as donor (alice@donor.com)..."
RESPONSE=$(curl -s -X POST "$API/login/donor" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@donor.com","password":"password123"}')

TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [[ -n $TOKEN ]]; then
  echo "✅ Login successful!"
  echo "Token: ${TOKEN:0:40}..."
  echo ""
  
  # Test 5: Get events with token
  echo "📅 Fetching events (with authentication)..."
  curl -s -H "Authorization: Bearer $TOKEN" "$API/events" | python3 -m json.tool 2>/dev/null | head -30
else
  echo "❌ Login failed"
  echo "Response: $RESPONSE"
fi

echo ""
echo "============================"
echo "✅ Quick test complete!"
