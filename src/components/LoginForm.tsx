import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("CUSTOMER");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const payload = { username, password };
      const response = await api.auth.login(payload);

      if (response) {
        toast.success("Login successful!");
        console.log("Login successful:", response);

        const accessToken = response.access;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", response.refresh);
        localStorage.setItem("user_id", response.user_id.toString());
        localStorage.setItem("role", response.role);
        localStorage.setItem("username", response.username);
        localStorage.setItem("email", response.email);

        if (response.role === "ADMIN") {
          navigate("/home");
        } else {
          // Redirect to kalida site with access_token
          localStorage.clear();
          window.location.href = `https://kalida-ecommerce.vercel.app/?token=${accessToken}`;
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const payload = {
        username,
        email,
        password,
        role,
        phone_number: phoneNumber,
        address,
        company_name: companyName,
      };
      const response = await api.auth.register(payload);

      if (response) {
        toast.success("Signup successful. Please log in.");
        setIsSignup(false);
      } else {
        toast.error("Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Info Panel */}
      <div className="w-1/2 hidden md:flex items-center justify-center relative p-2 bg-gradient-to-b from-[#0f1125] to-[#0f1a4d]">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1581084243124-209fc8f93cf6?q=80&w=1287"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 text-white text-center px-8 py-10 backdrop-brightness-75">
            <h1 className="text-3xl font-semibold">Our Organisation</h1>
            <p className="text-xl mt-2">Anything you can Imagine</p>
            <p className="text-sm mt-1 opacity-75">
              Generate any type of art with Openartistic
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-[#0f1125] to-[#0f1a4d] flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          <div>
            <p className="text-sm text-white text-opacity-60">
              {isSignup ? "New to Organization?" : "Login to your account"}
            </p>
            <h2 className="text-3xl font-bold text-white">
              {isSignup ? "Create Account" : "Welcome Back!"}
            </h2>
            <p className="text-white text-opacity-70 mt-1">
              {isSignup
                ? "Please fill the form to create an account"
                : "Enter your username and password"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-style"
                placeholder="Enter username or Email"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-white text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-style"
                  placeholder="Enter email"
                />
              </div>
            )}

            <div>
              <label className="block text-white text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-style"
                placeholder="Enter your password"
              />
            </div>

            {isSignup && (
              <>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-style"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-style"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input-style"
                    placeholder="Enter company name"
                  />
                </div>
              </>
            )}

            <button
              onClick={isSignup ? handleSignup : handleLogin}
              className="w-full py-3 rounded-md bg-gradient-to-r from-[#202020] to-black text-white font-semibold hover:opacity-90 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : isSignup ? (
                "Sign up"
              ) : (
                "Sign in"
              )}
            </button>

            <p className="text-sm text-white text-opacity-60 text-center">
              {isSignup ? "Already have an account?" : "New to Organization?"}{" "}
              <span
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                {isSignup ? "Login" : "Sign up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
