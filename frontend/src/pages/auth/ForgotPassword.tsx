import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { apiPost, ApiRequestError } from "../../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost<{ message: string }>("/api/auth/forgot-password", {
        email: email.trim(),
      });
      setSuccessMessage(
        res.message ||
          "If an account exists with that email, a password reset link has been sent."
      );
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Failed to send reset link. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
              <p className="font-semibold mb-1">Email Sent!</p>
              <p>{successMessage}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 border border-gray-100">
              💡 <strong>In local development:</strong> Open{" "}
              <a
                href="http://localhost:8025"
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 underline font-semibold"
              >
                Mailpit (localhost:8025)
              </a>{" "}
              to access your password reset link.
            </div>
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                placeholder="user@example.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>

            <div className="mt-4 text-center text-xs text-gray-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-rose-600 hover:text-rose-700 hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
