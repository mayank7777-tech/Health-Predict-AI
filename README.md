<div align="center">
  <img width="1200" height="460" alt="HealthPredict AI banner" src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80" />
</div>

# HealthPredict AI

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite" />
  <img alt="Healthcare AI" src="https://img.shields.io/badge/AI-Clinical%20Decision%20Support-00C2A8?style=for-the-badge" />
</p>

HealthPredict AI is a hospital readmission prediction platform designed to support clinicians, administrators, and care teams with real-time risk intelligence. Built around the UCI hospital readmission dataset, the system identifies patients at elevated risk of 30-day readmissions and prioritizes them for intervention based on clinical signals, comorbidities, and patient history.

This dashboard combines modern UI design, healthcare analytics, and explainable AI principles to make serious clinical insights easier to act on.

## Why this project matters

Readmissions create operational, financial, and patient-care burdens across hospitals. Early identification of risk enables:

- proactive discharge planning
- optimized nurse outreach and interventions
- better resource allocation for high-risk patients
- reduced avoidable re-admissions and improved patient outcomes

## Key features

- Clinical risk scoring dashboard for hospital readmission prediction
- Patient prioritization queue for high-risk cases
- Population-level analytics and diagnosis mix insights
- Weekly admissions and trend monitoring across cardiac conditions
- Model performance and AI pipeline visibility
- Prediction history and risk assessment workflows
- Role-based clinical views for doctor, analyst, and admin personas
- Clean, responsive design tailored for medical operations teams

## Dashboard preview

```text
┌────────────────────────────────────────────────────────────────────┐
│ HealthPredict AI | Hospital Readmission DSS                        │
├────────────────────────────────────────────────────────────────────┤
│ Overview | Patients | Priority Queue | Risk Prediction | Reports  │
├────────────────────────────────────────────────────────────────────┤
│ Active Patients  1,284       Critical Alerts  5      Avg Recovery 84.6 │
│ AI Risk Flags 35             Readmission Risk  28.4%                 │
├────────────────────────────────────────────────────────────────────┤
│ Weekly Admissions   Diagnosis Mix     Cardiac Vitals Trend         │
│ Emergency vs Scheduled   Arrhythmia 26%   30-day clinical trend   │
└────────────────────────────────────────────────────────────────────┘
```

## Tech stack

- React 19
- TypeScript
- Vite
- Recharts for analytics
- Tailwind-inspired styling and modern UI components
- Healthcare dataset-driven simulation logic

## Project structure

```text
healthpredict-ai/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── metadata.json
```

## Run locally

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Start the app

```bash
npm run dev -- --host 0.0.0.0
```

Then open:

```text
http://localhost:3000/
```

## Use case

This application is intended for healthcare teams that need a decision-support interface to:

- surface high-risk readmission patients
- monitor care trends across wards and populations
- understand clinical drivers behind risk predictions
- prioritize interventions with more confidence

## License

This project is provided as a demo/portfolio-ready application for healthcare AI exploration and clinical decision-support prototype work.

## Contact

For collaboration, enhancements, or healthcare analytics discussions, connect with the project owner and maintainers through the repository.

---

<p align="center">
  <strong>Built for smarter hospital care decisions.</strong>
</p>
