"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Truck, Lock, ChevronLeft, Store } from "lucide-react";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import type { CheckoutFormRef } from "@/components/StripeCheckoutForm";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContextTanStack";
import { getApiBaseUrl } from "@/utils/api";

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
  `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 text-neutral-900 text-sm ${error ? "border-red-400" : "border-neutral-200"}`;

const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";
const errorClass = "mt-1 text-xs text-red-500";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const stripeRef = useRef<CheckoutFormRef>(null);

  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

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
  const total = subtotal + shipping + tax;

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
        const response = await fetch(`${getApiBaseUrl()}/api/v1/payments/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            currency: "usd",
            metadata: { email: email || "guest@example.com", items: items.length },
          }),
        });

        if (!response.ok) throw new Error("Failed to create payment intent");

        const data = await response.json();
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

  const handlePaymentSuccess = () => router.push("/checkout/success");
  const handlePaymentError = (error: string) => setPaymentError(error);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Lock className="w-3 h-3" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="lastik text-4xl text-neutral-900 tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onValidSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {!isAuthenticated ? (
                <div className="bg-white rounded-xl border border-neutral-100 p-6">
                  <h2 className="text-base font-medium text-neutral-900 mb-1">Guest Checkout</h2>
                  <p className="text-sm text-neutral-400 mb-4">
                    You can checkout as a guest. Already have an account?{" "}
                    <Link href="/login" className="text-neutral-900 underline underline-offset-2 hover:no-underline font-medium">Sign in</Link>
                  </p>

                  <div className="border-t border-neutral-100 pt-4 mt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" {...register("createAccount")}
                        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                      <div>
                        <span className="text-sm font-medium text-neutral-900">Create an account for faster checkout</span>
                        <p className="text-xs text-neutral-400 mt-0.5">Save your details and track your orders</p>
                      </div>
                    </label>
                    {watch("createAccount") && (
                      <div className="mt-4 ml-7">
                        <label className={labelClass}>Create Password *</label>
                        <input type="password" {...register("password")} placeholder="At least 6 characters"
                          className={inputClass(errors.password?.message)} />
                        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.[0] || user?.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Welcome back, {user?.firstName || user?.email}
                    </p>
                    <p className="text-xs text-neutral-400">Your details have been pre-filled</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="text-base font-medium text-neutral-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input {...register("firstName")} placeholder="John" className={inputClass(errors.firstName?.message)} />
                    {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input {...register("lastName")} placeholder="Doe" className={inputClass(errors.lastName?.message)} />
                    {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input {...register("email")} placeholder="john@example.com" className={inputClass(errors.email?.message)} />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input {...register("phone")} placeholder="+1 (555) 000-0000" className={inputClass()} />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="text-base font-medium text-neutral-900 mb-4">Delivery Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${deliveryMethod === "delivery" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <input type="radio" value="delivery" {...register("deliveryMethod")} className="text-neutral-900 focus:ring-neutral-900" />
                    <Truck className="w-5 h-5 text-neutral-500" />
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Delivery</div>
                      <div className="text-xs text-neutral-400 mt-0.5">Ship to your address</div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${deliveryMethod === "pickup" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <input type="radio" value="pickup" {...register("deliveryMethod")} className="text-neutral-900 focus:ring-neutral-900" />
                    <Store className="w-5 h-5 text-neutral-500" />
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Pick Up</div>
                      <div className="text-xs text-neutral-400 mt-0.5">Free — available in 2-4 hours</div>
                    </div>
                  </label>
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <>
                  <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="text-base font-medium text-neutral-900 mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Country/Region</label>
                        <select {...register("country")} className={inputClass(errors.country?.message) + " bg-white"}>
                          <option value="Nepal">Nepal</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="TH">Thailand</option>
                        </select>
                        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Address *</label>
                        <input {...register("address")} placeholder="123 Main Street" className={inputClass(errors.address?.message)} />
                        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Apartment, suite, etc.</label>
                        <input {...register("apartment")} placeholder="Apt 4B" className={inputClass()} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>City *</label>
                          <input {...register("city")} placeholder="New York" className={inputClass(errors.city?.message)} />
                          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                        </div>
                        <div>
                          <label className={labelClass}>Postal Code</label>
                          <input {...register("postalCode")} placeholder="10001" className={inputClass()} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h2 className="text-base font-medium text-neutral-900 mb-4">Shipping Method</h2>
                    <div className="space-y-3">
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "standard" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" value="standard" {...register("shippingMethod")} className="text-neutral-900 focus:ring-neutral-900" />
                          <div>
                            <div className="text-sm font-medium text-neutral-900">Standard Shipping</div>
                            <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                              <Truck className="w-3 h-3" /> 5-7 business days
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-neutral-900">{subtotal > 100 ? "Free" : "$10.00"}</span>
                      </label>
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "express" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" value="express" {...register("shippingMethod")} className="text-neutral-900 focus:ring-neutral-900" />
                          <div>
                            <div className="text-sm font-medium text-neutral-900">Express Shipping</div>
                            <div className="text-xs text-neutral-400 mt-0.5">2-3 business days</div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-neutral-900">$12.99</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h2 className="text-base font-medium text-neutral-900 mb-4">Payment</h2>

                {isLoading && !clientSecret ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-neutral-900" />
                  </div>
                ) : paymentError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                    {paymentError}
                  </div>
                ) : clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeCheckoutForm ref={stripeRef} total={total} onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />
                  </Elements>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium">Stripe is not configured</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable payments.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-neutral-100 p-6 sticky top-24">
                <h2 className="text-base font-medium text-neutral-900 mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-neutral-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={resolveImage(item.image)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-neutral-900 truncate">{item.name}</h3>
                        {(item.size || item.color) && (
                          <p className="text-xs text-neutral-400 mt-0.5">{[item.size, item.color].filter(Boolean).join(" / ")}</p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-neutral-400">x{item.quantity}</span>
                          <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Subtotal ({items.length} items)</span>
                    <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Shipping</span>
                    <span className="text-neutral-900">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Tax (8%)</span>
                    <span className="text-neutral-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-3 border-t border-neutral-100">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 100 && shipping !== 0 && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
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
