# TESTING ACCESS FIXES - BYPASS STRIPE + PDF VIEWER
## Grant all tier access without payment + direct PDF viewer links

---

## COPY THIS TO REPLIT:

```
TESTING ACCESS - 2 CRITICAL FIXES

Issue 1: Can't test paid features without going through Stripe checkout
Issue 2: Can't find/view PDF workbooks in portal

Solution: Add testing bypasses + direct PDF viewer links in testing panel

---

FIX #1: BYPASS STRIPE FOR TESTING
==================================

Add "God Mode" toggle to testing panel that grants instant access to all tiers.

Implementation:

**Update TestingPanel component:**

```jsx
{/* Add to Testing Actions section */}
<div className="nav-section">
  <h4>God Mode (Testing)</h4>
  <button onClick={() => enableGodMode()}>
    Enable God Mode (All Access)
  </button>
  <button onClick={() => disableGodMode()}>
    Disable God Mode (Reset)
  </button>
  <div className="god-mode-status">
    Status: {isGodModeEnabled() ? '✅ ACTIVE' : '❌ Inactive'}
  </div>
</div>
```

**Helper functions:**

```javascript
// Enable God Mode - grants all access
function enableGodMode() {
  localStorage.setItem('godMode', 'true');
  
  // Update user object to have Archive access (highest tier)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  currentUser.tier = 'archive';
  currentUser.hasCrashCourse = true;
  currentUser.hasQuickStart = true;
  currentUser.hasArchive = true;
  currentUser.godMode = true;
  localStorage.setItem('user', JSON.stringify(currentUser));
  
  alert('🔓 GOD MODE ENABLED - All tiers unlocked');
  window.location.reload();
}

// Disable God Mode
function disableGodMode() {
  localStorage.removeItem('godMode');
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  currentUser.tier = 'free';
  currentUser.hasCrashCourse = true; // Keep free tier
  currentUser.hasQuickStart = false;
  currentUser.hasArchive = false;
  currentUser.godMode = false;
  localStorage.setItem('user', JSON.stringify(currentUser));
  
  alert('🔒 GOD MODE DISABLED - Reset to free tier');
  window.location.reload();
}

// Check if God Mode is active
function isGodModeEnabled() {
  return localStorage.getItem('godMode') === 'true';
}
```

**Update access checks throughout portal:**

```javascript
// In any component that checks tier access
function hasAccessToContent(requiredTier) {
  // Check God Mode first
  if (localStorage.getItem('godMode') === 'true') {
    return true; // Bypass all checks
  }
  
  // Normal tier check
  const user = getCurrentUser();
  
  if (requiredTier === 'free') return true;
  if (requiredTier === 'quick_start') return user.tier === 'quick_start' || user.tier === 'archive';
  if (requiredTier === 'archive') return user.tier === 'archive';
  
  return false;
}
```

**Visual indicator in portal header:**

```jsx
{/* Add to portal header */}
{isGodModeEnabled() && (
  <div className="god-mode-badge">
    🔓 GOD MODE ACTIVE
  </div>
)}
```

CSS:
```css
.god-mode-badge {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #EC4899, #14B8A6);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  z-index: 9998;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.god-mode-status {
  margin-top: 8px;
  padding: 8px;
  background: rgba(20, 184, 166, 0.1);
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  color: #14B8A6;
}
```

---

FIX #2: PDF VIEWER DIRECT ACCESS
=================================

Add direct links to PDF workbooks in testing panel + portal navigation.

**Update TestingPanel with PDF links:**

```jsx
{/* Add new section */}
<div className="nav-section">
  <h4>PDF Workbooks</h4>
  <a href="/portal/workbook/crash-course">Crash Course Workbook</a>
  <a href="/portal/workbook/quick-start">Quick-Start Workbook</a>
  <a href="/portal/workbook/archive">Complete Archive Workbook</a>
  <a href="/portal/workbook/disappearing">Disappearing Pattern</a>
  <a href="/portal/workbook/apology-loop">Apology Loop</a>
  <a href="/portal/workbook/testing">Testing Pattern</a>
  <a href="/portal/workbook/attraction-to-harm">Attraction to Harm</a>
  <a href="/portal/workbook/compliment-deflection">Compliment Deflection</a>
  <a href="/portal/workbook/draining-bond">Draining Bond</a>
  <a href="/portal/workbook/success-sabotage">Success Sabotage</a>
