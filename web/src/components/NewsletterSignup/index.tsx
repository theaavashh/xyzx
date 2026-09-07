"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    // Handle newsletter subscription here
    console.log("Subscribe:", email);
  };

  return (
    <section className="w-full bg-white px-5 py-10 text-[#071a2b] sm:px-8 md:px-10 lg:px-[18px] lg:py-9">
      <div className="w-full">
        {/* Heading */}
        <h2 className="text-[28px] font-normal leading-[1.15] tracking-[-0.03em] sm:text-[32px] md:text-[36px]">
          The One{" "}
          <span className="font-serif italic">Worth</span>{" "}
          Opening.
        </h2>

        {/* Content */}
        <div className="mt-9 sm:mt-10 md:mt-11">
          <h3 className="text-[16px] font-bold leading-none tracking-[-0.01em] sm:text-[17px]">
            STAY IN TOUCH
          </h3>

          <p className="mt-5 text-[16px] leading-[1.35] tracking-[-0.01em] sm:text-[17px]">
            Sign up and receive 15% off your first purchase.
            <br />
            Get early access to exclusive offers and promotions.
          </p>

          {/* Newsletter Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 w-full"
          >
            <div className="flex h-[53px] w-full items-center border border-[#071a2b]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL *"
                required
                aria-label="Your email"
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] font-medium tracking-[-0.01em] text-[#071a2b] outline-none placeholder:text-[#66717b] sm:px-3.5 sm:text-[13px]"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-full w-[52px] shrink-0 items-center justify-center transition-opacity hover:opacity-60"
              >
                <ArrowRight
                  size={25}
                  strokeWidth={1.4}
                />
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-2 h-px w-full bg-[#071a2b]" />

          {/* Terms */}
          <p className="mt-4 text-[14px] leading-[1.4] tracking-[-0.01em] sm:text-[15px]">
            By entering your email above, you agree to our{" "}
            <a
              href="/terms-of-service"
              className="underline underline-offset-2 hover:opacity-60"
            >
              terms of service
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              className="underline underline-offset-2 hover:opacity-60"
            >
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
