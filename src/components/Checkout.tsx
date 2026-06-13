import React, { useState } from "react";
import { CartItem, ShippingDetails, PaymentDetails } from "../types";
import { ArrowLeft, CreditCard, ShieldCheck, ShoppingBag, Eye, Smartphone, QrCode } from "lucide-react";

interface CheckoutProps {
  cartItems: CartItem[];
  onBackToCart: () => void;
  onPlaceOrder: (shipping: ShippingDetails, payment: PaymentDetails) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  onBackToCart,
  onPlaceOrder,
}) => {
  // Shipping Form States
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // Payment Form States
  const [payment, setPayment] = useState<PaymentDetails>({
    method: "card",
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
    phoneNumber: "",
  });

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [selectedUpiOption, setSelectedUpiOption] = useState<"upi-app" | "qr">("upi-app");

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-16 w-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-500">
          <ShoppingBag className="h-8 w-8 stroke-[1.2]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-stone-900 font-light">Your Checkout is Empty</h2>
          <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
            There are no garment templates in your active drafting session. Open our collection store below to choose items.
          </p>
        </div>
        <button
          onClick={onBackToCart}
          className="px-8 py-3.5 bg-[#1a1a1a] text-[#faf9f6] hover:bg-stone-800 transition uppercase text-xs tracking-widest font-semibold inline-flex items-center space-x-2.5 cursor-pointer"
        >
          <span>Open Atelier Store</span>
        </button>
      </div>
    );
  }

  // Total computation in INR
  const itemsTotal = cartItems.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );

  const gstAmount = itemsTotal * 0.05;
  const grandTotal = itemsTotal + gstAmount;

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "shipping" | "payment"
  ) => {
    const { name, value } = e.target;
    if (section === "shipping") {
      setShipping((prev) => ({ ...prev, [name]: value }));
    } else {
      setPayment((prev) => ({ ...prev, [name]: value }));
    }
    setFormError("");
  };

  const handleMethodChange = (method: "card" | "gpay" | "phonepe") => {
    setPayment((prev) => ({
      ...prev,
      method,
    }));
    setFormError("");
  };

  const validateForms = (): boolean => {
    // Basic shipping validation
    if (
      !shipping.fullName ||
      !shipping.email ||
      !shipping.address ||
      !shipping.city ||
      !shipping.postalCode ||
      !shipping.phone
    ) {
      setFormError("Please fill in all empty Shipping fields.");
      return false;
    }

    if (payment.method === "card") {
      if (
        !payment.cardHolder ||
        !payment.cardNumber ||
        !payment.expiry ||
        !payment.cvv
      ) {
        setFormError("Please fill in all Secure Card Payment fields.");
        return false;
      }

      // Card format verification
      if (payment.cardNumber.replace(/\s/g, "").length < 15) {
        setFormError("Please enter a valid Card Number.");
        return false;
      }

      if (payment.expiry.replace(/\s/g, "").length < 4) {
        setFormError("Please enter a valid Expiry Code (MM/YY).");
        return false;
      }

      if (payment.cvv.length < 3) {
        setFormError("Please enter a valid CVV Code.");
        return false;
      }
    } else {
      // UPI validation (only if app collect is selected)
      if (selectedUpiOption === "upi-app") {
        if (!payment.phoneNumber && !payment.upiId) {
          setFormError(`Please enter a Mobile Number or a UPI ID for ${payment.method === "gpay" ? "Google Pay" : "PhonePe"}.`);
          return false;
        }

        if (payment.phoneNumber && payment.phoneNumber.replace(/\D/g, "").length < 10) {
          setFormError("Please enter a valid 10-digit mobile number.");
          return false;
        }

        if (payment.upiId && !payment.upiId.includes("@")) {
          setFormError("Please enter a valid UPI ID format (e.g. username@upi_handle).");
          return false;
        }
      }
    }

    return true;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForms()) return;

    setIsSubmitting(true);

    if (payment.method === "gpay") {
      if (selectedUpiOption === "qr") {
        setProgressMsg("Generating secure Google Pay QR Code...");
        setTimeout(() => {
          setProgressMsg("Scanning simulation detected. Verifying collection status...");
          setTimeout(() => {
            setProgressMsg("GPay transaction captured successfully. Finalizing order...");
            setTimeout(() => {
              onPlaceOrder(shipping, payment);
              setIsSubmitting(false);
            }, 1000);
          }, 1500);
        }, 1000);
      } else {
        setProgressMsg("Opening Google Pay secure channel...");
        setTimeout(() => {
          setProgressMsg("Awaiting authorization from Google Pay App on your device...");
          setTimeout(() => {
            setProgressMsg("GPay authorization verified. Creating Atelier invoice...");
            setTimeout(() => {
              onPlaceOrder(shipping, payment);
              setIsSubmitting(false);
            }, 1000);
          }, 1500);
        }, 1000);
      }
    } else if (payment.method === "phonepe") {
      if (selectedUpiOption === "qr") {
        setProgressMsg("Generating custom PhonePe dynamic Merchant QR Code...");
        setTimeout(() => {
          setProgressMsg("Merchant callback token received. Confirming amount ₹" + grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "...");
          setTimeout(() => {
            setProgressMsg("PhonePe transaction authenticated successfully. Finalizing...");
            setTimeout(() => {
              onPlaceOrder(shipping, payment);
              setIsSubmitting(false);
            }, 1000);
          }, 1500);
        }, 1000);
      } else {
        setProgressMsg("Connecting to PhonePe Secure Gateway Merchant API...");
        setTimeout(() => {
          setProgressMsg("Please accept the collect request sent to your PhonePe App...");
          setTimeout(() => {
            setProgressMsg("PhonePe callback webhook cleared successfully. Finalizing...");
            setTimeout(() => {
              onPlaceOrder(shipping, payment);
              setIsSubmitting(false);
            }, 1000);
          }, 1500);
        }, 1000);
      }
    } else {
      setProgressMsg("Validating secure credit token authorization...");
      setTimeout(() => {
        setProgressMsg("Routing secure payment transaction through Razorpay...");
        setTimeout(() => {
          setProgressMsg("Finalizing order logs inside local storage...");
          setTimeout(() => {
            onPlaceOrder(shipping, payment);
            setIsSubmitting(false);
          }, 1000);
        }, 1000);
      }, 1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Return Back link */}
      <button
        onClick={onBackToCart}
        className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#1a1a1a] hover:text-stone-500 font-medium transition cursor-pointer mb-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Return To Atelier Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Billing/Shipping & Card Inputs (Col Span 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl text-stone-900 font-light border-b border-stone-100 pb-3">
              01. Shipping & Delivery Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shipping.fullName}
                  onChange={(e) => handleTextChange(e, "shipping")}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-[#faf9f6] border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm focus:outline-none transition rounded"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={shipping.email}
                  onChange={(e) => handleTextChange(e, "shipping")}
                  placeholder="e.g. aarav@gmail.com"
                  className="w-full bg-[#faf9f6] border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm focus:outline-none transition rounded"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shipping.phone}
                  onChange={(e) => handleTextChange(e, "shipping")}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#faf9f6] border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm focus:outline-none transition rounded"
                  required
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shipping.address}
                  onChange={(e) => handleTextChange(e, "shipping")}
                  placeholder="e.g. Unit 4B, Stellar Heights, MG Road"
                  className="w-full bg-[#faf9f6] border border-[#ecebe4] focus:border-[#1a1a1a] px-4 py-3 text-sm focus:outline-none transition rounded"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shipping.city}
                  onChange={(e) => handleTextChange(e, "shipping")}
                  placeholder="e.g. New Delhi"
                  className="w-full bg-[#faf9f6] border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm focus:outline-none transition rounded"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                  Pincode / Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shipping.postalCode}
                  onChange={(e) => handleTextChange(e, "shipping")}
                  placeholder="e.g. 110001"
                  className="w-full bg-[#faf9f6] border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm focus:outline-none transition rounded"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] bg-stone-100 text-stone-500 font-mono px-3 py-1.5 uppercase rounded tracking-wider leading-loose">
                ✓ Free Express Dispatch Across All Indian Territories
              </span>
            </div>
          </div>

          {/* Secure Payment Multi-Method Tab Box */}
          <div className="bg-white border border-[#ecebe4] rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-stone-100 pb-4 gap-3">
              <h2 className="font-serif text-2xl text-stone-900 font-light flex items-center space-x-2.5">
                <ShieldCheck className="h-[21px] w-[21px] text-[#1a1a1a]" />
                <span>02. Secure India Payment Gateway</span>
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] font-mono uppercase text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">PCI-DSS Secure</span>
                <span className="text-[8px] font-mono uppercase text-[#22c55e] bg-green-50 px-2 py-0.5 rounded border border-green-100 font-bold">UPI Auto-Sync</span>
              </div>
            </div>

            {/* Elite Payment Method Tabs Selector */}
            <div className="grid grid-cols-3 gap-2.5 p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => handleMethodChange("card")}
                className={`py-3 text-xs font-semibold uppercase tracking-wider rounded-md transition flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 cursor-pointer ${
                  payment.method === "card"
                    ? "bg-white text-stone-950 shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50/50"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span className="font-mono text-[10px]">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => handleMethodChange("gpay")}
                className={`py-3 text-xs font-semibold uppercase tracking-wider rounded-md transition flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 cursor-pointer ${
                  payment.method === "gpay"
                    ? "bg-stone-900 text-[#faf9f6] shadow-sm"
                    : "text-stone-500 hover:text-stone-950 hover:bg-stone-50/50"
                }`}
              >
                {/* Google Pay dynamic visual SVG */}
                <svg className="h-3 w-auto" viewBox="0 0 40 16" fill="currentColor">
                  <path d="M4.5 12.3H1.8V3.7h2.7c1.3 0 2.2.3 2.9 1 .7.6 1 1.4 1 2.4s-.3 1.8-1 2.4c-.7.6-1.6.8-2.9.8zm0-1.8c.6 0 1.1-.1 1.4-.4.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2c-.3-.3-.8-.4-1.4-.4H3.5v3.2h1zm9 .3c-.6 0-1.1-.1-1.5-.4-.4-.3-.7-.6-.8-1.1V12h-1.6V3.7h1.6v3.4c.1-.4.4-.8.8-1.1.4-.3.9-.4 1.5-.4 1 0 1.7.3 2.3.9.5.6.8 1.4.8 2.4s-.3 1.8-.8 2.4c-.6.6-1.3.9-2.3.9zm-.1-1.6c.5 0 .9-.1 1.2-.4.3-.3.4-.7.4-1.2s-.1-.9-.4-1.2c-.3-.3-.7-.4-1.2-.4s-.9.1-1.2.4c-.3.3-.4.7-.4 1.2s.1.9.4 1.2c.3.3.7.4 1.2.4zm8.6 1.7c-.8 0-1.5-.2-2-.6-.5-.4-.8-1-.8-1.7V6h1.6v2.5c0 .3.1.6.3.8.2.2.4.3.8.3s.6-.1.8-.3c.2-.2.3-.5.3-.8V6h1.6v2.7c0 .7-.3 1.3-.8 1.7-.5.4-1.2.6-2 .6z" />
                </svg>
                <span className="font-mono text-[10px]">Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => handleMethodChange("phonepe")}
                className={`py-3 text-xs font-semibold uppercase tracking-wider rounded-md transition flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 cursor-pointer ${
                  payment.method === "phonepe"
                    ? "bg-[#5f259f] text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50/50"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span className="font-mono text-[10px]">PhonePe</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              {/* CONDITION A: STANDARD CREDIT/DEBIT CARD */}
              {payment.method === "card" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    <span>Card Authorization Vault</span>
                    <div className="flex space-x-1.5">
                      <span className="bg-stone-100 px-1 py-0.5 rounded text-stone-400 text-[8px] font-bold">RUPAY</span>
                      <span className="bg-stone-100 px-1 py-0.5 rounded text-stone-400 text-[8px] font-bold">VISA</span>
                      <span className="bg-stone-100 px-1 py-0.5 rounded text-stone-400 text-[8px] font-bold">MASTERCARD</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                      Name Printed on Card *
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={payment.cardHolder}
                      onChange={(e) => handleTextChange(e, "payment")}
                      placeholder="e.g. AARAV SHARMA"
                      className="w-full bg-[#faf9f6]/95 border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm font-medium focus:outline-none transition rounded uppercase"
                      required={payment.method === "card"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        maxLength={19}
                        value={payment.cardNumber}
                        onChange={(e) => {
                          const formattedValue = e.target.value
                            .replace(/\s?/g, "")
                            .replace(/(\d{4})/g, "$1 ")
                            .trim();
                          setPayment((prev) => ({ ...prev, cardNumber: formattedValue }));
                        }}
                        placeholder="4321 0987 6543 2109"
                        className="w-full bg-[#faf9f6]/95 font-mono tracking-widest border border-stone-200 focus:border-stone-900 pl-11 pr-4 py-3 text-sm focus:outline-none transition rounded"
                        required={payment.method === "card"}
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                        Expiry Code (MM/YY) *
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        maxLength={5}
                        value={payment.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) {
                            val = val.substring(0, 2) + "/" + val.substring(2, 4);
                          }
                          setPayment((prev) => ({ ...prev, expiry: val }));
                        }}
                        placeholder="12/28"
                        className="w-full bg-[#faf9f6] text-center font-mono tracking-wider border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm focus:outline-none transition rounded"
                        required={payment.method === "card"}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                        Security Code (CVV / CVC) *
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        maxLength={4}
                        value={payment.cvv}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, "");
                          setPayment((prev) => ({ ...prev, cvv: clean }));
                        }}
                        placeholder="•••"
                        className="w-full bg-[#faf9f6] text-center font-mono tracking-widest border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm focus:outline-none transition rounded"
                        required={payment.method === "card"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONDITION B & C: UPI PLATFORMS (GOOGLE PAY OR PHONEPE) */}
              {(payment.method === "gpay" || payment.method === "phonepe") && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-[#faf9f6] border border-stone-200 rounded-lg p-1.5 flex justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUpiOption("upi-app")}
                      className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded font-medium transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                        selectedUpiOption === "upi-app"
                          ? "bg-white text-stone-950 border border-stone-200 shadow-sm font-bold"
                          : "text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>Instant Link Collect</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiOption("qr")}
                      className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded font-medium transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                        selectedUpiOption === "qr"
                          ? "bg-white text-stone-950 border border-stone-200 shadow-sm font-bold"
                          : "text-stone-400 hover:text-stone-700"
                      }`}
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Scan Dynamic QR</span>
                    </button>
                  </div>

                  {selectedUpiOption === "upi-app" ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                          Associated Mobile Number *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-stone-400 text-xs font-semibold font-mono">+91</span>
                          <input
                            type="tel"
                            name="phoneNumber"
                            maxLength={10}
                            value={payment.phoneNumber || ""}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/\D/g, "");
                              setPayment((prev) => ({ ...prev, phoneNumber: clean }));
                            }}
                            placeholder="98765 43210"
                            className="w-full bg-[#faf9f6]/95 border border-stone-200 focus:border-stone-900 pl-12 pr-4 py-3 text-sm font-medium focus:outline-none transition rounded font-mono tracking-wider"
                            required={selectedUpiOption === "upi-app"}
                          />
                        </div>
                        <p className="text-[9px] text-stone-400 uppercase font-mono leading-relaxed">
                          We will initiate an instantaneous payment callback trigger securely linked to your {payment.method === "gpay" ? "Google Pay" : "PhonePe"} app.
                        </p>
                      </div>

                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-stone-200/60"></div>
                        <span className="flex-shrink mx-4 text-stone-400 text-[10px] font-mono uppercase">OR PAY VIA UPI ID STYLE</span>
                        <div className="flex-grow border-t border-stone-200/60"></div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium block">
                          Virtual Payment Address (UPI ID)
                        </label>
                        <input
                          type="text"
                          name="upiId"
                          value={payment.upiId || ""}
                          onChange={(e) => handleTextChange(e, "payment")}
                          placeholder={payment.method === "gpay" ? "e.g. username@okaxis" : "e.g. username@ybl"}
                          className="w-full bg-[#faf9f6]/90 border border-stone-200 focus:border-stone-900 px-4 py-3 text-sm font-medium focus:outline-none transition rounded font-mono text-stone-700"
                        />
                      </div>
                    </div>
                  ) : (
                    /* DYNAMIC SCANNER ANIMATED QR BOX */
                    <div className="space-y-4 animate-fade-in">
                      <div className="relative border border-stone-200/80 rounded-lg p-5 flex flex-col items-center justify-center bg-stone-50 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500/80 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-green-700 font-semibold bg-green-50 px-2.5 py-0.5 rounded-full mb-3.5 flex items-center space-x-1 animate-pulse border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block animate-ping"></span>
                          <span>Active Atelier Gateway IP-Verified Terminal</span>
                        </div>

                        {/* Pure Simulated Elegant SVG QR Code */}
                        <div className="relative p-2.5 bg-white rounded-lg border border-stone-200/50 shadow-sm">
                          <svg width="140" height="140" viewBox="0 0 100 100" className="opacity-90">
                            {/* Outer Anchors */}
                            <rect x="0" y="0" width="22" height="22" fill="#1a1a1a" />
                            <rect x="3" y="3" width="16" height="16" fill="#ffffff" />
                            <rect x="6" y="6" width="10" height="10" fill="#1a1a1a" />

                            <rect x="78" y="0" width="22" height="22" fill="#1a1a1a" />
                            <rect x="81" y="3" width="16" height="16" fill="#ffffff" />
                            <rect x="84" y="6" width="10" height="10" fill="#1a1a1a" />

                            <rect x="0" y="78" width="22" height="22" fill="#1a1a1a" />
                            <rect x="3" y="81" width="16" height="16" fill="#ffffff" />
                            <rect x="6" y="84" width="10" height="10" fill="#1a1a1a" />

                            {/* Pixelized noise cluster block */}
                            <rect x="30" y="2" width="5" height="12" fill="#1a1a1a" />
                            <rect x="40" y="0" width="8" height="5" fill="#1a1a1a" />
                            <rect x="52" y="3" width="6" height="10" fill="#1a1a1a" />
                            <rect x="64" y="0" width="10" height="8" fill="#1a1a1a" />

                            <rect x="30" y="18" width="15" height="4" fill="#1a1a1a" />
                            <rect x="50" y="16" width="12" height="8" fill="#1a1a1a" />
                            <rect x="68" y="15" width="6" height="12" fill="#1a1a1a" />

                            <rect x="0" y="30" width="12" height="6" fill="#1a1a1a" />
                            <rect x="18" y="28" width="4" height="15" fill="#1a1a1a" />
                            <rect x="8" y="40" width="12" height="4" fill="#1a1a1a" />

                            <rect x="30" y="32" width="18" height="18" fill="#1a1a1a" />
                            <rect x="35" y="37" width="8" height="8" fill="#ffffff" />
                            <rect x="54" y="30" width="6" height="14" fill="#1a1a1a" />
                            <rect x="66" y="34" width="12" height="6" fill="#1a1a1a" />
                            <rect x="84" y="30" width="16" height="6" fill="#1a1a1a" />
                            <rect x="76" y="42" width="6" height="15" fill="#1a1a1a" />

                            <rect x="30" y="55" width="12" height="5" fill="#1a1a1a" />
                            <rect x="0" y="60" width="12" height="4" fill="#1a1a1a" />
                            <rect x="16" y="52" width="10" height="12" fill="#1a1a1a" />
                            <rect x="30" y="66" width="4" height="12" fill="#1a1a1a" />
                            <rect x="40" y="72" width="16" height="4" fill="#1a1a1a" />

                            <rect x="54" y="58" width="12" height="12" fill="#1a1a1a" />
                            <rect x="72" y="64" width="4" height="12" fill="#1a1a1a" />
                            <rect x="82" y="56" width="18" height="4" fill="#1a1a1a" />
                            <rect x="88" y="66" width="12" height="18" fill="#1a1a1a" />
                            <rect x="76" y="78" width="4" height="12" fill="#1a1a1a" />
                            <rect x="56" y="78" width="12" height="4" fill="#1a1a1a" />
                            <rect x="30" y="86" width="16" height="10" fill="#1a1a1a" />
                            <rect x="54" y="88" width="16" height="6" fill="#1a1a1a" />
                          </svg>

                          {/* Scanner Glowing Line moving up and down */}
                          <div className="absolute left-[10px] right-[10px] h-[1.5px] bg-[#10b981] animate-[bounce_3s_infinite] pointer-events-none shadow-[0_0_8px_rgba(16,185,129,0.9)]"></div>
                        </div>

                        <div className="text-center mt-3 space-y-1">
                          <p className="text-xs font-bold text-stone-900 font-serif lowercase tracking-wide font-medium">upi:vandfanshions@kotak</p>
                          <p className="text-[9px] font-mono uppercase tracking-wider text-stone-400">
                            Scan with Google Pay, PhonePe, Paytm, or any UPI banking app
                          </p>
                          <div className="pt-2">
                            <span className="text-[10px] bg-stone-100 text-[#1a1a1a] px-3 py-1 font-mono uppercase rounded-md font-bold">
                              Pay ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[9px] font-mono uppercase leading-relaxed text-center text-stone-400">
                        * Once payment is executed on your smartphone, our system detects transaction token and forwards you to processing success screen.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {formError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-3 rounded font-medium flex items-center space-x-2 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-amber-600 block flex-shrink-0"></span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Secure authorization warnings */}
              <div className="pt-4 border-t border-stone-100 flex items-start space-x-3.5 text-stone-400">
                <ShieldCheck className="h-5 w-5 text-stone-700 flex-shrink-0" />
                <p className="text-[11px] font-mono leading-relaxed uppercase tracking-wider">
                  Funds will be authorized in Indian Rupee (INR ₹). Real-time digital UPI clearance is safeguarded by NPCI-certified merchant channels.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#1a1a1a] text-[#faf9f6] hover:bg-stone-800 disabled:bg-stone-600 uppercase text-xs sm:text-sm tracking-widest font-semibold transition-all duration-300 shadow cursor-pointer flex justify-center items-center space-x-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#faf9f6]/95 animate-ping"></span>
                      <span>{progressMsg}</span>
                    </div>
                  ) : payment.method === "card" ? (
                    <span>Authorized Secure Card • ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                  ) : payment.method === "gpay" ? (
                    selectedUpiOption === "qr" ? (
                      <span>Simulate GPay Payment Completed • ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    ) : (
                      <span>Request Google Pay Collect • ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    )
                  ) : (
                    selectedUpiOption === "qr" ? (
                      <span>Simulate PhonePe Payment Completed • ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    ) : (
                      <span>Request PhonePe Collect • ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    )
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Summary (Col Span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-[#faf9f6] border border-stone-200 rounded-xl p-6 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-2.5">
              Atelier Purchase Box
            </h3>

            <div className="divide-y divide-stone-100 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item, id) => (
                <div key={id} className="py-3 flex space-x-3 first:pt-0 last:pb-0">
                  <div className="h-14 w-11 bg-stone-100 overflow-hidden rounded border border-stone-200 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between text-xs text-stone-800">
                    <div>
                      <h4 className="font-medium text-stone-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-stone-900 font-bold self-end md:self-auto text-right">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-stone-200" />

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-400 font-mono uppercase tracking-wider">
                <span>Standard Subtotal</span>
                <span className="text-[#1a1a1a]">₹{itemsTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-400 font-mono uppercase tracking-wider">
                <span>Shipping & Express Courier</span>
                <span className="text-green-700 font-semibold uppercase">Free</span>
              </div>
              <div className="flex justify-between text-xs text-stone-400 font-mono uppercase tracking-wider border-b border-stone-200/50 pb-2.5">
                <span>Atelier GST (5%)</span>
                <span className="text-[#1a1a1a]">₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-serif text-sm font-medium text-stone-900">Total Purchase Value</span>
                <span className="font-mono text-lg font-bold text-stone-950">
                  ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="pt-2 text-stone-400 text-[10px] leading-relaxed border-t border-stone-200 border-dashed font-mono uppercase">
              <p>
                Delivery Estimate: 2 - 4 business days to major metropolitans. Tracked from sector hub. Fully secure.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
