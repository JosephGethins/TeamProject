import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOutUser } from "../utils/auth";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOutUser();
    if (result.success) {
      navigate('/login');
    }
  };

  const navStyle = {
    background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))'
  };

  if (!isAuthenticated) {
    return (
      <nav style={navStyle} className="text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Student Quiz Helper
          </Link>
          <Link 
            to="/login" 
            className="bg-white text-[var(--color-primary)] px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav style={navStyle} className="text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Student Quiz Helper
        </Link>
        
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-white/70 transition">Home</Link>
          <Link to="/profile" className="hover:text-white/70 transition">Profile</Link>
          <Link to="/quiz" className="hover:text-white/70 transition">Quiz</Link>
          <Link to="/edit-timetable" className="hover:text-white/70 transition">Timetable</Link>
          <Link to="/data-metrics" className="hover:text-white/70 transition">Metrics</Link>
          <Link to="/quiz-problem" className="hover:text-white/70 transition">Problems</Link>
          
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm">Welcome, {user?.displayName || user?.email}</span>
            <button 
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
