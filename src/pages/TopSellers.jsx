import {
  FileText,
  Printer,
  SearchIcon,
  TrendingUp,
  BadgeDollarSign,
} from "lucide-react";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const topSellers = [
  {
    id: "SELL-1001",
    name: "Ananya Jewelers",
    region: "Mumbai",
    category: "Gold",
    productsSold: 120,
    totalRevenue: "₹1,200,000",
  },
  {
    id: "SELL-1002",
    name: "Kalyan Gold House",
    region: "Hyderabad",
    category: "Diamond",
    productsSold: 98,
    totalRevenue: "₹950,000",
  },
  {
    id: "SELL-1003",
    name: "Malabar Gold",
    region: "Chennai",
    category: "Gold",
    productsSold: 140,
    totalRevenue: "₹1,500,000",
  },
  {
    id: "SELL-1004",
    name: "TBZ",
    region: "Delhi",
    category: "Platinum",
    productsSold: 45,
    totalRevenue: "₹450,000",
  },
  {
    id: "SELL-1005",
    name: "Ananya Jewelers",
    region: "Mumbai",
    category: "Gold",
    productsSold: 120,
    totalRevenue: "₹1,200,000",
  },
  {
    id: "SELL-1006",
    name: "Kalyan Gold House",
    region: "Hyderabad",
    category: "Diamond",
    productsSold: 98,
    totalRevenue: "₹950,000",
  },
  {
    id: "SELL-1007",
    name: "Malabar Gold",
    region: "Chennai",
    category: "Gold",
    productsSold: 140,
    totalRevenue: "₹1,500,000",
  },
  {
    id: "SELL-1008",
    name: "TBZ",
    region: "Delhi",
    category: "Platinum",
    productsSold: 45,
    totalRevenue: "₹450,000",
  },
  {
    id: "SELL-1009",
    name: "Ananya Jewelers",
    region: "Mumbai",
    category: "Gold",
    productsSold: 120,
    totalRevenue: "₹1,200,000",
  },
  {
    id: "SELL-1010",
    name: "Kalyan Gold House",
    region: "Hyderabad",
    category: "Diamond",
    productsSold: 98,
    totalRevenue: "₹950,000",
  },
  {
    id: "SELL-1011",
    name: "Malabar Gold",
    region: "Chennai",
    category: "Gold",
    productsSold: 140,
    totalRevenue: "₹1,500,000",
  },
  {
    id: "SELL-1012",
    name: "TBZ",
    region: "Delhi",
    category: "Platinum",
    productsSold: 45,
    totalRevenue: "₹450,000",
  },
];

export default function TopSellersList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredSellers = useMemo(() => {
    let data = [...topSellers];

    if (search) {
      data = data.filter((seller) =>
        seller.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter((seller) => seller.category === categoryFilter);
    }

    if (sortBy === "revenue") {
      data.sort(
        (a, b) =>
          parseInt(b.totalRevenue.replace(/[^0-9]/g, "")) -
          parseInt(a.totalRevenue.replace(/[^0-9]/g, ""))
      );
    } else if (sortBy === "sold") {
      data.sort((a, b) => b.productsSold - a.productsSold);
    }

    return data;
  }, [search, categoryFilter, sortBy]);

  const exportToExcel = () => {
    const data = filteredSellers.map((s) => ({
      ID: s.id,
      Name: s.name,
      Region: s.region,
      Category: s.category,
      "Products Sold": s.productsSold,
      "Total Revenue": s.totalRevenue,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Top Sellers");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "top-sellers.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "ID",
      "Name",
      "Region",
      "Category",
      "Products Sold",
      "Total Revenue",
    ];
    const rows = filteredSellers.map((s) => [
      s.id,
      s.name,
      s.region,
      s.category,
      s.productsSold,
      s.totalRevenue,
    ]);

    doc.text("Top Sellers Report", 14, 15);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
      styles: { fontSize: 9 },
    });

    doc.save("top-sellers.pdf");
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Top Sellers</h2>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search sellers"
            className="w-full h-10 rounded border px-4 pr-10 text-sm focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon
            size={16}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded border text-sm"
        >
          <option value="">All Categories</option>
          <option>Gold</option>
          <option>Diamond</option>
          <option>Platinum</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 rounded border text-sm"
        >
          <option value="">Sort By</option>
          <option value="revenue">Highest Revenue</option>
          <option value="sold">Most Sold</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 border px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            <FileText size={16} />
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 border px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            <Printer size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Seller ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Region</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Products Sold</th>
              <th className="p-2 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{s.id}</td>
                <td className="p-2 font-medium">{s.name}</td>
                <td className="p-2">{s.region}</td>
                <td className="p-2">{s.category}</td>
                <td className="p-2">{s.productsSold}</td>
                <td className="p-2">{s.totalRevenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
