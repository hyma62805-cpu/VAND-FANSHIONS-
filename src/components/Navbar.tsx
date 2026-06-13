import React from "react";
import { ShoppingBag, History, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  activePage: "home" | "shop" | "orders";
  setActivePage: (page: "home" | "shop" | "orders") => void;
  cartCount: number;
  onOpenCart: () => void;
  ordersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  cartCount,
  onOpenCart,
  ordersCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#ecebe4] tracking-wide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo element on Left */}
          <div className="flex items-center space-x-12">
            <button
              onClick={() => {
                setActivePage("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center space-x-3 cursor-pointer group text-left"
            >
              <img
                src="https://lh3.googleusercontent.com/aida/AP1WRLulACoBSZXiSropIXsW3n_M-enzgERNIdYeD3gBPtrf3nEIKQGfbtEKgn5Aq03iyaEb2mPglBIGOVLCe9lkttCpo7_17J4TCVi9kuVInJaLEuyGSW84C7_-H65BAEwh1BOTQjm2NLI4TIbyHBt6vdfegMyXOl6UmXhqeDMmU6RrNK60x7hkzS-WtJ2iDggtiBJQtzr0J6nixXrnq8YFGJ1ROcAZvi6R6681N-KipJoYi0k5Egt0uC3ZQYU"
                alt="VAND FANSHIONS"
                className="h-10 w-auto object-contain brightness-95 group-hover:opacity-80 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif text-xl font-bold tracking-widest text-[#1a1a1a] block sm:inline-block">
                VAND FANSHIONS
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <button
                onClick={() => setActivePage("home")}
                className={`py-2 border-b transition-all duration-300 text-xs uppercase tracking-widest ${
                  activePage === "home"
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300"
                }`}
              >
                Atelier
              </button>
              <button
                onClick={() => setActivePage("shop")}
                className={`py-2 border-b transition-all duration-300 text-xs uppercase tracking-widest ${
                  activePage === "shop"
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300"
                }`}
              >
                Collection
              </button>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setActivePage("orders")}
              className={`flex items-center space-x-2 text-xs uppercase tracking-widest transition duration-300 ${
                activePage === "orders" ? "text-[#1a1a1a] font-semibold" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <History className="h-[18px] w-[18px] stroke-[1.5]" />
              <span>Orders</span>
              {ordersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a] text-[10px] text-[#faf9f6] font-medium font-sans">
                  {ordersCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors relative cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5 stroke-[1.5] text-[#1a1a1a]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a] text-[8px] font-sans font-bold text-white uppercase animate-fade-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-stone-800">Cart</span>
            </button>

            <span className="text-stone-300">|</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 bg-stone-100 hover:bg-stone-200 transition duration-300 px-2.5 py-1 rounded">
              INR (₹) EST.
            </span>
          </div>

          {/* Mobile Menu & Cart Icon */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={onOpenCart}
              className="p-2 relative text-[#1a1a1a]"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a] text-[8px] font-sans font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1a1a1a]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 stroke-[1.5]" />
              ) : (
                <Menu className="h-5 w-5 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf9f6] border-t border-[#ecebe4] px-4 py-6 space-y-4 animate-fade-in">
          <button
            onClick={() => {
              setActivePage("home");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-serif text-xl font-medium text-stone-800 flex justify-between items-center"
          >
            <span>The Atelier Home</span>
            <ArrowUpRight className="h-4 w-4 text-stone-400" />
          </button>
          <button
            onClick={() => {
              setActivePage("shop");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-serif text-xl font-medium text-stone-800 flex justify-between items-center"
          >
            <span>The Collection Store</span>
            <ArrowUpRight className="h-4 w-4 text-stone-400" />
          </button>
          <button
            onClick={() => {
              setActivePage("orders");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-serif text-xl font-medium text-stone-800 flex justify-between items-center"
          >
            <span className="flex items-center space-x-2">
              <span>Your Orders History</span>
              {ordersCount > 0 && (
                <span className="rounded-full bg-stone-900 px-2 py-0.5 text-xs text-stone-100 font-sans">
                  {ordersCount}
                </span>
              )}
            </span>
            <ArrowUpRight className="h-4 w-4 text-stone-400" />
          </button>
          <div className="pt-4 border-t border-stone-200">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
              Valued in Indian Rupee (INR ₹)
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};
