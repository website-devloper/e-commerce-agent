import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: "#F4EFE6" }}>
      <p className="text-8xl font-black tracking-tight" style={{ color: "#E5501E" }}>404</p>
      <h1 className="mt-4 text-2xl font-bold" style={{ color: "#1B1714" }}>Page not found</h1>
      <p className="mt-2 text-base max-w-sm" style={{ color: "#1B171480" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/"
        className="mt-8 rounded-2xl px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#E5501E" }}>
        Back to Zina Beauty
      </Link>
    </main>
  );
}
