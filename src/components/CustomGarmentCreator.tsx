import React, { useState, useRef } from "react";
import { X, Upload, Camera, Sparkles, AlertCircle, Check, Loader2 } from "lucide-react";
import { Product } from "../types";

interface CustomGarmentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (newProduct: Product) => void;
}

export const CustomGarmentCreator: React.FC<CustomGarmentCreatorProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Shirts" | "T-Shirts">("T-Shirts");
  const [style, setStyle] = useState<"Essential" | "Atelier" | "Premium">("Atelier");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [careInput, setCareInput] = useState("");
  const [detailsInput, setDetailsInput] = useState("");
  
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Sizes setup
  const availableSizes = ["S", "M", "L", "XL"];
  
  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Image size exceeds 4MB. Please select a smaller photo for storage performance.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setImagePreview(e.target.result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Please enter a garment name.");
      return;
    }

    if (price === "" || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Please specify a valid price greater than ₹0.");
      return;
    }

    if (!imagePreview) {
      setError("Please upload or drag a garment photo to preview.");
      return;
    }

    if (selectedSizes.length === 0) {
      setError("Please select at least one size marker.");
      return;
    }

    const carePoints = careInput.trim() 
      ? careInput.split("\n").map(line => line.trim()).filter(line => line.length > 0)
      : ["Delicate professional wet clean only", "Dry flat away from structural pressure", "Iron low on reverse side"];

    const detailPoints = detailsInput.trim()
      ? detailsInput.split("\n").map(line => line.trim()).filter(line => line.length > 0)
      : [
          `Tailored 100% fine bespoke custom cotton-mix`,
          `Individually custom draft numbered model`,
          `Zero physical fabric seams friction styling`,
          `Eco-consciously processed and ethically dyed`
        ];

    const randomId = `custom-${Date.now()}`;
    const newProduct: Product = {
      id: randomId,
      name: name.trim(),
      price: Number(price),
      description: description.trim() || `${style} garment custom drafted on demand. Features classic modern tailored fits.`,
      category,
      style,
      image: imagePreview,
      images: [imagePreview],
      sizes: selectedSizes,
      careInfo: carePoints,
      details: detailPoints,
    };

    onProductCreated(newProduct);
    
    // Reset state & close
    setName("");
    setPrice("");
    setDescription("");
    setImagePreview(null);
    setSelectedSizes(["S", "M", "L", "XL"]);
    setCareInput("");
    setDetailsInput("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl border border-stone-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[95vh]"
        id="custom-garment-creator-panel"
      >
        {/* Header bar */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2">
            <span className="p-1 px-2.5 bg-stone-900 text-[#faf9f6] text-[10px] font-mono rounded uppercase tracking-wider">
              Bespoke
            </span>
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-stone-700" />
              <span>Atelier Draft Studio</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-900 transition cursor-pointer"
            id="btn-close-creator"
            title="Close drafting studio"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Body block */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start space-x-2 font-medium">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COLUMN 1: IMAGE COMPILER UPLOAD PANEL */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-bold block">
                1. Garment Photo Upload
              </span>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl aspect-[4/5] bg-stone-50/60 hover:bg-stone-50 transition duration-200 flex flex-col items-center justify-center text-center p-6 relative cursor-pointer group ${
                  dragActive ? "border-stone-900 bg-stone-100/50" : imagePreview ? "border-stone-300" : "border-stone-200"
                }`}
                id="garment-upload-container"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="garment-image-input"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="absolute inset-2 bg-white rounded-lg overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Garment drafted design preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-2.5 bg-stone-900 text-white rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center space-x-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Camera className="h-3.5 w-3.5" />
                        <span>Change Photo</span>
                      </div>
                    </div>
                  </div>
                ) : isProcessing ? (
                  <div className="space-y-3.5 text-stone-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-stone-700" />
                    <p className="text-xs font-mono tracking-wide">Processing local image data...</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="h-14 w-14 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400 mx-auto group-hover:scale-105 transition-all duration-200 shadow-sm">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-sm font-medium text-stone-900">
                        Drag photo here, or click to browse
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        Accepts any model photo (Max 4MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-xl space-y-1 text-[11px] text-stone-500 font-light">
                <span className="font-bold text-stone-700 block text-[10px] uppercase font-mono tracking-wider">Storage & Quality Tip</span>
                <p>The photo you select will be safely encoded in base64 inside your browser session only. Use nice studio light photos for stellar results!</p>
              </div>
            </div>

            {/* COLUMN 2: APPAREL PARAMETERS AND STATS */}
            <div className="space-y-4.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-bold block">
                2. Design Particulars
              </span>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-600 block">
                  Garment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bespoke Cashmere Jersey"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 focus:border-stone-900 px-3 py-2.5 text-xs focus:outline-none transition rounded-lg text-stone-800 font-medium"
                  id="input-creator-name"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-600 block">
                  Draft Pricing (₹ INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-mono text-stone-400">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 1499"
                    value={price}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setPrice(val);
                    }}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-stone-900 pl-7 pr-3 py-2.5 text-xs focus:outline-none transition rounded-lg text-stone-800 font-bold font-mono"
                    id="input-creator-price"
                    required
                  />
                </div>
              </div>

              {/* Category & Style selection */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-stone-600 block">
                    Collection Class
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-stone-900 px-2 py-2.5 text-xs focus:outline-none rounded-lg text-stone-800"
                    id="input-creator-category"
                  >
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Shirts">Shirts</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-stone-600 block">
                    Atelier Grading
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as any)}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:border-stone-900 px-2 py-2.5 text-xs focus:outline-none rounded-lg text-stone-800"
                    id="input-creator-style"
                  >
                    <option value="Essential">Essential Series</option>
                    <option value="Atelier">Atelier Series</option>
                    <option value="Premium">Premium Series</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-600 block">
                  Creative Notes / Description
                </label>
                <textarea
                  placeholder="Drape features, texture weights, fit silhouette..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 focus:border-stone-900 px-3 py-2 text-xs focus:outline-none transition rounded-lg text-stone-800 font-light resize-none leading-relaxed"
                  id="input-creator-description"
                />
              </div>

              {/* Size Selectors Checkboxes */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-600 block">
                  Available Sizing Matrix
                </span>
                <div className="flex space-x-2">
                  {availableSizes.map((size) => {
                    const isChecked = selectedSizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`h-9 w-9 text-xs font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                          isChecked
                            ? "bg-stone-900 border-stone-900 text-white shadow-sm"
                            : "bg-white border-stone-200 text-stone-400 hover:border-stone-400"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          <hr className="border-stone-100" />

          {/* ADVANCED OPTIONAL ACCORDIONS: DETAILS & CARE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Fabrication Bullet lists */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-stone-600 font-medium block">
                Bullet details (One per line - Optional)
              </label>
              <textarea
                placeholder="e.g. 100% fine bespoke modal fibers&#10;Flatlock seamless hand stitches"
                rows={3}
                value={detailsInput}
                onChange={(e) => setDetailsInput(e.target.value)}
                className="w-full bg-stone-50/30 border border-stone-250/70 focus:border-stone-900 p-2.5 text-xs focus:outline-none transition rounded-lg text-stone-700 font-mono leading-relaxed"
                id="input-creator-details"
              />
            </div>

            {/* Care guidelines */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-stone-600 font-medium block">
                Care instructions (One per line - Optional)
              </label>
              <textarea
                placeholder="e.g. Handwash cold with silk soap&#10;Lay flat in shadow"
                rows={3}
                value={careInput}
                onChange={(e) => setCareInput(e.target.value)}
                className="w-full bg-stone-50/30 border border-stone-250/70 focus:border-stone-900 p-2.5 text-xs focus:outline-none transition rounded-lg text-stone-700 font-mono leading-relaxed"
                id="input-creator-care"
              />
            </div>

          </div>

          {/* Submit container */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-3 bg-stone-50/20 -mx-6 -mb-6 p-6">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2.5 border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg text-xs uppercase font-semibold tracking-wider transition cursor-pointer"
              id="btn-cancel-creation"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 bg-stone-900 border border-stone-900 text-[#faf9f6] hover:bg-stone-800 disabled:bg-stone-300 disabled:border-stone-300 rounded-lg text-xs uppercase font-bold tracking-widest transition flex items-center space-x-2 shadow-md cursor-pointer"
              id="btn-submit-creation"
            >
              <Check className="h-4 w-4 text-green-300" />
              <span>Compile Draft</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
