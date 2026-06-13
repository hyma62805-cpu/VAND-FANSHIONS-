import React, { useState } from "react";
import { Product } from "../types";
import { X, ChevronDown, ChevronUp, ShieldCheck, Truck, RefreshCw, Star, Info, Share2, Copy, Check, Mail, Trash2 } from "lucide-react";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onDeleteCustom?: (id: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onClose,
  onAddToCart,
  onDeleteCustom,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "shipping">("details");
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const getShareUrl = () => {
    return `${window.location.href.split("?")[0]}?product=${product.id}`;
  };

  const getShareText = () => {
    return `Highly recommending the ${product.name} from VAND-FANSHIONS Atelier collection! It looks exceptional. Check it out here:`;
  };

  const handleCopyLink = () => {
    const link = getShareUrl();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy link:", err);
    });
  };
  
  // Slide through thumbnails
  const allImages = [product.image, ...(product.images || [])];
  const [mainImageUrl, setMainImageUrl] = useState<string>(product.image);

  // Set the main image when product changes
  React.useEffect(() => {
    setMainImageUrl(product.image);
    setSelectedSize("");
    setQuantity(1);
    setSizeError(false);
  }, [product]);

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setAddedAnimation(true);
    onAddToCart(product, selectedSize, quantity);
    
    setTimeout(() => {
      setAddedAnimation(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-md flex justify-center items-center p-4 md:p-6 animate-fade-in">
      <div className="bg-[#faf9f6] w-full max-w-6xl shadow-2xl relative border border-stone-200 rounded-xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button absolute inside */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-[#faf9f6]/90 border border-stone-200/80 rounded-full hover:bg-stone-900 hover:text-white transition-all shadow-md focus:outline-none"
          title="Return to Collection"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT COLUMN: Gallery */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between border-r border-[#ecebe4] overflow-y-auto max-h-[45vh] md:max-h-[92vh]">
          <div className="space-y-4">
            
            {/* Main Stage Image */}
            <div className="aspect-[4/5] overflow-hidden bg-stone-100 relative rounded-lg border border-stone-200">
              <img
                src={mainImageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Premium Floating Badge */}
              <span className="absolute top-4 left-4 text-[9px] uppercase font-mono tracking-widest bg-[#1a1a1a] text-white px-2.5 py-1 rounded">
                Atelier No. 01 / {product.style} Level
              </span>
            </div>

            {/* Thumbnail Navigation Row */}
            {allImages.length > 1 && (
              <div className="flex space-x-2.5 justify-start">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImageUrl(img)}
                    className={`h-16 w-16 overflow-hidden rounded border cursor-pointer transition ${
                      mainImageUrl === img ? "border-[#1a1a1a] ring-1 ring-stone-900" : "border-stone-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i}`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sourcing notes block at bottom of gallery */}
          <div className="hidden md:block pt-8 border-t border-stone-200/60 text-xs text-stone-400 space-y-2">
            <p className="flex items-center space-x-2">
              <Info className="h-3.5 w-3.5 text-stone-500 flex-shrink-0" />
              <span>Tailored at our local atelier by master weavers.</span>
            </p>
            <p>We source certified flax linen from France and extra-long staple organic cotton from the US for guaranteed structural memory.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Commerce Controls Card */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[47vh] md:max-h-[92vh] bg-white">
          
          <div className="space-y-6">
            
            {/* Title Block */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#1a1a1a] bg-stone-100 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="text-stone-300">|</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-light">
                  {product.style} Series
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 tracking-tight leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center space-x-3 pt-1">
                <p className="font-mono text-2xl font-semibold text-stone-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <span className="text-xs text-stone-400 line-through">
                  ₹{(product.price * 1.6).toFixed(0).toLocaleString()}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 font-mono font-medium rounded">
                  40% Off Direct Value
                </span>
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* Description */}
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              {product.description}
            </p>

            {/* SIZE SELECTOR SECTION */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-xs uppercase tracking-widest font-semibold text-stone-950 flex items-center space-x-1">
                  <span>Choose Sizing</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="text-[10px] text-stone-400 space-x-2 font-mono">
                  <span>Fits True-to-Size</span>
                  <span>•</span>
                  <span className="italic">Double-dyed Preshrunk</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`min-w-[48px] h-12 flex items-center justify-center text-xs tracking-wider uppercase font-medium border rounded transition-all cursor-pointer ${
                      selectedSize === size
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#faf9f6] scale-102 font-bold shadow-md"
                        : "border-stone-200 text-stone-800 hover:border-stone-400 hover:text-stone-950"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {sizeError && (
                <p className="text-xs text-amber-800 font-medium bg-amber-50 px-3 py-2 rounded border border-amber-200/50 flex items-center space-x-1.5 animate-pulse">
                  <Info className="h-4 w-4 text-amber-700 flex-shrink-0" />
                  <span>Please select a size to proceed with your order.</span>
                </p>
              )}
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#1a1a1a]">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-stone-200 rounded overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-stone-600 hover:bg-stone-50 transition border-r border-stone-200 cursor-pointer text-xs"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-5 py-1 text-xs font-mono font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-stone-600 hover:bg-stone-50 transition border-l border-stone-200 cursor-pointer text-xs"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Only 4 remaining in stock at this size
                </span>
              </div>
            </div>

            {/* ADD TO CART ACTION BUTTON */}
            <div className="pt-4 space-y-4">
              <button
                onClick={handleAdd}
                className={`w-full py-4 uppercase text-xs tracking-widest font-semibold transition-all duration-300 shadow cursor-pointer ${
                  addedAnimation
                    ? "bg-green-850 text-white bg-green-600"
                    : "bg-[#1a1a1a] text-white hover:bg-stone-800"
                }`}
              >
                {addedAnimation ? "✓ Added To Cart!" : `Add To Bag (₹${(product.price * quantity).toLocaleString("en-IN")})`}
              </button>

              <button
                onClick={onClose}
                className="w-full py-3.5 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-colors uppercase text-[10px] tracking-wider"
              >
                Close & Keep Browsing
              </button>

              {onDeleteCustom && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to discard this custom design draft? This will remove the custom product from your active browser session.")) {
                      onDeleteCustom(product.id);
                    }
                  }}
                  className="w-full py-3 border border-red-200 text-red-650 hover:bg-red-50 hover:border-red-400 transition-all uppercase text-[10px] cursor-pointer tracking-widest font-semibold flex items-center justify-center space-x-1.5 rounded-lg"
                  id="btn-discard-custom-draft"
                >
                  <Trash2 className="h-3.5 w-3.5 transition-transform" />
                  <span>Discard Custom Draft</span>
                </button>
              )}
            </div>

            {/* MINI VALUE-PROPS INFOBAR */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] text-stone-400 font-mono uppercase bg-stone-50 p-3 rounded border border-stone-200/50">
              <div className="flex flex-col items-center">
                <Truck className="h-4 w-4 text-stone-600 mb-1" />
                <span>Free Shipping</span>
              </div>
              <div className="flex flex-col items-center border-x border-stone-200">
                <RefreshCw className="h-4 w-4 text-stone-600 mb-1" />
                <span>Easy Returns</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-4 w-4 text-stone-600 mb-1" />
                <span>Secure Payments</span>
              </div>
            </div>

            {/* SOCIAL RECOMMEND & SHARE COMPONENT */}
            <div className="border border-stone-200/65 rounded-xl p-4 bg-stone-50/50 space-y-3.5 mt-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-900 flex items-center space-x-1.5">
                  <Share2 className="h-3.5 w-3.5 text-stone-700" />
                  <span>Recommend Garment</span>
                </span>
                <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Atelier DeepLink</span>
              </div>

              {/* Copy Link Input Bar */}
              <div className="flex items-center bg-white border border-stone-200 rounded overflow-hidden shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-stone-500 select-all outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  type="button"
                  className="px-3 py-2 bg-stone-900 text-[#faf9f6] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider font-mono flex items-center space-x-1 transition-all duration-200 cursor-pointer border-l border-stone-200"
                  id="btn-copy-share-link"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-green-400" />
                      <span className="text-[10px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Social Channels */}
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText() + " " + getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 transition rounded flex items-center justify-center space-x-1 text-xs font-semibold uppercase tracking-wider"
                  id="link-share-whatsapp"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.022-.079-.182-.204-.424-.325l-1.06-.53c-.242-.12-.424-.12-.544 0-.12.12-.424.53-.544.647-.12.12-.242.12-.483 0-1.213-.603-2.122-1.393-2.666-2.33 0-.181.182-.303.364-.424l.364-.316c.12-.12.182-.242.06-.364l-.726-1.528c-.12-.242-.242-.242-.364-.242-.09 0-.21 0-.332.022-.12.022-.303.06-.483.242a2.316 2.316 0 0 0-.756 1.706c0 1.03.544 2.028 1.272 3.023 1.258 1.722 2.872 2.658 4.673 3.097.483.12.847.12 1.15.06a3.013 3.013 0 0 0 1.965-1.393.375.375 0 0 0 .12-.726zM12.012 2C6.48 2 2 6.48 2 12.012c0 1.748.455 3.42 1.303 4.908L2 22l5.228-1.378a9.972 9.972 0 0 0 4.784 1.22c5.532 0 10.012-4.48 10.012-10.012C22.024 6.48 17.544 2 12.012 2z"/>
                  </svg>
                  <span className="text-[9px] font-mono tracking-normal">WhatsApp</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-900 transition rounded flex items-center justify-center space-x-1 text-xs font-semibold uppercase tracking-wider"
                  id="link-share-twitter"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-[9px] font-mono tracking-normal">Twitter/X</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent("Recommended Garment - " + product.name)}&body=${encodeURIComponent(getShareText() + "\n\n" + getShareUrl())}`}
                  className="py-1.5 px-2.5 bg-[#eae2d3]/20 hover:bg-[#eae2d3]/30 border border-stone-200 text-stone-900 transition rounded flex items-center justify-center space-x-1 text-xs font-semibold uppercase tracking-wider"
                  id="link-share-email"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-[9px] font-mono tracking-normal">Email</span>
                </a>
              </div>
            </div>

          </div>

          {/* ACCORDION PANELS */}
          <div className="mt-8 border-t border-stone-150 pt-6">
            <div className="flex space-x-6 border-b border-stone-100 text-xs font-mono pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-1 uppercase tracking-wider relative cursor-pointer ${
                  activeTab === "details" ? "text-stone-950 font-bold" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                Atelier Features
                {activeTab === "details" && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-stone-900"></div>}
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`pb-1 uppercase tracking-wider relative cursor-pointer ${
                  activeTab === "care" ? "text-stone-950 font-bold" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                Fabric Care
                {activeTab === "care" && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-stone-900"></div>}
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-1 uppercase tracking-wider relative cursor-pointer ${
                  activeTab === "shipping" ? "text-stone-950 font-bold" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                Origin Spec
                {activeTab === "shipping" && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-stone-900"></div>}
              </button>
            </div>

            <div className="py-4 text-xs font-light text-stone-600 min-h-[100px]">
              {activeTab === "details" && (
                <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                  {product.details ? (
                    product.details.map((detail, idx) => <li key={idx}>{detail}</li>)
                  ) : (
                    <li>Tailored for active draping and long-term weave retention.</li>
                  )}
                </ul>
              )}

              {activeTab === "care" && (
                <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                  {product.careInfo ? (
                    product.careInfo.map((care, idx) => <li key={idx} className="text-stone-900 font-normal">{care}</li>)
                  ) : (
                    <li>Cold delicate machine wash option. Do not machine tumble dry.</li>
                  )}
                </ul>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-2 leading-relaxed text-stone-600">
                  <p>
                    <strong>Weave Origin:</strong> Wet-spun organic fibers, responsibly sourced from our vetted cooperatives.
                  </p>
                  <p>
                    <strong>Dyeing:</strong> Cruelty-free organic reactive garment-dyed cycles ensuring beautiful hues that adapt over wear without leakage or fading.
                  </p>
                  <p>
                    <strong>Eco Assurance:</strong> Zero single-use plastic wraps inside transit boxes. Standard carbon-offset dispatch across all Indian pin codes.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
