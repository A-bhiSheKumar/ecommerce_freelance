import { useState } from "react";
import AddPurchaseInfo from "./AddPurchaseInfo/AddPurchaseInfo";
import AddUserInfo from "./AddUserInfo/AddUserInfo";
import CheckoutPage from "./CheckoutBill/CheckoutBill";

const MainBilling = () => {
  const [activeTab, setActiveTab] = useState<
    "userInfo" | "purchaseItems" | "checkout"
  >("userInfo");

  // Move formData to the parent
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
    customer_id: "",
    purchase_date: "",
    gst_number: "",
  });

  const handleNext = () => {
    if (activeTab === "userInfo") setActiveTab("purchaseItems");
    else if (activeTab === "purchaseItems") setActiveTab("checkout");
  };

  return (
    <div className="main-billing-container">
      <div className="p-4 text-black flex space-x-8 border-b border-gray-200">
        <button
          className={`topbar-button relative pb-2 ${
            activeTab === "userInfo"
              ? "text-blue-700 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("userInfo")}
        >
          Add Billing Info
          {activeTab === "userInfo" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 opacity-80"></span>
          )}
        </button>
        <button
          className={`topbar-button relative pb-2 ${
            activeTab === "purchaseItems"
              ? "text-blue-700 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("purchaseItems")}
        >
          Billing List
          {activeTab === "purchaseItems" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 opacity-80"></span>
          )}
        </button>
        <button
          className={`topbar-button relative pb-2 ${
            activeTab === "checkout"
              ? "text-blue-700 font-semibold"
              : "text-gray-600"
          }`}
          // onClick={() => setActiveTab("checkout")}
        >
          Chekout
          {activeTab === "checkout" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 opacity-80"></span>
          )}
        </button>
      </div>
      <div className="content-section p-4">
        {activeTab === "userInfo" && (
          <AddUserInfo
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        )}
        {activeTab === "purchaseItems" && (
          <AddPurchaseInfo formData={formData} onNext={handleNext} />
        )}
        {activeTab === "checkout" && <CheckoutPage formData={formData} />}
      </div>
    </div>
  );
};

export default MainBilling;
