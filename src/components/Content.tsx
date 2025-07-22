import React from "react";
import MainBilling from "./Billings/MainBilling";
import DashboardHome from "./dashboardHome/DashboardHome";
import CheckBills from "./CheckBills/CheckBills";

interface ContentProps {
  activeSection: string;
}

const Content: React.FC<ContentProps> = ({ activeSection }) => {
  const renderSectionContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardHome />;
      case "Tables":
        return <MainBilling />;
      case "Billing":
        return <MainBilling />;
      case "Check Bills":
        return <CheckBills />;
      default:
        return <div>Select a section to view content.</div>;
    }
  };
  return (
    <div className="flex-1 p-6 bg-white">
      <h1 className="text-2xl font-bold mb-2">{activeSection}</h1>
      {renderSectionContent()}
    </div>
  );
};

export default Content;
