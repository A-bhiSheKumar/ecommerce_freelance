import React, { useCallback, useContext, useEffect, useState } from "react";
import { AddPurchaseInfoProps } from "../../../interface/UserInterface";
import ItemContext from "../../../context/ItemsContext/itemsContext";
import { Item } from "../../../interface/ProductInterface";
import { numberToWords } from "../../../utils/AmountFunctions";
import { FaPrint, FaWhatsapp, FaDownload, FaTimes } from "react-icons/fa";
import signatureImg from "../../../assets/signature.png";
import jsPDF from "jspdf";
import "./checkoutStyles.css";
import { api } from "../../../utils/api";
import { Dues } from "../../../interface/DuesInterface";
const CheckoutPage: React.FC<AddPurchaseInfoProps> = ({ formData }) => {
  const { items } = useContext(ItemContext);
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duesInfo, setDuesInfo] = useState<Dues[]>([]);
  const [dueModalOpen, setDueModalOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const totalPrice = items.reduce((total: number, item: Item) => {
    const price = parseFloat(item.price) * parseFloat(item.quantity);
    return total + price;
  }, 0);

  const roundedTotalPrice = Math.round(totalPrice * 10) / 10;

  const totalInWords = numberToWords(totalPrice);

  const handleCheckoutAction = async (action: string) => {
    if (action === "print") {
      window.print();
    } else if (action === "whatsapp") {
      const message = `Checkout Details: Total: ₹${roundedTotalPrice}, Amount in words: ${totalInWords}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    } else if (action === "download") {
      const doc = new jsPDF();
      let y = 10;
      const lineHeight = 8;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("M/s BAM TARA Enterprise(Prop: N G Das)", 10, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("Sitala Mandir Road , Chanditala Park", 10, y);
      y += lineHeight;
      doc.text("State Name: West Bengal, Code: 19", 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(`GSTIN: 19AGYPD7229G2ZV`, 140, 10);
      doc.text(`Dated: ${formData.purchase_date}`, 140, 10 + lineHeight);
      y += 15;

      // Buyer Details
      doc.setFont("helvetica", "bold");
      doc.text("Buyer Details", 10, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${formData.full_name}`, 10, y);
      y += lineHeight;
      doc.text(`Address: ${formData.address}`, 10, y);
      y += lineHeight;
      doc.text(`Phone: ${formData.phone_number}`, 10, y);
      y += lineHeight;
      doc.text(`Email: ${formData.email}`, 10, y);
      y += lineHeight;
      doc.text(`GSTIN: ${formData.gst_number}`, 10, y);
      y += lineHeight + 4;

      // Table Header
      doc.setFont("helvetica", "bold");
      doc.text("Description", 10, y);
      doc.text("Weight", 70, y);
      doc.text("Qty", 100, y);
      doc.text("Dimensions", 120, y);
      doc.text("Amount", 200, y, { align: "right" });
      y += lineHeight;

      doc.setFont("helvetica", "normal");

      // Table Rows
      items.forEach((item) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        const amount = (
          parseFloat(item.price) * parseFloat(item.quantity)
        ).toFixed(2);
        doc.text(`${item.name}-(${item.items_purchase_date})`, 10, y);
        doc.text(`${item.weight || "N/A"}`, 70, y);
        doc.text(`${item.quantity || "N/A"}`, 100, y);
        doc.text(`${item.dimensions || "N/A"}`, 120, y);
        doc.text(`Rs-${amount}`, 200, y, { align: "right" });
        y += lineHeight;
      });

      // Total & Words
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Total: Rs-${roundedTotalPrice}`, 200, y, { align: "right" });
      y += lineHeight;
      doc.setFont("helvetica", "italic");
      doc.text(`Amount in words: ${totalInWords}`, 200, y, { align: "right" });
      y += 10;

      // Due Bills Info
      if (duesInfo.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = 10;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("Due Bills Info:", 10, y);
        y += lineHeight;

        duesInfo.forEach((due) => {
          const totalAmount = `₹${Number(
            due.duesNotes?.total_amount || 0
          ).toFixed(2)}`;
          const paidAmount = `₹${Number(
            due.duesNotes?.paid_amount || 0
          ).toFixed(2)}`;
          const pendingAmount = `₹${Number(
            due.duesNotes?.pending_amount || 0
          ).toFixed(2)}`;

          // One-line horizontal layout
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);

          const leftX = 10;
          const mid1X = 80;
          const mid2X = 140;

          doc.text(`Total Amount: ${totalAmount}`, leftX, y);
          doc.text(`Paid Amount: ${paidAmount}`, mid1X, y);
          doc.text(`Pending Amount: ${pendingAmount}`, mid2X, y);
          y += lineHeight;
        });

        doc.setFontSize(11); // Reset font size after section
      }

      // Signature Image
      const img = new Image();
      img.src = signatureImg;
      img.onload = () => {
        if (y > 250) {
          doc.addPage();
          y = 10;
        }
        doc.addImage(img, "PNG", 10, y, 50, 20);
        doc.setFont("helvetica", "normal");
        doc.text("Signature", 35, y + 25, { align: "center" });

        const fileName = `${formData.full_name}_${new Date()
          .toLocaleDateString()
          .replace(/\//g, "-")}.pdf`;
        doc.save(fileName);
      };
    }

    setIsModalOpen(false);
  };

  console.log("Checkingforthedimensions--->");
  const handleOpenDueModal = () => {
    setDueModalOpen(true);
  };

  const handleCloseDueModal = () => {
    setDueModalOpen(false);
  };
  const handleConfirmModel = async () => {
    const payload = {
      phone_number: formData.phone_number,
      duesNotes: {
        paid_amount: paidAmount,
        total_amount: roundedTotalPrice,
        pending_amount: roundedTotalPrice - paidAmount,
        due_date: formData.purchase_date,
        description: description,
      },
    };

    try {
      const response = await api.billingInfo.addPendingDueNote(payload);
      console.log("Checkingdueresponse---->>", response);
      if (response) {
        alert("✅ Successfully added the due!");
      } else {
        alert("⚠️ Failed to add the due. Please try again.");
      }

      setDueModalOpen(false);
      setPaidAmount(0); // Reset when closed
      setDescription("");
    } catch (error) {
      console.error("Error while closing and sending due modal:", error);
      alert("❌ Something went wrong while adding the due.");
    }
  };

  const fetchData = useCallback(async (phone_number: string) => {
    try {
      setIsRefreshing(true);
      const response = await api.itemsInfo.getCustomerWithItemsDetails({
        phone_number,
      });
      console.log("Console output ----->>>", response);

      if (response) {
        const duesInfoData = response.duesInfo || [];
        setDuesInfo(duesInfoData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const phone_number = formData.phone_number;
    fetchData(phone_number);
  }, [fetchData]);

  const payableAmount = Math.max(roundedTotalPrice - paidAmount, 0);

  // const currentDate = new Date().toLocaleDateString();
  return (
    <>
      <div className="max-w-7xl mx-auto p-4 border shadow-md bg-white">
        <div id="invoice">
          {/* Header Section */}
          <div className="grid grid-cols-2 gap-4 mt-4 border-b pb-4">
            <div>
              <p>
                <strong>M/s BAM TARA Enterprise(Prop: N G Das)</strong>
              </p>
              <p>Sitala Mandir Road , Chanditala Park</p>
              <p>State Name: West Bengal, Code: 19</p>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Invoice Details</h2>
              <p>
                GST: <strong>19AGYPD7229G2ZV</strong>
              </p>
              <p>
                Dated: <strong>{formData.purchase_date}</strong>
              </p>
              {/* <p>
              Mode of Payment: <strong>Other</strong>
            </p> */}
            </div>
          </div>

          {/* Buyer Section */}

          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h1 className="font-bold text-xl">{formData.full_name}</h1>
              <p>{formData.address}</p>
              <p>Phone: {formData.phone_number}</p>
              <p>Email: {formData.email}</p>
              <p>GSTIN: {formData.gst_number}</p>
              <p>State Name: West Bengal, Code: 19</p>
            </div>
          </div>

          {/* if dues is added and there is a due than show this */}

          <div className="mb-6 rounded-lg border border-gray-300 p-4 shadow-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-800">
                Due Bills Info
              </h1>
              <button
                onClick={() => fetchData(formData.phone_number)}
                className="flex items-center text-blue-600 hover:underline text-sm"
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10h4z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-blue-600 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4v5h.582l2.382-2.38A6 6 0 1110 16v-2a4 4 0 10-3.582-2.12l-2.28-2.28H4z" />
                  </svg>
                )}
                Refresh
              </button>
            </div>

            {duesInfo.length > 0 ? (
              <div className="space-y-6">
                {duesInfo.map((due, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <p className="text-base font-medium mb-3 text-gray-700">
                      {due.duesNotes?.description || "No description"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <label className="block text-gray-500 font-medium mb-1">
                          Total Amount
                        </label>
                        <div className="bg-white p-2 rounded border">
                          ₹{Number(due.duesNotes?.total_amount || 0).toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 font-medium mb-1">
                          Paid Amount
                        </label>
                        <div className="bg-white p-2 rounded border">
                          ₹{Number(due.duesNotes?.paid_amount || 0).toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 font-medium mb-1">
                          Pending Amount
                        </label>
                        <div className="bg-white p-2 rounded border">
                          ₹
                          {Number(due.duesNotes?.pending_amount || 0).toFixed(
                            2
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No dues information available.
              </p>
            )}
          </div>

          {/* Table Section */}
          <div className="mt-4">
            {/* Header */}
            <div className="grid grid-cols-12 text-sm font-semibold border-b py-2 bg-gray-100">
              <div className="col-span-6">Description of Goods</div>
              <div className="col-span-2 text-center">Weight</div>
              <div className="col-span-1 text-center">Quantity</div>
              <div className="col-span-1 text-center">Dimensions</div>
              <div className="col-span-2 text-center">Amount</div>
            </div>

            {/* Items */}
            {items.map((item: Item, index: number) => (
              <div
                key={index}
                className="grid grid-cols-12 border-b py-2 text-sm items-center"
              >
                <div className="col-span-6 truncate flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">
                    {item.name || "N/A"}
                  </span>
                  {item.items_purchase_date && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {item.items_purchase_date}
                    </span>
                  )}
                </div>

                <div className="col-span-2 text-center">
                  {item.weight || "N/A"}
                </div>
                <div className="col-span-1 text-center">
                  {item.quantity || "N/A"}
                </div>
                <div className="col-span-1 text-center">
                  {item.dimensions || "N/A"}
                </div>
                <div className="col-span-2 text-center">
                  ₹
                  {(
                    (parseFloat(item.price || "0") || 0) *
                    (parseFloat(item.quantity || "0") || 0)
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Section */}
          <div className="mt-4">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="font-semibold text-lg">
                  Total: ₹{roundedTotalPrice}
                </p>
                <p className="text-gray-500">Amount Chargeable (in words):</p>
                <p className="italic">{totalInWords}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="mt-10">
                <img
                  src={signatureImg}
                  alt="Signature"
                  className="h-12 w-auto"
                />
                <p className="text-gray-500 text-center">Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600"
          >
            Checkout
          </button>
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleOpenDueModal}
        >
          Enter Due / Advance
        </button>

        {/* Modal for Checkout Options */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="font-semibold text-lg mb-4 text-center">
                Choose an Action
              </h3>
              <div className="flex flex-col items-center space-y-4">
                {/* Print Button with Icon */}
                <button
                  onClick={() => handleCheckoutAction("print")}
                  className="flex items-center bg-teal-500 text-white p-3 rounded-lg hover:bg-tel-600 space-x-2"
                >
                  <FaPrint className="text-xl" />
                  <span>Print</span>
                </button>

                {/* Send to WhatsApp Button with Icon */}
                <button
                  onClick={() => handleCheckoutAction("whatsapp")}
                  className="flex items-center bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 space-x-2"
                >
                  <FaWhatsapp className="text-xl" />
                  <span>Send to WhatsApp</span>
                </button>

                {/* Download Button with Icon */}
                <button
                  onClick={() => handleCheckoutAction("download")}
                  className="flex items-center bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 space-x-2"
                >
                  <FaDownload className="text-xl" />
                  <span>Download</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 mt-4 space-x-2"
                >
                  <FaTimes className="text-xl" />
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {dueModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Partial Payment</h2>
            <p className="mb-2">
              <strong>Total Amount:</strong> ₹{roundedTotalPrice}
            </p>
            <label className="block mb-2">
              <span className="text-sm">Enter Paid Amount (₹)</span>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) =>
                  setPaidAmount(parseFloat(e.target.value || "0"))
                }
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Add Descriptions:</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note about the payment..."
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                rows={3}
              ></textarea>
            </label>
            <p className="mt-2 text-gray-800">
              <strong>Remaining Due:</strong> ₹{payableAmount.toFixed(2)}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleCloseDueModal}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // you can add save logic here
                  handleConfirmModel();
                }}
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
