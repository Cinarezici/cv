# Interview-Ready CV Optimizer - Full Implementation Plan

Based on the `resume-optimizer-product-spec.md`, here is the detailed checklist for the remaining implementation. We will proceed phase by phase automatically.

## Phase 1: Editor Features & Theming (Section 2)
- [x] **Color & Font Picker**: Add a "Style & Theme" tab to the CV Dashboard to allow changing primary colors and fonts dynamically.
- [ ] **Dynamic Sections Integration**: Improve `ResumeViewer.tsx` to handle dynamic custom sections (Projects, Certifications, Languages) instead of just hardcoded Experience/Education.
- [ ] **Export Options**: Polish the PDF export (Puppeteer or `window.print` optimizations). Add DOCX structure later.

## Phase 2: Monetization & Edit Lock (Section 5)
- [ ] **Edit Lock Overlay**: Implement the logic where if the trial/Pro plan ends, the CV inputs are disabled and covered by a glassmorphism "Locked" overlay.
- [ ] **Upgrade Modal**: Build the specific Upgrade prompt shown when trying to edit a locked document.

## Phase 3: Smart Optimization Engine (Section 4)
- [ ] **ATS & Quality Score UI**: Add the real-time scoring pie chart/bars into the CV Dashboard (or a sticky top bar).
- [ ] **AI Bullet Rewriting**: Add a `✨` button next to every bullet point to auto-rewrite weak bullets via OpenAI/Anthropic.
- [ ] **Job Matcher**: Add an input to paste a Job Description and receive a match score with missing keywords.

## Phase 4: Analytics Dashboard (Section 6)
- [ ] **Tracking**: Add an invisible script to public `/r/[slug]` pages to track views and time spent.
- [ ] **Analytics UI**: Add an Analytics modal/page on the Dashboard to show performance metrics for each CV.

## Phase 5: Conversational AI Builder (Section 3)
- [ ] **AI Interview Chat**: Build the "First Resume" chat interface where an AI coach extracts STAR components step-by-step.

---
**Status:** Starting Phase 1 immediately (Theme & Color Picker Integration).
