import { useState } from "react";
import { Plus, Search } from "lucide-react";
import CampaignCard from "./CampaignCard";
import CampaignModal from "./CampaignModal";
import CampaignFilterBar from "./CampaignFilterBar";

const mockCampaigns = [
  {
    id: 1,
    name: "Summer Flash Sale",
    status: "Active",
    budget: 5000,
    spent: 3200,
    ctr: 4.2,
    conversions: 150,
    startDate: "2025-06-01",
    endDate: "2025-06-10",
  },
  {
    id: 2,
    name: "Father's Day Promo",
    status: "Inactive",
    budget: 3000,
    spent: 2900,
    ctr: 3.1,
    conversions: 90,
    startDate: "2025-06-05",
    endDate: "2025-06-15",
  },
];

export default function CampaignManager() {
  const [campaigns, _setCampaigns] = useState(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Campaign Manager</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <CampaignFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {filtered.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      <CampaignModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
