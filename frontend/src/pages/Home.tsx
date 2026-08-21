import { useEffect, useState } from "react";

import { ApiRequestError, apiGet } from "../api/client";
import type { HealthStatus } from "../api/types";

/** Landing page — also serves as the M0 smoke test (API + DB reachability). */
export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<HealthStatus>("/api/health")
      .then(setHealth)
      .catch((err: unknown) =>
        setError(err instanceof ApiRequestError ? err.message : "Unknown error"),
      );
  }, []);

  return (
    <section className="flex flex-col items-center gap-6 py-12 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">
        Because love, too, can be <span className="text-rose-600">industrialized</span>.
      </h1>
      <p className="max-w-prose text-gray-600">
        Register, complete your profile, browse matches, like, and chat — in real time.
      </p>

      <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 text-sm shadow-sm">
        <span className="font-medium text-gray-500">Backend status: </span>
        {error && <span className="font-semibold text-red-600">{error}</span>}
        {!error && !health && <span className="text-gray-400">checking…</span>}
        {health && (
          <span
            className={
              health.status === "ok"
                ? "font-semibold text-green-600"
                : "font-semibold text-amber-600"
            }
          >
            API {health.status} · Neo4j {health.neo4j}
          </span>
        )}
      </div>
    </section>
  );
}
