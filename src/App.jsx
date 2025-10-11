import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import EditTimetable from "./pages/EditTimetable";
import DataMetrics from "./pages/DataMetrics";
import QuizProblem from "./pages/QuizProblem";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/edit-timetable" element={<EditTimetable />} />
          <Route path="/data-metrics" element={<DataMetrics />} />
          <Route path="/Quizproblem" element={<QuizProblem />} />
          <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;