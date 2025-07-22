# ⭐ AlumniConnect  
### 🌐 **Alumni & Community Networking Web Platform with AI Integration**

---

## 📝 Project Overview

**AlumniConnect** is a community-driven **web platform** designed to bridge connections between students, alumni, and professionals from various institutions such as colleges, schools, companies, and clubs. 

The platform empowers users to:
- Network with alumni and peers.
- Get AI-powered career guidance.
- Receive job referrals and track professional goals.
- Engage in topic-based communities and discussions.

Built with modern web technologies and Firebase backend, **AlumniConnect** is optimized for 24/7 usage and real-time updates.

---

## 🔑 Key Features

### 🔹 1. User Profile  [16 july 25]
- Complete profile system with photo, bio, education, and work.
- Skills, interests, and achievements.
- Goal tracker and certifications.

### 🔹 2. AI Chat Assistant *(Coming Soon)*  
- Career advice & mentorship suggestions.
- Dynamic goal tracking and personalized responses.
- Resume, job, and skill guidance.

### 🔹 3. Connection System [21 july 25]
- Send and accept friend/connection requests.
- Mutual connection-based networking (like LinkedIn/Facebook).
- Secure request and response system with Firestore.

### 🔹 4. One-to-One Chatting *(Upcoming)*  
- **Real-time Messaging**: Send and receive messages instantly using Firebase Firestore.  
- **User-based Chat Threads**: Each conversation is uniquely identified by user pairs.  

### 🔹 5. Community Feed *(Upcoming)*  
- Share posts, articles, jobs, and opportunities.
- Interact through likes/comments.
- Filter posts by tags or interest areas.

### 🔹 6. Alumni Groups *(Upcoming)*  
- Batch, department, or company-based groups.
- Share updates and organize events (e.g. webinars, reunions).

---

## 🛠️ Tech Stack

### 🧩 Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS (with custom dark/light theme)
- **Authentication**: Firebase Auth
- **File Uploads**: Cloudinary (profile & background images)

### 🧩 Backend & Database
- **Database**: Firebase Firestore (NoSQL)
- **Hosting**: Vercel
- **AI Assistant**: (Planned) OpenAI API or custom NLP model via Python backend

### 🧩 Tools
- Figma – UI/UX prototyping  
- GitHub – Version control  
- Cloudinary – Image storage  
- Firebase – Realtime database, auth, and hosting  

---

## 📜 Project Journey

| Date Range         | Milestone                                           | Status       |
|--------------------|-----------------------------------------------------|--------------|
| May 2025           | 💡 Initial Idea & Planning                          | ✅ Completed |
| 1-5 July 2025       | Project Started (Frontend + Firebase)            | ✅ Completed |
| 6–16 July 2025     |  User Profile Page (with Firestore + Cloudinary) | ✅ Completed |
| 17–21 July 2025    | 🔗 Friend/Connection System with Firestore          | ✅ Completed |
| 22 July – Aug 2025 | Real-time chatting system             | ⏳ In Progress |


---

## 📅 Project Phases & Timeline

| Phase                         | Description                                                                 | Status     |
|------------------------------|-----------------------------------------------------------------------------|------------|
| Phase 1: Planning & Research | Feature finalization, tech stack, AI use-cases                             | ✅ Done     |
| Phase 2: UI/UX Design        | Wireframes, flowcharts, and prototyping in Figma                          | ✅ Done     |
| Phase 3: Auth + Firestore    | Firebase setup, user profile schema, storage                              | ✅ Done     |
| Phase 4: Profile System      | Section-based dynamic profile, editable entries, image support            | ✅ Done     |
| Phase 5: Connection System   | Mutual request/response handling, secure writes                           | ✅ Done     |
| Phase 6: Real-time Chatting System | One-to-one messaging using MongoDB, chat UI, and message persistence      | ⏳ Planned  |

---

## 🚀 How to Run Locally

```bash
git clone https://github.com/your-username/alumniconnect.git
cd alumniconnect
npm install
npm run dev
