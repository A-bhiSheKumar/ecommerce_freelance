import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const ViewCotation = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCotations = async () => {
    try {
      setIsLoading(true);
      const response = await api.quotations.getQuotations();
      setQuotations(response || []);
    } catch (error) {
      console.error("Failed to fetch quotations", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCotations();
  }, []);

  const statusColors: Record<string, string> = {
    processing: "bg-yellow-50 text-yellow-800",
    completed: "bg-green-50 text-green-800",
    cancelled: "bg-red-50 text-red-800",
  };

  const statusIcons: Record<string, string> = {
    processing: "⏳",
    completed: "✅",
    cancelled: "❌",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white-800">
          Quotation Management
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Total: {quotations.length} quotation
            {quotations.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={fetchCotations}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No quotations found
          </h3>
          <p className="mt-1 text-gray-500">
            There are currently no quotations available.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {quotations.map((quotation) => (
            <div
              key={quotation.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Quotation #{quotation.id}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[quotation.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusIcons[quotation.status] || ""}{" "}
                      {quotation.status_display}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {quotation.user.username} ({quotation.user.email})
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(quotation.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500">
                    TOTAL
                  </span>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{quotation.total_price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {quotation.items.map((item: any) => (
                  <div key={item.id} className="px-6 py-4 flex items-start">
                    <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={
                          item.product.images.find((img: any) => img.is_main)
                            ?.image ||
                          item.product.images[0]?.image ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.product.category.name}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="mr-3">Qty: {item.quantity}</span>
                        <span>Price: ₹{item.price}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-gray-800">
                        ₹{item.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {quotation.notes ? (
                    <p>
                      <span className="font-medium">Notes:</span>{" "}
                      {quotation.notes}
                    </p>
                  ) : (
                    <p>No additional notes</p>
                  )}
                </div>
                {/* <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    Process
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCotation;
