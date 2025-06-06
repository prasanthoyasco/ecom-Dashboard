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
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Navigate, useNavigate } from "react-router-dom";
import EditProductModal from "./EditProductModal";

const initialProducts = [
  {
    id: 1,
    images: [
      "/laptop.jpg",
      "/laptop.jpg",
      "/laptop.jpg",
    ],
    name: "PC & Laptop",
    category: "Sport & Outdoor",
    stock: 72,
    price: "₹21",
    status: "Inactive",
  },
  {
    id: 2,
    images: [
      "/mobile.png",
      "/mobile.png",
    ],
    name: "Smartphone",
    category: "Electronics",
    stock: 120,
    price: "₹500",
    status: "Active",
  },
  {
    id: 3,
    images: ["headphone.jpg"],
    name: "Wireless Headphones",
    category: "Audio",
    stock: 250,
    price: "₹150",
    status: "Active",
  },
  {
    id: 4,
    images: [
      "/smartwatch.jpg",
      "/smartwatch.jpg",
    ],
    name: "Smartwatch",
    category: "Wearables",
    stock: 45,
    price: "₹299",
    status: "Inactive",
  },
  {
    id: 5,
    images: ["https://via.placeholder.com/44x44/8C33FF/FFFFFF?text=P9"],
    name: "Gaming Console",
    category: "Entertainment",
    stock: 80,
    price: "₹399",
    status: "Active",
  },
  {
    id: 6,
    images: [
      "https://via.placeholder.com/44x44/FF3333/FFFFFF?text=P10",
      "https://via.placeholder.com/44x44/33FF33/FFFFFF?text=P11",
    ],
    name: "External Hard Drive",
    category: "Computer Accessories",
    stock: 180,
    price: "₹80",
    status: "Active",
  },
  {
    id: 7,
    images: ["https://via.placeholder.com/44x44/3333FF/FFFFFF?text=P12"],
    name: "Webcam",
    category: "Computer Accessories",
    stock: 60,
    price: "₹45",
    status: "Inactive",
  },
  {
    id: 8,
    images: [
      "https://via.placeholder.com/44x44/FFFF33/FFFFFF?text=P13",
      "https://via.placeholder.com/44x44/33FFFF/FFFFFF?text=P14",
    ],
    name: "Bluetooth Speaker",
    category: "Audio",
    stock: 110,
    price: "₹75",
    status: "Active",
  },
  {
    id: 9,
    images: ["https://via.placeholder.com/44x44/FF338C/FFFFFF?text=P15"],
    name: "Fitness Tracker",
    category: "Wearables",
    stock: 90,
    price: "₹120",
    status: "Active",
  },
  {
    id: 10,
    images: [
      "https://via.placeholder.com/44x44/8CFF33/FFFFFF?text=P16",
      "https://via.placeholder.com/44x44/338CFF/FFFFFF?text=P17",
    ],
    name: "Drone",
    category: "Hobbies",
    stock: 25,
    price: "₹700",
    status: "Inactive",
  },
];

export default function ProductList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [statusFilter, setStatusFilter] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");

const filteredProducts = useMemo(() => {
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
    setSelectedProduct(product);
    setEditModalOpen(true);
  };
  const handleDeleteClick = (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id)); // remove

    const undo = () => {
      setProducts((prev) => [product, ...prev]); // re-add at top
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
      {
        duration: 5000,
      }
    );
  };

  const handleSaveProduct = (updatedProduct) => {
    console.log("Updated Product:", updatedProduct);
    // Update product list logic here
  };

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
            <td colSpan="8" className="text-center py-8 text-gray-500 italic">
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
              <td className="p-3 flex flex-wrap gap-1">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="thumb"
                    title={product.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ))}
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

  {/* Modal */}
  <EditProductModal
    isOpen={editModalOpen}
    onClose={() => setEditModalOpen(false)}
    product={selectedProduct}
    onSave={handleSaveProduct}
  />
</div>

  );
}
