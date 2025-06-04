import React, { useState } from "react";
// Import all your step components
import ProductPhotoUpload from "./ProductPhotoUpload"; // Assuming this is your first step
import ProductInfoStep from "./ProductInfoStep";
import ProductDetailStep from "./ProductDetailStep";
import ProductVariantStep from "./ProductVariantStep"; // The component with the "Add Variant" button
import ProductVariantDetails from "./ProductVariantDetails"; // The component for displaying/editing a single variant
import WeightShipping from "./weightShipping"; // Corrected casing for consistency

const steps = ["Product Photo", "Product Info", "Product Details", "Product Variants", "Weight & Shipping"];

const ProductFormModal = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // --- Data states for each step ---
  const [productPhotos, setProductPhotos] = useState([]); // from ProductPhotoUpload
  const [productInfo, setProductInfo] = useState({ // from ProductInfoStep
    productName: "",
    category: "",
    subcategory: "",
  });
  const [productDetails, setProductDetails] = useState({ // from ProductDetailStep
    condition: "",
    description: "",
    videoUrl: "", // Assuming you'll add state for this when video is implemented
  });

  const [variants, setVariants] = useState([]); // from ProductVariantStep and ProductVariantDetails
  // You might need to update the variant structure to include options for each variant type
  // Example: [{ id: 1, name: 'Color', options: [{ id: 101, value: 'Red' }] }]
  // For now, keeping it simple as per your last ProductVariantDetails component.

  const [weightShippingData, setWeightShippingData] = useState({ // from WeightShipping
    weight: '',
    weightUnit: 'Gram (g)',
    dimensions: { width: '', height: '', length: '' },
    insurance: 'optional',
    shippingService: 'standard',
    preOrder: false,
  });

  // --- Handlers for updating each step's data ---

  const handleProductPhotosChange = (images) => {
    setProductPhotos(images);
  };

  const handleProductInfoChange = (e) => {
    // This handler assumes ProductInfoStep passes individual field changes,
    // or you might refactor ProductInfoStep to pass an object for all its fields.
    // Assuming individual changes for now as per your initial prop names.
    const { name, value } = e.target;
    setProductInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductDetailChange = (e) => {
    // Similar to ProductInfoStep, assuming individual changes.
    const { name, value, type, checked } = e.target;
    setProductDetails((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProductDescriptionChange = (newDescription) => {
    setProductDetails(prevData => ({ ...prevData, description: newDescription }));
  };

  const handleConditionChange = (newCondition) => {
    setProductDetails(prevData => ({ ...prevData, condition: newCondition }));
  };

  const handleVideoUrlChange = (url) => {
    setProductDetails(prevData => ({ ...prevData, videoUrl: url }));
  };


  // Handlers for Product Variants
  const addVariant = () => {
    if (variants.length >= 2) {
      alert("You can add a maximum of 2 variant types.");
      return;
    }
    // Generate a unique ID for the new variant
    setVariants([...variants, { id: Date.now(), name: "", options: [] }]); // Added options array
  };

  const removeVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariantName = (id, newName) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, name: newName } : v))
    );
  };

  // You'll need handlers for adding/removing/updating options within each variant
  // For example:
  const addVariantOption = (variantId, newOptionValue) => {
    setVariants(
      variants.map(v =>
        v.id === variantId
          ? { ...v, options: [...v.options, { id: Date.now(), value: newOptionValue }] }
          : v
      )
    );
  };

  const removeVariantOption = (variantId, optionId) => {
    setVariants(
      variants.map(v =>
        v.id === variantId
          ? { ...v, options: v.options.filter(opt => opt.id !== optionId) }
          : v
      )
    );
  };

  const handleWeightShippingChange = (data) => {
    setWeightShippingData(data);
  };


  // --- Navigation handlers ---
  const nextStep = () => {
    // --- Add validation logic before advancing to the next step ---
    // Example: Basic validation for the current step
    switch (currentStep) {
      case 0: // Product Photo Upload
        if (productPhotos.length === 0) {
          alert("Please upload at least one product photo.");
          return;
        }
        break;
      case 1: // Product Info Step
        if (!productInfo.productName || productInfo.productName.length < 40 || !productInfo.category) {
          alert("Please fill in required product name (min 40 chars) and category.");
          return;
        }
        break;
      case 2: // Product Detail Step
        if (!productDetails.condition || !productDetails.description) {
          alert("Please select product condition and provide a description.");
          return;
        }
        if (productDetails.description.length < 100) { // Example min length
            alert("Product description should be at least 100 characters.");
            return;
        }
        break;
      case 3: // Product Variant Step
        // You might add validation here if variants are required or have specific rules
        // For example, if variants are added, ensure their names are not empty, and they have options
        // if (variants.length > 0 && variants.some(v => !v.name || v.options.length === 0)) {
        //     alert("Please ensure all variants have a name and at least one option.");
        //     return;
        // }
        break;
      case 4: // Weight & Shipping
          if (!weightShippingData.weight || parseFloat(weightShippingData.weight) <= 0 ||
              !weightShippingData.dimensions.width || parseFloat(weightShippingData.dimensions.width) <= 0 ||
              !weightShippingData.dimensions.height || parseFloat(weightShippingData.dimensions.height) <= 0 ||
              !weightShippingData.dimensions.length || parseFloat(weightShippingData.dimensions.length) <= 0) {
              alert("Please enter valid positive weight and dimensions.");
              return;
          }
          break;
      default:
        break;
    }
    // If validation passes, move to the next step
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // --- Submit handler ---
  const handleSubmit = () => {
    // Final validation can happen here as well
    // For simplicity, directly logging the data
    const finalData = {
      productPhotos: productPhotos.map(file => file.name), // Just sending file names for example
      productInfo,
      productDetails,
      variants,
      weightShipping: weightShippingData,
    };
    console.log("Submitting data:", finalData);
    alert("Form submitted! Check console for data.");
    // In a real application, you would send this data to an API
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h1>

      {/* Progress Indicator / Step Title */}
      <div className="mb-8 text-center text-lg font-medium text-indigo-700">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </div>

      {/* --- Render Current Step Component --- */}
      {currentStep === 0 && (
        <ProductPhotoUpload onImagesChange={handleProductPhotosChange} />
      )}

      {currentStep === 1 && (
        <ProductInfoStep
          productName={productInfo.productName}
          setProductName={(name) => handleProductInfoChange({ target: { name: 'productName', value: name } })}
          category={productInfo.category}
          setCategory={(cat) => handleProductInfoChange({ target: { name: 'category', value: cat } })}
          subcategory={productInfo.subcategory}
          setSubcategory={(subcat) => handleProductInfoChange({ target: { name: 'subcategory', value: subcat } })}
          // You'll need to pass actual categories and subcategories data here
          categories={["Electronics", "Apparel", "Home Goods", "Books"]}
          subcategories={ // Example: Filter subcategories based on selected category
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
          onAddVideoClick={() => alert("Video URL input will appear here or in a modal!")} // Placeholder for video
          // You would likely pass productDetails.videoUrl and its setter here too
        />
      )}

      {currentStep === 3 && (
        <>
          <ProductVariantStep onAddVariantClick={addVariant} />
          {variants.length === 0 && (
            <p className="mt-4 text-center text-gray-500">No variants added yet. Click "Add Variant" to begin.</p>
          )}
          {variants.map((variant) => (
            <ProductVariantDetails // Correctly using ProductVariantDetails here
              key={variant.id}
              variantName={variant.name}
              onRemove={() => removeVariant(variant.id)}
              onNameChange={(newName) => updateVariantName(variant.id, newName)}
              // You'll also need to pass props to manage options for this variant
              // e.g., options={variant.options} onAddOption={...} onRemoveOption={...}
            />
          ))}
        </>
      )}

      {currentStep === 4 && (
        <WeightShipping
          weight={weightShippingData.weight}
          setWeight={(val) => setWeightShippingData(prev => ({ ...prev, weight: val }))}
          weightUnit={weightShippingData.weightUnit}
          setWeightUnit={(val) => setWeightShippingData(prev => ({ ...prev, weightUnit: val }))}
          dimensions={weightShippingData.dimensions}
          setDimensions={(dims) => setWeightShippingData(prev => ({ ...prev, dimensions: dims }))}
          insurance={weightShippingData.insurance}
          setInsurance={(val) => setWeightShippingData(prev => ({ ...prev, insurance: val }))}
          shippingService={weightShippingData.shippingService}
          setShippingService={(val) => setWeightShippingData(prev => ({ ...prev, shippingService: val }))}
          preOrder={weightShippingData.preOrder}
          setPreOrder={(val) => setWeightShippingData(prev => ({ ...prev, preOrder: val }))}
        />
      )}

      {/* --- Navigation Buttons --- */}
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