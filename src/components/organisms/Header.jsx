import { useState } from "react";

export default function Header() {
  const [active_notif, setactive_notif] = useState(true);
  return (
    <header className="bg-white rounded-tl-[50px] rounded-tr-[50px] py-5 px-8 flex items-center justify-between shadow-sm">
        <div className="text-3xl text-[#42427D]"><span className="font-medium me-1">Welcome</span>,<strong>Admin</strong></div>
      <div className="flex items-center gap-4">
        <div className="relative ms-5 mt-2 w-72">
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-[#F3F6FF] text-[#7979B2] border border-transparent rounded-tl-[18px] h-12 rounded-tr-[5px] rounded-br-[18px] rounded-bl-[5px] px-4 py-2 w-full pr-10
             focus:border focus:border-gray-300 focus:outline-none transition-colors duration-300 ease-in-out"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>

        <button
          onClick={() => setactive_notif(!active_notif)}
          className="bg-[#F3F6FF] relative w-11 h-11 rounded-tl-[10px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[5px] flex items-center justify-center"
          aria-pressed={active_notif}
        >
          {/* Bell icon (Heroicons outline bell) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#2E2E62]"
            fill="none"
            viewBox="0 0 26 26"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {/* Indicator dot */}
          {active_notif && (
            <span className="absolute top-[-2px] right-[-2px] block h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-tl-[10px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[5px] overflow-hidden">
          <img
            src="/admin-img.jpg"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
