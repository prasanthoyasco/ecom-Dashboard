import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

const ProductVariant = ({ variantName = "Variant 1", onRemove,onNameChange  }) => {
  const [variantValue, setVariantValue] = useState("");

useEffect(() => {
    setVariantValue(variantName);
  }, [variantName]);

  const handleChange = (e) => {
    setVariantValue(e.target.value);
    onNameChange && onNameChange(e.target.value);
  };

  return (
    <div className="relative p-5 mt-8 box before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md">
      <div className="rounded-lg border p-5 bg-white relative z-10">
        <div className="flex items-center border-b pb-5 text-base font-medium">
          <ChevronDown className="mr-2 size-4 stroke-[1.5]" />
          Product Variant (Details)
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col xl:flex-row items-start">
            <div className="w-full xl:w-64 xl:mr-10">
              <div className="text-left">
                <div className="font-medium">Variant 1</div>
                <div className="mt-3 text-xs leading-relaxed text-gray-500">
                  Add the types of variants and options, you can add up to 5 options.
                </div>
              </div>
            </div>

            <div className="mt-3 w-full flex-1 xl:mt-0">
              <div className="relative rounded-lg border border-gray-200 bg-gray-50 py-10 pl-5 pr-5 xl:pr-10">
                <button
                  className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
                  onClick={onRemove}
                  title="Remove Variant"
                >
                  <X className="size-5 stroke-[1.5]" />
                </button>

                <div className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-12">
                    <div className="col-span-2 text-sm font-medium text-right mt-2">
                      Name
                    </div>
                    <div className="col-span-10 grid gap-5">
                      <div className="grid gap-5 sm:grid-cols-12">
                        <div className="col-span-10 flex">
                          <input
                                type="text"
                                value={variantValue}
                                onChange={handleChange}
                                placeholder="e.g., Size"
                                maxLength={14} 
                                className="h-10 w-full rounded border border-r-0 bg-white px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="bg-gray-100 border border-l-0 text-gray-500 flex w-16 items-center justify-center rounded-md">
                                {variantValue.length}/14 {/* Dynamic count */}
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVariant;
