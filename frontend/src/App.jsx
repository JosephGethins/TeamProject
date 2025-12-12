import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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
import Onboarding from "./pages/Onboarding";
import Navbar from "./components/Navbar";
import QuestionBank from "./pages/QuestionBank";

function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const themeToApply = savedTheme || "professional";
    document.documentElement.setAttribute("data-theme", themeToApply);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
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
          <Route path="/question-bank" element={
            <ProtectedRoute>
              <QuestionBank />
            </ProtectedRoute>
}           />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;