</div>
```

**Add "View Workbook" buttons to portal modules:**

```jsx
{/* Add to each module/lesson page */}
<div className="workbook-access">
  <button 
    onClick={() => window.open('/portal/workbook/crash-course', '_blank')}
    className="workbook-btn"
  >
    📄 Open Workbook (PDF)
  </button>
</div>
```

CSS:
```css
.workbook-access {
  margin: 24px 0;
  padding: 16px;
  background: rgba(20, 184, 166, 0.05);
  border: 1px solid rgba(20, 184, 166, 0.2);
  border-radius: 8px;
}

.workbook-btn {
  background: #14B8A6;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.workbook-btn:hover {
  background: #EC4899;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}
```

**Create PDF viewer route if it doesn't exist:**

```jsx
// Route: /portal/workbook/:type
import PDFViewer from '@/components/PDFViewer';

export default function WorkbookPage({ params }) {
  const { type } = params;
  
  // Map type to PDF path
  const pdfPaths = {
    'crash-course': '/pdfs/crash-course-workbook.pdf',
    'quick-start': '/pdfs/quick-start-workbook.pdf',
    'archive': '/pdfs/complete-archive-workbook.pdf',
    'disappearing': '/pdfs/disappearing-pattern-workbook.pdf',
    'apology-loop': '/pdfs/apology-loop-workbook.pdf',
    'testing': '/pdfs/testing-pattern-workbook.pdf',
    'attraction-to-harm': '/pdfs/attraction-to-harm-workbook.pdf',
    'compliment-deflection': '/pdfs/compliment-deflection-workbook.pdf',
    'draining-bond': '/pdfs/draining-bond-workbook.pdf',
    'success-sabotage': '/pdfs/success-sabotage-workbook.pdf',
  };
  
  const pdfPath = pdfPaths[type];
  
  if (!pdfPath) {
    return <div>Workbook not found</div>;
  }
  
  return (
    <div className="workbook-page">
      <h1>Workbook: {type.replace('-', ' ').toUpperCase()}</h1>
      <PDFViewer pdfUrl={pdfPath} />
    </div>
  );
}
```

**Verify PDFViewer component exists:**

If PDFViewer component doesn't exist yet, here's a basic implementation:

```jsx
// components/PDFViewer.jsx
'use client';

import { useState } from 'react';

export default function PDFViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <button 
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <span>Page {pageNumber} of {numPages || '?'}</span>
        <button 
          onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
        <a 
          href={pdfUrl} 
          download 
          className="download-btn"
        >
          Download PDF
        </a>
      </div>
      
      <div className="pdf-container">
        <iframe
          src={`${pdfUrl}#page=${pageNumber}`}
          width="100%"
          height="800px"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}
```

CSS:
```css
.pdf-viewer {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.pdf-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(20, 184, 166, 0.05);
  border-radius: 8px;
}

