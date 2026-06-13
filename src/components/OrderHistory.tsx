import React from "react";
import { Order } from "../types";
import { History, ArrowRight, ShieldCheck, ShoppingBag, Eye, Clock, Package, Truck, Check, RefreshCw } from "lucide-react";

interface OrderHistoryProps {
  orders: Order[];
  onBrowseCollection: () => void;
  onViewOrderReceipt: (order: Order) => void;
  onUpdateOrderStatus?: (orderId: string, status: Order["status"]) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  onBrowseCollection,
  onViewOrderReceipt,
  onUpdateOrderStatus,
}) => {
  const getStatusBadgeStyle = (status: Order["status"]) => {
    switch (status) {
      case "Shipped":
        return "bg-amber-50 text-amber-850 border-amber-200/50";
      case "Delivered":
        return "bg-green-50 text-green-800 border-green-200/50";
      case "Pending":
        return "bg-[#faf9f6] text-stone-550 border-stone-200/50";
      default: // "Processing"
        return "bg-orange-50 text-orange-800 border-orange-200/50";
    }
  };

  const getStatusDotStyle = (status: Order["status"]) => {
    switch (status) {
      case "Shipped":
        return "bg-amber-500";
      case "Delivered":
        return "bg-green-500";
      case "Pending":
        return "bg-stone-400";
      default: // "Processing"
        return "bg-orange-500 animate-pulse";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-baseline space-y-2 md:space-y-0">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">Your Boutique Account</span>
          <h2 className="font-serif text-3xl font-light text-stone-900 tracking-tight">
            Personal Order Archives
          </h2>
        </div>
        <span className="text-stone-400 text-xs font-mono font-light uppercase tracking-wide">
          {orders.length} order{orders.length !== 1 ? "s" : ""} registered in this browser cache
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="h-20 w-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-500">
            <History className="h-10 w-10 stroke-[1.2]" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-medium text-stone-900">No Orders Dispatched Yet</h3>
            <p className="text-xs text-stone-500 font-light max-w-md mx-auto leading-relaxed">
              When you complete checkout inside VAND FANSHIONS, your transaction receipt and tracking statuses will pop up right here automatically!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onBrowseCollection}
              className="px-8 py-3.5 bg-[#1a1a1a] text-[#faf9f6] hover:bg-stone-800 transition uppercase text-xs tracking-widest font-semibold flex items-center justify-center space-x-2.5 mx-auto cursor-pointer"
            >
              <span>Explore The Atelier Shop</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const itemCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-white border border-[#ecebe4] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                
                {/* Header info */}
                <div className="bg-stone-50/80 border-b border-[#ecebe4] px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="grid grid-cols-2 sm:flex sm:space-x-8 gap-2.5">
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400 block">Reference ID</span>
                      <span className="font-mono text-xs font-semibold text-stone-900 tracking-wider">
                        {order.id}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400 block">Date Purchased</span>
                      <span className="text-xs font-medium text-stone-800 font-serif">
                        {order.date}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-stone-400 block">Total Amount</span>
                      <span className="font-mono text-xs font-bold text-stone-950">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-stone-300 sm:block sm:text-right hidden">Fulfillment</span>
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 ${getStatusBadgeStyle(order.status)} rounded font-mono text-[9px] font-semibold uppercase tracking-wider border`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotStyle(order.status)}`}></span>
                      <span>{order.status || "Processing"}</span>
                    </span>
                  </div>
                </div>

                {/* Visual Order Status Tracking Section */}
                <div className="bg-stone-50/20 border-b border-[#ecebe4] px-6 py-8" id={`order-tracking-section-${order.id}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-sm font-semibold text-stone-900">Order Status Tracking</h4>
                      <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wide">Secure Logistics Pipeline</p>
                    </div>
                    {/* Interactive state trigger description */}
                    <span className="text-[10px] font-mono font-medium text-amber-800 px-2.5 py-0.5 border border-amber-200/55 bg-amber-50/20 rounded">
                      Live Delivery Tracker
                    </span>
                  </div>

                  {/* Responsive Timeline Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
                    {/* Background connecting lines for desktop */}
                    <div className="hidden md:block absolute top-[18px] left-[15%] right-[15%] h-[2px] bg-stone-200 -z-0">
                      <div 
                        className="h-full bg-stone-900 transition-all duration-500" 
                        style={{ 
                          width: order.status === "Delivered" ? "100%" : order.status === "Shipped" ? "50%" : "0%" 
                        }}
                      />
                    </div>

                    {[
                      {
                        key: "Processing" as const,
                        label: "Atelier Processing",
                        description: "Sourcing premium organic fibers & structural drafting in Delhi studio.",
                        icon: Clock,
                        isCompleted: order.status === "Shipped" || order.status === "Delivered",
                        isActive: order.status === "Processing" || order.status === "Pending" || !order.status,
                      },
                      {
                        key: "Shipped" as const,
                        label: "Express Dispatch",
                        description: "Secured in custom anti-dust sleeve. Dispatched via premium air freight courier.",
                        icon: Truck,
                        isCompleted: order.status === "Delivered",
                        isActive: order.status === "Shipped",
                      },
                      {
                        key: "Delivered" as const,
                        label: "Bespoke Delivery",
                        description: "Arrived at your specified destination, signed, inspected, and verified.",
                        icon: Package,
                        isCompleted: order.status === "Delivered", // Show complete or active delivery
                        isActive: order.status === "Delivered",
                      }
                    ].map((step, idx) => {
                      const StepIcon = step.icon;
                      
                      // Status colors
                      let badgeClass = "";
                      let ringClass = "";
                      let textClass = "";
                      let iconClass = "";
                      
                      if (step.isCompleted && step.key !== "Delivered") {
                        badgeClass = "bg-stone-900 border-stone-900 text-[#faf9f6]";
                        textClass = "text-stone-900 font-semibold";
                        iconClass = "text-white";
                      } else if (step.isActive) {
                        badgeClass = "bg-[#1f1e1c] border-[#1f1e1c] text-white animate-pulse shadow-md";
                        ringClass = "ring-4 ring-stone-100";
                        textClass = "text-stone-950 font-bold";
                        iconClass = "text-white";
                      } else {
                        badgeClass = "bg-[#faf9f6] border-stone-200 text-stone-300";
                        textClass = "text-stone-400 font-light";
                        iconClass = "text-stone-300";
                      }

                      return (
                        <div key={idx} className="relative z-10 flex md:flex-col items-start md:items-center text-left md:text-center space-x-4 md:space-x-0 group">
                          {/* Left Line for mobile vertical tracking */}
                          {idx < 2 && (
                            <div className="md:hidden absolute left-5 top-10 bottom-[-24px] w-[2px] bg-stone-200">
                              <div 
                                className="w-full bg-stone-900 transition-all duration-500"
                                style={{
                                  height: (idx === 0 && (order.status === "Shipped" || order.status === "Delivered")) || 
                                          (idx === 1 && order.status === "Delivered") ? "100%" : "0%"
                                }}
                              />
                            </div>
                          )}

                          {/* Icon Circle */}
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${badgeClass} ${ringClass} md:mb-3`}>
                            {step.isCompleted && step.key !== "Delivered" ? (
                              <Check className="h-4 w-4 stroke-[2.5]" />
                            ) : (
                              <StepIcon className={`h-4 w-4 ${iconClass}`} />
                            )}
                          </div>

                          {/* Narrative blocks */}
                          <div className="space-y-1 pr-4">
                            <span className={`text-xs font-mono uppercase tracking-widest block transition-colors duration-300 ${textClass}`}>
                              {idx + 1}. {step.label}
                            </span>
                            <p className="text-[11px] text-stone-500 leading-relaxed font-light font-sans max-w-xs mx-auto">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Simulated pipeline speed trigger bar */}
                  {onUpdateOrderStatus && (
                    <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-stone-200/50 mt-6 bg-[#faf9f6]/40 p-3 rounded-xl border border-stone-100/50">
                      <div className="flex items-center space-x-1.5">
                        <RefreshCw className="h-3 w-3 text-stone-400 rotate-180" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                          Simulate Shipping Tracker (Demo):
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(["Processing", "Shipped", "Delivered"] as const).map((stage) => {
                          const isSelected = order.status === stage;
                          return (
                            <button
                              key={stage}
                              onClick={() => {
                                if (onUpdateOrderStatus) {
                                  onUpdateOrderStatus(order.id, stage);
                                }
                              }}
                              className={`px-3 py-1.5 text-[9px] font-mono rounded-md border uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                                isSelected
                                  ? "bg-stone-900 border-stone-900 text-white font-bold shadow-sm"
                                  : "bg-white border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                              }`}
                              style={{
                                backgroundColor: isSelected ? "#1f1e1c" : ""
                              }}
                              id={`btn-simulate-order-${order.id}-${stage.toLowerCase()}`}
                            >
                              {stage}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items grid */}
                <div className="p-6 divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-10 overflow-hidden bg-stone-50 border border-stone-200 rounded flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-stone-900 font-sans">{item.product.name}</h4>
                          <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">
                            Size: {item.selectedSize} • Qty: {item.quantity} • Checked at ₹{item.product.price.toLocaleString("en-IN")} ea
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-stone-900 pr-2">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and view Receipt */}
                <div className="bg-[#faf9f6]/90 border-t border-[#ecebe4] px-6 py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 text-xs">
                  <p className="text-stone-400 font-mono text-[10px] uppercase">
                    Shipped to: <strong className="text-stone-700 font-semibold uppercase font-sans tracking-wide">{order.shipping.fullName}</strong> ({order.shipping.city})
                  </p>
                  
                  <button
                    onClick={() => onViewOrderReceipt(order)}
                    className="flex items-center space-x-1 text-stone-950 font-bold uppercase tracking-widest text-[10px] hover:text-stone-500 transition-colors ml-auto sm:ml-0 cursor-pointer"
                  >
                    <span>View Receipt Screen</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Trust seal bottom */}
      <div className="mt-16 flex items-center justify-center space-x-2 text-stone-400 text-[10px] font-mono uppercase border-t border-stone-200 pt-8">
        <ShieldCheck className="h-4 w-4 text-stone-500" />
        <span>VAND FANSHIONS Secure SSL Handled Client Ledger</span>
      </div>

    </div>
  );
};
