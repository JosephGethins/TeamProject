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

  if (!isAuthenticated) {
    return (
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Student Quiz Helper
          </Link>
          <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
            Sign In
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Student Quiz Helper
        </Link>
        
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/profile" className="hover:text-blue-200">Profile</Link>
          <Link to="/quiz" className="hover:text-blue-200">Quiz</Link>
          <Link to="/edit-timetable" className="hover:text-blue-200">Timetable</Link>
          <Link to="/data-metrics" className="hover:text-blue-200">Metrics</Link>
          <Link to="/quiz-problem" className="hover:text-blue-200">Problems</Link>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">Welcome, {user?.displayName || user?.email}</span>
            <button 
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
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
