import React, { useEffect, useRef } from "react";
import { BellRing, PackageCheck, BarChart2, X } from "lucide-react";

export default function NotificationModal({ open, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute right-24 top-24 z-50">
      <div
        ref={modalRef}
        className="bg-white w-80 rounded-lg shadow-xl border border-gray-200 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center p-3 gap-2 text-gray-700 hover:bg-gray-100">
            <BellRing className="w-4 h-4 text-blue-500" />
            New product launched
          </li>
          <li className="flex items-center p-3 gap-2 text-gray-700 hover:bg-gray-100">
            <PackageCheck className="w-4 h-4 text-green-500" />
            Order #1234 shipped
          </li>
          <li className="flex items-center p-3 gap-2 text-gray-700 hover:bg-gray-100">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            Campaign performance updated
          </li>
        </ul>
      </div>
    </div>
  );
}
