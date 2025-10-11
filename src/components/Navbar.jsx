import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ marginBottom: "20px" }}>
    <Link to="/">Home</Link> |{" "}
    <Link to="/profile">Profile</Link> |{" "}
    <Link to="/quiz">Quiz</Link> |{" "}
    <Link to="/edit-timetable">Edit Timetable</Link> |{" "}
    <Link to="/data-metrics">Data Metrics</Link> |{" "}
    <Link to="/problem">Problem</Link> |{" "}
    <Link to="/settings">Settings</Link> |{" "}
    <Link to="/module-quiz">Module Quiz</Link>
  </nav>
);

export default Navbar;
