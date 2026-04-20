import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Home, Calendar, Plus } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-primary-600">
                <Calendar className="h-8 w-8" />
              </span>
              <span className="font-bold text-xl tracking-tight text-gray-900">CommunityHub</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link to="/events" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hidden sm:block">
              Explore Events
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 hidden sm:flex">
                  <Home className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/events/new" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors">
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create Event</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link to="/login" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