.pdf-controls button {
  background: #14B8A6;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.pdf-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.download-btn {
  background: #EC4899;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}

.pdf-container {
  border: 2px solid rgba(20, 184, 166, 0.2);
  border-radius: 8px;
  overflow: hidden;
}
```

---

FIX #3: ADD "DOWNLOADS" SECTION TO PORTAL
==========================================

Create a dedicated Downloads page in portal for easy PDF access.

**Route: /portal/downloads**

```jsx
export default function DownloadsPage() {
  const user = getCurrentUser();
  const hasGodMode = isGodModeEnabled();
  
  const downloads = [
    {
      title: 'Crash Course Workbook',
      tier: 'free',
      path: '/pdfs/crash-course-workbook.pdf',
      description: '7-day pattern recognition guide'
    },
    {
      title: 'Quick-Start System Workbook',
      tier: 'quick_start',
      path: '/pdfs/quick-start-workbook.pdf',
      description: '90-day pattern interruption protocol'
    },
    {
      title: 'Complete Archive',
      tier: 'archive',
      path: '/pdfs/complete-archive-workbook.pdf',
      description: 'All 7 patterns + advanced protocols'
    },
    // Individual pattern workbooks
    {
      title: 'Disappearing Pattern Workbook',
      tier: 'archive',
      path: '/pdfs/disappearing-pattern-workbook.pdf',
      description: 'Ghost before they leave you'
    },
    // ... add other 6 patterns
  ];
  
  return (
    <div className="downloads-page">
      <h1>Downloads</h1>
      <p>Access your pattern interruption workbooks</p>
      
      {hasGodMode && (
        <div className="god-mode-notice">
          🔓 GOD MODE: All downloads unlocked
        </div>
      )}
      
      <div className="downloads-grid">
        {downloads.map((item, i) => {
          const hasAccess = hasGodMode || hasAccessToContent(item.tier);
          
          return (
            <div key={i} className={`download-card ${!hasAccess ? 'locked' : ''}`}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              
              {hasAccess ? (
                <div className="download-actions">
                  <a href={item.path} download className="btn-download">
                    Download PDF
                  </a>
                  <button 
                    onClick={() => window.open(`/portal/workbook/${item.path.split('/').pop().replace('.pdf', '')}`, '_blank')}
                    className="btn-view"
                  >
                    View Online
                  </button>
                </div>
              ) : (
                <div className="locked-notice">
                  🔒 Requires {item.tier === 'quick_start' ? 'Quick-Start' : 'Archive'} tier
                  <a href="/portal/upgrade" className="upgrade-link">Upgrade</a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Add Downloads link to portal navigation:**

```jsx
<nav className="portal-nav">
  <a href="/portal">Dashboard</a>
  <a href="/portal/crash-course">Crash Course</a>
  <a href="/portal/downloads">Downloads</a>
  <a href="/portal/profile">Profile</a>
</nav>
```

---

TESTING WORKFLOW (AFTER IMPLEMENTATION)
========================================

**Step 1: Enable God Mode**
1. Open testing panel (🔧 button or ?debug=true)
2. Click "Enable God Mode"
3. See "🔓 GOD MODE ACTIVE" badge appear

**Step 2: Access Everything**
1. Go to /portal
2. See all modules unlocked (Crash Course, Quick-Start, Archive)
3. Click any module
4. Click "Open Workbook" button
5. PDF opens in new tab with viewer

**Step 3: Use Testing Panel**
1. Open testing panel
2. Click "PDF Workbooks" section
3. Click any workbook link
4. Opens directly in PDF viewer

**Step 4: Downloads Page**
1. Go to /portal/downloads
2. See all workbooks listed
3. Click "Download PDF" or "View Online"
4. Works instantly (no Stripe)

**Step 5: Disable God Mode (when done testing)**
1. Open testing panel
2. Click "Disable God Mode"
3. Returns to free tier
4. Locked content shows 🔒 again

---

COMPLETION CHECKLIST
====================

God Mode:
- [ ] Enable God Mode button works
- [ ] All content unlocks instantly
- [ ] God Mode badge appears in portal
- [ ] Disable God Mode resets to free tier
- [ ] Status indicator updates correctly

PDF Viewer:
- [ ] Direct links in testing panel work
- [ ] "Open Workbook" buttons appear in modules
- [ ] PDF viewer loads and displays PDFs
- [ ] Page navigation works (prev/next)
- [ ] Download button works
- [ ] Opens in new tab correctly

Downloads Page:
- [ ] /portal/downloads route works
- [ ] All workbooks listed
- [ ] Locked workbooks show 🔒 when God Mode off
- [ ] All workbooks accessible when God Mode on
- [ ] Download links work
- [ ] View online opens PDF viewer

Testing Panel Integration:
- [ ] PDF links section added
- [ ] God Mode section added
- [ ] All links functional
- [ ] Works on mobile (with ?debug=true)

---

BUILD ALL 3 FIXES NOW

Estimated time: 2-3 hours
- God Mode: 45 min
- PDF viewer links: 45 min  
- Downloads page: 1 hour
- Testing: 30 min

This eliminates ALL testing friction. No Stripe. No hunting. Direct access to everything.

Build now.
```
