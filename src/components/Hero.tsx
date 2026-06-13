import React from "react";
import { ArrowRight, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";

interface HeroProps {
  onBrowseCollection: (category?: "Shirts" | "T-Shirts") => void;
  onSelectProduct: (product: Product) => void;
  currentTheme: "charcoal" | "sand" | "navy" | "forest";
  onToggleTheme: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBrowseCollection,
  onSelectProduct,
  currentTheme,
  onToggleTheme,
}) => {
  // Grab a few highlight products: e.g., Riviera Linen Shirt and Supima Cotton Tee
  const featuredProducts = PRODUCTS.filter(
    (p) => ["riviera-linen-shirt", "supima-cotton-tee"].includes(p.id)
  );

  const getHeroBg = () => {
    switch (currentTheme) {
      case "sand": return "bg-[#3e342a] text-[#faf8f5]";
      case "navy": return "bg-[#0c1421] text-[#faf9f6]";
      case "forest": return "bg-[#091b11] text-[#faf9f6]";
      default: return "bg-[#1f1e1c] text-[#faf9f6]";
    }
  };

  const getThemeDisplayName = () => {
    switch (currentTheme) {
      case "sand": return "sand & linen";
      case "navy": return "royal blue";
      case "forest": return "premium sage";
      default: return "classic slate";
    }
  };

  const getPillColor = () => {
    switch (currentTheme) {
      case "sand": return "bg-[#514336] hover:bg-[#604f3f] border-[#655343] text-stone-200";
      case "navy": return "bg-[#142033] hover:bg-[#1a2b45] border-[#223654] text-stone-200";
      case "forest": return "bg-[#112d1c] hover:bg-[#173e27] border-[#1d4c31] text-stone-200";
      default: return "bg-[#292826] hover:bg-[#33312e] border-[#3a3936] text-stone-200";
    }
  };

  return (
    <div className="transition-all duration-500">
      {/* 1. HERO SECTION */}
      <section className={`relative overflow-hidden ${getHeroBg()} py-24 lg:py-32 transition-colors duration-550`}>
        {/* Abstract design elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-stone-300/30 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] rounded-full bg-stone-500/20 blur-3xl"></div>
        </div>
 
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <button
              onClick={onToggleTheme}
              className={`inline-flex items-center space-x-2 border px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest cursor-pointer transition-all duration-300 transform active:scale-95 shadow-sm group select-none ${getPillColor()}`}
              title="Click to change color accent theme"
              id="btn-sartorial-theme-toggle"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
              <span className="font-semibold text-[11px] sm:text-xs">Sartorial Excellence • Honest Pricing</span>
              <span className="ml-1.5 px-2 py-0.5 bg-stone-900/40 text-[9px] lowercase font-light rounded text-stone-200 border border-stone-100/10 transition-colors uppercase font-bold tracking-wider">
                {getThemeDisplayName()}
              </span>
            </button>
            
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] text-[#faf9f6]">
              Elevated Essentials, <br />
              <span className="font-serif italic font-normal text-stone-300">Honestly Crafted.</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              VAND FANSHIONS balances the exquisite craftsmanship of a modern atelier 
              with approachable value. Explore premium shirts up to <span className="font-semibold text-stone-100">₹7,999</span> and daily essentials starting at <span className="font-semibold text-stone-100">₹499</span>.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onBrowseCollection()}
                className="group px-8 py-4 bg-[#faf9f6] text-[#1a1a1a] hover:bg-stone-200 uppercase text-xs tracking-widest font-semibold transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onBrowseCollection("Shirts")}
                className="px-8 py-4 border border-stone-500 text-stone-200 hover:text-white hover:border-white uppercase text-xs tracking-widest font-medium transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                Atelier Shirts Only
              </button>
            </div>
          </div>

          {/* Luxury Lifestyle Image Block */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] overflow-hidden bg-stone-800 shadow-2xl relative border border-stone-800 rounded-lg group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjByBejMDl5n_o1A9hjDZJIzQgkRFKGi3xwHy6ur_ynQEB-fLU0niz6RuD9hTXsxngFzAnTAQXtOHVSz12sufpNaYKhrP11cftsX-whh6qRV_YZIjkrChAnnCcqy9JkJhxQS3OTlxbmc0BUG563jm0c58nOm4BuxcC_X4mwF24GYdX5GpGYSc6vllNi6T_8rSg2Qiz5anw2NnrgQNvn0aj1uM9H8uMyBsmREkTeVDVa4sGYY-YqnwPH9p32ym9t692D2GysC7Nrk8"
                alt="Riviera Linen Shirt"
                className="w-full h-full object-cover grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 transform hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 space-y-2">
                <span className="font-mono text-[9px] tracking-widest text-[#ecebe4] bg-stone-805/50 border border-stone-800 px-2 py-0.5 uppercase">Featured Piece</span>
                <h3 className="font-serif text-2xl text-stone-200 font-light">Riviera Linen Shirt</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-stone-300 font-medium">100% French Flax • ₹1,999</p>
                  <button
                    onClick={() => {
                      const riv = PRODUCTS.find((p) => p.id === "riviera-linen-shirt");
                      if (riv) onSelectProduct(riv);
                    }}
                    className="text-xs uppercase tracking-wider text-white border-b border-white pb-0.5 hover:text-stone-300 hover:border-stone-300 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            {/* Soft decorative offset frame */}
            <div className="absolute -inset-2 border border-stone-700/60 pointer-events-none rounded-lg transform translate-x-4 translate-y-4 -z-10"></div>
          </div>
        </div>
      </section>

      {/* 2. DUAL-CATEGORY DIRECTORIES SECTION */}
      <section className="bg-stone-50 py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1a1a1a]">
              The Atelier Catalog
            </h2>
            <div className="h-0.5 w-16 bg-[#1a1a1a] mx-auto"></div>
            <p className="text-stone-500 font-light text-sm tracking-wide">
              We focus tightly on what we live and breathe: T-shirts and Shirts only. Zero clutter, perfect fabrication, and bespoke grading for every body type.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Category: T-SHTS */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden group shadow-md border border-stone-200 bg-white rounded-lg">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7RghUo64cO7ZPGHdzSwgZ2scSOEe_uh8kInbIAk-omYMPveUymyw8geHujmD6WlhTSPEiu5gBsWp8V09QkkH1Bl6EYCF5WAsRxJ7fdRsRGICG_mRYa5NjwUePO5KUWaj7NaXrLUjdz08cqXpZbsIU3ET4Ey03fS3umDr5FLTL3IMrHSZQ7Ip1vhC6NWuvC2NL7MTmdOaH2jFm13Lm0DQx5iGkh2Jbv8a171m3YzZLGAquLdC4UqKVpIm1xdS8nu27lKUF9K9eYdg"
                alt="Essential T-Shirts Category"
                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ecebe4] bg-[#1a1a1a]/40 self-start px-2.5 py-1">Beginning at ₹499</span>
                <h3 className="font-serif text-3xl font-light text-[#faf9f6]">Elevated Essentials</h3>
                <p className="text-xs text-stone-200 font-light max-w-sm">
                  Super-fine Supima yarn, heavy compact knit drapes, and textured waffle blends built for absolute comfort.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onBrowseCollection("T-Shirts")}
                    className="px-6 py-3 bg-white text-stone-950 hover:bg-[#1a1a1a] hover:text-white uppercase text-[10px] sm:text-xs tracking-widest font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Browse T-Shirts</span>
                    <ArrowRight className="h-3 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category: SHIRTS */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden group shadow-md border border-stone-200 bg-white rounded-lg">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1dYHVrwIWhXJAErEnzJn3OxbkrZdy3_vhEukqJqhvBwhBUH7kOw73ELPIaQqRbW4u2jL04VF2q9Lztt4hAoBZK631atISJgnxX7XaJl-t2qWV-tZOVU23oNs70a6CGOpNaNrklFqYInWPuLwLGRVxfcjUSzWUYZr4lAne4VMVZ08hs1adfcgAVKuBEFgnlj1Tf4ZTIeoiswSQVvLtRuYsVxc8NQGgWP7uVKpjXKEJptPQ7YbmjWGU30_haMoJ1TR84aAaTE3rNNg"
                alt="Premium Shirts Category"
                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ecebe4] bg-[#1a1a1a]/40 self-start px-2.5 py-1">Up to ₹7,999</span>
                <h3 className="font-serif text-3xl font-light text-[#faf9f6]">Atelier Drape shirts</h3>
                <p className="text-xs text-stone-200 font-light max-w-sm">
                  Wet-spun organic linen shirts, heavy task-wear overshirts, and premium 22-Momme heavy Mulberry silk.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onBrowseCollection("Shirts")}
                    className="px-6 py-3 bg-white text-stone-950 hover:bg-[#1a1a1a] hover:text-white uppercase text-[10px] sm:text-xs tracking-widest font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Browse Shirts</span>
                    <ArrowRight className="h-3 w-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VALUE GRAPHIC SPOTLIGHT (ATELIER BRAND VALUES) */}
      <section className="bg-white py-16 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="p-3.5 bg-stone-100 rounded-full text-stone-800">
                <ShieldCheck className="h-6 w-6 stroke-[1.2]" />
              </div>
              <h4 className="font-serif text-lg font-medium text-stone-900">Direct-to-Customer Value</h4>
              <p className="text-stone-500 font-light text-xs leading-relaxed max-w-xs">
                By removing middle-tier retailers and boutique markups, we pack genuine luxury-level stitching and organic fibers into approachable pricing.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 space-y-4 border-y md:border-y-0 md:border-x border-stone-100">
              <div className="p-3.5 bg-stone-100 rounded-full text-stone-800">
                <Sprout className="h-6 w-6 stroke-[1.2]" />
              </div>
              <h4 className="font-serif text-lg font-medium text-stone-900">Ethical Sourcing First</h4>
              <p className="text-stone-500 font-light text-xs leading-relaxed max-w-xs">
                From organic US-grown Supima cotton to certified French flax and cruelty-free Mulberry silk, we take care of our farmers and the earth.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="p-3.5 bg-stone-100 rounded-full text-stone-800">
                <Sparkles className="h-6 w-6 stroke-[1.2]" />
              </div>
              <h4 className="font-serif text-lg font-medium text-stone-900">The 100-Wear Guarantee</h4>
              <p className="text-stone-500 font-light text-xs leading-relaxed max-w-xs">
                Every collar collar-roll, twin-needle seam, and reactive dye is stress-tested to survive over 100 gentle home laundry cycles without losing shape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHRYSTAL PORTRAIT SPOTLIGHT (ELEVATED ESSENTIAL SPOTLIGHT) */}
      <section className="bg-[#faf9f6] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <div className="space-y-1">
              <span className="font-mono text-[10px] tracking-widest text-stone-500 uppercase">Season 01 Spotlight</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900">The Elevated Highlights</h2>
            </div>
            <button
              onClick={() => onBrowseCollection()}
              className="mt-4 md:mt-0 group flex items-center space-x-2 text-xs uppercase tracking-widest text-[#1a1a1a] hover:text-stone-600 font-medium transition-colors"
            >
              <span>View All 10 Pieces</span>
              <ArrowRight className="h-3 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 justify-center">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer bg-white border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 rounded-lg"
                onClick={() => onSelectProduct(product)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Pricing indicator tag */}
                  <span className="absolute top-4 right-4 bg-[#1a1a1a] text-white font-mono text-[11px] font-semibold tracking-wider px-3 py-1 rounded">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  {product.style === "Atelier" && (
                    <span className="absolute bottom-4 left-4 bg-orange-50/90 text-amber-900 border border-amber-200/50 font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 backdrop-blur-sm rounded">
                      Atelier Pure
                    </span>
                  )}
                </div>
                
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                      {product.category} • {product.style} Style
                    </p>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-stone-500 font-light text-xs line-clamp-2">
                    {product.description}
                  </p>
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-stone-400 font-mono font-light text-[10px]">
                      Sizing: {product.sizes.join(", ")}
                    </span>
                    <span className="text-[#1a1a1a] font-semibold border-b border-[#1a1a1a] pb-0.5 group-hover:text-stone-500 group-hover:border-stone-400 transition-colors">
                      Configure & Add
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
