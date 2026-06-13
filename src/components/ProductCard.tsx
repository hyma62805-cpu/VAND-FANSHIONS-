import React from "react";
import { Product } from "../types";
import { ArrowUpRight, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col h-full rounded-lg"
    >
      {/* Visual Product Display Stage */}
      <div className="aspect-[4/5] bg-stone-100 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Hover overlay with a classic magnifying glass or glance eye icon */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="p-3 bg-white/95 text-stone-900 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="h-4 w-4" />
          </span>
        </div>

        {/* Style Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.style === "Premium" && (
            <span className="text-[9px] tracking-widest font-mono text-[#faf9f6] bg-[#1a1a1a] uppercase px-2 py-0.5 rounded shadow">
              Premium Drape
            </span>
          )}
          {product.style === "Atelier" && (
            <span className="text-[9px] tracking-widest font-mono text-stone-900 bg-stone-100 border border-stone-300 uppercase px-2 py-0.5 rounded shadow">
              Atelier Cut
            </span>
          )}
          {product.style === "Essential" && (
            <span className="text-[9px] tracking-widest font-mono text-stone-600 bg-stone-50 border border-stone-200 uppercase px-2 py-0.5 rounded shadow">
              Classic Core
            </span>
          )}
        </div>

        {/* Currency Tag */}
        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-mono font-bold text-stone-900 tracking-wider shadow rounded">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Content & Metadata info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono tracking-widest uppercase text-stone-400">
              {product.category}
            </span>
            <span className="text-[9px] bg-stone-100 text-stone-500 font-mono px-1.5 py-0.5 rounded">
              {product.sizes.join(", ")}
            </span>
          </div>
          <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
            {product.details ? `${product.details.length} atelier features` : "Bespoke drape"}
          </span>
          <span className="text-xs font-semibold text-stone-900 flex items-center space-x-1 group-hover:text-stone-500 transition-colors">
            <span>Configure</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
