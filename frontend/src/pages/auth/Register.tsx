import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { ApiRequestError } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordChecks = {
    length: formData.password.length >= 8,
    lowercase: /[a-z]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    digit: /\d/.test(formData.password),
    special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(formData.password),
    matches:
      formData.password.length > 0 &&
      formData.password === formData.confirmPassword,
  };

  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.lowercase &&
    passwordChecks.uppercase &&
    passwordChecks.digit &&
    passwordChecks.special;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.password
    ) {
      setError("All fields are required.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please ensure your password meets all security criteria.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const msg = await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        password: formData.password,
      });
      setSuccessMessage(
        msg ||
          "Registration successful! Please check your email to activate your account."
      );
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✉️
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {successMessage}
          </p>
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 border border-gray-100">
            💡 <strong>In local development:</strong> Open{" "}
            <a
              href="http://localhost:8025"
              target="_blank"
              rel="noreferrer"
              className="text-rose-600 underline font-semibold"
            >
              Mailpit Inbox (localhost:8025)
            </a>{" "}
            to click the verification link.
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-block w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Join Matcha and discover meaningful connections
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                placeholder="Jane"
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="e.g. matcha_star"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="user@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
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
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {/* Password Security Criteria checklist */}
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
                <span>Uppercase letter (A-Z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  passwordChecks.lowercase ? "text-emerald-600 font-medium" : "text-gray-400"
                }`}
              >
                <span>{passwordChecks.lowercase ? "✓" : "○"}</span>
                <span>Lowercase letter (a-z)</span>
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
                <span>Special character (!@#$)</span>
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-rose-600 hover:text-rose-700 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
