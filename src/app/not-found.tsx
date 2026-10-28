import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <h1 className="font-display text-6xl">404</h1>
        <p className="mt-4 text-muted">This page does not exist.</p>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center border border-white/60 px-6 text-sm">
          Back home
        </Link>
      </div>
    </main>
  );
}
