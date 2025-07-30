import Sidebar from "./Sidebar";
import { Routes, Route, useNavigate } from "react-router-dom";
import DashboardHome from "./adminSideBarComponents/DashboardHome";
import ViewCotation from "./adminSideBarComponents/ViewCotation";
import ManagaeProfile from "./adminSideBarComponents/ManagaeProfile";
import AddUser from "./adminSideBarComponents/ManageUser";
import ProductDetails from "./adminSideBarComponents/ProductDetails";

const HomeLayout = () => {
  const navigate = useNavigate();

  const handleSelect = (label: string) => {
    const route = label.toLowerCase().replace(/\s+/g, "-");
    // ✅ Absolute navigation (not nested again)
    navigate(`/home/${route}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={handleSelect} />
      <div className="flex-1 bg-[#0f1125] text-white overflow-auto p-6">
        <Routes>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="category-details" element={<ProductDetails />} />
          <Route path="view-cotation" element={<ViewCotation />} />
          <Route path="manage-profile" element={<ManagaeProfile />} />
          {/* Default route */}
          <Route index element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomeLayout;
