import React from "react";
import { CartItem } from "../types";
import { X, Trash2, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productID: string, size: string, quantity: number) => void;
  onRemoveItem: (productID: string, size: string) => void;
  onProceedToCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  // Compute prices in INR
  const totalAmount = cartItems.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );

  const gstAmount = totalAmount * 0.05;
  const grandTotal = totalAmount + gstAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Blurred background wrapper */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf9f6] border-l border-stone-200 flex flex-col justify-between shadow-2xl animate-slide-in h-full">
          
          {/* Header Block */}
          <div className="px-5 py-6 border-b border-[#ecebe4] flex justify-between items-center bg-[#faf9f6]">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="h-5 w-5 stroke-[1.5] text-[#1a1a1a]" />
              <h2 className="font-serif text-xl font-medium text-stone-900">
                Your Atelier Bag
              </h2>
              {cartItems.length > 0 && (
                <span className="bg-stone-900 text-[#faf9f6] text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="p-1 px-2 rounded hover:bg-stone-100 hover:text-stone-900 text-stone-500 transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* MAIN CART CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="h-16 w-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="h-8 w-8 stroke-[1]" />
                </div>
                <h3 className="font-serif text-lg text-stone-800">Your bag is current empty.</h3>
                <p className="text-stone-500 text-xs font-light max-w-xs mx-auto">
                  Browse our range of entry-level Essentials and handcrafted Premium shirts and begin building your tailored look.
                </p>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-stone-800 transition uppercase text-[10px] tracking-widest font-semibold cursor-pointer"
                  >
                    Browse Collections
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {cartItems.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${idx}`}
                    className="py-4 flex space-x-4 first:pt-0 last:pb-0 group"
                  >
                    {/* Item Image */}
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-stone-50 border border-stone-200 rounded">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta info & Quantity controls */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-medium text-stone-950 font-sans line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-xs font-bold text-stone-900 font-mono pl-2">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2 text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                          <span>Size: <strong className="text-stone-900 font-bold">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>₹{item.product.price.toLocaleString("en-IN")} ea</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Interactive Quantity control */}
                        <div className="flex items-center border border-stone-250 rounded bg-white overflow-hidden text-[10px]">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.selectedSize,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1 text-stone-500 hover:bg-stone-100 border-r border-stone-200 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2.5 font-mono text-stone-900 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 text-stone-500 hover:bg-stone-100 border-l border-stone-200 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Interactive garbage throw button */}
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          className="text-stone-400 hover:text-red-700 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CHECKOUT PRICING SUMMARY PANEL */}
          {cartItems.length > 0 && (
            <div className="px-5 py-6 bg-stone-50 border-t border-[#ecebe4] space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-400 font-mono uppercase tracking-wider">
                  <span>Standard Subtotal</span>
                  <span className="text-[#1a1a1a]">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-400 font-mono uppercase tracking-wider">
                  <span>Dispatch & Shipping</span>
                  <span className="text-green-700 font-semibold uppercase">Free Complimentary</span>
                </div>
                <div className="flex justify-between text-xs text-stone-400 font-mono uppercase tracking-wider border-b border-stone-200/50 pb-2">
                  <span>Estimated GST (5%)</span>
                  <span className="text-[#1a1a1a]">₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-serif text-lg font-medium text-stone-900">Total Bag Value</span>
                  <span className="font-mono text-xl font-bold text-stone-950">
                    ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-4 bg-[#1a1a1a] text-white hover:bg-stone-800 transition-all uppercase text-xs tracking-widest font-semibold flex items-center justify-center space-x-3 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>Proceed To Secure Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Secure Checkout label */}
              <div className="flex items-center justify-center space-x-2 text-[10px] text-stone-400 font-mono uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-stone-600 flex-shrink-0" />
                <span>Secure SSL Checkout via Razorpay & PayU</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
