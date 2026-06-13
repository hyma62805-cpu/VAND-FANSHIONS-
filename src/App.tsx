import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductCard } from "./components/ProductCard";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { OrderSuccess } from "./components/OrderSuccess";
import { OrderHistory } from "./components/OrderHistory";

import { Product, CartItem, Order, ShippingDetails, PaymentDetails } from "./types";
import { PRODUCTS } from "./data/products";
import { SlidersHorizontal, Search, RotateCcw, HelpCircle, ShieldCheck, Plus, Sparkles } from "lucide-react";
import { CustomGarmentCreator } from "./components/CustomGarmentCreator";
import { AtelierCareFAQModal } from "./components/AtelierCareFAQModal";

export default function App() {
  // Page Navigation States
  const [activePage, setActivePage] = useState<"home" | "shop" | "orders" | "checkout" | "success">("home");

  // Unified Luxury Accent Theme System
  const [currentTheme, setCurrentTheme] = useState<"charcoal" | "sand" | "navy" | "forest">(() => {
    try {
      const saved = localStorage.getItem("vand_fanshions_palette");
      return (saved as any) || "charcoal";
    } catch {
      return "charcoal";
    }
  });

  // Toggle theme cyclically
  const handleToggleTheme = () => {
    setCurrentTheme((prev) => {
      let next: "charcoal" | "sand" | "navy" | "forest" = "charcoal";
      if (prev === "charcoal") next = "sand";
      else if (prev === "sand") next = "navy";
      else if (prev === "navy") next = "forest";
      else next = "charcoal";
      
      try {
        localStorage.setItem("vand_fanshions_palette", next);
      } catch {}
      return next;
    });
  };

  // Keep actual DOM body styling fully synchronized
  useEffect(() => {
    const rootBody = document.body;
    if (rootBody) {
      if (currentTheme === "sand") {
        rootBody.style.backgroundColor = "#faf8f3";
      } else if (currentTheme === "navy") {
        rootBody.style.backgroundColor = "#f4f6fa";
      } else if (currentTheme === "forest") {
        rootBody.style.backgroundColor = "#f6faf8";
      } else {
        rootBody.style.backgroundColor = "#faf9f6";
      }
    }
  }, [currentTheme]);

  // Dynamic products list incorporating custom uploaded items
  const [localProducts, setLocalProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("vand_fanshions_custom_products");
      const parsedCustom = saved ? JSON.parse(saved) : [];
      return [...PRODUCTS, ...parsedCustom];
    } catch {
      return PRODUCTS;
    }
  });

  const [creatorOpen, setCreatorOpen] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<boolean>(false);

  const handleAddCustomProduct = (newProduct: Product) => {
    setLocalProducts((prev) => {
      const savedCustom = localStorage.getItem("vand_fanshions_custom_products");
      let parsedCustom: Product[] = [];
      try {
        parsedCustom = savedCustom ? JSON.parse(savedCustom) : [];
      } catch {}
      const updatedCustom = [newProduct, ...parsedCustom];
      localStorage.setItem("vand_fanshions_custom_products", JSON.stringify(updatedCustom));
      return [newProduct, ...prev];
    });
  };

  const handleDeleteCustomProduct = (productId: string) => {
    setLocalProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      const savedCustom = localStorage.getItem("vand_fanshions_custom_products");
      let parsedCustom: Product[] = [];
      try {
        parsedCustom = savedCustom ? JSON.parse(savedCustom) : [];
      } catch {}
      const updatedCustom = parsedCustom.filter((p) => p.id !== productId);
      localStorage.setItem("vand_fanshions_custom_products", JSON.stringify(updatedCustom));
      return updated;
    });
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  // Cart & Order lists synchronization with LocalStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("vand_fanshions_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("vand_fanshions_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Flow State trackers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // SHOPPING FILTERS STATES
  const [filterCategory, setFilterCategory] = useState<"All" | "Shirts" | "T-Shirts">("All");
  const [filterStyle, setFilterStyle] = useState<"All" | "Essential" | "Atelier" | "Premium">("All");
  const [maxPrice, setMaxPrice] = useState<number>(7999);
  const [minPrice, setMinPrice] = useState<number>(499);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"Featured" | "LowToHigh" | "HighToLow">("Featured");

  // Synchronize lists with storage
  useEffect(() => {
    localStorage.setItem("vand_fanshions_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("vand_fanshions_orders", JSON.stringify(orders));
  }, [orders]);

  // Check for deep links on mount to automatically open shared garments
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");
    if (productId) {
      const matched = localProducts.find((p) => p.id === productId);
      if (matched) {
        setSelectedProduct(matched);
        setActivePage("shop");
      }
    }
  }, [localProducts]);

  // CATEGORY CTA HOME REDIRECT
  const handleBrowseCollection = (category?: "Shirts" | "T-Shirts") => {
    if (category) {
      setFilterCategory(category);
    } else {
      setFilterCategory("All");
    }
    // reset other filters to be standard
    setFilterStyle("All");
    setMaxPrice(7999);
    setMinPrice(499);
    setSearchQuery("");
    setSortBy("Featured");
    setActivePage("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CART WORKFLOW OPERATIONS
  const handleAddToCart = (product: Product, size: string, qty: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += qty;
        return copy;
      } else {
        return [...prev, { product, selectedSize: size, quantity: qty }];
      }
    });
  };

  const handleUpdateQuantity = (productID: string, size: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productID && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productID: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productID && item.selectedSize === size))
    );
  };

  // COMPLETE ORDER SUBMISSION
  const handlePlaceOrder = (shipping: ShippingDetails, payment: PaymentDetails) => {
    const itemsValue = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    const orderID = `VAND-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const newOrder: Order = {
      id: orderID,
      date: formattedDate,
      items: cartItems,
      shipping,
      paymentMethod: payment.method,
      paymentDetails: {
        upiId: payment.upiId,
        phoneNumber: payment.phoneNumber,
        cardNumberMasked: payment.cardNumber ? `•••• •••• •••• ${payment.cardNumber.trim().slice(-4)}` : undefined,
      },
      total: itemsValue * 1.05,
      status: "Processing",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setCartItems([]); // Clear cart
    setActivePage("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // INTERACTIVE ORDER TRACKING SIMULATOR
  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // FILTERED PRODUCT RETRIEVAL
  const filteredProducts = localProducts.filter((product) => {
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    const matchesStyle = filterStyle === "All" || product.style === filterStyle;
    const matchesMinPrice = product.price >= minPrice;
    const matchesMaxPrice = product.price <= maxPrice;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStyle && matchesMinPrice && matchesMaxPrice && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "LowToHigh") return a.price - b.price;
    if (sortBy === "HighToLow") return b.price - a.price;
    return 0; // "Featured" static order
  });

  const cartTotalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const getPageBgClass = () => {
    switch (currentTheme) {
      case "sand": return "bg-[#faf8f3] text-[#2c241e]";
      case "navy": return "bg-[#f4f6fa] text-[#0e1726]";
      case "forest": return "bg-[#f6faf8] text-[#112419]";
      default: return "bg-[#faf9f6] text-stone-900";
    }
  };

  return (
    <div className={`min-h-screen ${getPageBgClass()} flex flex-col justify-between selection:bg-stone-250 selection:text-underline font-sans antialiased transition-all duration-500`}>
      
      {/* Dynamic Header navbar */}
      <Navbar
        activePage={activePage === "checkout" || activePage === "success" ? "shop" : activePage}
        setActivePage={(page) => {
          setActivePage(page);
          // Auto close detail/cart
          setSelectedProduct(null);
          setCartOpen(false);
        }}
        cartCount={cartTotalCount}
        onOpenCart={() => setCartOpen(true)}
        ordersCount={orders.length}
      />

      {/* PRIMARY CONTROLLER CONTENT SCREEN */}
      <main className="flex-1">
        {activePage === "home" && (
          <Hero
            onBrowseCollection={handleBrowseCollection}
            onSelectProduct={(product) => setSelectedProduct(product)}
            currentTheme={currentTheme}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {/* PRODUCT LISTINGS AND FILTER COOP */}
        {activePage === "shop" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Header intro */}
            <div className="border-b border-stone-200 pb-6 mb-8 text-center sm:text-left">
              <span className="font-mono text-[10px] tracking-widest text-stone-500 uppercase">Season 01 / Essentials</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 tracking-tight">
                Explore Core Collections
              </h1>
              <p className="text-stone-500 font-light text-xs mt-1 max-w-xl">
                Drape in certified materials designed to retain shape memory cycle after cycle. Ranging from ₹499 casuals to ₹7,999 mulberry silken couture.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* SIDEBAR: FILTER SHELF CONTROLS */}
              <div className="lg:col-span-1 space-y-6 bg-white p-5 rounded-xl border border-[#ecebe4] h-fit">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2 font-serif text-base font-semibold text-stone-900">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter & Arrange</span>
                  </div>
                  
                  {/* Reset Filters */}
                  <button
                    onClick={() => {
                      setFilterCategory("All");
                      setFilterStyle("All");
                      setMaxPrice(7999);
                      setMinPrice(499);
                      setSearchQuery("");
                      setSortBy("Featured");
                    }}
                    className="text-[10px] uppercase font-mono tracking-wider text-stone-400 hover:text-stone-950 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Filter : Name search */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                    Product Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Linen, Silk, Supima..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 pl-9 pr-3 py-2 text-xs focus:outline-none transition rounded text-stone-800 font-medium"
                    />
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                  </div>
                </div>

                <hr className="border-stone-100" />

                {/* Filter : Category selector */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                    Garment Categories
                  </span>
                  <div className="flex flex-col space-y-1 text-xs">
                    {(["All", "Shirts", "T-Shirts"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`text-left px-3 py-2 rounded transition cursor-pointer flex justify-between items-center ${
                          filterCategory === cat
                            ? "bg-stone-900 text-white font-bold"
                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                        }`}
                      >
                        <span>{cat === "All" ? "All Apparel" : cat}</span>
                        <span className="text-[10px] font-mono opacity-50 font-light">
                          ({localProducts.filter((p) => cat === "All" || p.category === cat).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-stone-100" />

                {/* Filter : Style selector */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                    Atelier Grading style
                  </span>
                  <div className="flex flex-col space-y-1 text-xs">
                    {(["All", "Essential", "Atelier", "Premium"] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setFilterStyle(style)}
                        className={`text-left px-3 py-2 rounded transition cursor-pointer flex justify-between items-center ${
                          filterStyle === style
                            ? "bg-stone-900 text-white font-bold"
                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                        }`}
                      >
                        <span>{style === "All" ? "All Series" : `${style} Series`}</span>
                        <span className="text-[10px] font-mono opacity-50 font-light">
                          ({localProducts.filter((p) => style === "All" || p.style === style).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-stone-100" />

                {/* Filter: Pricings */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium">
                      Maximum Price Limit
                    </span>
                    <span className="font-mono text-xs font-bold text-stone-900">
                      ₹{maxPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min={499}
                    max={7999}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900"
                  />
                  
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>Min: ₹499</span>
                    <span>Max: ₹7,999</span>
                  </div>
                </div>

                <hr className="border-stone-100" />

                {/* Sort Order dropdown */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                    Arrange Collections
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-[#faf9f6] border border-stone-200 focus:border-stone-950 text-xs px-2.5 py-2 focus:outline-none rounded text-stone-700"
                  >
                    <option value="Featured">Signature Spotlights</option>
                    <option value="LowToHigh">Price: Low to High (Entry-level)</option>
                    <option value="HighToLow">Price: High to Low (Premium)</option>
                  </select>
                </div>

              </div>

              {/* GRID COLUMN: PRODUCT DISPLAY CARDS (Col Span 3) */}
              <div className="lg:col-span-3 space-y-6">
                
                {filteredProducts.length === 0 ? (
                  <div className="bg-white border border-[#ecebe4] rounded-xl py-20 text-center max-w-xl mx-auto px-4">
                    <div className="h-14 w-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-4">
                      <HelpCircle className="h-6 w-6 stroke-[1.2]" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-stone-900">
                      No matching models found
                    </h3>
                    <p className="text-stone-500 font-light text-xs mt-1.5 leading-relaxed">
                      Your current selectors didn't match any of our Atelier garments. Try checking your parameters or hitting the Reset button.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setFilterCategory("All");
                          setFilterStyle("All");
                          setMaxPrice(7999);
                          setMinPrice(499);
                          setSearchQuery("");
                          setSortBy("Featured");
                        }}
                        className="px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-stone-800 transition uppercase text-[10px] tracking-widest font-semibold cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-baseline mb-4 text-xs font-mono text-stone-400">
                      <span>Representing {filteredProducts.length} high-quality garments</span>
                      {maxPrice < 7999 && <span>Filtered below ₹{maxPrice.toLocaleString()}</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* DRAFT BESPOKE PIECE STARTER CARD */}
                      <div 
                        onClick={() => setCreatorOpen(true)}
                        className="border-2 border-dashed border-stone-200 hover:border-stone-400 bg-white hover:bg-stone-50/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center text-center h-[380px] sm:h-full min-h-[360px] shadow-sm relative overflow-hidden group select-none"
                        title="Bespoke drafting studio"
                        id="btn-open-creator-from-grid"
                      >
                        {/* Decorative background grid threads */}
                        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        
                        <div className="relative space-y-4 flex flex-col items-center">
                          <div className="h-14 w-14 rounded-full border border-stone-200 bg-[#faf9f6]/90 flex items-center justify-center text-stone-600 shadow-sm group-hover:scale-110 group-hover:border-stone-400 transition-all duration-300">
                            <Plus className="h-5 w-5" />
                          </div>
                          
                          <div className="space-y-1.5 p-1">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block">
                              Atelier Crafting
                            </span>
                            <h4 className="font-serif text-lg font-light text-stone-900 group-hover:text-amber-800 transition-colors">
                              Draft Custom Piece
                            </h4>
                            <p className="text-[11px] text-stone-500 font-light max-w-[190px] leading-relaxed mx-auto">
                              Upload any apparel photo & configure your personal template with custom sizing.
                            </p>
                          </div>

                          <div className="pt-2">
                            <span className="px-3.5 py-1.5 bg-[#1a1a1a] text-[#faf9f6] text-[10px] font-mono tracking-wider uppercase font-semibold rounded shadow-sm group-hover:bg-stone-800 transition-all duration-200">
                              Open Studio
                            </span>
                          </div>
                        </div>
                      </div>

                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => setSelectedProduct(product)}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* SECURE PAYMENT WRAPPER */}
        {activePage === "checkout" && (
          <Checkout
            cartItems={cartItems}
            onBackToCart={() => {
              setActivePage("shop");
            }}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {/* ORDER SUCCESS SCREEN WRAPPER */}
        {activePage === "success" && lastPlacedOrder && (
          <OrderSuccess
            order={lastPlacedOrder}
            onContinueShopping={() => {
              setActivePage("shop");
              setLastPlacedOrder(null);
            }}
            onViewOrders={() => {
              setActivePage("orders");
              setLastPlacedOrder(null);
            }}
          />
        )}

        {/* ORDER ARCHIVE SYSTEM LOGS */}
        {activePage === "orders" && (
          <OrderHistory
            orders={orders}
            onBrowseCollection={() => {
              setActivePage("shop");
            }}
            onViewOrderReceipt={(order) => {
              setLastPlacedOrder(order);
              setActivePage("success");
            }}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* FOOTER BLOCK */}
      <footer className="bg-[#1f1e1c] text-[#faf9f6] border-t border-[#ecebe4] pt-12 pb-8 tracking-wider mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLulACoBSZXiSropIXsW3n_M-enzgERNIdYeD3gBPtrf3nEIKQGfbtEKgn5Aq03iyaEb2mPglBIGOVLCe9lkttCpo7_17J4TCVi9kuVInJaLEuyGSW84C7_-H65BAEwh1BOTQjm2NLI4TIbyHBt6vdfegMyXOl6UmXhqeDMmU6RrNK60x7hkzS-WtJ2iDggtiBJQtzr0J6nixXrnq8YFGJ1ROcAZvi6R6681N-KipJoYi0k5Egt0uC3ZQYU"
                alt="VAND FANSHIONS"
                className="h-8 w-auto object-contain brightness-100"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif text-lg font-bold tracking-widest text-white">VAND FANSHIONS</span>
            </div>
            
            <p className="text-[11px] text-stone-400 font-light leading-relaxed">
              We operate a single, focused, direct-to-customer atelier. Our core devotion starts and concludes with superior T-Shirts and Shirts only. Accessible luxury, honestly priced.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-4 uppercase">Apparel Core</h4>
            <ul className="space-y-2 text-[11px] text-stone-400 font-mono uppercase">
              <li>
                <button onClick={() => handleBrowseCollection("T-Shirts")} className="hover:text-white cursor-pointer transition">
                  Supima Essentials
                </button>
              </li>
              <li>
                <button onClick={() => handleBrowseCollection("T-Shirts")} className="hover:text-white cursor-pointer transition">
                  Heavyweight Sculpted
                </button>
              </li>
              <li>
                <button onClick={() => handleBrowseCollection("Shirts")} className="hover:text-white cursor-pointer transition">
                  French Riviera Linen
                </button>
              </li>
              <li>
                <button onClick={() => handleBrowseCollection("Shirts")} className="hover:text-white cursor-pointer transition">
                  Mulberry Luxury Silk
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-4 uppercase">Atelier Sourcing</h4>
            <div className="space-y-2 text-[11px] text-stone-400 font-light leading-relaxed">
              <p>Certified Organic French Flax, sustainably wet-spun.</p>
              <p>US Extra-Long Staple certified organic cotton fields.</p>
              <p>Garment-dyed colors using zero hazardous chemicals.</p>
            </div>
            <div className="pt-3.5">
              <button
                onClick={() => setFaqOpen(true)}
                className="text-[11px] text-amber-300 hover:text-amber-200 uppercase tracking-widest font-mono font-bold flex items-center space-x-1 cursor-pointer bg-transparent border-0 p-0 text-left"
                id="btn-footer-faq-trigger"
              >
                <span>Atelier Care & FAQ →</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-4 uppercase">Authorized Trust</h4>
            <div className="space-y-3.5 text-stone-400">
              <div className="flex items-center space-x-2 text-[10px] font-mono uppercase">
                <ShieldCheck className="h-4 w-4 text-stone-300 flex-shrink-0" />
                <span>Secured SSL Encryption</span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono leading-relaxed uppercase">
                VAND FANSHIONS, Atelier sector 4B, MG Road, New Delhi, India. support@vandfanshions.com
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 font-mono">
          <p>© 2026 VAND FANSHIONS Atelier Corporation. Sourced Ethically. All Rights Reserved.</p>
          <div className="flex space-x-4 items-center">
            <span className="hover:text-stone-300 cursor-pointer">Terms & Retraction</span>
            <span className="hover:text-stone-300 cursor-pointer">Refund Policies</span>
            <span className="hover:text-stone-300 cursor-pointer">Pincode Availability</span>
            <span className="text-stone-700">|</span>
            <button 
              onClick={() => setFaqOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-mono tracking-tight bg-transparent border-0 p-0 text-left text-[10px] cursor-pointer"
              id="btn-bottom-faq-trigger"
            >
              Atelier Care & FAQ
            </button>
          </div>
        </div>
      </footer>

      {/* OVERLAID PRODUCT DETAIL VIEW CARD */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(prod, size, q) => {
            handleAddToCart(prod, size, q);
            // Open the cart automatically so the user enjoys immediate sensory confirmation!
            setCartOpen(true);
          }}
          onDeleteCustom={selectedProduct.id.startsWith("custom-") ? handleDeleteCustomProduct : undefined}
        />
      )}

      {/* OVERLAID DRAFT CREATOR SYSTEM */}
      <CustomGarmentCreator
        isOpen={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        onProductCreated={handleAddCustomProduct}
      />

      {/* OVERLAID ATELIER CARE & FAQ MODAL */}
      <AtelierCareFAQModal
        isOpen={faqOpen}
        onClose={() => setFaqOpen(false)}
      />

      {/* OVERLAID SLIDEOUT SHOPPING CART DRAWER */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setActivePage("checkout");
        }}
      />

    </div>
  );
}
