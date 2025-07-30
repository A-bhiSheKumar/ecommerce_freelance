import React from "react";
import * as Icons from "@mui/icons-material";
import { adminMenuItems } from "../constants";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  onSelect: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const location = useLocation();

  // Get username and role from localStorage
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "Guest";

  return (
    <div className="h-full w-64 bg-gradient-to-b from-[#0f1125] to-[#0f1a4d] shadow-2xl text-white flex flex-col">
      {/* Header with user profile */}
      <div className="p-4 flex items-center space-x-3 border-b border-gray-600">
        {/* Profile Icon */}
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
          {username[0].toUpperCase()}
        </div>
        {/* Username & Role */}
        <div>
          <h2 className="text-lg font-semibold">{username}</h2>
          <p className="text-xs text-gray-300">{role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        {adminMenuItems.map((item) => {
          const IconComponent = Icons[item.icon as keyof typeof Icons];

          const path = `/home/${item.label.toLowerCase().replace(/\s+/g, "-")}`;
          const isActive = location.pathname === path;

          return (
            <button
              key={item.label}
              onClick={() => onSelect(item.label)}
              className={`flex items-center space-x-4 p-4 w-full text-left transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-inner"
                  : "hover:bg-[#1c1e3a]"
              }`}
            >
              {IconComponent && <IconComponent />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
