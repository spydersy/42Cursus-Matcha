import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { to: "/browse", label: "Browse" },
  { to: "/search", label: "Search" },
  { to: "/chat", label: "Chat" },
  { to: "/profile", label: "Profile" },
] as const;

/**
 * App shell — header / main / footer on every page (subject requirement).
 * Auth-aware nav (login/logout, notification bell) added by T6/T20.
 */
export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="text-xl font-bold text-rose-600">
              🍵 Matcha
            </NavLink>

            {user && (
              <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-600">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      isActive
                        ? "text-rose-600 font-semibold"
                        : "transition-colors hover:text-rose-600"
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs font-medium text-gray-600">
                  Hi, <span className="font-semibold text-gray-900">{user.first_name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-rose-600"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:text-rose-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile secondary nav row if logged in */}
        {user && (
          <div className="flex sm:hidden border-t border-gray-100 px-4 py-2 justify-around text-xs font-medium text-gray-600">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-600 font-semibold"
                    : "transition-colors hover:text-rose-600"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <p className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-gray-500">
          🍵 Matcha — a 42 project by Spyder &amp; Weirdo
        </p>
      </footer>
    </div>
  );
}
