# SOC Alert Triage Simulator

## Project Overview
Educational web app simulating SOC analyst alert triage workflows. Users investigate alerts and decide if they're real threats or false positives. Portfolio-quality project.

## Tech Stack
- React (functional components + hooks) with Vite
- Tailwind CSS for styling
- Static JSON scenario data (no backend)
- State via React Context / useState

## Architecture
- `src/components/` - AlertDisplay, InvestigationPanel, ActionResult, DecisionPanel, ScoreCard, ScenarioSelector
- `src/data/scenarios/` - JSON scenario files (MVP: scenario_001 only)
- `src/hooks/useScenario.js` - scenario state management
- `src/utils/scoring.js` - scoring calculation logic

## Key Design Decisions
- MVP scope: single scenario (PowerShell phishing), all 8 investigation actions, 5 decision options
- Scoring: base points from decision (0-100) + investigation efficiency modifier
- Investigation actions have weights: essential, good_practice, neutral
- No backend, no auth, no persistence

## Commands
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Scoring Rules
1. Base points from decision outcome (0-100)
2. Investigation modifier: essential actions taken + efficiency
3. Over-investigating (all actions) = -15 penalty
4. Optimal count (4 actions) = +5 bonus
5. Final score capped 0-100
