import {
  CheckSquare, ArrowLeftRight, FileText, Printer, SearchIcon,
  Clock, RotateCcw, Send, XCircle, Box, Truck, CheckCircle
} from 'lucide-react';
import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const transactions = [
  {
    id: '#INV-77807556',
    buyer: 'Rajesh Kumar',
    location: 'Mumbai, Maharashtra',
    status: 'Completed',
    paymentMethod: 'UPI',
    paymentDate: '25 March, 12:55 PM',
    total: '₹77,000.00',
  },
  {
    id: '#INV-99012345',
    buyer: 'Priya Sharma',
    location: 'Delhi, Delhi',
    status: 'Pending',
    paymentMethod: 'Credit Card',
    paymentDate: '12 April, 09:30 AM',
    total: '₹24,300.50',
  },
  {
    id: '#INV-11223344',
    buyer: 'Amit Verma',
    location: 'Bangalore, Karnataka',
    status: 'Completed',
    paymentMethod: 'Net Banking',
    paymentDate: '01 May, 02:45 PM',
    total: '₹9,500.00',
  },
  {
    id: '#INV-44556677',
    buyer: 'Neha Patil',
    location: 'Pune, Maharashtra',
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    paymentDate: '28 April, 11:20 AM',
    total: '₹56,820.00',
  },
  {
    id: '#INV-77889900',
    buyer: 'Sanjay Singh',
    location: 'Lucknow, Uttar Pradesh',
    status: 'Cancelled',
    paymentMethod: 'UPI',
    paymentDate: '15 March, 08:00 AM',
    total: '₹0.00',
  },
  {
    id: '#INV-55566677',
    buyer: 'Meera Joshi',
    location: 'Ahmedabad, Gujarat',
    status: 'Packing',
    paymentMethod: 'Debit Card',
    paymentDate: '22 May, 05:10 PM',
    total: '₹18,299.99',
  },
  {
    id: '#INV-33221100',
    buyer: 'Karthik Reddy',
    location: 'Hyderabad, Telangana',
    status: 'Shipped',
    paymentMethod: 'UPI',
    paymentDate: '30 May, 04:05 PM',
    total: '₹12,600.00',
  },
  {
    id: '#INV-00112233',
    buyer: 'Anjali Mehta',
    location: 'Chennai, Tamil Nadu',
    status: 'Packing',
    paymentMethod: 'Direct bank transfer',
    paymentDate: '03 June, 10:50 AM',
    total: '₹45,750.00',
  },
  {
    id: '#INV-88990077',
    buyer: 'Vikram Chauhan',
    location: 'Jaipur, Rajasthan',
    status: 'Returned',
    paymentMethod: 'Net Banking',
    paymentDate: '29 May, 01:15 PM',
    total: '₹15,000.00',
  },
  {
    id: '#INV-66677788',
    buyer: 'Deepika Nair',
    location: 'Kochi, Kerala',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    paymentDate: '04 June, 09:00 AM',
    total: '₹20,000.00',
  },
];

export default function TransactionList() {
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [buyerFilter, setBuyerFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');

const exportToExcel = () => {
  const data = filteredTransactions.map(txn => ({
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
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'transactions.xlsx');
};

const exportToPDF = () => {
  const doc = new jsPDF();
  const tableColumn = ["Invoice", "Buyer", "Location", "Status", "Payment", "Amount"];
  const tableRows = [];

  filteredTransactions.forEach(txn => {
    tableRows.push([
      txn.id,
      txn.buyer,
      txn.location,
      txn.status,
      `${txn.paymentMethod} (${txn.paymentDate})`,
      txn.total
    ]);
  });

  doc.text("Transaction Report", 14, 15);
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 9 },
  });

  doc.save('transactions.pdf');
};


  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (statusFilter) filtered = filtered.filter(t => t.status === statusFilter);
    if (paymentFilter) filtered = filtered.filter(t => t.paymentMethod === paymentFilter);
    if (buyerFilter) filtered = filtered.filter(t => t.buyer.toLowerCase().includes(buyerFilter));
    if (locationFilter) filtered = filtered.filter(t => t.location.toLowerCase().includes(locationFilter));

    if (priceSort === 'low') {
      filtered.sort((a, b) => parseFloat(a.total.replace(/[^0-9.]/g, '')) - parseFloat(b.total.replace(/[^0-9.]/g, '')));
    } else if (priceSort === 'high') {
      filtered.sort((a, b) => parseFloat(b.total.replace(/[^0-9.]/g, '')) - parseFloat(a.total.replace(/[^0-9.]/g, '')));
    }

    return filtered;
  }, [statusFilter, paymentFilter, buyerFilter, locationFilter, priceSort]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Orders List</h2>

      {/* Top Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* Search Bar */}
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
          <SearchIcon size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Export Buttons */}
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

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white py-3 flex flex-wrap gap-3 border-y mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded border px-3 text-sm focus:ring-indigo-500"
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

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="h-9 rounded border px-3 text-sm focus:ring-indigo-500"
        >
          <option value="">All Payments</option>
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Net Banking</option>
          <option>Cash on Delivery</option>
          <option>Direct bank transfer</option>
        </select>

        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="h-9 rounded border px-3 text-sm focus:ring-indigo-500"
        >
          <option value="">Sort by Price</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="text-left text-gray-600">
            <tr>
              <th className='p-3'><input type="checkbox" /></th>
              <th className='p-3'>Invoice</th>
              <th className='p-3'>Buyer</th>
              <th className='p-3'>Status</th>
              <th className='p-3'>Payment</th>
              <th className='p-3'>Amount</th>
              <th className='p-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn, index) => (
                <tr key={index} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3 font-medium text-indigo-600 underline decoration-dotted">{txn.id}</td>
                  <td className="p-3">
                    <div className="font-medium">{txn.buyer}</div>
                    <div className="text-xs text-gray-500">{txn.location}</div>
                  </td>
                  <td className={`p-3 flex items-center gap-2 font-medium ${
                    txn.status === 'Completed'
                      ? 'text-green-600'
                      : txn.status === 'Pending'
                      ? 'text-orange-500'
                      : txn.status === 'Cancelled' || txn.status === 'Returned'
                      ? 'text-red-600'
                      : txn.status === 'Shipped'
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}>
                    {{
                      'check-circle': <CheckCircle size={16} />,
                      'clock': <Clock size={16} />,
                      'rotate-ccw': <RotateCcw size={16} />,
                      'send': <Send size={16} />,
                      'x-circle': <XCircle size={16} />,
                      'box': <Box size={16} />,
                      'truck': <Truck size={16} />
                    }[txn.statusIcon]}
                    {txn.status}
                  </td>
                  <td className="p-3">
                    <div>{txn.paymentMethod}</div>
                    <div className="text-xs text-gray-500">{txn.paymentDate}</div>
                  </td>
                  <td className="p-3">{txn.total}</td>
                  <td className="p-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        title="View Details"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <CheckSquare size={16} /> Details
                      </button>
                      <button
                        title="Change Status"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
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

      {/* Footer info */}
      <div className="mt-4 text-gray-500 text-sm">
        Showing {filteredTransactions.length} of {transactions.length} entries
      </div>
    </div>
  );
}