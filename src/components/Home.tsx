import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Get user data from localStorage
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 flex items-center justify-center p-6 relative">
      {/* 🔒 Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-sm text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>

      {/* 👤 Profile Icon */}
      <div
        onClick={() => setShowModal(true)}
        className="absolute top-6 left-6 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg"
        title="View Profile"
      >
        <span className="text-white font-bold text-lg">
          {username?.[0]?.toUpperCase() || "U"}
        </span>
      </div>

      {/* 👤 Modal */}
      {showModal && (
        <div className="absolute top-20 left-6 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white w-64 shadow-xl z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Your Profile</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white text-sm"
            >
              ✖
            </button>
          </div>
          <div className="text-sm space-y-2">
            <p>
              <strong>Username:</strong> {username || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {email || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {role || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Center content */}
      <div className="text-center space-y-6 text-white">
        <div className="animate-pulse text-5xl font-extrabold tracking-wide">
          🚧 Work in Progress 🚧
        </div>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          This section is currently under construction. We’re working hard to
          bring you something awesome!
        </p>
        <div className="relative flex justify-center">
          <div className="w-20 h-20 border-4 border-dashed border-yellow-400 rounded-full animate-spin"></div>
        </div>
        <div className="text-sm text-gray-400">
          Stay tuned. Cool stuff is coming your way! 🚀
        </div>
      </div>
    </div>
  );
};

export default Home;
