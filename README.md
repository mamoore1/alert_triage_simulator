# SOC Alert Triage Simulator

Interactive training tool for practicing security incident investigation and decision-making.

**Live Demo:** https://alerttriagesimulatorvercel.vercel.app/

## Overview

Practice SOC analyst workflows through realistic alert scenarios. Investigate security alerts, gather evidence, and make triage decisions. Get scored on both decision quality and investigation efficiency.

## Features

**5 Realistic Scenarios:**
- PowerShell phishing attack
- Credential spray attempt  
- Geographic login anomaly (false positive)
- Large cloud data transfer (benign activity)
- LSASS credential dumping (authorized pentest)

**Progressive Investigation Trees:** Actions unlock based on what you discover. You can't investigate a malicious domain until you've found it in the logs.

**Context-Aware Scoring:** Rewards correct decisions and efficient investigation. Wrong decisions receive base points only - investigation efficiency modifiers apply only to correct/partial decisions.

**Educational Feedback:** Each decision explains why it's right or wrong, what evidence matters, and common analyst mistakes.

## Design Decisions

**Investigation trees** teach logical sequencing - you investigate what you've discovered, not what you assume exists.

**Scenario variety** covers the main SOC decision types: escalate real threats, close false positives, verify before disrupting business operations, check for authorized testing.

**Difficulty progression** ranges from straightforward (evidence clearly points one way) to high-pressure situations where the obvious response is wrong.

## Tech Stack

React, Vite, Tailwind CSS. Client-side only. Scenario data stored as JSON.

Built using Claude Code - I provided specifications and design decisions, Claude Code implemented the components, state management, and scoring logic.

## Running Locally

```bash
git clone https://github.com/yourusername/alert_triage_simulator_vercel.git
cd alert_triage_simulator_vercel
npm install
npm run dev
```
