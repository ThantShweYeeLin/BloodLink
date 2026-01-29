#!/bin/bash
# Fix absolute paths in HTML files for GitHub Pages

cd /Users/thantshweyeelin/Desktop/BloodLink/BloodLink/public

# Files in root directory - use relative paths directly
for file in donation-recording.html login-donor.html login-hospital.html login-staff.html staff-donor-management.html; do
  if [ -f "$file" ]; then
    # Fix navigation links from root
    sed -i '' 's|href="/dashboards/|href="dashboards/|g' "$file"
    sed -i '' 's|href="/pages/|href="pages/|g' "$file"
    sed -i '' 's|href="/donation-recording.html|href="donation-recording.html|g' "$file"
    sed -i '' 's|href="/staff-management.html|href="staff-management.html|g' "$file"
    sed -i '' 's|href="/login-|href="login-|g' "$file"
  fi
done

# Files in pages/ subdirectory - need ../ to go up
cd pages
for file in *.html; do
  if [ -f "$file" ]; then
    # Fix navigation links from pages/
    sed -i '' 's|href="/dashboards/|href="../dashboards/|g' "$file"
    sed -i '' 's|href="/pages/|href="./|g' "$file"
    sed -i '' 's|href="/donation-recording.html|href="../donation-recording.html|g' "$file"
    sed -i '' 's|href="/staff-management.html|href="../staff-management.html|g' "$file"
    sed -i '' 's|href="/login-|href="../login-|g' "$file"
  fi
done

echo "✓ Fixed all absolute paths to relative paths"
