// import { api } from "../../../utils/api";

interface AddUserInfoProps {
  formData: {
    full_name: string;
    phone_number: string;
    email: string;
    address: string;
    customer_id: string;
    purchase_date: string;
    gst_number: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      full_name: string;
      phone_number: string;
      email: string;
      address: string;
      customer_id: string;
      purchase_date: string;
      gst_number: string;
    }>
  >;
  onNext: () => void;
}

const AddUserInfo: React.FC<AddUserInfoProps> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("FormData --->", formData);

      // Create FormData and append customerDetails
      const formDataPayload = new FormData();
      formDataPayload.append("customerDetails", JSON.stringify(formData));

      // const response = await api.userInfo.addCustomerInfo(formDataPayload);

      // console.log("API Response:", response);
      onNext(); // Navigate to the next component
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Details Form
      </h1>
      <form onSubmit={handleNextClick}>
        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter full name"
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter contact number"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter email"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address<span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter address"
          />
        </div>

        {/* Customer ID */}
        <div className="mb-4">
          <label
            htmlFor="customer_id"
            className="block text-sm font-medium text-gray-700"
          >
            Customer ID (Optional)
          </label>
          <input
            type="text"
            id="customer_id"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter customer ID"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700"
          >
            GST Number (Optional)
          </label>
          <input
            type="text"
            id="gst_number"
            name="gst_number"
            value={formData.gst_number}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter contact number"
          />
        </div>

        {/* Date of Purchase */}
        <div className="mb-4">
          <label
            htmlFor="purchase_date"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Purchase<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="purchase_date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserInfo;
