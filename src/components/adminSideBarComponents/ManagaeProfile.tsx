import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ManageProfile = () => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Get user data from localStorage
  const [userData, setUserData] = useState({
    username: "N/A",
    email: "N/A",
    role: "N/A",
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setUserData({
        username: localStorage.getItem("username") || "N/A",
        email: localStorage.getItem("email") || "N/A",
        role: localStorage.getItem("role") || "N/A",
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // Clear all user-related data
    localStorage.clear();
    navigate("/"); // Typically redirect to login after logout
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20 mix-blend-multiply"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-20 mix-blend-multiply"></div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </button>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {showCard ? (
            <motion.div
              key="profile-card"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Profile Details
                </h2>
                <button
                  onClick={() => setShowCard(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
                  aria-label="Close profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-800 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Username
                    </span>
                    <span className="font-medium text-lg py-2 px-3 bg-white/5 rounded-lg">
                      {userData.username}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </span>
                    <span className="font-medium text-lg py-2 px-3 bg-white/5 rounded-lg">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </span>
                    <span className="font-medium text-lg py-2 px-3 bg-white/5 rounded-lg capitalize">
                      {userData.role.toLowerCase()}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-5 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowCard(false)}
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hidden-message"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="mb-4 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-gray-400 mb-6">
                Your profile information is currently hidden.
              </p>
              <button
                onClick={() => setShowCard(true)}
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Show Profile
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageProfile;
