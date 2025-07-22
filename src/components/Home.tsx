const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 flex items-center justify-center p-6">
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
