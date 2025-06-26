import { useEffect, useRef, useState } from "react";
import { Lightbulb, Image, X, ChevronDown } from "lucide-react";

const ProductPhotoUpload = ({ initialImages = [], onImagesChange }) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

  // Populate existing images from props
  useEffect(() => {
    if (initialImages?.length) {
      const formatted = initialImages.map((img) =>
        typeof img === "string" || img.secure_url
          ? { preview: img.secure_url || img }
          : { file: img, preview: URL.createObjectURL(img) }
      );
      setImages(formatted);
    }
  }, [initialImages]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    const newImages = [...images, ...previews].slice(0, 5); // max 5
    setImages(newImages);
    onImagesChange?.(
      newImages.map((img) => img.file || img.preview) // return either file or URL
    );
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange?.(newImages.map((img) => img.file || img.preview));
  };

  return (
    <div className="relative p-5">
      <div className="before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-md before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-md after:rounded-xl after:z-[-1] after:backdrop-blur-md" />
      <div className="rounded-lg border p-5 bg-white relative z-10">
        <div className="flex items-center border-b pb-5 text-base font-medium">
          <ChevronDown className="mr-2 size-4 stroke-[1.5]" />
          Upload Product
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {/* Note */}
          <div className="mb-5 flex items-center text-sm text-gray-700">
            <Lightbulb className="text-yellow-500 h-5 w-5" />
            <div className="ml-2">
              Avoid selling counterfeit products to prevent deletion.{" "}
              <a className="text-indigo-600 font-medium" href="#">
                Learn More
              </a>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div className="xl:w-64">
              <h3 className="font-medium flex items-center">
                Product Photos
                <span className="ml-3 text-xs text-red-600 border px-2 py-0.5 rounded bg-red-50 border-red-200">
                  Required
                </span>
              </h3>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Use JPG, JPEG, PNG formats. Minimum 300x300px, recommended 700x700px.
                Upload up to 5 images. Include at least 3 attractive photos.
              </p>
            </div>

            <div className="flex-1">
              <div className="rounded-xl border-2 border-dashed pt-4 pb-6">
                {/* Uploaded Images */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative h-28 rounded-xl shadow group">
                      <img
                        src={img.preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full rounded-xl object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-[-5px] right-[-5px] bg-red-600 text-white rounded-full p-1 hover:bg-red-700 z-10"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Area */}
                <div
                  className="mt-6 flex justify-center items-center gap-2 cursor-pointer relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Image className="size-4 text-indigo-500" />
                  <span className="text-indigo-600 font-medium">Upload a file</span> or drag and drop
                </div>

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPhotoUpload;
