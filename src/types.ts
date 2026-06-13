export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "Shirts" | "T-Shirts";
  style: "Atelier" | "Essential" | "Premium";
  image: string;
  images?: string[];
  sizes: string[];
  careInfo: string[];
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface PaymentDetails {
  method: "card" | "gpay" | "phonepe";
  cardHolder?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  upiId?: string;
  phoneNumber?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shipping: ShippingDetails;
  paymentMethod?: "card" | "gpay" | "phonepe";
  paymentDetails?: {
    upiId?: string;
    phoneNumber?: string;
    cardNumberMasked?: string;
  };
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Pending";
}
