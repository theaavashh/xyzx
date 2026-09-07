"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Truck, Lock, ChevronLeft, Store, Tag, X } from "lucide-react";
import { toast } from "react-hot-toast";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import type { CheckoutFormRef } from "@/components/StripeCheckoutForm";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContextTanStack";
import { api } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const isStripeConfigured =
  STRIPE_PK &&
  !STRIPE_PK.includes("YOUR_ACTUAL_KEY_HERE") &&
  !STRIPE_PK.includes("YOUR_PUBLISHABLE_KEY_HERE");

const stripePromise = isStripeConfigured ? loadStripe(STRIPE_PK) : null;

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Valid email is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  shippingMethod: z.enum(["standard", "express"]).optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
}).refine(
  (data) => !data.createAccount || (data.password && data.password.length >= 6),
  { message: "Password must be at least 6 characters", path: ["password"] }
).refine(
  (data) => data.deliveryMethod !== "delivery" || (data.address && data.city),
  { message: "Address and city are required for delivery", path: ["address"] }
);

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function resolveImage(url: string | null): string {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

const inputClass = (error?: string) =>
  `w-full px-4 py-3.5 border rounded-xl bg-white text-sm text-zinc-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors ${error ? "border-red-400" : "border-neutral-200"}`;

const labelClass = "block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wide";
const errorClass = "mt-1 text-xs text-red-500";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const stripeRef = useRef<CheckoutFormRef>(null);

  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    name: string;
    type: string;
    value: number;
    discountAmount: number;
    description?: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      postalCode: "",
      country: "Nepal",
      deliveryMethod: "delivery",
      shippingMethod: "standard",
      createAccount: false,
      password: "",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const shippingMethod = watch("shippingMethod");
  const email = watch("email");
  const shipping = subtotal > 100 ? 0 : deliveryMethod === "pickup" ? 0 : shippingMethod === "express" ? 12.99 : 10;
  const tax = subtotal * 0.08;
  const discount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotal + shipping + tax - discount);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.firstName) setValue("firstName", user.firstName);
      if (user.lastName) setValue("lastName", user.lastName);
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phone", user.phone || "");
    }
  }, [isAuthenticated, user, setValue]);

  useEffect(() => {
    if (items.length === 0) router.push("/");
  }, [items.length, router]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (total <= 0) return;
      try {
        setIsLoading(true);
        setPaymentError("");
        const data = await api.post<{ success: boolean; data: { clientSecret: string } }>(
          "/api/v1/payments/create-payment-intent",
          {
            amount: total,
            currency: "usd",
            metadata: { email: email || "guest@example.com", items: items.length },
          },
        );
        if (data.success) {
          setClientSecret(data.data.clientSecret);
        }
      } catch {
        setPaymentError("Failed to initialize payment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (total > 0) createPaymentIntent();
  }, [total, items.length]);

  const onValidSubmit = async () => {
    await stripeRef.current?.submitPayment();
  };

  const handlePaymentSuccess = async () => {
    try {
      const formData = watch();
      const orderData = {
        subtotal,
        tax,
        shipping,
        discount: discount,
        total,
        currency: "USD",
        shippingName: `${formData.firstName} ${formData.lastName}`.trim(),
        shippingEmail: formData.email,
        shippingPhone: formData.phone || undefined,
        shippingAddress: [formData.address, formData.apartment].filter(Boolean).join(", "),
        shippingCity: formData.city || "",
        shippingState: "",
        shippingCountry: formData.country || "Nepal",
        shippingZip: formData.postalCode || "",
        paymentMethod: "stripe",
        couponCode: appliedCoupon?.code || undefined,
        couponId: appliedCoupon?.id || undefined,
        notes: appliedCoupon ? `Coupon applied: ${appliedCoupon.code} (-$${discount.toFixed(2)})` : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await api.post<{ success: boolean; data: { id: string; orderNumber: string } }>(
        "/api/v1/orders",
        orderData,
      );

      if (response.success) {
        await clearCart();
        router.push(`/checkout/success?orderNumber=${response.data.orderNumber}`);
      }
    } catch {
      setPaymentError("Payment succeeded but failed to create order. Please contact support.");
      toast.error("Failed to create order");
    }
  };

  const handlePaymentError = (error: string) => setPaymentError(error);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const response = await api.post<{ success: boolean; data: { id: string; code: string; name: string; type: string; value: number; discountAmount: number; description?: string } }>(
        "/api/v1/public/coupons/validate",
        { code: couponCode.trim(), subtotal },
      );
      if (response.success) {
        setAppliedCoupon(response.data);
        setClientSecret("");
        toast.success(`Coupon "${response.data.code}" applied! You save $${response.data.discountAmount.toFixed(2)}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid coupon code";
      setCouponError(message);
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setClientSecret("");
    toast.success("Coupon removed");
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-zinc-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Return to shop
          </Link>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Lock className="w-3 h-3" /> Secure checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="swansea text-3xl sm:text-4xl font-bold text-zinc-900 tracking-wide mb-10">Checkout</h1>

        <form onSubmit={handleSubmit(onValidSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left — Form */}
            <div className="lg:col-span-7 space-y-8">
              {!isAuthenticated ? (
                <div>
                  <h2 className="text-sm font-medium text-zinc-600 mb-1">Guest checkout</h2>
                  <p className="text-sm text-neutral-500 mb-5">
                    Already have an account?{" "}
                    <Link href="/login" className="text-zinc-600 underline underline-offset-2 hover:no-underline font-medium">Log in</Link>
                  </p>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...register("createAccount")}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-zinc-600 focus:ring-black" />
                    <div>
                      <span className="text-sm font-medium text-zinc-600">Create an account for faster checkout</span>
                      <p className="text-xs text-neutral-400 mt-0.5">Save your details and track your orders</p>
                    </div>
                  </label>
                  {watch("createAccount") && (
                    <div className="mt-4 ml-7">
                      <label className={labelClass}>Password *</label>
                      <input type="password" {...register("password")} placeholder="At least 6 characters"
                        className={inputClass(errors.password?.message)} />
                      {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.[0] || user?.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-600">
                      Welcome back, {user?.firstName || user?.email}
                    </p>
                    <p className="text-xs text-neutral-400">Your details have been pre-filled</p>
                  </div>
                </div>
              )}

              {/* Delivery */}
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100">Delivery Method</h2>
                <div className="grid grid-cols-2 bg-neutral-100 rounded-2xl p-1">
                  <button
                    type="button"
                    onClick={() => setValue("deliveryMethod", "delivery")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                      deliveryMethod === "delivery"
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-neutral-500 hover:text-zinc-900"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("deliveryMethod", "pickup")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                      deliveryMethod === "pickup"
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-neutral-500 hover:text-zinc-900"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Pick Up
                  </button>
                </div>
                <p className="text-xs text-neutral-400 mt-2 text-center">
                  {deliveryMethod === "delivery" ? "Ship to your address" : "Free — available in 2-4 hours"}
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      {...register("firstName")}
                      placeholder=" "
                      className={`peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors ${errors.firstName?.message ? "border-red-400" : "border-neutral-200"}`}
                    />
                    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                      First Name *
                    </label>
                    {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      {...register("lastName")}
                      placeholder=" "
                      className={`peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors ${errors.lastName?.message ? "border-red-400" : "border-neutral-200"}`}
                    />
                    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                      Last Name *
                    </label>
                    {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      {...register("email")}
                      placeholder=" "
                      className={`peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors ${errors.email?.message ? "border-red-400" : "border-neutral-200"}`}
                    />
                    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                      Email *
                    </label>
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      {...register("phone")}
                      placeholder=" "
                      className="peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors border-neutral-200"
                    />
                    <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                      Phone
                    </label>
                  </div>
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <>
                  {/* Address */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Country / Region</label>
                        <select {...register("country")} className={`w-full px-4 py-3.5 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors ${errors.country?.message ? "border-red-400" : "border-neutral-200"}`}>
                          <option value="Nepal">Nepal</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="TH">Thailand</option>
                        </select>
                        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
                      </div>
                      <div className="relative">
                        <input
                          {...register("address")}
                          placeholder=" "
                          className={`peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors ${errors.address?.message ? "border-red-400" : "border-neutral-200"}`}
                        />
                        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                          Address *
                        </label>
                        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                      </div>
                      <div className="relative">
                        <input
                          {...register("apartment")}
                          placeholder=" "
                          className="peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors border-neutral-200"
                        />
                        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                          Apartment, suite, etc.
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <input
                            {...register("city")}
                            placeholder=" "
                            className={`peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors ${errors.city?.message ? "border-red-400" : "border-neutral-200"}`}
                          />
                          <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                            City *
                          </label>
                          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                        </div>
                        <div className="relative">
                          <input
                            {...register("postalCode")}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors border-neutral-200"
                          />
                          <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-600 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-zinc-600">
                            Postal Code
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100">Shipping Method</h2>
                    <div className="space-y-3">
                      <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === "standard" ? "border-black bg-neutral-50 shadow-sm" : "border-neutral-200 hover:border-neutral-300"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" value="standard" {...register("shippingMethod")} className="text-zinc-600 focus:ring-black" />
                          <div>
                            <div className="text-sm font-medium text-zinc-600">Standard Shipping</div>
                            <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                              <Truck className="w-3 h-3" /> 5-7 business days
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-zinc-600">{subtotal > 100 ? "Free" : "$10.00"}</span>
                      </label>
                      <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === "express" ? "border-black bg-neutral-50 shadow-sm" : "border-neutral-200 hover:border-neutral-300"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" value="express" {...register("shippingMethod")} className="text-zinc-600 focus:ring-black" />
                          <div>
                            <div className="text-sm font-medium text-zinc-600">Express Shipping</div>
                            <div className="text-xs text-neutral-400 mt-0.5">2-3 business days</div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-zinc-600">$12.99</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Payment */}
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100">Payment</h2>

                {isLoading && !clientSecret ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-black" />
                  </div>
                ) : paymentError ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
                    {paymentError}
                  </div>
                ) : clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeCheckoutForm ref={stripeRef} total={total} onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />
                  </Elements>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <p className="text-sm text-yellow-800 font-medium">Stripe is not configured</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable payments.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-neutral-50 rounded-3xl p-6 lg:p-8 sticky top-24">
                <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-neutral-100">
                        <img src={resolveImage(item.image)} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-600 truncate">{item.name}</h3>
                          {(item.size || item.color) && (
                            <p className="text-xs text-neutral-400 mt-0.5">{[item.size, item.color].filter(Boolean).join(" / ")}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-zinc-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal ({items.length} items)</span>
                    <span className="text-zinc-600 font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Coupon Input */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700 tracking-tight">{appliedCoupon.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-emerald-700">-${appliedCoupon.discountAmount.toFixed(2)}</span>
                        <button type="button" onClick={removeCoupon} className="text-emerald-600 hover:text-emerald-800">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Discount code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                        className="flex-1 px-3 py-2.5 border border-neutral-200 rounded-xl bg-white text-sm text-zinc-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">
                      {shipping === 0 ? "Shipping" : deliveryMethod === "pickup" ? "Shipping" : shippingMethod === "express" ? "Express Delivery" : "Standard Shipping"}
                    </span>
                    <span className="text-zinc-600 font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Tax (8%)</span>
                    <span className="text-zinc-600 font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600">Discount</span>
                      <span className="text-emerald-600 font-medium">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold pt-4 border-t border-neutral-200">
                    <span className="text-zinc-600">Total</span>
                    <span className="text-zinc-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 100 && shipping !== 0 && (
                  <div className="mt-5 bg-emerald-50 rounded-2xl p-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <p className="text-xs text-emerald-800">
                      Add <span className="font-semibold">${(100 - subtotal).toFixed(2)}</span> more for free shipping
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
