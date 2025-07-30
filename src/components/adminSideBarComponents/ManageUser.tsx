/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../utils/api";

const AddUser = () => {
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("USER"); // dropdown default
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        username,
        email,
        password,
        phone_number: phoneNumber,
        address,
        company_name: companyName,
        role,
      };

      console.log("Creating user:", payload);

      // Call API
      const response = await api.auth.register(payload);

      if (response) {
        // ✅ Show toast only when response is valid
        toast.success(`${role} created successfully!`);

        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        setAddress("");
        setCompanyName("");
        setRole("USER");
      } else {
        // Handle empty/invalid response
        toast.error("Failed to create user. Please try again.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1125] to-[#0f1a4d] flex items-center justify-center px-6 w-[90%]">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1f2937] to-[#111827] p-6 rounded-xl shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-white text-center">
          Add {role === "ADMIN" ? "Admin" : "User"}
        </h2>

        <p className="text-center text-gray-400 text-sm">
          Fill the form to add a new user or admin
        </p>

        {/* Username */}
        <div>
          <label className="block text-white text-sm mb-1">Username</label>
          <input
            type="text"
            className="input-style"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white text-sm mb-1">Email</label>
          <input
            type="email"
            className="input-style"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-white text-sm mb-1">Password</label>
          <input
            type="password"
            className="input-style"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-white text-sm mb-1">Phone Number</label>
          <input
            type="text"
            className="input-style"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-white text-sm mb-1">Address</label>
          <input
            type="text"
            className="input-style"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-white text-sm mb-1">Company Name</label>
          <input
            type="text"
            className="input-style"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        {/* Role Dropdown */}
        <div>
          <label className="block text-white text-sm mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-style bg-gray-800 text-white"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-md bg-gradient-to-r from-[#202020] to-black text-white font-semibold hover:opacity-90 transition"
        >
          {loading ? "Saving..." : `Create ${role}`}
        </button>
      </div>
    </div>
  );
};

export default AddUser;
