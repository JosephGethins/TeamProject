# Backend API Documentation

## Setup

1) Create an env file (Windows PowerShell):

   Copy `env.example` to `.env` and fill in values.

   Required variables:
   - `PORT` (default 4000)
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (paste with \n for newlines)
   - `FIREBASE_API_KEY` (from Firebase project settings)

2) Install and run

```bash
npm install
npm run dev
```

## API Routes

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/verify` - Verify ID token

### Users
- `POST /users/profile` - Create user profile
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/profile` - Delete user profile
- `GET /users/progress` - Get user progress
- `PUT /users/progress` - Update user progress
- `GET /users/settings` - Get user settings (Settings page)
- `PUT /users/settings` - Update user settings (Settings page)
- `GET /users/account` - Get account information (Settings page)
- `PUT /users/account` - Update account information (Settings page)

### Quizzes
- `POST /quizzes` - Create quiz (instructor only)
- `GET /quizzes` - Get all quizzes (optional ?moduleId=)
- `GET /quizzes/:quizId` - Get specific quiz
- `PUT /quizzes/:quizId` - Update quiz (instructor only)
- `DELETE /quizzes/:quizId` - Delete quiz (instructor only)
- `POST /quizzes/:quizId/questions` - Add question (instructor only)
- `GET /quizzes/:quizId/questions` - Get quiz questions
- `PUT /quizzes/:quizId/questions/:questionId` - Update question (instructor only)
- `DELETE /quizzes/:quizId/questions/:questionId` - Delete question (instructor only)
- `POST /quizzes/:quizId/attempt` - Submit quiz attempt
- `GET /quizzes/:quizId/attempts` - Get user's quiz attempts
- `GET /quizzes/attempts/all` - Get all user's quiz attempts

### Analytics
- `GET /analytics/user` - Get user analytics
- `GET /analytics/module/:moduleId` - Get module analytics
- `GET /analytics/global` - Get global analytics (admin only)
- `POST /analytics/event` - Save analytics event
- `GET /analytics/user/progress` - Get user progress over time
- `GET /analytics/user/modules` - Get user performance by module
- `GET /analytics/leaderboard` - Get leaderboard (instructor only)

### Timetable
- `POST /timetable` - Create timetable
- `GET /timetable` - Get timetable
- `PUT /timetable` - Update timetable
- `POST /timetable/schedule/:day` - Add schedule item
- `PUT /timetable/schedule/:day/:itemId` - Update schedule item
- `DELETE /timetable/schedule/:day/:itemId` - Delete schedule item
- `GET /timetable/preferences` - Get timetable preferences
- `PUT /timetable/preferences` - Update timetable preferences
- `GET /timetable/upcoming` - Get upcoming events
- `GET /timetable/schedule/:day` - Get schedule for specific day

### Modules
- `POST /modules` - Create module (instructor only)
- `GET /modules` - Get all modules
- `GET /modules/:moduleId` - Get specific module
- `GET /modules/:moduleId/quizzes` - Get module with quizzes
- `GET /modules/:moduleId/progress` - Get user's progress in module
- `PUT /modules/:moduleId` - Update module (instructor only)
- `DELETE /modules/:moduleId` - Delete module (instructor only)

### Dashboard
- `GET /dashboard` - Get dashboard data (home page)
- `GET /dashboard/stats` - Get quick stats

### Enhanced Quiz Endpoints
- `GET /quizzes/:quizId/take` - Get quiz for taking (Quiz page)
- `GET /quizzes/:quizId/problems` - Get all quiz problems (QuizProblem page)
- `GET /quizzes/:quizId/problems/:questionId` - Get specific quiz problem
- `GET /quizzes/history` - Get user's quiz history with detailed results
- `GET /quizzes/attempts/:attemptId/results` - Get detailed quiz results

### Enhanced Analytics for DataMetrics Page
- `GET /analytics/metrics` - Get comprehensive metrics for DataMetrics page
- `GET /analytics/trends` - Get performance trends over time

## Database Collections

### Users Collection
- `users/{uid}` - User profiles with preferences and settings

### Quizzes Collection
- `quizzes/{quizId}` - Quiz metadata
- `quizzes/{quizId}/questions/{questionId}` - Quiz questions

### User Progress Collection
- `userProgress/{uid}` - User progress and statistics

### Quiz Attempts Collection
- `quizAttempts/{attemptId}` - User quiz attempts and scores

### Timetables Collection
- `timetables/{uid}` - User timetable and schedule

### Analytics Events Collection
- `analyticsEvents/{eventId}` - User activity events

### Modules Collection
- `modules/{moduleId}` - Course modules and organization

## Authentication

Most routes require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## Roles

- `student` - Default role, can take quizzes and view own data
- `instructor` - Can create/edit quizzes and view analytics
- `admin` - Full access to all features


