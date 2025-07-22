import React from "react";
import ProductTable from "./AddItem";
import { AddPurchaseInfoProps } from "../../../interface/UserInterface";

const AddPurchaseInfo: React.FC<AddPurchaseInfoProps> = ({
  formData,
  onNext,
}) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-full mx-auto">
      {/* <h2 className="text-xl font-semibold mb-6 text-center">User Details</h2> */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div className="flex justify-between items-center">
          <strong className="text-gray-800">Full Name:</strong>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {formData.full_name}
          </span>
        </div>

        <div className="flex justify-between">
          <strong>Phone Number:</strong>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {formData.phone_number}
          </span>
        </div>
        <div className="flex justify-between">
          <strong>Email:</strong>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {formData.email}
          </span>
        </div>
        <div className="flex justify-between">
          <strong>Address:</strong>
          <span className="">{formData.address}</span>
        </div>
        <div className="flex justify-between">
          <strong>Customer ID:</strong>
          <span>{formData.customer_id || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <strong>Purchase Date:</strong>
          <span>{formData.purchase_date}</span>
        </div>
        <div className="flex justify-between">
          <strong>GST Number:</strong>
          <span>{formData.gst_number}</span>
        </div>
      </div>
      <ProductTable onNext={onNext} formData={formData} />
    </div>
  );
};

export default AddPurchaseInfo;
