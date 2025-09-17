# CoHabitify - The Unified Platform for Habits, Harmony & Home

A comprehensive full-stack application built with React, Node.js, Express, and MongoDB that combines habit tracking, roommate coordination, mood tracking, and anonymous emotional expression.

## 🚀 Features

### 🎯 Habit Tracker (Habit Duel)
- Create, edit, and delete custom habits
- Daily check-ins with streak tracking
- Habit categories (Study, Health, Wellness, etc.)
- Visual progress tracking and analytics
- Badge system for achievements
- Challenge roommates in habit duels
- Missed check-in reminders
- Calendar view of habits
- Weekly/Monthly progress graphs
- Create and manage daily, weekly, or monthly habits
- Track completion streaks and progress
- Visual analytics and performance charts
- Category-based organization

### 🏠 RoomMate Management
- Invite and manage roommates
- Chore assignment and tracking
- Shared expense management
- Analytics dashboard for household activities

### 🤫 SecretCircle
- Anonymous sharing platform for roommates
- Like and comment on posts
- Safe space for thoughts and feelings

### 💭 Mood Mirror
- Daily mood tracking (1-10 scale)
- Mood analytics and trends
- Tag-based emotion categorization
- Weekly mood visualization

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cohabitify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Backend Requirements

This frontend application requires a Node.js/Express backend with the following endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/complete` - Mark habit complete
- `GET /api/habits/analytics` - Get habit analytics

### Roommate Management
- `GET /api/roommate/roommates` - Get roommates
- `POST /api/roommate/invite` - Invite roommate
- `DELETE /api/roommate/roommates/:id` - Remove roommate
- `GET /api/roommate/chores` - Get chores
- `POST /api/roommate/chores` - Create chore
- `PUT /api/roommate/chores/:id` - Update chore
- `DELETE /api/roommate/chores/:id` - Delete chore
- `POST /api/roommate/chores/:id/complete` - Complete chore
- `GET /api/roommate/expenses` - Get expenses
- `POST /api/roommate/expenses` - Create expense
- `PUT /api/roommate/expenses/:id` - Update expense
- `DELETE /api/roommate/expenses/:id` - Delete expense
- `GET /api/roommate/analytics` - Get roommate analytics

### Secret Circle
- `GET /api/secrets` - Get secrets
- `POST /api/secrets` - Create secret
- `DELETE /api/secrets/:id` - Delete secret
- `POST /api/secrets/:id/like` - Toggle like
- `GET /api/secrets/:id/comments` - Get comments
- `POST /api/secrets/:id/comments` - Add comment
- `DELETE /api/secrets/:secretId/comments/:commentId` - Delete comment

### Mood Tracking
- `GET /api/moods` - Get mood logs
- `GET /api/moods/date/:date` - Get mood by date
- `POST /api/moods` - Log mood
- `PUT /api/moods/:id` - Update mood
- `DELETE /api/moods/:id` - Delete mood
- `GET /api/moods/analytics` - Get mood analytics
- `GET /api/moods/insights` - Get mood insights

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── ui/
│       ├── Modal.tsx
│       └── Chart.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── HabitTracker.tsx
│   ├── RoomMate.tsx
│   ├── SecretCircle.tsx
│   └── MoodMirror.tsx
├── services/
│   ├── habitService.ts
│   ├── roommateService.ts
│   ├── secretService.ts
│   └── moodService.ts
├── types/
│   └── index.ts
├── lib/
│   ├── api.ts
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@cohabitify.com or join our Discord community.
