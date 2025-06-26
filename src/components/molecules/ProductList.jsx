import {
  FileText,
  Printer,
  SearchIcon,
  PencilIcon,
  Trash2,
  BoxIcon,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../api/productApi";

export default function ProductList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log(products);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter(
      (p) =>
        (p.name + p.category + p.id)
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (statusFilter ? p.status === statusFilter : true) &&
        (categoryFilter ? p.category === categoryFilter : true)
    );
  }, [search, statusFilter, categoryFilter, products]);

  const exportToExcel = () => {
    const data = filteredProducts.map((p) => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      Stock: p.stock,
      Price: p.price,
      Status: p.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "products.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Name", "Category", "Stock", "Price", "Status"]],
      body: filteredProducts.map((p) => [
        p.id,
        p.name,
        p.category,
        p.stock,
        p.price,
        p.status,
      ]),
    });
    doc.save("products.pdf");
  };
  const handleEditClick = (product) => {
    console.log(product.id);
    navigate(`/editproduct/${product._id}`);
  };
  const handleDeleteClick = (product) => {
    // Optimistically remove from UI
    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    let undoCalled = false;

    const undo = () => {
      undoCalled = true;
      setProducts((prev) => [product, ...prev]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSearch("");
      setStatusFilter("");
      setCategoryFilter("");
    };

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm">
            Deleted <b>{product.name}</b>
          </span>
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => {
              undo();
              toast.dismiss(t.id);
            }}
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    );

    // After timeout, if not undone, call actual delete API
    setTimeout(() => {
      if (!undoCalled) {
        deleteProduct(product._id)
          .then(() => {
            toast.success(`${product.name} deleted`);
          })
          .catch(() => {
            toast.error(`Failed to delete ${product.name} from server.`);
            // Optional: re-add product on error
            setProducts((prev) => [product, ...prev]);
          });
      }
    }, 5000); // same as toast duration
  };

  // const handleSaveProduct = (updatedProduct) => {
  //   console.log("Updated Product:", updatedProduct);
  //   // Update product list logic here
  // };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <span className="ml-3 text-blue-600 font-semibold text-lg">
          Loading...
        </span>
      </div>
    );

  return (
    <div className="p-4 sm:p-5">
      <h2 className="text-xl font-semibold mb-4">Product List</h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name, ID or category"
            className="w-full h-10 rounded-md border px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon
            size={16}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/addproducts")}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-white bg-green-700 hover:bg-green-600"
          >
            <BoxIcon size={16} /> Add Product
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-100"
          >
            <FileText size={16} /> Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-100"
          >
            <Printer size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden sticky top-0 z-10 flex justify-end mb-3">
        <button
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1 border rounded text-sm text-gray-700 bg-white shadow-sm"
        >
          <Filter size={16} />
        </button>
      </div>

      {/* Filters - Visible on sm+ or if toggled on mobile */}
      {(showMobileFilters || window.innerWidth >= 640) && (
        <div className="sticky top-[26px] sm:top-[-12px] z-10 bg-white py-3 flex flex-wrap gap-3 border-y mb-4 sm:flex">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded border px-3 text-sm focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded border px-3 text-sm focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm border-separate border-spacing-y-2">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="p-3">
                <input type="checkbox" />
              </th>
              <th className="p-3">Images</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-500 italic"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr
                  key={index}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3">
                  <div className="flex items-center -space-x-2">
                    {product.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="thumb"
                        title={product.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      />
                    ))}
                  </div>
                </td>

                  <td className="p-3 whitespace-nowrap">{product.name}</td>
                  <td className="p-3 whitespace-nowrap">{product.category}</td>
                  <td className="p-3 whitespace-nowrap">{product.stock}</td>
                  <td className="p-3 whitespace-nowrap">{product.price}</td>
                  <td
                    className={`p-3 font-medium whitespace-nowrap ${
                      product.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.status}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap items-center gap-2 justify-center">
                      <button
                        className="flex items-center text-indigo-600 hover:underline text-sm"
                        onClick={() => handleEditClick(product)}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                      </button>
                      <button
                        className="flex items-center text-red-600 hover:underline text-sm"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 text-gray-500 text-sm">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
