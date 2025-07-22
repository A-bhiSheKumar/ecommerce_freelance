const LoginForm = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image and Text */}
      <div className="w-1/2 hidden md:flex items-center justify-center relative p-2 bg-gradient-to-b from-[#0f1125] to-[#0f1a4d]">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1581084243124-209fc8f93cf6?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 text-white text-center px-8 py-10 backdrop-brightness-75">
            <h1 className="text-3xl font-semibold">Our Organigination</h1>
            <p className="text-xl mt-2">Anything you can Imagine</p>
            <p className="text-sm mt-1 opacity-75">
              Generate anytype of art with Openartistic
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-[#0f1125] to-[#0f1a4d] flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          <div>
            <p className="text-sm text-white text-opacity-60">
              Login your account
            </p>
            <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
            <p className="text-white text-opacity-70 mt-1">
              Enter your email and password
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-white text-sm mb-1">
                Email address
              </label>
              <input
                type="email"
                defaultValue="Hello@basitkhan.design"
                className="w-full px-4 py-3 rounded-md bg-[#0d1025] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-md bg-[#0d1025] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-blue-400 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-gradient-to-r from-[#202020] to-black text-white font-semibold hover:opacity-90 transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
