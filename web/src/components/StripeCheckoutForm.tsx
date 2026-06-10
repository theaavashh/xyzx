"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { forwardRef, useImperativeHandle, useState } from "react";
import { toast } from "react-hot-toast";

interface CheckoutFormProps {
  total: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

export interface CheckoutFormRef {
  submitPayment: () => Promise<void>;
}

const CheckoutForm = forwardRef<CheckoutFormRef, CheckoutFormProps>(
  function CheckoutForm({ total, onPaymentSuccess, onPaymentError, disabled }, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const submitPayment = async () => {
      if (!stripe || !elements) return;

      setIsProcessing(true);

      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
          },
          redirect: "if_required",
        });

        if (error) {
          onPaymentError(error.message || "Payment failed");
          toast.error(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          toast.success("Payment successful!");
          onPaymentSuccess();
        } else {
          onPaymentError("Payment processing failed");
          toast.error("Payment processing failed");
        }
      } catch (err: any) {
        onPaymentError(err.message || "An unexpected error occurred");
        toast.error(err.message || "An unexpected error occurred");
      } finally {
        setIsProcessing(false);
      }
    };

    useImperativeHandle(ref, () => ({ submitPayment }));

    return (
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <PaymentElement
            onLoadError={(err) => {
              console.error("Stripe Element Load Error:", err);
              onPaymentError("Failed to load payment form.");
            }}
            options={{ layout: "tabs" }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing || disabled}
          className="w-full bg-[#D4AF37] text-white py-4 px-4 rounded-xl font-bold text-base hover:bg-[#C4A12F] active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg shadow-[#D4AF37]/20 uppercase tracking-wider"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay ${total.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
          )}
        </button>
      </div>
    );
  }
);

export default CheckoutForm;
