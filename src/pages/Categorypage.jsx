import { useEffect, useRef, useState } from "react";
import { BoxIcon, Pencil, Trash2, UploadCloud } from "lucide-react";
import CreateCategoryModal from "../components/molecules/CreateCategoryModal";
import {
  getAllCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} from "../api/categoryApi";

export default function CategoryPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving , setSaving] = useState(false)
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }finally{
      setLoading(false)
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setEditingCategory({ ...editingCategory, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    setSaving(true)
    try {
      const updated = await updateCategory(
        editingCategory._id,
        editingCategory
      );
      const newList = categories.map((cat) =>
        cat._id === updated._id ? updated : cat
      );
      setCategories(newList);
      setEditingCategory(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Failed to update category", error);
    }finally{
      setSaving(false)
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat._id !== id));
      setDeletingCategory(null);
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const handleCreateCategory = async (data) => {
    try {
      const newCat = await createCategory(data);
      setCategories([...categories, newCat]);
    } catch (err) {
      console.error("Failed to create category", err);
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <span className="ml-3 text-blue-600 font-semibold text-lg">
          Loading...
        </span>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between h-10 my-5">
        <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-white bg-green-700 hover:bg-green-600"
        >
          <BoxIcon size={16} /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded shadow">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Category Image</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Subcategories</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>

            {categories.map((cat, i) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">{cat.name}</td>
                <td className="py-3 px-4">{cat.description}</td>
                <td className="py-3 px-4">
                  {cat.subcategories?.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {cat.subcategories.map((sub, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {sub.image && (
                            <img
                              src={sub.image}
                              className="w-5 h-5 rounded-full object-cover border"
                              alt={sub.name}
                            />
                          )}
                          <span>{sub.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No subcategories</span>
                  )}
                </td>
                <td className="py-3 px-4 flex gap-4 text-center">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setPreviewImage(null);
                    }}
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

            {/* Image Upload with hover icon */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="group relative w-full h-40 border-2 border-dashed rounded flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 cursor-pointer mb-4 overflow-hidden"
            >
              {(previewImage || editingCategory.image) ? (
                <img
                  src={previewImage || editingCategory.image}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <p>Drag & drop an image here, or click to upload</p>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <UploadCloud size={32} />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </div>

            <input
              type="text"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
              placeholder="Category Name"
            />
            <textarea
              value={editingCategory.description}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  description: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border rounded"
              placeholder="Description"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateCategoryModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCategory}
      />

      {/* Delete Modal */}
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
                onClick={() => handleDelete(deletingCategory._id)}
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
