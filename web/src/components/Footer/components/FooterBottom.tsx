import { LegalLinks } from './LegalLinks';
import { PaymentIcons } from './PaymentIcons';

const CURRENT_YEAR = new Date().getFullYear();

export function FooterBottom() {
  return (
    <div>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-2 sm:gap-3 lg:gap-4 pt-10">
        <p className="text-sm sm:text-base md:text-md text-black text-center md:text-left w-full order-2 md:order-first">
          &copy; {CURRENT_YEAR} RaphArch. All rights reserved.
        </p>

        <div className="w-full order-1 md:order-none mt-4 sm:mt-6 md:mt-0">
          <LegalLinks />
        </div>

        <p className="text-sm sm:text-base md:text-md text-black md:text-right w-full text-center order-3 md:order-last">
          Website By: M.A.P Tech Pvt. Ltd.
        </p>
      </div>

      <div className="mt-6 sm:mt-8">
        <p className="text-sm sm:text-base text-black uppercase text-center mb-3">We accept</p>
        <PaymentIcons />
      </div>
    </div>
  );
}
