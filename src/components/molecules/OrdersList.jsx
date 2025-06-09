import {
  CheckSquare,
  ArrowLeftRight,
  FileText,
  Printer,
  SearchIcon,
  Clock,
  RotateCcw,
  Send,
  XCircle,
  Box,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getOrders } from "../../api/ordersApi";
import { assignAwb, trackShipment, getLabel } from "../../api/shiprocketApi";
import { toast } from 'react-hot-toast';
import OrderDetailsModal from "./OrderDetailsModal";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
const [isModalOpen, setModalOpen] = useState(false);

const openDetails = (order) => {
  setSelectedOrder(order);
  setModalOpen(true);
};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setTransactions(res.data.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);
console.log(transactions);

  const assignAwbHandler = async (orderId) => {
    try {
      await assignAwb(orderId);
       toast.success(`AWB assigned for ${orderId}`);
    } catch (err) {
         console.error(err);
    toast.error("Failed to assign AWB");
    }
  };

  const trackShipmentHandler = async (orderId) => {
    try {
      const res = await trackShipment(orderId);
      toast.success("Tracking details loaded");
      alert(`Tracking details: ${JSON.stringify(res.data)}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to track shipment");
    }
  };

  const downloadLabelHandler = async (orderId) => {
    try {
      const res = await getLabel(orderId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${orderId}_label.pdf`;
      link.click();
       toast.success("Label downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download label");
    }
  };

  const filteredTransactions = useMemo(() => {
      if (!Array.isArray(transactions)) return [];
    let filtered = [...transactions];

    if (statusFilter)
      filtered = filtered.filter((t) => t.status === statusFilter);
    if (paymentFilter)
      filtered = filtered.filter((t) => t.paymentMethod === paymentFilter);
    if (buyerFilter)
      filtered = filtered.filter((t) =>
        t.buyer.toLowerCase().includes(buyerFilter)
      );
    if (locationFilter)
      filtered = filtered.filter((t) =>
        t.location.toLowerCase().includes(locationFilter)
      );

    if (priceSort === "low") {
      filtered.sort(
        (a, b) =>
          parseFloat(a.total.replace(/[^0-9.]/g, "")) -
          parseFloat(b.total.replace(/[^0-9.]/g, ""))
      );
    } else if (priceSort === "high") {
      filtered.sort(
        (a, b) =>
          parseFloat(b.total.replace(/[^0-9.]/g, "")) -
          parseFloat(a.total.replace(/[^0-9.]/g, ""))
      );
    }

    return filtered;
  }, [transactions, statusFilter, paymentFilter, buyerFilter, locationFilter, priceSort]);

  const exportToExcel = () => {
    const data = filteredTransactions.map((txn) => ({
      Invoice: txn.id,
      Buyer: txn.buyer,
      Location: txn.location,
      Status: txn.status,
      PaymentMethod: txn.paymentMethod,
      PaymentDate: txn.paymentDate,
      Total: txn.total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "transactions.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Invoice",
      "Buyer",
      "Location",
      "Status",
      "Payment",
      "Amount",
    ];
    const tableRows = [];

    filteredTransactions.forEach((txn) => {
      tableRows.push([
        txn.id,
        txn.buyer,
        txn.location,
        txn.status,
        `${txn.paymentMethod} (${txn.paymentDate})`,
        txn.total,
      ]);
    });

    doc.text("Transaction Report", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
    });

    doc.save("transactions.pdf");
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Orders List</h2>

      {/* Top Filters and Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by Buyer or Location"
            className="w-full h-10 rounded-md border px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => {
              setBuyerFilter(e.target.value.toLowerCase());
              setLocationFilter(e.target.value.toLowerCase());
            }}
          />
          <SearchIcon
            size={16}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition"
          >
            <FileText size={16} />
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition"
          >
            <Printer size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="sticky top-0 sm:top-[-12px] z-10 bg-white py-3 border-y mb-4">
        <div className="mb-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded border w-full px-1 sm:px-3 text-sm focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option>Pending</option>
            <option>Packing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Completed</option>
            <option>Cancelled</option>
            <option>Returned</option>
          </select>
        </div>

        <div className="flex gap-1">
          <div className="w-1/2">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="h-9 rounded border w-full px-1 sm:px-3 text-sm focus:ring-indigo-500"
            >
              <option value="">All Payments</option>
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Net Banking</option>
              <option>Cash on Delivery</option>
              <option>Direct bank transfer</option>
            </select>
          </div>

          <div className="w-1/2">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="h-9 rounded border w-full px-1 sm:px-3 text-sm focus:ring-indigo-500"
            >
              <option value="">Sort by Price</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Ship Rocket</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions?.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500 italic">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions?.map((txn, index) => (
                <tr key={index} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3 font-medium text-indigo-600 underline decoration-dotted">{txn.id}</td>
                  <td className="p-3">
                    <div className="font-medium">{txn.buyer}</div>
                    <div className="text-xs text-gray-500">{txn.location}</div>
                  </td>
                  <td className={`p-3 flex items-center gap-2 font-medium ${
                    txn.status === "Completed" ? "text-green-600" :
                    txn.status === "Pending" ? "text-orange-500" :
                    txn.status === "Cancelled" || txn.status === "Returned" ? "text-red-600" :
                    txn.status === "Shipped" ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {{
                      "check-circle": <CheckCircle size={16} />,
                      clock: <Clock size={16} />,
                      "rotate-ccw": <RotateCcw size={16} />,
                      send: <Send size={16} />,
                      "x-circle": <XCircle size={16} />,
                      box: <Box size={16} />,
                      truck: <Truck size={16} />,
                    }[txn.statusIcon]}
                    {txn.status}
                  </td>
                  <td className="p-3">
                    <div>{txn.paymentMethod}</div>
                    <div className="text-xs text-gray-500">{txn.paymentDate}</div>
                  </td>
                  <td className="p-3">{txn.total}</td>
                  <td className="px-4 py-2 space-x-2 text-xs text-blue-600">
                    <button onClick={() => assignAwbHandler(txn.id)}>AWB</button>
                    <button onClick={() => trackShipmentHandler(txn.id)}>Track</button>
                    <button onClick={() => downloadLabelHandler(txn.id)}>Label</button>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="text-indigo-600 hover:underline flex items-center gap-1"  onClick={() => openDetails(txn)}>
                        <CheckSquare size={16} /> Details
                      </button>
                      <button className="text-indigo-600 hover:underline flex items-center gap-1">
                        <ArrowLeftRight size={16} /> Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-gray-800 text-sm">
        AWB: <span className="text-gray-400">AWB number is a unique tracking number assigned to a shipment when it is booked through a courier</span>
      </div>
      <div className="mt-4 text-gray-500 text-sm">
        Showing {filteredTransactions.length} of {transactions.length} entries
      </div>
      <OrderDetailsModal
  open={isModalOpen}
  onClose={() => setModalOpen(false)}
  order={selectedOrder}
/>
    </div>
  );
}
