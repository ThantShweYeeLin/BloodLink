#!/bin/bash

# BloodLink Startup Script
# This script starts both the backend and frontend servers

echo "🩸 BloodLink Startup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if MySQL is running
echo "⏳ Checking MySQL connection..."
mysql -u root -e "SELECT 1" &> /dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Could not connect to MySQL"
    echo "   Make sure MySQL is installed and running"
    echo "   On macOS: brew services start mysql"
    echo "   On Linux: sudo systemctl start mysql"
    echo ""
fi

# Start backend in the background
echo ""
echo "🚀 Starting BloodLink Backend Server..."
echo "   Server: http://localhost:3000"
cd backend
npm install > /dev/null 2>&1
npm run dev &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start frontend
echo ""
echo "🚀 Starting BloodLink Frontend Server..."
echo "   Server: http://localhost:5173"
cd ..
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ BloodLink is running!"
echo ""
echo "📱 Open your browser: http://localhost:5173"
echo ""
echo "Available Logins:"
echo "  • Donor:   http://localhost:5173/login-donor.html"
echo "  • Hospital: http://localhost:5173/login-hospital.html"
echo "  • Staff:   http://localhost:5173/login-staff.html"
echo ""
echo "To stop the servers, press Ctrl+C"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Keep the script running
wait
