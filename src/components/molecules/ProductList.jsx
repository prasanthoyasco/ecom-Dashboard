import {
  FileText, Printer, SearchIcon, PencilIcon, Trash2,
  BoxIcon
} from 'lucide-react';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Navigate, useNavigate } from 'react-router-dom';

const initialProducts = [
   {
    id: 1,
    images: [
      'https://via.placeholder.com/44x44/FF5733/FFFFFF?text=P1',
      'https://via.placeholder.com/44x44/33FF57/FFFFFF?text=P2',
      'https://via.placeholder.com/44x44/3357FF/FFFFFF?text=P3',
    ],
    name: 'PC & Laptop',
    category: 'Sport & Outdoor',
    stock: 72,
    price: '$21',
    status: 'Inactive',
  },
  {
    id: 2,
    images: [
      'https://via.placeholder.com/44x44/FF33AA/FFFFFF?text=P4',
      'https://via.placeholder.com/44x44/33AAFF/FFFFFF?text=P5',
    ],
    name: 'Smartphone',
    category: 'Electronics',
    stock: 120,
    price: '$500',
    status: 'Active',
  },
  {
    id: 3,
    images: [
      'https://via.placeholder.com/44x44/AA33FF/FFFFFF?text=P6',
    ],
    name: 'Wireless Headphones',
    category: 'Audio',
    stock: 250,
    price: '$150',
    status: 'Active',
  },
  {
    id: 4,
    images: [
      'https://via.placeholder.com/44x44/FF8C33/FFFFFF?text=P7',
      'https://via.placeholder.com/44x44/33FF8C/FFFFFF?text=P8',
    ],
    name: 'Smartwatch',
    category: 'Wearables',
    stock: 45,
    price: '$299',
    status: 'Inactive',
  },
  {
    id: 5,
    images: [
      'https://via.placeholder.com/44x44/8C33FF/FFFFFF?text=P9',
    ],
    name: 'Gaming Console',
    category: 'Entertainment',
    stock: 80,
    price: '$399',
    status: 'Active',
  },
  {
    id: 6,
    images: [
      'https://via.placeholder.com/44x44/FF3333/FFFFFF?text=P10',
      'https://via.placeholder.com/44x44/33FF33/FFFFFF?text=P11',
    ],
    name: 'External Hard Drive',
    category: 'Computer Accessories',
    stock: 180,
    price: '$80',
    status: 'Active',
  },
  {
    id: 7,
    images: [
      'https://via.placeholder.com/44x44/3333FF/FFFFFF?text=P12',
    ],
    name: 'Webcam',
    category: 'Computer Accessories',
    stock: 60,
    price: '$45',
    status: 'Inactive',
  },
  {
    id: 8,
    images: [
      'https://via.placeholder.com/44x44/FFFF33/FFFFFF?text=P13',
      'https://via.placeholder.com/44x44/33FFFF/FFFFFF?text=P14',
    ],
    name: 'Bluetooth Speaker',
    category: 'Audio',
    stock: 110,
    price: '$75',
    status: 'Active',
  },
  {
    id: 9,
    images: [
      'https://via.placeholder.com/44x44/FF338C/FFFFFF?text=P15',
    ],
    name: 'Fitness Tracker',
    category: 'Wearables',
    stock: 90,
    price: '$120',
    status: 'Active',
  },
  {
    id: 10,
    images: [
      'https://via.placeholder.com/44x44/8CFF33/FFFFFF?text=P16',
      'https://via.placeholder.com/44x44/338CFF/FFFFFF?text=P17',
    ],
    name: 'Drone',
    category: 'Hobbies',
    stock: 25,
    price: '$700',
    status: 'Inactive',
  },
];

export default function ProductList() {
     const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p =>
      (p.name + p.category + p.id).toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? p.status === statusFilter : true) &&
      (categoryFilter ? p.category === categoryFilter : true)
    );
  }, [search, statusFilter, categoryFilter]);

  const exportToExcel = () => {
    const data = filteredProducts.map(p => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      Stock: p.stock,
      Price: p.price,
      Status: p.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'products.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'Name', 'Category', 'Stock', 'Price', 'Status']],
      body: filteredProducts.map(p => [p.id, p.name, p.category, p.stock, p.price, p.status]),
    });
    doc.save('products.pdf');
  };

  const handleDeleteClick = (product) => {
    console.log('Delete clicked for:', product);
    // implement deletion logic here
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Product List</h2>

      {/* Top Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name, ID or category"
            className="w-full h-10 rounded-md border px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/addproducts')}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-white bg-green-700 hover:bg-green-600"
            >
            <BoxIcon size={16} /> Add New Product
            </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-100"
          >
            <FileText size={16} /> Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-100"
          >
            <Printer size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[-12px] z-10 bg-white py-3 flex flex-wrap gap-3 border-y mb-4">
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
          {[...new Set(initialProducts.map(p => p.category))].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              {/* <th className="p-3">ID</th> */}
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
                <td colSpan="9" className="text-center py-8 text-gray-500 italic">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={index} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition">
                  <td className="p-3"><input type="checkbox" /></td>
                  {/* <td className="p-3 font-medium text-indigo-600">{product.id}</td> */}
                  <td className="p-3 flex gap-1">
                    {product.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="thumb"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ))}
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.price}</td>
                  <td className={`p-3 font-medium ${product.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {product.status}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <a className="mr-3 flex items-center text-indigo-600 hover:underline" href="#">
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                      </a>
                      <a
                        className="text-red-600 flex items-center hover:underline"
                        href="#"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </a>
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
        Showing {filteredProducts.length} of {initialProducts.length} products
      </div>
    </div>
  );
}
