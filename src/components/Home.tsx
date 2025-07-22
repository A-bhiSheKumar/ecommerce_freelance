import { useState } from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";

const Home = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  return (
    <>
      {/* Ensure this container takes full height */}
      <div className="flex h-screen bg-red-400">
        <Sidebar onSelect={(section) => setActiveSection(section)} />
        <Content activeSection={activeSection} />
      </div>
    </>
  );
};

export default Home;
