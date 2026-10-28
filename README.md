# QuickMove Operations Hub

An intelligent operational command center and coordination platform designed to manage and streamline end-to-end relocation logistics, gated society permissions, and ground team workflows across multi-city networks.

---

## 📌 Project Overview

**QuickMove Operations Hub** unifies fragmented operational channels—such as team chats, spreadsheets, and emails—into a single, real-time command dashboard. It provides ground operations coordinators with the tools needed to manage moves, monitor milestones, resolve on-ground roadblocks, and maintain transparent communication with customers, logistics vendors, and property estate managers.

---

## 🔄 Core Project Workflow

The platform coordinates the complete lifecycle of a relocation through five synchronized operational stages:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Relocation Lifecycle Workflow                         │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
  1. Intake & Routing Assessment
     • Profile customer requirements, household volume, and target move dates.
     • Check origin and destination hub coverage, applying operational network 
       guidance for any non-hub routes.
         │
         ▼
  2. Property & Gated Society Coordination
     • Track lease readiness and society management committee regulations.
     • Manage advance freight elevator reservations, move-in NOCs, and refundable 
       lift deposits to prevent moving day delays.
         │
         ▼
  3. Logistics & Moving Day Dispatch
     • Coordinate logistics partners, truck sizing (e.g. 14ft/17ft containers vs. 
       shuttle tempos for narrow bylanes), and arrival windows.
     • Monitor transit status from origin packing through destination delivery.
         │
         ▼
  4. Utilities Transfer & Documentation
     • Oversee essential utility transfers (electricity meters, piped gas, optical 
       fiber broadband) ahead of move-in.
     • Verify lease agreements and required address change documentation.
         │
         ▼
  5. Ground Issue Resolution & AI Co-Pilot
     • Process unstructured messages from drivers, security teams, or customers.
     • Rapidly triage roadblocks, determine root causes, and dispatch pre-formatted 
       contingency updates with zero delay.
```

---

## ⚡ Key Features

### 1. Centralized Pipeline Tracker
* **Multi-City Hub Coverage:** Full tracking across major metro hubs with flexible support for custom origin and destination routes.
* **Network Guidance:** Automatic indicators for out-of-network destinations highlighting where logistics or services require manual partner confirmation.
* **Risk Scoring Engine:** Real-time visibility into high-risk moves facing potential society curfew blocks, vehicle access limits, or missing paperwork.

### 2. Task Command Center
* **Milestone Tracking:** Categorized tracking across Society Permissions, Logistics, Utilities, Documentation, and Post-Move milestones.
* **Smart Filtering:** View tasks by *All*, *Due Today*, *Overdue*, and *Done*.
* **Quick Actions:** Instant status toggles and rapid task creation to keep teams synchronized.

### 3. Roadblock & Issue Management
* **Active Blocker Board:** Dedicated tracking for critical on-ground failures (e.g., security gate pass rejections, lane access restrictions, utility approval holds).
* **AI-Assisted Resolution:** Immediate recommended contingency steps and ready-to-copy communication drafts for landlords, vendors, or estate committees.
* **Resolution History:** Track resolved issues with the ability to reopen or review previous incident solutions.

### 4. Operations AI Co-Pilot
* **Chat & Message Parser:** Ingests raw, unstructured messages from drivers or field personnel, categorizes severity, and pinpoints the underlying issue.
* **Direct Task & Ticket Injection:** Convert parsed recommendations into active tasks or blocker tickets in one click.
* **Custom Communication Composer:** Generate clear, professional, or time-sensitive messages tailored for different stakeholders.

### 5. Full Pipeline Editing & Safeguards
* **Record Editing:** Update customer parameters, route details, society policies, or vendor allocation directly from the pipeline table or detail view.
* **Deletion Safeguards:** Confirmation modal prevents accidental data loss.

---

## 🛠️ Tech Stack

* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
* npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shravya117/Quick_Move.git
   cd Quick_Move
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

### Production Build

To compile and optimize the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components & modals
│   │   ├── Navbar.tsx              # Top navigation & global city/lead filters
│   │   ├── StatsCards.tsx          # Key performance metric overview cards
│   │   ├── MovesTable.tsx          # Interactive pipeline table with search & filters
│   │   ├── TaskCenter.tsx          # Task execution and milestone tracker
│   │   ├── IssueBlockerBoard.tsx   # Critical blocker and failure tracker
│   │   ├── MoveDetailModal.tsx     # Comprehensive deep-dive drawer per move
│   │   ├── AiOpsAssistantModal.tsx # AI operations co-pilot & message parser
│   │   ├── NewMoveModal.tsx        # New customer move intake form
│   │   ├── EditMoveModal.tsx       # Move record editing modal
│   │   └── DeleteConfirmModal.tsx  # Safety confirmation dialog for deletion
│   ├── data/               # Default pipeline and demonstration datasets
│   ├── types/              # TypeScript interfaces and domain models
│   ├── utils/              # Storage management and helper utilities
│   ├── App.tsx             # Root dashboard container and state orchestration
│   └── main.tsx            # Application entry point
├── package.json
└── vite.config.ts
```
