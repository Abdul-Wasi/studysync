# StudySync📚

**An all-in-one academic utility platform built for real students, by a real student.**

> Live at → [studysync-three.vercel.app](https://studysync-three.vercel.app/tools)

---

## What is StudySync ?

StudySync is a full-stack academic companion app built to be used by **millions of students** across colleges and universities. It combines  the tools students actually need — attendance tracking, SGPA calculation, study planning, budget management, and peer discussion — into one clean, persistent platform. No more juggling five different apps or losing your data every session.

---

## Features

### 🎯 Academic Tools:
- **Attendance Calculator** — Input total and attended classes; get your current percentage, a visual progress bar, a pie chart, and exactly how many more classes you can skip (or need to attend) to hit your target.
- **SGPA Calculator** — Supports university-specific grading scales (IUST B.Tech, Nursing, B.Arch, Ph.D) and a generic "Others" mode. Enter marks, grades, or grade points — the form auto-fills the rest. Save results per semester with custom names and track CGPA over time.
- **Study Planner** — Create, edit, and complete tasks with due dates and times. Data persists to Firebase for logged-in users.
- **Citation Generator** — Generates APA-format citations for books, journal articles, and websites.
- **Budgeting Tool** — Track monthly income vs. expenses with real-time remaining balance and contextual spending feedback.

### 💬 Discussion Forum
- Rich-text posts and comments powered by ReactQuill with DOMPurify sanitization.
- Nested comment threads with like/unlike functionality via atomic Firebase transactions.
- Real-time updates through Firebase Realtime Database listeners.

### 👤 User System
- Email/password auth via Firebase Authentication.
- Custom display names stored in Realtime Database.
- Profile page aggregates all saved data: tasks, budget, semester history, and CGPA.
- Password reset via email.

### 🌗 Other
- Dark/light mode toggle, persisted via `body.dark` class.
- Open Graph + Twitter Card metadata for optimized social sharing.
- Vercel Analytics integration.
- Fully responsive across mobile, tablet, and desktop.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Styling | Tailwind CSS v4 (Vite plugin), custom CSS variables |
| Backend/DB | Firebase Realtime Database, Firebase Authentication |
| Rich Text | ReactQuill, DOMPurify |
| Charts | Chart.js (Pie via react-chartjs-2) |
| Icons | Lucide React, React Icons, FontAwesome |
| Email | EmailJS (contact form) |
| Notifications | React Toastify |
| Deployment | Vercel |
| Build Tool | Vite |

---

## Project Structure

```
src/
├── components/
│   ├── AttendanceCalculator.jsx
│   ├── BudgetingTool.jsx
│   ├── CitationGenerator.jsx
│   ├── DiscussionDetail.jsx
│   ├── DiscussionList.jsx
│   ├── NewDiscussionForm.jsx
│   ├── FAQPage.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ProfilePage.jsx
│   ├── SGPACalculator.jsx
│   ├── StudyPlanner.jsx
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Tools.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── styles/          # Per-component CSS files
├── utils/
│   └── gradingScales.js
├── firebase.js
└── App.jsx
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Realtime Database and Authentication enabled

### Setup

```bash
git clone https://github.com/Abdul-Wasi/StudySync
cd StudySync
npm install
```

Create a `.env` file at the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

```bash
npm run dev
```

---

## Firebase Database Structure

```
/
├── users/
│   └── {uid}/
│       ├── displayName
│       ├── email
│       ├── studyPlannerData/tasks/
│       ├── budgetingData/
│       │   ├── totalIncome
│       │   └── expenses/
│       └── sgpaData/semesters/
├── discussions/
│   └── {discussionId}/
└── comments/
    └── {discussionId}/
        └── {commentId}/
```

---

## Roadmap

- [ ] Attendance Visualizer — semester-wise charts
- [ ] Requirement Estimator — calculate classes needed for a target %
- [ ] More university grading scales (NIT, IIT, AMU, etc.)
- [ ] Employee-accepting tasks in the forum
- [ ] Push notifications for study planner reminders

---

## Author

**Abdul Wasi** — [abdulwasi.site](https://abdulwasi.site) · [LinkedIn](https://linkedin.com/in/abdulwasibhat) · [GitHub](https://github.com/Abdul-Wasi)

*B.Tech CSE, Islamic University of Science and Technology
