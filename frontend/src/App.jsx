import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import EditTimetable from "./pages/EditTimetable";
import DataMetrics from "./pages/DataMetrics";
import QuizProblem from "./pages/QuizProblem";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/edit-timetable" element={
            <ProtectedRoute>
              <EditTimetable />
            </ProtectedRoute>
          } />
          <Route path="/data-metrics" element={
            <ProtectedRoute>
              <DataMetrics />
            </ProtectedRoute>
          } />
          <Route path="/quiz-problem" element={
            <ProtectedRoute>
              <QuizProblem />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;