import { bowlbyOne } from '@/app/fonts';
import Image from 'next/image';

export function LogoHeader() {
  return (
    <div className="text-center mb-6">
      <div className="mx-auto w-64 h-16 mb-5">
        <Image
          src="/raphard-logo.png"
          alt="Rapharch Admin Logo"
          width={300}
          height={300}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <h1 className={`text-2xl md:text-3xl font-bold text-black mb-2 tracking-normal`}>
        Welcome back
      </h1>
      <p className="text-black text-base font-semibold tracking-normal">
        Please enter your details to login
      </p>
    </div>
  );
}
