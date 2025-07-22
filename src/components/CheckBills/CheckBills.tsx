import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { api } from "../../utils/api";
import { Dues } from "../../interface/DuesInterface";

// Define types for Bill and User
interface Bill {
  item: string;
  amount: number;
  items_purchase_date: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  purchase_date: string;
  bills: Bill[];
}

const CheckBills: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duesInfo, setDuesInfo] = useState<Dues[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleUserClick = (user: User): void => {
    setSelectedUser(user);
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
  };

  const handleBack = (): void => {
    setSelectedUser(null);
    sessionStorage.removeItem("selectedUser");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchClick = async () => {
    if (searchTerm.length >= 5) {
      // you can decide minimum length
      await fetchData(searchTerm);
    } else {
      setSearchedUser(null);
      setError("Please enter a valid 10 digits number to search");
    }
  };

  const fetchData = useCallback(async (phone_number: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.itemsInfo.getCustomerWithItemsDetails({
        phone_number,
      });
      console.log("Consolelofforthis----->>>", response);

      if (response) {
        const customerData = response.customer;
        const itemsData = response.items || [];
        const duesInfoData = response.duesInfo || [];
        setDuesInfo(duesInfoData);
        sessionStorage.setItem("duesInfo", JSON.stringify(duesInfoData));
        const userData: User = {
          id: customerData.id,
          name: customerData.full_name,
          phone: customerData.phone_number,
          purchase_date: customerData.purchase_date,
          bills: itemsData.map((item: any) => ({
            item: item.name,
            amount: parseFloat(item.price) || 0,
            items_purchase_date: item.items_purchase_date || "N/A",
          })),
        };

        setSearchedUser(userData);
        sessionStorage.setItem("searchedUser", JSON.stringify(userData));
      } else {
        setError("Customer not found");
        setSearchedUser(null);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data");
      setSearchedUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (bill: Bill, index: number) => {
    setEditingBill({ ...bill });
    setEditIndex(index);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Bill
  ) => {
    if (editingBill) {
      setEditingBill({
        ...editingBill,
        [field]:
          field === "amount" ? parseFloat(e.target.value) || 0 : e.target.value,
      });
    }
  };

  const handleSaveEdit = async () => {
    if (editingBill && editIndex !== null && selectedUser) {
      try {
        setLoading(true);

        // Here you would typically call your API to update the bill
        // For example:
        // await api.itemsInfo.updateBill({
        //   userId: selectedUser.id,
        //   billId: selectedUser.bills[editIndex].id, // You might need to add an id to your Bill interface
        //   updates: editingBill
        // });

        // For now, we'll just update the local state
        const updatedBills = [...selectedUser.bills];
        updatedBills[editIndex] = editingBill;

        const updatedUser = {
          ...selectedUser,
          bills: updatedBills,
        };

        setSelectedUser(updatedUser);
        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));

        // If you're also showing this user in searchedUser, update that too
        if (searchedUser && searchedUser.id === selectedUser.id) {
          const updatedSearchedUser = {
            ...searchedUser,
            bills: updatedBills,
          };
          setSearchedUser(updatedSearchedUser);
          sessionStorage.setItem(
            "searchedUser",
            JSON.stringify(updatedSearchedUser)
          );
        }

        setEditingBill(null);
        setEditIndex(null);
      } catch (error) {
        console.error("Failed to update bill:", error);
        setError("Failed to update bill");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingBill(null);
    setEditIndex(null);
  };

  useEffect(() => {
    const savedSearchedUser = sessionStorage.getItem("searchedUser");
    const savedSelectedUser = sessionStorage.getItem("selectedUser");
    const savedDuesInfo = sessionStorage.getItem("duesInfo");

    if (savedSearchedUser) {
      setSearchedUser(JSON.parse(savedSearchedUser));
    }
    if (savedSelectedUser) {
      setSelectedUser(JSON.parse(savedSelectedUser));
    }
    if (savedDuesInfo) {
      setDuesInfo(JSON.parse(savedDuesInfo));
    }
  }, []);

  const currentDate = moment().format("MMMM Do, YYYY");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br p-6 flex flex-col items-center">
        {!selectedUser ? (
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-700 text-center">
              User Bills Portal
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Today: {currentDate}
            </p>

            {/* Search input */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Search by phone number..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearchClick}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {loading && (
              <p className="text-center text-blue-500 mb-4">Loading...</p>
            )}
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}

            <ul className="divide-y divide-gray-200">
              {searchedUser ? (
                <li
                  onClick={() => handleUserClick(searchedUser)}
                  className="py-4 px-6 flex justify-between items-center bg-gray-50 hover:bg-blue-100 rounded-lg shadow-md transition cursor-pointer mb-4"
                >
                  <div>
                    <span className="text-lg font-medium text-gray-800 block">
                      {searchedUser.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {searchedUser.phone}
                    </span>
                  </div>
                  <span className="text-sm text-blue-500 font-semibold">
                    View Bills
                  </span>
                </li>
              ) : (
                !loading && (
                  <li className="py-4 text-center text-gray-500">
                    Search by phone number to find user
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6">
            <div className="flex gap-4 mb-6">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Dues Info
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Bills for {selectedUser.name}
            </h2>
            <p className="text-gray-500 mb-2">Phone: {selectedUser.phone}</p>
            <p className="text-gray-500 mb-6">
              Date:{" "}
              {new Date(selectedUser.purchase_date).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )}
            </p>

            <table className="w-full text-left table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border py-3 px-4 font-semibold text-gray-700">
                    Item
                  </th>
                  <th className="border py-3 px-4 font-semibold text-gray-700">
                    Amount ($)
                  </th>
                  <th className="border py-3 px-4 font-semibold text-gray-700">
                    Date (dd/mm/yy)
                  </th>
                  <th className="border py-3 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.bills.map((bill, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition">
                    {editIndex === index ? (
                      <>
                        <td className="border py-3 px-4">
                          <input
                            type="text"
                            value={editingBill?.item || ""}
                            onChange={(e) => handleEditChange(e, "item")}
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="border py-3 px-4">
                          <input
                            type="number"
                            value={editingBill?.amount || 0}
                            onChange={(e) => handleEditChange(e, "amount")}
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="border py-3 px-4">
                          <input
                            type="date"
                            value={editingBill?.items_purchase_date || ""}
                            onChange={(e) =>
                              handleEditChange(e, "items_purchase_date")
                            }
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="border py-3 px-4">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-green-600 text-white rounded mr-2 hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border py-3 px-4 text-gray-800">
                          {bill.item}
                        </td>
                        <td className="border py-3 px-4 text-gray-800">
                          {bill.amount}
                        </td>
                        <td className="border py-3 px-4 text-gray-800">
                          {bill.items_purchase_date}
                        </td>
                        <td className="border py-3 px-4">
                          <button
                            onClick={() => handleEdit(bill, index)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Dues Information
            </h2>

            {duesInfo.length > 0 ? (
              <ul className="space-y-4 mb-4">
                {duesInfo.map((due, idx) => (
                  <li
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
                  >
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {due.duesNotes?.description || "No description"}
                    </p>

                    <div className="text-sm space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium text-gray-800">
                          Total:
                        </span>{" "}
                        ₹{Number(due.duesNotes?.total_amount || 0).toFixed(2)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-800">Paid:</span>{" "}
                        ₹{Number(due.duesNotes?.paid_amount || 0).toFixed(2)}
                      </p>

                      <p>
                        <span className="font-medium text-gray-800">
                          Pending:
                        </span>{" "}
                        ₹{Number(due.duesNotes?.pending_amount || 0).toFixed(2)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-800">
                          Due Date:
                        </span>{" "}
                        {new Date(due.duesNotes?.due_date).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                No dues information available.
              </p>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckBills;
