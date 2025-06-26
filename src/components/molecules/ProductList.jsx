import {
  FileText,
  Printer,
  SearchIcon,
  PencilIcon,
  Trash2,
  BoxIcon,
  Filter,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct, updateProduct } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";

export default function ProductList() {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productRes.data);
        setCategories(categoryRes);
      } catch (error) {
        toast.error("Failed to load products or categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIdToNameMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.name + p.id + categoryIdToNameMap[p.category] || "")
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (statusFilter ? p.status === statusFilter : true) &&
        (categoryFilter ? p.category === categoryFilter : true)
    );
  }, [search, statusFilter, categoryFilter, products, categoryIdToNameMap]);

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedProducts.includes(p.id));

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const exportToExcel = () => {
    const data = filteredProducts.map((p) => ({
      ID: p.id,
      Name: p.name,
      Category: categoryIdToNameMap[p.category] || p.category,
      Stock: p.stock,
      Price: p.price,
      Status: p.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "products.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Name", "Category", "Stock", "Price", "Status"]],
      body: filteredProducts.map((p) => [
        p.id,
        p.name,
        categoryIdToNameMap[p.category] || p.category,
        p.stock,
        p.price,
        p.status,
      ]),
    });
    doc.save("products.pdf");
  };

  const handleEditClick = (product) => navigate(`/editproduct/${product._id}`);
  const handleViewClick = (product) =>
    window.open(`${import.meta.env.VITE_API_front_URL}/product/${product._id}`, "_blank");

  const handleDeleteClick = (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    let undoCalled = false;

    const undo = () => {
      undoCalled = true;
      setProducts((prev) => [product, ...prev]);
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

    setTimeout(() => {
      if (!undoCalled) {
        deleteProduct(product._id).catch(() => {
          toast.error(`Failed to delete ${product.name}`);
          setProducts((prev) => [product, ...prev]);
        });
      }
    }, 5000);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    const confirmed = confirm(`Delete ${selectedProducts.length} product(s)?`);
    if (!confirmed) return;

    const remaining = products.filter((p) => !selectedProducts.includes(p.id));
    setProducts(remaining);

    for (const id of selectedProducts) {
      try {
        await deleteProduct(id);
      } catch (err) {
        toast.error(`Failed to delete product with ID ${id}`);
      }
    }

    setSelectedProducts([]);
    toast.success("Products deleted");
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    const updated = products.map((p) => {
      if (selectedProducts.includes(p.id)) {
        return { ...p, status: newStatus };
      }
      return p;
    });

    setProducts(updated);
    toast.success(`Status updated to ${newStatus}`);

    for (const id of selectedProducts) {
      try {
        await updateProduct(id, { status: newStatus });
      } catch (err) {
        toast.error(`Failed to update status for ID ${id}`);
      }
    }

    setSelectedProducts([]);
  };

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
      <div className="flex flex-wrap justify-between gap-4 mb-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name, ID or category"
            className="w-full h-10 rounded-md border px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        </div>

       <div className="flex flex-wrap gap-2">
  {selectedProducts.length === 0 ? (
    <>
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
    </>
  ) : (
    <>
      <button
        onClick={handleBulkDelete}
        className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-white bg-red-600 hover:bg-red-500"
      >
        <Trash2 size={16} /> Bulk Delete
      </button>
      <button
        onClick={() => handleBulkStatusUpdate("Active")}
        className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-500"
      >
        Set Active
      </button>
      <button
        onClick={() => handleBulkStatusUpdate("Inactive")}
        className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-white bg-yellow-500 hover:bg-yellow-400"
      >
        Set Inactive
      </button>
    </>
  )}
</div>


      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select">
          <option value="">All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="form-select">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left">
              <th className="p-3"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAllChange} /></th>
              <th className="p-3">Images</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="bg-white hover:shadow-md">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                </td>
                <td className="p-1">
                  <img src={product.images[0]} alt="thumb" className="w-10 h-10 rounded-full object-cover" />
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{categoryIdToNameMap[product.category] || "Unknown"}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">{product.price}</td>
                <td className={`p-3 ${product.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                  {product.status}
                </td>
                <td className="p-1 flex gap-2">
                  <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:underline text-sm">
                    <PencilIcon className="h-4 w-4 inline mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:underline text-sm">
                    <Trash2 className="h-4 w-4 inline mr-1" /> Delete
                  </button>
                  <button onClick={() => handleViewClick(product)} className="text-green-600 hover:underline text-sm">
                    <Eye className="h-4 w-4 inline mr-1" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-gray-500 text-sm">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
