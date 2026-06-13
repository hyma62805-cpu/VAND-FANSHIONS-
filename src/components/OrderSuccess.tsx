import React from "react";
import { Order } from "../types";
import { CheckCircle, Calendar, Truck, ArrowRight, ShieldCheck } from "lucide-react";

interface OrderSuccessProps {
  order: Order;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({
  order,
  onContinueShopping,
  onViewOrders,
}) => {
  // Estimated delivery range 2-4 days
  const deliveryMin = new Date();
  deliveryMin.setDate(deliveryMin.getDate() + 2);
  const deliveryMax = new Date();
  deliveryMax.setDate(deliveryMax.getDate() + 4);

  const opt = { month: "short" as const, day: "numeric" as const, weekday: "short" as const };
  const strMin = deliveryMin.toLocaleDateString("en-IN", opt);
  const strMax = deliveryMax.toLocaleDateString("en-IN", opt);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
      
      {/* Visual Ring Badge check */}
      <div className="inline-flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-full mb-6 text-green-700">
        <CheckCircle className="h-12 w-12 stroke-[1.2]" />
      </div>

      <div className="space-y-3">
        <span className="font-mono text-[10px] tracking-widest text-stone-500 uppercase">Transaction Confirmed</span>
        <h2 className="font-serif text-4xl font-light text-stone-900 tracking-tight">
          Sartorial Success
        </h2>
        <p className="text-sm text-stone-500 font-light max-w-lg mx-auto">
          Your payment was successfully authorized. We have registered your order inside our master atelier drafting books.
        </p>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 shadow-sm text-left my-10 space-y-6">
        
        {/* Row 1: Order Num & Status */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline border-b border-stone-100 pb-4 space-y-2 sm:space-y-0">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Order Reference</span>
            <p className="font-mono text-sm font-semibold text-stone-900 tracking-wider">
              {order.id}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Fulfillment Status</span>
            <p className="text-xs uppercase font-mono tracking-widest font-semibold text-[#1a1a1a] flex items-center sm:justify-end space-x-1.5 pt-0.5">
              <span className="h-2 w-2 rounded-full bg-orange-500 block"></span>
              <span>Drafting & Processing</span>
            </p>
          </div>
        </div>

        {/* Row 2: Delivery estimate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-stone-100">
          <div className="space-y-2 flex items-start space-x-3.5">
            <Truck className="h-5 w-5 text-stone-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Expected Delivery Range</span>
              <p className="text-sm font-medium text-stone-950 font-serif">
                {strMin} — {strMax}
              </p>
              <p className="text-[10px] text-stone-400 font-mono">Complimentary Express Dispatch</p>
            </div>
          </div>

          <div className="space-y-2 flex items-start space-x-3.5">
            <Calendar className="h-5 w-5 text-stone-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Purchase Date</span>
              <p className="text-sm font-medium text-stone-950 font-serif">
                {order.date}
              </p>
              <p className="text-[10px] text-stone-400 font-mono">
                {order.paymentMethod === "gpay"
                  ? "Google Pay UPI Cleared"
                  : order.paymentMethod === "phonepe"
                  ? "PhonePe Transaction Cleared"
                  : "Secure Card Vault Authorized"}
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Items and Amount Summary */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Fulfillment Items</span>
          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-stone-500 text-[10px]">[{item.quantity}x]</span>
                  <span className="font-medium text-stone-900">{item.product.name}</span>
                  <span className="text-[10px] bg-stone-140 px-1.5 py-0.2 px-2 py-0.5 text-stone-500 rounded font-mono uppercase bg-stone-100">
                    {item.selectedSize}
                  </span>
                </div>
                <span className="font-mono text-stone-900">
                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-1.5">
            <div className="flex justify-between items-baseline text-xs text-stone-500 font-mono">
              <span>Items Subtotal</span>
              <span>₹{(order.total / 1.05).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-baseline text-xs text-stone-500 font-mono">
              <span>Atelier GST (5% Added)</span>
              <span>₹{(order.total - order.total / 1.05).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-stone-200/50">
              <span className="font-serif text-base font-semibold text-stone-900">Amount Paid (GST Included)</span>
              <span className="font-mono text-xl font-bold text-stone-950">
                ₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Row 4: Shipping Destination Address */}
        <div className="bg-stone-50 p-4 rounded border border-stone-200/60 text-xs space-y-1 text-stone-800">
          <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400">Shipping Destination</span>
          <p className="font-semibold text-stone-950">{order.shipping.fullName}</p>
          <p>{order.shipping.address}, {order.shipping.city} - {order.shipping.postalCode}</p>
          <p className="text-[10px] text-stone-500 font-mono pt-1">Phone: {order.shipping.phone} | email: {order.shipping.email}</p>
        </div>

      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
        <button
          onClick={onContinueShopping}
          className="px-8 py-4 bg-[#1a1a1a] text-[#faf9f6] hover:bg-stone-800 transition uppercase text-xs tracking-widest font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-md"
        >
          <span>Continue Exploring</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          onClick={onViewOrders}
          className="px-8 py-4 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 transition uppercase text-xs tracking-widest font-medium cursor-pointer bg-white"
        >
          View Full Order History
        </button>
      </div>

    </div>
  );
};
