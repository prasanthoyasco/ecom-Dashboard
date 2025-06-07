import { useEffect, useState } from "react";
import { getProductById } from "../../api/productApi"; // Adjust the import path as per your project structure
import { X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderDetailsModal({ open, onClose, order }) {
  const [detailedProducts, setDetailedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!order?.products?.length) return;

      const enrichedProducts = await Promise.all(
        order.products.map(async (item) => {
          try {
            const product = await getProductById(item.productId);
            console.log(product);
            
            return {
              ...product.data,
              qty: item.quantity,
            };
          } catch (err) {
            console.error("Failed to fetch product", item.productId, err);
            return {
              name: "Unknown Product",
              image: "",
              qty: item.quantity,
              price: 0,
            };
          }
        })
      );

      setDetailedProducts(enrichedProducts);
    };
console.log(detailedProducts);

    if (open && order) {
      fetchProductDetails();
    }
  }, [open, order]);

  if (!open || !order) return null;

const exportPDF = () => {
  const doc = new jsPDF();
  let y = 15;
  const leftMargin = 7;
  const lineHeight = 7;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Order Invoice: ${order.id}`, leftMargin, y);
  y += 12;

  // Products Table
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Products:", leftMargin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [["Product", "Quantity", "Price"]],
    body: detailedProducts.map((p) => [
      p.name,
      p.qty.toString(),
      p.price ? `₹${p.price}` : "N/A",
    ]),
    theme: "striped",
    headStyles: { fillColor: [33, 37, 41] }, // dark header color
    styles: { font: "helvetica", fontSize: 10 },
    columnStyles: {
      2: { halign: "right" }, // Right align price
      1: { halign: "center" }, // Center align qty
    },
  });

  y = doc.lastAutoTable.finalY + 12;

  // Helper for labels & values with better spacing
  const printLabelValue = (label, value, isBoldLabel = true) => {
    if (isBoldLabel) doc.setFont(undefined, "bold");
    doc.text(`${label}:`, leftMargin, y);
    if (isBoldLabel) doc.setFont(undefined, "normal");
    doc.text(`${value}`, leftMargin + 40, y);
    y += lineHeight;
  };

  // Customer Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Info:", leftMargin, y);
  y += lineHeight;

  doc.setFontSize(10);
  printLabelValue("Name", order.buyer || "N/A");
  printLabelValue("Email", order.customer?.email || "N/A");
  printLabelValue("Phone", order.customer?.phone || "N/A");
  printLabelValue("Address", order.customer?.address || "N/A");
  y += 6;

  // Order Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Summary:", leftMargin, y);
  y += lineHeight;

  doc.setFontSize(10);
  printLabelValue("Subtotal", `₹${order.subtotal || order.total}`);
  printLabelValue("Discount", `₹${order.discount || 0}`);
  printLabelValue("Tax", `₹${order.tax || 0}`);
  doc.setFont(undefined, "bold");
  printLabelValue("Total", `₹${order.total}`, false);
  doc.setFont(undefined, "normal");
  y += 6;

  // Order Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Info:", leftMargin, y);
  y += lineHeight;

  doc.setFontSize(10);
  printLabelValue("Order Date", new Date(order.createdAt).toLocaleString());
  printLabelValue("Status", order.status);
  printLabelValue("Payment Method", order.paymentMethod);
  printLabelValue("Payment Date", new Date(order.paymentDate).toLocaleString());
  printLabelValue("Transaction ID", order.transactionId || "N/A");
  y += 6;

  // Shipping Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Shipping Info:", leftMargin, y);
  y += lineHeight;

  doc.setFontSize(10);
  printLabelValue("Courier", order.courier || "N/A");
  printLabelValue("AWB", order.awb || "N/A");
  printLabelValue("Tracking Status", order.shippingStatus || "Pending");

  // Save PDF
  doc.save(`Order_${order.id}.pdf`);
};



  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold mb-4">Order #{order.id}</h3>

        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Products */}
          <section>
            <h4 className="font-semibold mb-2">Products:</h4>
            <div className="space-y-2">
              {detailedProducts.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4 border p-2 rounded">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {product.qty} | {product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

         <div className="flex gap-8 mb-8">
  <section className="flex-1">
    <h4 className="font-semibold mb-1">Customer Info:</h4>
    <p><strong>Name:</strong> {order.buyer || "N/A"}</p>
    <p><strong>Email:</strong> {order.customer?.email || "N/A"}</p>
    <p><strong>Phone:</strong> {order.customer?.phone || "N/A"}</p>
    <p><strong>Address:</strong> {order.customer?.address || "N/A"}</p>
  </section>

  <section className="flex-1">
    <h4 className="font-semibold mb-1">Order Summary:</h4>
    <p><strong>Subtotal:</strong> ₹{order.subtotal || order.total}</p>
    <p><strong>Discount:</strong> ₹{order.discount || 0}</p>
    <p><strong>Tax:</strong> ₹{order.tax || 0}</p>
    <p className="font-bold"><strong>Total:</strong> ₹{order.total}</p>
  </section>
</div>
            <div className="flex gap-2 my-6">
          {/* Order Info */}
          <section className="flex-1">
            <h4 className="font-semibold mb-1">Order Info:</h4>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Payment Date:</strong> {new Date(order.paymentDate).toLocaleString()}</p>
            <p><strong>Transaction ID:</strong> {order.transactionId || "N/A"}</p>
          </section>

          {/* Shipping Info */}
          <section className="flex-1">
            <h4 className="font-semibold mb-1">Shipping Info:</h4>
            <p><strong>Courier:</strong> {order.courier || "N/A"}</p>
            <p><strong>AWB:</strong> {order.awb || "N/A"}</p>
            <p><strong>Tracking Status:</strong> {order.shippingStatus || "Pending"}</p>
            {order.labelUrl && (
              <a
                href={order.labelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                Download Label
              </a>
            )}
          </section>
            </div>
          {/* Export PDF */}
          <button
            onClick={exportPDF}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Export as PDF
          </button>
        </div>
      </div>
      </div>
  );
}
