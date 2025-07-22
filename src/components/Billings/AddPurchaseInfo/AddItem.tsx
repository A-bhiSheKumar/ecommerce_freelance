import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { CheckOutProps } from "../../../interface/UserInterface";
import { Item } from "../../../interface/ProductInterface";
import ItemContext from "../../../context/ItemsContext/itemsContext";
import { api } from "../../../utils/api";
import { addItemDetails } from "../../../utils/api/billing/billing.api";
import { formatDate } from "../../../commanFuntion/DateFormat";

const AddItemGrid: React.FC<CheckOutProps> = ({ onNext, formData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [productItems, setProductItems] = useState<Item[]>([
    {
      name: "",
      price: "",
      dimensions: "",
      weight: "",
      quantity: "",
      items_purchase_date: formattedDate,
    },
  ]);
  const [dimensionUnit, setDimensionUnit] = useState<string[]>(
    productItems.map(() => "cm")
  );

  const { setItems } = useContext(ItemContext);

  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    // Save productItems to localStorage whenever it changes
    localStorage.setItem("productItems", JSON.stringify(productItems));
  }, [productItems]);

  const isItemEmpty = (item: Item) =>
    !item.name &&
    !item.price &&
    !item.dimensions &&
    !item.weight &&
    !item.quantity &&
    !item.items_purchase_date;

  const handleChange = (
    index: number,
    field: keyof Item,
    value: string
  ): void => {
    const updatedproductItems = [...productItems];
    updatedproductItems[index][field] = value;
    setProductItems(updatedproductItems);

    // Update ItemContext with non-empty items
    setItems(updatedproductItems.filter((item) => !isItemEmpty(item)));
  };

  const handleDimensionChange = (
    index: number,
    value: string,
    unit: string
  ): void => {
    const updatedproductItems = [...productItems];
    updatedproductItems[index]["dimensions"] = `${value} (${unit})`;
    setProductItems(updatedproductItems);

    // Update ItemContext with non-empty items
    setItems(updatedproductItems.filter((item) => !isItemEmpty(item)));
  };

  const handleUnitChange = (index: number, value: string): void => {
    const updatedUnits = [...dimensionUnit];
    updatedUnits[index] = value;
    setDimensionUnit(updatedUnits);

    // Update the dimensions in the productItems array with the new unit
    const updatedproductItems = [...productItems];
    const dimensionValue = updatedproductItems[index].dimensions.split(" (")[0]; // Extract the dimension value
    updatedproductItems[index].dimensions = `${dimensionValue} (${value})`; // Update with the new unit
    setProductItems(updatedproductItems);

    // Update ItemContext with non-empty items
    setItems(updatedproductItems.filter((item) => !isItemEmpty(item)));
  };
  const addRow = (): void => {
    // Validate that the last row is not empty before adding a new one
    const lastItem = productItems[productItems.length - 1];
    if (isItemEmpty(lastItem)) {
      alert("Please fill out the current row before adding a new one.");
      return;
    }

    setProductItems((prevproductItems) => {
      const updatedproductItems = [
        ...prevproductItems,
        {
          name: "",
          price: "",
          dimensions: "",
          weight: "",
          quantity: "",
          items_purchase_date: "",
        },
      ];
      setDimensionUnit([...dimensionUnit, "cm"]); // Add default unit for the new row

      setItems(updatedproductItems.filter((item) => !isItemEmpty(item)));
      setTimeout(() => {
        lastItemRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 0);
      return updatedproductItems;
    });
  };

  const removeRow = (index: number): void => {
    const updatedproductItems = productItems.filter((_, i) => i !== index);
    const updatedUnits = dimensionUnit.filter((_, i) => i !== index);
    setProductItems(updatedproductItems);
    setDimensionUnit(updatedUnits);

    // Update ItemContext with non-empty items
    setItems(updatedproductItems.filter((item) => !isItemEmpty(item)));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    // Filter to remove empty items from productItems
    const nonEmptyItems = productItems.filter((item) => !isItemEmpty(item));

    if (nonEmptyItems.length === 0) {
      alert("Please add at least one valid item.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("customerInfoDetails", JSON.stringify(formData));
      payload.append("customerPurchaseDetails", JSON.stringify(nonEmptyItems));

      const response = await api.userInfo.addCustomerInfo(payload);
      console.log("ResponseCheck--->", response);

      setItems(nonEmptyItems);

      // Proceed to next step if onNext function is provided
      if (onNext) {
        console.log("Valid productItems Added:", nonEmptyItems);
        onNext();
      }
    } catch (error) {
      console.error("Error submitting customer info:", error);
      alert(
        "An error occurred while submitting the information. Please try again."
      );
    }
  };

  const handleSearch = useCallback(async (name: string) => {
    if (!name.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      console.log("Name for the payload ----->", name);
      const response = await api.itemsInfo.getItemsDetails({ name });

      console.log("Response -->", response);

      // Ensure searchResults is always an array
      setSearchResults(response);
    } catch (error) {
      console.error("Error searching items:", error);
      setSearchResults([]);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, handleSearch]);

  // console.log("Dimensionsscheck-->", dimensionUnit);

  useEffect(() => {
    console.log("Updated Search Results:", searchResults);
  }, [searchResults]);

  console.log("Search Results:", searchResults);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchTerm("");
        setSearchResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add productItems</h2>
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto max-h-96">
          <table className="table-auto w-full border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2">#</th>
                <th className="border border-gray-700 p-2">Item Name</th>
                <th className="border border-gray-700 p-2">Price (₹)</th>
                <th className="border border-gray-700 p-2">Dimensions</th>
                <th className="border border-gray-700 p-2">Weight (kg)</th>
                <th className="border border-gray-700 p-2">Quantity</th>
                <th className="border border-gray-700 p-2">
                  Items Purchase Date
                </th>
              </tr>
            </thead>
            <tbody>
              {productItems.map((item, index) => (
                <tr
                  key={index}
                  ref={index === productItems.length - 1 ? lastItemRef : null}
                >
                  <td className="border border-gray-700 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-700 p-2 relative">
                    <input
                      type="text"
                      value={productItems[index].name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        handleChange(index, "name", value);
                        setSearchTerm(value); // Update searchTerm before triggering search
                      }}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter name"
                    />

                    {/* Dropdown for Search Suggestions */}
                    {searchResults.length > 0 && searchTerm && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 top-0 bg-gray-800 border border-gray-600 rounded shadow-lg z-10"
                      >
                        <select
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            handleChange(index, "name", e.target.value);
                            setTimeout(() => {
                              setSearchTerm("");
                              setSearchResults([]);
                            }, 100); // Allow time for the update
                          }}
                          className="px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          {searchResults.map((item, i) => (
                            <option key={i} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </td>

                  <td className="border border-gray-700 p-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, "price", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price"
                    />
                  </td>
                  <td className="border border-gray-700 p-2 flex space-x-2">
                    <input
                      type="text"
                      value={item.dimensions.split(" (")[0]} // Extract dimension value
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleDimensionChange(
                          index,
                          e.target.value,
                          dimensionUnit[index]
                        )
                      }
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10×20"
                    />
                    <select
                      value={dimensionUnit[index]}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleUnitChange(index, e.target.value)
                      }
                      className="px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="sq.feet">sq.feet</option>
                      <option value="inches">inches</option>
                      <option value="meters">meters</option>
                    </select>
                  </td>
                  <td className="border border-gray-700 p-2">
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, "weight", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter weight"
                    />
                  </td>
                  <td className="border border-gray-700 p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, "quantity", e.target.value)
                      }
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quantity"
                    />
                  </td>
                  <td className="border border-gray-700 p-2">
                    <input
                      type="string"
                      value={item.items_purchase_date}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          index,
                          "items_purchase_date",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Items Purchase Date"
                    />
                  </td>
                  <td className="border border-gray-700 p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={addRow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
          >
            Add Item
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
            onClick={async () => {
              try {
                const payload = { name: productItems[0].name };
                const newItem = await addItemDetails(payload);
                console.log("Item added successfully:", newItem);
                alert("Item added successfully!");
              } catch (error) {
                console.error("Error adding item:", error);
                alert("Failed to add item. Please try again.");
              }
            }}
          >
            Generate Bill
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemGrid;
