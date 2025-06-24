import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const ProductManagement = ({ isActive: isActiveProp, stock: stockProp, sku: skuProp, onChange,price: priceProp, }) => {
  const [isActive, setIsActive] = useState(isActiveProp ?? false);
  const [stock, setStock] = useState(stockProp ?? "");
  const [sku, setSku] = useState(skuProp ?? "");
   const [price, setPrice] = useState(priceProp ?? "");

  // Sync with props (e.g., for Edit mode)
  useEffect(() => {
    if (isActiveProp !== undefined) setIsActive(isActiveProp);
    if (stockProp !== undefined) setStock(stockProp);
    if (skuProp !== undefined) setSku(skuProp);
   if (priceProp !== undefined) setPrice(priceProp);
  }, [isActiveProp, stockProp, skuProp, priceProp]);

    useEffect(() => {
    onChange?.({ isActive, stock, sku, price });
  }, [isActive, stock, sku, price]);

  const handleToggle = () => setIsActive((prev) => !prev);
  const handleStockChange = (e) => setStock(e.target.value);
  const handleSkuChange = (e) => setSku(e.target.value);

  return (
    <div className="relative p-5 mt-8 box before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md">
      <div className="rounded-lg border p-5 bg-white relative z-10">
        <div className="flex items-center border-b pb-5 text-base font-medium">
          <ChevronDown className="mr-2 size-4 stroke-[1.5]" />
          Product Management
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {/* Product Status */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <div className="font-medium">Product Status</div>
              <div className="mt-3 text-xs text-gray-500">
                If the status is active, your product can be searched for by potential buyers.
              </div>
            </div>
            <div className="mt-3 xl:mt-0 w-full flex-1">
              <div className="flex items-center space-x-2">
                <div className="relative h-6 w-11">
                  <input
                    type="checkbox"
                    id="statusToggle"
                    checked={isActive}
                    onChange={handleToggle}
                    className="peer relative z-10 size-full cursor-pointer opacity-0"
                  />
                  <div className={`absolute inset-0 rounded-full transition-all ${isActive ? "bg-indigo-600" : "bg-gray-300"}`} />
                  <div className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ${isActive ? "translate-x-5" : ""}`} />
                </div>
                <label htmlFor="statusToggle" className="text-xs text-gray-600">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Product Stock */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <div className="font-medium">Product Stock</div>
            </div>
            <div className="mt-3 xl:mt-0 w-full flex-1">
              <input
                type="text"
                placeholder="Input Product Stock"
                value={stock}
                onChange={handleStockChange}
                className="h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          {/* Product Price */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <div className="font-medium">Product Price</div>
              <div className="mt-3 text-xs text-gray-500">
                This will be the base price for the product.
              </div>
            </div>
            <div className="mt-3 xl:mt-0 w-full flex-1">
              <input
                type="number"
                placeholder="Enter Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>


          {/* SKU */}
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <div className="font-medium">SKU (Stock Keeping Unit)</div>
              <div className="mt-3 text-xs text-gray-500">
                Use a unique SKU code if you want to mark your product.
              </div>
            </div>
            <div className="mt-3 xl:mt-0 w-full flex-1">
              <input
                type="text"
                placeholder="Input SKU"
                value={sku}
                onChange={handleSkuChange}
                className="h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
