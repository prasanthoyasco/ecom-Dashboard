import React, { useState } from "react";

// Import all your step components
import ProductPhotoUpload from "./ProductPhotoUpload";
import ProductInfoStep from "./ProductInfoStep";
import ProductDetailStep from "./ProductDetailStep";
import ProductVariantStep from "./ProductVariantStep";
import ProductVariantDetails from "./ProductVariantDetails";
import WeightShipping from "./WeightShipping.jsx";

const steps = [
  "Product Photo",
  "Product Info",
  "Product Details",
  "Product Variants",
  "Weight & Shipping",
];

const ProductFormModal = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Step-wise data
  const [productPhotos, setProductPhotos] = useState([]);
  const [productInfo, setProductInfo] = useState({
    productName: "",
    category: "",
    subcategory: "",
  });
  const [productDetails, setProductDetails] = useState({
    condition: "",
    description: "",
    videoUrl: "",
  });
  const [variants, setVariants] = useState([]);
  const [weightShippingData, setWeightShippingData] = useState({
    weight: "",
    weightUnit: "Gram (g)",
    dimensions: { width: "", height: "", length: "" },
    insurance: "optional",
    shippingService: "standard",
    preOrder: false,
  });

  // Handlers for info steps
  const handleProductPhotosChange = (images) => setProductPhotos(images);

  const handleProductInfoChange = ({ target: { name, value } }) => {
    setProductInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductDetailChange = ({ target: { name, value, type, checked } }) => {
    setProductDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductDescriptionChange = (value) =>
    setProductDetails((prev) => ({ ...prev, description: value }));

  const handleConditionChange = (value) =>
    setProductDetails((prev) => ({ ...prev, condition: value }));

  const handleVideoUrlChange = (url) =>
    setProductDetails((prev) => ({ ...prev, videoUrl: url }));

  // Variant Handlers
  const addVariant = () => {
    if (variants.length >= 2) {
      alert("You can add a maximum of 2 variant types.");
      return;
    }
    setVariants([...variants, { id: Date.now(), name: "", options: [] }]);
  };

  const removeVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariantName = (id, newName) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, name: newName } : v)));
  };

  const addVariantOption = (variantId, value) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, options: [...v.options, { id: Date.now(), value }] }
          : v
      )
    );
  };

  const removeVariantOption = (variantId, optionId) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, options: v.options.filter((o) => o.id !== optionId) }
          : v
      )
    );
  };

  const handleWeightShippingChange = (data) => {
    setWeightShippingData(data);
  };

  // Step Navigation
  const nextStep = () => {
    switch (currentStep) {
      case 0:
        if (!productPhotos.length) return alert("Upload at least one product photo.");
        break;
      case 1:
        if (!productInfo.productName || productInfo.productName.length < 40)
          return alert("Product name must be at least 40 characters.");
        if (!productInfo.category) return alert("Category is required.");
        break;
      case 2:
        if (!productDetails.condition || !productDetails.description)
          return alert("Condition and description are required.");
        if (productDetails.description.length < 100)
          return alert("Description should be at least 100 characters.");
        break;
      case 4:
        const { weight, dimensions } = weightShippingData;
          const { width, height, length } = dimensions || {};

          if (
            !weight || isNaN(weight) || Number(weight) <= 0 ||
            !width || isNaN(width) || Number(width) <= 0 ||
            !height || isNaN(height) || Number(height) <= 0 ||
            !length || isNaN(length) || Number(length) <= 0
          ) {
            return alert("Enter valid weight and all dimensions (width, height, length).");
          }
          break;
    }
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const finalData = {
      productPhotos: productPhotos.map((file) => file.name),
      productInfo,
      productDetails,
      variants,
      weightShipping: weightShippingData,
    };
    console.log("Submitting:", finalData);
    alert("Form submitted! Check console.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h1>

      <div className="mb-8 text-center text-lg font-medium text-indigo-700">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </div>

      {/* Step Components */}
      {currentStep === 0 && <ProductPhotoUpload onImagesChange={handleProductPhotosChange} />}
      {currentStep === 1 && (
        <ProductInfoStep
          productName={productInfo.productName}
          setProductName={(val) =>
            handleProductInfoChange({ target: { name: "productName", value: val } })
          }
          category={productInfo.category}
          setCategory={(val) =>
            handleProductInfoChange({ target: { name: "category", value: val } })
          }
          subcategory={productInfo.subcategory}
          setSubcategory={(val) =>
            handleProductInfoChange({ target: { name: "subcategory", value: val } })
          }
          categories={["Electronics", "Apparel", "Home Goods", "Books"]}
          subcategories={
            productInfo.category === "Electronics"
              ? ["Phones", "Laptops", "Tablets"]
              : productInfo.category === "Apparel"
              ? ["Men's", "Women's", "Kids'"]
              : []
          }
        />
      )}
      {currentStep === 2 && (
        <ProductDetailStep
          condition={productDetails.condition}
          setCondition={handleConditionChange}
          description={productDetails.description}
          setDescription={handleProductDescriptionChange}
          videoUrl={productDetails.videoUrl}
          setVideoUrl={handleVideoUrlChange}
          onAddVideoClick={() => alert("Video upload coming soon!")}
          handleChange={handleProductDetailChange}
        />
      )}
      {currentStep === 3 && (
        <>
          <ProductVariantStep onAddVariantClick={addVariant} />
          {variants.length === 0 && (
            <p className="mt-4 text-center text-gray-500">
              No variants added. Click "Add Variant" to begin.
            </p>
          )}
          {variants.map((variant) => (
            <ProductVariantDetails
              key={variant.id}
              variantName={variant.name}
              options={variant.options}
              onNameChange={(val) => updateVariantName(variant.id, val)}
              onAddOption={(val) => addVariantOption(variant.id, val)}
              onRemoveOption={(optId) => removeVariantOption(variant.id, optId)}
              onRemove={() => removeVariant(variant.id)}
            />
          ))}
        </>
      )}
      {currentStep === 4 && (
        <WeightShipping
          onChange={handleWeightShippingChange}
          weight={weightShippingData.weight}
          setWeight={(val) => setWeightShippingData((prev) => ({ ...prev, weight: val }))}
          weightUnit={weightShippingData.weightUnit}
          setWeightUnit={(val) => setWeightShippingData((prev) => ({ ...prev, weightUnit: val }))}
          dimensions={weightShippingData.dimensions}
          setDimensions={(dims) => setWeightShippingData((prev) => ({ ...prev, dimensions: dims }))}
          insurance={weightShippingData.insurance}
          setInsurance={(val) => setWeightShippingData((prev) => ({ ...prev, insurance: val }))}
          shippingService={weightShippingData.shippingService}
          setShippingService={(val) =>
            setWeightShippingData((prev) => ({ ...prev, shippingService: val }))
          }
          preOrder={weightShippingData.preOrder}
          setPreOrder={(val) => setWeightShippingData((prev) => ({ ...prev, preOrder: val }))}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10 p-4 border-t border-gray-200">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            currentStep === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
          >
            Submit Product
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFormModal;
