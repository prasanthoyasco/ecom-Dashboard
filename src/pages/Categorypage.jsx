import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const dummyCategories = [
  { id: 1, name: 'Rings', description: 'All types of rings' },
  { id: 2, name: 'Necklaces', description: 'Gold and diamond necklaces' },
  { id: 3, name: 'Earrings', description: 'Studs, drops, and hoops' },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState(dummyCategories);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [deletingCategory, setDeletingCategory] = useState(null);

  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setDeletingCategory(null);
  };

  const handleEdit = () => {
    const updated = categories.map((cat) =>
      cat.id === editingCategory.id ? editingCategory : cat
    );
    setCategories(updated);
    setEditingCategory(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded shadow">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">{cat.name}</td>
                <td className="py-3 px-4">{cat.description}</td>
                <td className="py-3 px-4 flex gap-4 text-center">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingCategory(cat)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Category Name"
            />
            <textarea
              value={editingCategory.description}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, description: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingCategory(null)} className="px-4 py-2 text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Category</h2>
            <p>Are you sure you want to delete "{deletingCategory.name}"?</p>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingCategory.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
