# Donor Selection Input Changes

## Summary
Changed the donation-recording.html from a dropdown "Select Donor" to input fields for "Donor Name" and "Donor Email" with real-time matching.

## Changes Made

### 1. HTML Structure Changes

**Replaced:** Dropdown select element with two text input fields

**Old:**
```html
<label for="donorSelect">Select Donor *</label>
<select id="donorSelect" onchange="selectDonor()">
  <option value="">-- Loading eligible donors --</option>
</select>
```

**New:**
```html
<label for="donorName">Donor Name *</label>
<input type="text" id="donorName" placeholder="Enter donor's full name" oninput="onDonorInputChange()">

<label for="donorEmail">Donor Email *</label>
<input type="email" id="donorEmail" placeholder="Enter donor's email" oninput="onDonorInputChange()">

<div id="donorMatchStatus" style="display: none; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.9rem;"></div>
```

### 2. JavaScript Changes

#### Added Variable
```javascript
let allDonors = [];  // Stores all donors for matching
```

#### Updated loadDonors()
- Now stores all donors in `allDonors` array instead of populating a dropdown
- Keeps eligible and ineligible donors for matching

```javascript
async function loadDonors() {
  const data = await apiCall('/staff/donors');
  if (!data.success) return showError('Failed to load donors');
  
  // Store all donors for matching
  allDonors = data.data;
}
```

#### New Function: onDonorInputChange()
- Triggers on input change for both name and email fields
- Real-time matching algorithm:
  1. Gets name and email from input fields
  2. Searches `allDonors` for matching donor
  3. Checks eligibility status
  4. Shows appropriate status message:
     - ✓ Green: Donor found and eligible
     - ⚠️ Yellow: Donor found but not eligible
     - ✗ Red: No matching donor found
  5. Fetches full donor details if match found and eligible

```javascript
function onDonorInputChange() {
  const name = document.getElementById('donorName').value.trim().toLowerCase();
  const email = document.getElementById('donorEmail').value.trim().toLowerCase();

  if (!name || !email) {
    document.getElementById('donorMatchStatus').style.display = 'none';
    document.getElementById('donorInfo').classList.remove('visible');
    selectedDonor = null;
    return;
  }

  // Search for matching donor
  const matchedDonor = allDonors.find(d => 
    d.full_name.toLowerCase().includes(name) && 
    d.email.toLowerCase() === email
  );

  // Handle match/no match scenarios with status display
}
```

#### Updated resetForm()
- Changed from clearing `donorSelect` dropdown to clearing text inputs
- Also clears `donorMatchStatus` display

```javascript
document.getElementById('donorName').value = '';
document.getElementById('donorEmail').value = '';
document.getElementById('donorMatchStatus').style.display = 'none';
```

#### Updated checkAllTestsComplete()
- Changed donor selection check from `document.getElementById('donorSelect').value` to `selectedDonor !== null`
- More robust since `selectedDonor` is set via matching logic

```javascript
const donorSelected = selectedDonor !== null;
```

#### Removed selectDonor()
- Old dropdown change handler no longer needed
- `onDonorInputChange()` replaces this functionality

## User Experience Flow

1. **Staff enters donor name** → Triggers matching
2. **Staff enters donor email** → Triggers matching
3. **System searches for matching donor:**
   - Match found + eligible → Shows green status, loads donor info
   - Match found + ineligible → Shows yellow warning with days until eligible
   - No match → Shows red error, clears donor info
4. **Staff completes donation details and tests**
5. **Submit button enabled** when donor selected + all tests passed
6. **Donation recorded** with staff_id and donor attribution

## Matching Logic

- **Name matching:** Case-insensitive, includes (partial name match)
- **Email matching:** Case-insensitive, exact match
- **Eligibility:** Checks `isEligible` flag from donor data
- **Ineligible donors:** Shows how many days until they can donate again

## Status Messages

### Success (Green)
```
✓ Donor found and eligible
```

### Warning (Yellow)
```
⚠️ Donor found but not eligible. Must wait X more days.
```

### Error (Red)
```
✗ No matching donor found in system
```

## Benefits

1. **Better UX**: No need to scroll through dropdown of eligible donors
2. **Real-time feedback**: Immediate status about donor eligibility
3. **Flexible matching**: Works with partial name matches
4. **Ineligibility info**: Shows exactly how long to wait
5. **Cleaner interface**: Two simple input fields instead of dropdown

## Files Modified

- `/public/donation-recording.html`

## Testing Recommendations

1. Test with exact donor name and email → Should match
2. Test with partial name → Should match if email exact
3. Test with ineligible donor → Should show days remaining
4. Test with non-existent donor → Should show "not found"
5. Test submit button enable/disable based on donor selection
6. Test reset clears inputs and status message
7. Verify donation history still shows in donor-management.html with staff attribution
