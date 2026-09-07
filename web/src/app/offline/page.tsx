import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center bg-white">
      <div className="max-w-sm">
        <div className="mb-10 animate-float">
          <svg className="mx-auto h-14 w-14 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 0 1 0 12.728m-2.829-2.829a5 5 0 0 1 0-7.07m-4.243 4.243a1 1 0 0 1 0-1.414M3 3l18 18" />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-medium tracking-wide text-neutral-900 animate-fade-in-up">
          No connection
        </h1>

        <p className="mb-10 text-sm leading-relaxed text-neutral-400 animate-fade-in-up-delay">
          You&apos;re offline. Check your connection and try again — previously viewed pages are still accessible.
        </p>

        <div className="animate-fade-in-up-delay-2">
          <Link
            href="/"
            className="inline-block rounded-full border border-neutral-200 px-7 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
