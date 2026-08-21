import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { apiPost, ApiRequestError } from "../../api/client";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [resendEmail, setResendEmail] = useState<string>("");
  const [resending, setResending] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage("Verification token is missing from the URL.");
      return;
    }

    let isMounted = true;

    const verify = async () => {
      try {
        const res = await apiPost<{ message: string }>("/api/auth/verify-email", {
          token,
        });
        if (isMounted) {
          setSuccess(true);
          setMessage(res.message || "Email verified successfully!");
        }
      } catch (err) {
        if (isMounted) {
          setSuccess(false);
          if (err instanceof ApiRequestError) {
            setMessage(err.message);
          } else {
            setMessage("Failed to verify email. The link may have expired.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResending(true);
    setResendMessage(null);
    try {
      const res = await apiPost<{ message: string }>("/api/auth/resend-verification", {
        email: resendEmail.trim(),
      });
      setResendMessage(res.message);
    } catch {
      setResendMessage("Failed to send verification link. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
          <p className="mt-4 font-medium text-gray-700">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
        {success ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              ✓
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Email Verified!
            </h1>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {message}
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-block w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
              >
                Sign In to Your Account
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-2xl text-rose-600">
              ✕
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Verification Failed
            </h1>
            <p className="mt-2 text-sm text-rose-600">{message}</p>

            <div className="mt-6 rounded-lg bg-gray-50 p-4 border border-gray-100 text-left">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Need a new verification link?
              </h3>
              {resendMessage && (
                <p className="text-xs text-emerald-700 font-medium mb-3">
                  {resendMessage}
                </p>
              )}
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-xs shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  disabled={resending}
                  className="w-full rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-900 disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend Verification Email"}
                </button>
              </form>
            </div>

            <div className="mt-4">
              <Link
                to="/login"
                className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
              >
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
