# MOTION AUDIT CHECKLIST — Command Center PAMTAS

**Version:** 1.0
**Date:** 2026-06-29
**Scope:** All pages and components

---

## AUDIT METHODOLOGY

Every page/component should have:
1. Page entrance animation (fade-in)
2. Staggered list items (50ms delay, cap at 300ms)
3. Hover transitions (100ms)
4. Active/press feedback
5. Modal/detail panel animations

---

## PAGE-BY-PAGE CHECKLIST

### HomePage
- [x] Page entrance: `animate-fade-in`
- [ ] List stagger: N/A (no list)
- [x] Nav items: transition-colors
- [x] Card hover: CSS transition

### OverviewPage
- [x] Page entrance: `animate-fade-in`
- [x] Metric cards: hover lift effect
- [x] Map: lazy loaded with spinner
- [x] Panels: slide animations

### InsidenPage
- [x] Page entrance: `animate-fade-in`
- [x] List stagger: `getStaggerDelay` (50ms, cap 300ms)
- [x] List items: `cursor-pointer`, `transition-all`
- [x] Detail panel: `animate-slide-in-right`
- [x] Selected state: background color transition

### KerawananPage
- [x] Page entrance: `animate-fade-in`
- [x] List stagger: `getStaggerDelay` (50ms, cap 300ms)
- [x] List items: `transition-all`
- [ ] Detail panel: N/A (navigates to POS)

### BinterPage
- [x] Page entrance: `animate-fade-in`
- [x] List stagger: `getStaggerDelay` (50ms, cap 300ms)
- [x] List items: `transition-all`
- [x] Detail panel: `animate-slide-in-right`

### PosDetailPage
- [x] Page entrance: `animate-fade-in`
- [x] Tab indicator: `transition-all duration-100`
- [x] Sections: `animate-scale-in` with stagger
- [x] Content rows: `animate-fade-in` with stagger

### AdminPage
- [x] Page entrance: `animate-fade-in`
- [x] Cards: `animate-pulse` (loading skeleton)
- [x] Form: `space-y-4 animate-fade-in`

### PanduanPage
- [x] Page entrance: `animate-fade-in`
- [x] Tabs: `transition-all`
- [x] Content: `transition-colors`

### LoginPage
- [x] Page entrance: `animate-fade-in`
- [x] Form: `animate-scale-in`
- [x] Button hover: CSS transition

---

## COMPONENT CHECKLIST

### Button
- [x] Hover: 100ms transition
- [x] Active: scale(0.98)
- [x] Focus: focus-visible ring
- [x] Loading: spinner replaces content

### Modal
- [x] Overlay: fade-in
- [x] Content: scale-in
- [x] Close: scale-out

### Toast
- [x] Enter: slide-up
- [x] Exit: fade-out
- [x] Auto-dismiss: progress bar

### Card/Panel
- [x] Depth: inset shadow
- [x] Hover: lift effect
- [x] Header: gradient

### List Items
- [x] Hover: background shift
- [x] Cursor: pointer
- [x] Transition: 100ms

### Status Dot
- [x] Pulse: 2s ease-in-out infinite
- [x] Glow: box-shadow
- [x] Danger: faster pulse (1s)

### Loading Spinner
- [x] Spin: 600ms linear infinite
- [x] Skeleton: shimmer 1.5s

---

## MOTION TOKEN COMPLIANCE

All animations should use CSS variables:

```css
--duration-instant: 50ms    /* Toggles */
--duration-fast: 100ms      /* Hover */
--duration-normal: 150ms    /* Standard */
--duration-smooth: 200ms    /* Component */
--duration-slow: 300ms      /* Panel */
--duration-page: 400ms       /* Page */

--ease-out: cubic-bezier(0.16, 1, 0.3, 1)     /* Enter */
--ease-sharp: cubic-bezier(0.7, 0, 0.84, 0)   /* Exit */
--ease-linear: linear                         /* Loading */
```

---

## STAGGER PATTERN

Use `getStaggerDelay` helper:

```javascript
const getStaggerDelay = (index) => Math.min(index * 50, 300)
```

This ensures:
- First item: 0ms
- Second: 50ms
- Third: 100ms
- ...
- Seventh+: 300ms (capped)

---

## ISSUES FOUND

| Issue | Page | Status |
|-------|------|--------|
| None | All pages | ✅ Compliant |

---

## RECOMMENDATIONS

1. **Apply `.hover-lift`** to card components for enhanced hover effect
2. **Apply `.hover-icon-scale`** to icon-only buttons
3. **Add page templates** for consistent animation setup

---

*End of Motion Audit Checklist*
