import React, { useState } from "react";
import { X, Ruler, Sparkles, Droplets, ReceiptText, ShieldAlert } from "lucide-react";

interface AtelierCareFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AtelierCareFAQModal: React.FC<AtelierCareFAQModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"sizing" | "care" | "gst">("sizing");

  if (!isOpen) return null;

  const tabs = [
    { id: "sizing" as const, label: "Sizing Matrix", icon: Ruler },
    { id: "care" as const, label: "Laundry & Care", icon: Droplets },
    { id: "gst" as const, label: "5% GST Policy", icon: ReceiptText },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in" id="atelier-faq-modal-overlay">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl border border-stone-200/85 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="atelier-faq-modal-container"
      >
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2">
            <span className="p-1 px-2 bg-stone-900 text-[#faf9f6] text-[9px] font-mono rounded font-bold uppercase tracking-widest">
              Atelier
            </span>
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-stone-700 animate-pulse" />
              <span>Care & Sourcing FAQ</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-900 transition-all duration-200 cursor-pointer"
            id="btn-close-faq"
            title="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-stone-100 bg-[#faf9f6]/90 px-4 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3.5 text-xs uppercase tracking-wider font-semibold font-mono border-b-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-stone-900 text-stone-950"
                    : "border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-200"
                }`}
                id={`tab-faq-${tab.id}`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-stone-950" : "text-stone-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content body based on active tab selection */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* TAB 1: SIZING GUIDELINES */}
          {activeTab === "sizing" && (
            <div className="space-y-6 animate-fade-in" id="faq-content-sizing">
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-light text-stone-900">Precision Tailored Sizing</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Our products are drafted globally inside our local Delhi design studio for an architectural drape. The fit is moderately relaxed on the shoulders, contouring cleanly down the upper chest before finishing in a soft straight fall.
                </p>
              </div>

              {/* Measurement tables */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block">
                  Sizing Matrix Measurements (Inches)
                </span>
                
                <div className="overflow-x-auto border border-stone-200/60 rounded-xl bg-stone-50/50">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 font-mono text-stone-500 bg-stone-100/70 text-[10px] uppercase">
                        <th className="px-4 py-3 font-semibold">Size Spec</th>
                        <th className="px-4 py-3 font-semibold">Chest (Inches)</th>
                        <th className="px-4 py-3 font-semibold">Length (Inches)</th>
                        <th className="px-4 py-3 font-semibold">Shoulder Drop</th>
                        <th className="px-4 py-3 font-semibold">Recommended Body Height</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-stone-800 divide-y divide-stone-150">
                      <tr>
                        <td className="px-4 py-3 font-bold text-stone-950 bg-stone-50/20">S (Small)</td>
                        <td className="px-4 py-3">38" - 40"</td>
                        <td className="px-4 py-3">27.0"</td>
                        <td className="px-4 py-3">18.0"</td>
                        <td className="px-4 py-3">5'5" – 5'8"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-stone-950 bg-stone-50/20">M (Medium)</td>
                        <td className="px-4 py-3">40" - 42"</td>
                        <td className="px-4 py-3">28.0"</td>
                        <td className="px-4 py-3">19.0"</td>
                        <td className="px-4 py-3">5'8" – 5'11"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-stone-950 bg-stone-50/20">L (Large)</td>
                        <td className="px-4 py-3">42" - 44"</td>
                        <td className="px-4 py-3">29.0"</td>
                        <td className="px-4 py-3">20.0"</td>
                        <td className="px-4 py-3">5'11" – 6'2"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-stone-950 bg-stone-50/20">XL (Extra L)</td>
                        <td className="px-4 py-3">44" - 47"</td>
                        <td className="px-4 py-3">30.0"</td>
                        <td className="px-4 py-3">21.5"</td>
                        <td className="px-4 py-3">6'2" – 6'5"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fit Tips */}
              <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-xl space-y-2">
                <span className="font-serif text-[12px] font-semibold text-orange-900 block flex items-center space-x-1.5">
                  <span>How to find your perfect fit</span>
                </span>
                <p className="text-[11px] text-[#554a3a] leading-relaxed font-light">
                  If you prefer a contemporary relaxed drape that flatters natural movement, order your standard regular retail size. For a more traditional fitted profile, we recommend choosing one size smaller.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: GARMENT CARE MANUAL */}
          {activeTab === "care" && (
            <div className="space-y-6 animate-fade-in" id="faq-content-care">
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-light text-stone-900">Fine Fabric Preservation</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Our extra-long staple Supima cotton threads and premium French Riviera Linen fibers are carefully sourced to last decades. Treating them with conscious care prolongs their smooth feel and natural breathability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 border border-stone-200/70 rounded-xl space-y-2 text-stone-800">
                  <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                    <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                    <span>Washing Guidelines</span>
                  </div>
                  <ul className="text-[11px] text-stone-600 space-y-1.5 font-light list-disc pl-3">
                    <li>Wash inside out with similar fine textures only.</li>
                    <li>Use mild, pH-neutral liquid detergent or wool soap.</li>
                    <li>Optionally handwash cold or select a delicate machine cycle (Max 30°C/86°F).</li>
                    <li>Avoid optical brighteners & chlorinated bleach products.</li>
                  </ul>
                </div>

                <div className="p-4 border border-stone-200/70 rounded-xl space-y-2 text-stone-800">
                  <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                    <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                    <span>Drying & Shaping</span>
                  </div>
                  <ul className="text-[11px] text-stone-600 space-y-1.5 font-light list-disc pl-3">
                    <li>Never machine tumble dry premium custom fibers.</li>
                    <li>Gently squeeze out excess wetness; do not wring or twist.</li>
                    <li>Reshape garment while damp and dry flat in shaded breeze.</li>
                    <li>Store folded flat rather than on heavy hangers to prevent shoulder warp.</li>
                  </ul>
                </div>

              </div>

              <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-start space-x-3 text-xs leading-relaxed text-stone-600">
                <ShieldAlert className="h-5 w-5 text-stone-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 font-light">
                  <strong className="text-stone-900 font-semibold font-mono uppercase text-[10px] tracking-wide block">Steam Ironing Note</strong>
                  <p>Iron only on reverse settings using low heat (cotton option). If you are ironing a customized dynamic print or delicate bespoke piece, always use an intermediate cotton cloth guard to protect natural dyes.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 5% GST POLICY */}
          {activeTab === "gst" && (
            <div className="space-y-6 animate-fade-in" id="faq-content-gst">
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-light text-stone-900">Integrated GST Transparency policy</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  We are integrated and fully registered. At VAND FANSHIONS, we maintain complete transparency in accounting, billing, and localized taxation in compliance with national merchant frameworks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200/80 p-5 rounded-xl space-y-4.5">
                  <div className="flex justify-between items-center text-xs font-mono uppercase font-bold tracking-wider text-stone-800 border-b border-stone-200 pb-3">
                    <span>Applicable Tax Tariff</span>
                    <span className="px-2.5 py-0.5 bg-stone-900 text-[#faf9f6] rounded text-[10px]">
                      5% Standard GST
                    </span>
                  </div>

                  <div className="space-y-3 font-light text-stone-650 text-xs leading-relaxed">
                    <p>
                      <strong>Standard Apparel GST:</strong> By regional mandate, fabric garments priced under ₹1,000 as well as luxury, bespoke on-demand drafted clothes are subject to a uniform <strong>5% Goods and Services Tax (GST)</strong>.
                    </p>
                    <p>
                      <strong>How it is applied:</strong> The 5% GST surcharge is dynamically computed over the base apparel subtotal and clearly displayed as an independent line-item inside both your active Shopping Bag drawer and finalized Secure Checkout panels.
                    </p>
                    <p>
                      <strong>Tax Duty Redistribution:</strong> 100% of collected GST rates are filed directly with regional authorities. Standardizing tax processes ensures full legal clearance of express courier parcels dispatched to your address.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-stone-200/50 bg-[#faf9f6] rounded-xl text-center space-y-1">
                  <p className="text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider">Example calculation on a standard ₹1,500 Base Item</p>
                  <p className="font-serif text-sm text-stone-905">
                    ₹1,500.00 Base + ₹75.00 GST (5%) = <strong className="font-semibold text-stone-950">₹1,575.00 Total Due</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-stone-150 bg-stone-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-900 text-[#faf9f6] hover:bg-stone-800 transition rounded-lg text-xs uppercase font-bold tracking-widest cursor-pointer shadow-md"
            id="btn-faq-confirm-close"
          >
            Acknowledge Guidelines
          </button>
        </div>

      </div>
    </div>
  );
};
