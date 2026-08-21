import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-rose-600">404</p>
      <p className="text-gray-600">This page doesn&apos;t exist — much like your ex&apos;s feelings.</p>
      <Link
        to="/"
        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
      >
        Back to home
      </Link>
    </section>
  );
}
