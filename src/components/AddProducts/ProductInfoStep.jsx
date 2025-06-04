import { ChevronDown } from "lucide-react";

const ProductInfoStep = ({
  productName,
  setProductName,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  categories = [],
  subcategories = []
}) => {
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
              <div className="font-medium flex items-center">
                Product Name
                <span className="ml-3 text-xs text-red-600 border px-2 py-0.5 rounded bg-red-50 border-red-200">
                  Required
                </span>
              </div>
              <p className="mt-3 text-xs opacity-70 leading-relaxed">
                Include min. 40 characters to make it more attractive and easy for buyers to find. Include product type, brand, color, material, etc.
              </p>
            </div>
            <div className="mt-3 xl:mt-0 flex-1 w-full">
              <input
                type="text"
                placeholder="Product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="h-10 w-full rounded-md border px-3 py-2 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <p className="text-right text-xs text-gray-500 mt-1">
                {productName.length}/70
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <div className="font-medium flex items-center">
                Category
                <span className="ml-3 text-xs text-red-600 border px-2 py-0.5 rounded bg-red-50 border-red-200">
                  Required
                </span>
              </div>
            </div>
            <div className="mt-3 xl:mt-0 flex-1 w-full">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-md border px-3 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 pr-8" 
            >
                <option value="">Select a Category</option>
                {categories.map((cat, i) => (
                <option key={i} value={cat}>
                    {cat}
                </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Subcategory */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <div className="font-medium">Subcategory</div>
              <p className="mt-3 text-xs opacity-70 leading-relaxed">
                You can add a new subcategory or choose from existing ones.
              </p>
            </div>
            <div className="mt-3 xl:mt-0 flex-1 w-full">
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="h-10 w-full rounded-md border px-3 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Select a Subcategory</option>
                {subcategories.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoStep;
