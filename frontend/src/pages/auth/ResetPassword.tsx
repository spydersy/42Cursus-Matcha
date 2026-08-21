import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { apiPost, ApiRequestError } from "../../api/client";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password),
    matches: password.length > 0 && password === confirmPassword,
  };

  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.lowercase &&
    passwordChecks.uppercase &&
    passwordChecks.digit &&
    passwordChecks.special;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing from the link.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please ensure your new password meets all security criteria.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await apiPost("/api/auth/reset-password", {
        token,
        password,
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Failed to reset password. The link may have expired.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xl font-bold">
            !
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Invalid Reset Link
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This password reset link is missing a valid token or has expired.
          </p>
          <div className="mt-6">
            <Link
              to="/forgot-password"
              className="inline-block w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              Request a New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Password Reset Complete!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been successfully updated. You can now sign in with
            your new password.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-block w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose a strong, unique password for your account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {/* Password criteria checklist */}
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-200">
            <p className="font-semibold text-gray-700 mb-1.5">
              Password requirements:
            </p>
            <div className="grid grid-cols-2 gap-1">
              <div
                className={`flex items-center gap-1.5 ${
                  passwordChecks.length ? "text-emerald-600 font-medium" : "text-gray-400"
                }`}
              >
                <span>{passwordChecks.length ? "✓" : "○"}</span>
                <span>At least 8 characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  passwordChecks.uppercase ? "text-emerald-600 font-medium" : "text-gray-400"
                }`}
              >
                <span>{passwordChecks.uppercase ? "✓" : "○"}</span>
                <span>Uppercase letter</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  passwordChecks.lowercase ? "text-emerald-600 font-medium" : "text-gray-400"
                }`}
              >
                <span>{passwordChecks.lowercase ? "✓" : "○"}</span>
                <span>Lowercase letter</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  passwordChecks.digit ? "text-emerald-600 font-medium" : "text-gray-400"
                }`}
              >
                <span>{passwordChecks.digit ? "✓" : "○"}</span>
                <span>At least one number</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  passwordChecks.special ? "text-emerald-600 font-medium" : "text-gray-400"
                }`}
              >
                <span>{passwordChecks.special ? "✓" : "○"}</span>
                <span>Special character</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  passwordChecks.matches ? "text-emerald-600 font-medium" : "text-gray-400"
                }`}
              >
                <span>{passwordChecks.matches ? "✓" : "○"}</span>
                <span>Passwords match</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Resetting password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
