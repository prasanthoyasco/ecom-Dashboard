import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";

const dummyData = [
  {
    payment_id: "pay_001",
    order_id: "ord_001",
    user_name: "John Doe",
    user_email: "john@example.com",
    status: "success",
    amount: 2500,
    gateway: "razorpay",
  },
  {
    payment_id: "pay_002",
    order_id: "ord_002",
    user_name: "Jane Smith",
    user_email: "jane@example.com",
    status: "failed",
    amount: 1500,
    gateway: "stripe",
  },
  {
    payment_id: "pay_003",
    order_id: "ord_003",
    user_name: "Akash Kumar",
    user_email: "akash@example.com",
    status: "pending",
    amount: 3000,
    gateway: "razorpay",
  },
];

const PaymentDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    gateway: "",
    status: "",
    startDate: "",
    endDate: "",
    searchQuery: "",
  });

  // New state to toggle filter visibility on mobile
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let data = dummyData;

    if (filters.status) {
      data = data.filter((t) => t.status === filters.status);
    }
    if (filters.gateway) {
      data = data.filter((t) => t.gateway === filters.gateway);
    }
    if (filters.searchQuery) {
      data = data.filter(
        (t) =>
          t.payment_id.toLowerCase().includes(filters.searchQuery) ||
          t.order_id.toLowerCase().includes(filters.searchQuery)
      );
    }

    setTransactions(data);
  };

  const handleRefund = (paymentId) => {
    alert(`Refund initiated for: ${paymentId}`);
  };

  return (
    <div className="px-2 sm:p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold sm:mb-4">Payments Details</h2>

        {/* Toggle Filters Button - visible only on mobile */}
        <button
          onClick={() => setFiltersOpen((prev) => !prev)}
          className="sm:hidden bg-[#F3F6FF]  text-[#2E2E62] px-4 py-2 rounded focus:outline-none"
          aria-expanded={filtersOpen}
          aria-controls="filter-panel"
          aria-label="Toggle filters"
        >
         <Filter size={16}/>
        </button>
      </div>

     <div
  id="filter-panel"
  className={`
    bg-white p-4 rounded shadow
    flex flex-wrap gap-4
    ${filtersOpen ? "block" : "hidden"} 
    sm:flex
  `}
>
  <div className="flex-grow flex-shrink basis-full md:basis-[48%] lg:basis-[30%]">
    <input
      type="text"
      placeholder="Search by Payment ID or Order ID"
      className="w-full border px-3 py-2 rounded"
      onChange={(e) =>
        setFilters({ ...filters, searchQuery: e.target.value.toLowerCase() })
      }
    />
  </div>

  <div className="flex-grow flex-shrink basis-[48%] md:basis-[23%] lg:basis-[15%]">
    <input
      type="date"
      className="w-full border px-3 py-2 rounded"
      placeholder="From"
      value={filters.startDate}
      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
    />
  </div>

  <div className="flex-grow flex-shrink basis-[48%] md:basis-[23%] lg:basis-[15%]">
    <input
      type="date"
      className="w-full border px-3 py-2 rounded"
      placeholder="To"
      value={filters.endDate}
      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
    />
  </div>

  <div className="flex-grow flex-shrink basis-[48%] md:basis-[23%] lg:basis-[15%]">
    <select
      className="w-full border px-3 py-2 rounded"
      value={filters.status}
      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
    >
      <option value="">All Status</option>
      <option value="success">Success</option>
      <option value="failed">Failed</option>
      <option value="pending">Pending</option>
    </select>
  </div>

  <div className="flex-grow flex-shrink basis-[48%] md:basis-[23%] lg:basis-[15%]">
    <select
      className="w-full border px-3 py-2 rounded"
      value={filters.gateway}
      onChange={(e) => setFilters({ ...filters, gateway: e.target.value })}
    >
      <option value="">All Gateways</option>
      <option value="razorpay">Razorpay</option>
      <option value="stripe">Stripe</option>
    </select>
  </div>
</div>


      {/* Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Payment ID</th>
              <th className="border px-4 py-2 text-left">Order ID</th>
              <th className="border px-4 py-2 text-left">User</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Gateway</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.payment_id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{txn.payment_id}</td>
                <td className="border px-4 py-2">{txn.order_id}</td>
                <td className="border px-4 py-2">
                  {txn.user_name} <br />
                  <span className="text-xs text-gray-500">{txn.user_email}</span>
                </td>
                <td
                  className={`border px-4 py-2 font-semibold capitalize ${
                    txn.status === "success"
                      ? "text-green-600"
                      : txn.status === "failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {txn.status}
                </td>
                <td className="border px-4 py-2">₹{txn.amount}</td>
                <td className="border px-4 py-2">{txn.gateway}</td>
                <td className="border px-4 py-2">
                  {txn.status === "success" && (
                    <button
                      onClick={() => handleRefund(txn.payment_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDashboard;
