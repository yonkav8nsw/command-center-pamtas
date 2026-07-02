# MILESTONE: UI Refinements

**Date:** 2026-07-02
**Status:** IN PROGRESS
**Branch:** `fix/ui-refinements`

---

## Summary

UI improvements and refinements for Command Center PAMTAS dashboard.

---

## Tasks

### 1. Sidebar Font Improvements
- **Issue:** Font size too large, not aesthetic
- **Status:** PENDING
- **Files:** `src/components/layout/Sidebar.jsx`

### 2. GEO-DEMO-KONSOS Tab Enhancement
- **Issue:** Need better structure with 3 sections
- **Sections:**
  - Kondisi Geografi (from existing POS data)
  - Kondisi Demografi (from demografi data)
  - Kondisi Sosial (analysis text)
- **Status:** PENDING
- **Files:** `src/components/pos/GeoDemoKonsos.jsx`

### 3. HUD Panel Reposition (2x3 Grid)
- **Issue:** Need to reposition HUD Panel to 2 rows x 3 columns
- **Layout:**
  - Row 1: PERSONEL — POS AKTIF — INSIDEN
  - Row 2: OVERVIEW — INSIDEN — LAPORAN
- **Status:** PENDING
- **Files:** `src/pages/HomePage.jsx`

### 4. Logo Reposition
- **Issue:** Need to reposition logo with proper centering
- **Status:** PENDING
- **Files:** `src/pages/HomePage.jsx`

### 5. TokohWilayahPage onEdit Error
- **Issue:** Error "onEdit is not defined" when clicking tokoh
- **Status:** PENDING
- **Files:** `src/pages/laporan/TokohWilayahPage.jsx`

---

## Design References

Using Emil Kowalski design principles:
- Typography: Clean, readable, consistent spacing
- Animations: 150-300ms, ease-out for interactions
- Micro-interactions: Subtle scale on press (0.97)

Using UI/UX Pro Max guidelines:
- Touch targets: Minimum 44x44px
- Contrast: 4.5:1 minimum
- Spacing: 4/8dp rhythm

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/layout/Sidebar.jsx` | Font sizing, aesthetics |
| `src/components/pos/GeoDemoKonsos.jsx` | 3-section layout |
| `src/pages/HomePage.jsx` | HUD Panel + Logo reposition |
| `src/pages/laporan/TokohWilayahPage.jsx` | onEdit fix |

---

## Progress

- [ ] Sidebar font improvements
- [ ] GEO-DEMO-KONSOS implementation
- [ ] HUD Panel reposition
- [ ] Logo reposition
- [ ] TokohWilayahPage fix

---

*Milestone Started: 2026-07-02*
