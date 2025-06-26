import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/productApi";
import { uploadToCloudinary } from "../../api/imageUpload";
import { toast } from "react-hot-toast";
import ProductPhotoUpload from "./ProductPhotoUpload";
import ProductInfoStep from "./ProductInfoStep";
import ProductDetailStep from "./ProductDetailStep";
import ProductVariantStep from "./ProductVariantStep";
import ProductVariant from "./ProductVariantDetails";
import ProductManagement from "./ProductManagementStep";
import WeightShippings from "./WeightShippings";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

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
  const [productManagementData, setProductManagementData] = useState({
    isActive: true,
    stock: 0,
    sku: "",
    price: "",
  });
  const [weightShippingData, setWeightShippingData] = useState({
    weight: "",
    weightUnit: "Gram (g)",
    dimensions: { width: "", height: "", length: "" },
    insurance: "optional",
    shippingService: "standard",
    preOrder: false,
    dimensionsUnit: "inch",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(productId);
        console.log("Fetched Product:", data);

        setProductPhotos((data.images || []).map((url) => ({ secure_url: url })));

        setProductInfo({
          productName: data.name || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
        });

        setProductDetails({
          condition: data.condition || "",
          description: data.description || "",
          videoUrl: data.productVideoUrl || "",
        });

        setVariants(data.variant || []);

        setProductManagementData({
          isActive: data.status === "Active",
          stock: data.stock || 0,
          sku: data.SKU || "",
          price: data.price || "",
        });

        setWeightShippingData({
          weight: data.shipping?.weight || "",
          weightUnit: data.shipping?.weightUnit || "Gram (g)",
          dimensions: data.shipping?.dimensions || { width: "", height: "", length: "" },
          insurance: data.shipping?.insurance || "optional",
          shippingService: data.shipping?.shippingService || "standard",
          preOrder: data.shipping?.preOrder || false,
          dimensionsUnit: data.shipping?.dimensionsUnit || "inch",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        toast.error("Failed to load product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async () => {
    try {
      const imageUrls = await Promise.all(
        productPhotos.map(async (img) =>
          img.secure_url ? img : await uploadToCloudinary(img)
        )
      );

      const payload = {
        images: imageUrls.map((img) => img.secure_url || img),
        name: productInfo.productName,
        category: productInfo.category,
        subcategory: productInfo.subcategory,
        condition: productDetails.condition,
        description: productDetails.description,
        productVideoUrl: productDetails.videoUrl,
        variant: variants,
        status: productManagementData.isActive ? "Active" : "Inactive",
        stock: productManagementData.stock,
        SKU: productManagementData.sku,
        price: productManagementData.price,
        shipping: weightShippingData,
      };

      await updateProduct(productId, payload);
      toast.success("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("Error updating product");
    }
  };

  if (loading) {
    return <div className="p-4">Loading product...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>

      <ProductPhotoUpload
        initialImages={productPhotos}
        onImagesChange={setProductPhotos}
      />

      <ProductInfoStep
        productName={productInfo.productName}
        setProductName={(val) =>
          setProductInfo((prev) => ({ ...prev, productName: val }))
        }
        category={productInfo.category}
        setCategory={(val) =>
          setProductInfo((prev) => ({ ...prev, category: val }))
        }
        subcategory={productInfo.subcategory}
        setSubcategory={(val) =>
          setProductInfo((prev) => ({ ...prev, subcategory: val }))
        }
      />

      <ProductDetailStep
        description={productDetails.description}
        setDescription={(val) =>
          setProductDetails((prev) => ({ ...prev, description: val }))
        }
        onAddVideoClick={() => {
          const urlInput = document.querySelector("input[type='url']");
          if (urlInput) {
            setProductDetails((prev) => ({
              ...prev,
              videoUrl: urlInput.value,
            }));
          }
        }}
      />

      <ProductVariantStep
        onAddVariantClick={() => setVariants([...variants, ""])}
      />

      {variants.map((variantName, index) => (
        <ProductVariant
          key={index}
          variantName={variantName}
          onRemove={() => {
            const updated = [...variants];
            updated.splice(index, 1);
            setVariants(updated);
          }}
          onNameChange={(newName) => {
            const updated = [...variants];
            updated[index] = newName;
            setVariants(updated);
          }}
        />
      ))}

      <ProductManagement
        isActive={productManagementData.isActive}
        stock={productManagementData.stock}
        sku={productManagementData.sku}
        price={productManagementData.price}
        onChange={setProductManagementData}
      />

      <WeightShippings
        weight={weightShippingData.weight}
        setWeight={(val) =>
          setWeightShippingData((prev) => ({ ...prev, weight: val }))
        }
        weightUnit={weightShippingData.weightUnit}
        setWeightUnit={(val) =>
          setWeightShippingData((prev) => ({ ...prev, weightUnit: val }))
        }
        dimensions={weightShippingData.dimensions}
        setDimensions={(val) =>
          setWeightShippingData((prev) => ({ ...prev, dimensions: val }))
        }
        insurance={weightShippingData.insurance}
        setInsurance={(val) =>
          setWeightShippingData((prev) => ({ ...prev, insurance: val }))
        }
        shippingService={weightShippingData.shippingService}
        setShippingService={(val) =>
          setWeightShippingData((prev) => ({ ...prev, shippingService: val }))
        }
        preOrder={weightShippingData.preOrder}
        setPreOrder={(val) =>
          setWeightShippingData((prev) => ({ ...prev, preOrder: val }))
        }
        dimensionsUnit={weightShippingData.dimensionsUnit}
        setDimensionsUnit={(val) =>
          setWeightShippingData((prev) => ({ ...prev, dimensionsUnit: val }))
        }
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
