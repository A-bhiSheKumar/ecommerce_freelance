import React, { useState } from "react";
import * as Icons from "@mui/icons-material";
import { menuItems } from "../constants";

interface SidebarProps {
  onSelect: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [active, setActive] = useState("Dashboard");

  const handleSelect = (label: string) => {
    setActive(label);
    onSelect(label);
  };

  return (
    <div className="h-full w-64 bg-gradient-to-b from-gray-900 to-gray-700 shadow-2xl text-white flex flex-col">
      <div className="p-4 text-lg font-bold flex items-center space-x-2">
        <span className="material-icons text-3xl">BAM TARA</span>
        <span>BillingSystem</span>
      </div>
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => {
          const IconComponent = Icons[item.icon as keyof typeof Icons];

          return (
            <button
              key={item.label}
              onClick={() => handleSelect(item.label)}
              className={`flex items-center space-x-4 p-3 w-full rounded transition-all ${
                active === item.label
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-gray-600"
              }`}
            >
              {IconComponent && <IconComponent />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      {/* <div className="p-4">
        <button
          className="w-full p-3 bg-blue-500 rounded text-white hover:opacity-90"
          onClick={handleBills}
        >
          Check Bills
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
