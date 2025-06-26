import { useEffect, useState } from "react";
import { ChevronDown, Plus} from "lucide-react";
import { getAllCategories, createCategory } from "../../api/categoryApi";
import CreateCategoryModal from "../molecules/CreateCategoryModal";

const ProductInfoStep = ({
  productName,
  setProductName,
  category,
  setCategory,
  // subcategory,
  setSubcategory,
}) => {
  const [categories, setCategories] = useState([]);
  // const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // const selected = categories.find((cat) => cat._id === category);
    // setFilteredSubcategories(selected?.subcategories || []);
    setSubcategory(""); // reset subcategory on category change
  }, [category, categories, setSubcategory]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "add-new") {
      setShowCreateModal(true);
    } else {
      setCategory(value);
    }
  };

const handleCreateCategory = async (formData) => {
  try {
    const newCat = await createCategory(formData); // call API
    setCategories((prev) => [...prev, newCat]);   // add to dropdown
    setCategory(newCat._id);                      // auto-select new category
    setShowCreateModal(false);                    // close modal
  } catch (err) {
    console.error("Failed to create category", err);
    alert("Category creation failed");
  }
};

  return (
    <div className="relative p-5 mt-8">
      <div className="before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-md before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-md after:rounded-xl after:z-[-1] after:backdrop-blur-md" />
      <div className="rounded-lg border p-5 relative z-10 bg-white">
        <div className="flex items-center border-b pb-5 text-base font-medium">
          <ChevronDown className="mr-2 size-4 stroke-[1.5]" />
          Product Information
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {/* Product Name */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <label htmlFor="productName" className="font-medium flex items-center">
                Product Name
                <span className="ml-3 text-xs text-red-600 border px-2 py-0.5 rounded bg-red-50 border-red-200">
                  Required
                </span>
              </label>
              <p className="mt-3 text-xs opacity-70 leading-relaxed">
                Include min. 20 characters to make it more attractive and easy for buyers to find. Include product type, brand, color, material, etc.
              </p>
            </div>
            <div className="mt-3 xl:mt-0 flex-1 w-full relative">
              <input
                id="productName"
                type="text"
                placeholder="Product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                maxLength={70}
                className="h-10 w-full rounded-md border px-3 py-2 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <p className="text-right text-xs text-gray-500 mt-1">
                {productName?.length}/70
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <label htmlFor="category" className="font-medium flex items-center">
                Category
                <span className="ml-3 text-xs text-red-600 border px-2 py-0.5 rounded bg-red-50 border-red-200">
                  Required
                </span>
              </label>
            </div>
            <div className="mt-3 xl:mt-0 flex-1 w-full relative">
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                required
                className="h-10 w-full rounded-md border px-3 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 pr-8"
              >
                <option value="">Select a Category</option>
                <option value="add-new" className="bg-green-100 font-medium"> + Add New Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Subcategory */}
          {/* <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <label htmlFor="subcategory" className="font-medium">
                Subcategory
              </label>
              <p className="mt-3 text-xs opacity-70 leading-relaxed">
                You can add a new subcategory or choose from existing ones.
              </p>
            </div>
            <div className="mt-3 xl:mt-0 flex-1 w-full relative">
              <select
                id="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="h-10 w-full rounded-md border px-3 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 pr-8"
              >
                <option value="">Select a Subcategory</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-gray-500" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCategory}
      />
    </div>
  );
};

export default ProductInfoStep;
