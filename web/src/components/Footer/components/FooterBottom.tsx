import { LegalLinks } from './LegalLinks';
import { PaymentIcons } from './PaymentIcons';

const CURRENT_YEAR = new Date().getFullYear();

export function FooterBottom() {
  return (
    <div>
      <div className="flex flex-col items-center gap-1 sm:gap-2 pt-10">
        <p className="text-xs sm:text-sm md:text-base text-zinc-600 text-center w-full">
          &copy; {CURRENT_YEAR} RaphArch. All rights reserved.
        </p>

        <div className="w-full">
          <LegalLinks />
        </div>
      </div>

      <div className="mt-4 flex justify-start md:justify-center">
        <PaymentIcons />
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-zinc-600">
          <span>Australian Dollar (AUD $)</span>
          <span>·</span>
          <span>English</span>
        </div>
      </div>
    </div>
  );
}
