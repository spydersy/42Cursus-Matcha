/**
 * Shared API types contract (T4) — mirrors the backend JSON shapes.
 *
 * Conventions:
 * - All timestamps are ISO 8601 strings.
 * - `id` fields are UUID strings.
 * - `email` / `last_name` are NEVER exposed for other users (subject rule).
 * - Backend errors always use the `ApiError` envelope: {"error": "..."}.
 */

export type Gender = "male" | "female" | "other";

/** Default for every new account is "bisexual" (subject requirement). */
export type SexualPreference = "heterosexual" | "homosexual" | "bisexual";

/** The authenticated user — returned by /api/auth/me. */
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  verified: boolean;
  created_at: string;
}

export interface Picture {
  id: string;
  url: string;
  is_profile: boolean;
}

/** Own profile — the editable shape returned by GET /api/profile. */
export interface Profile {
  gender: Gender | null;
  sexual_preference: SexualPreference;
  bio: string;
  /** ISO date (YYYY-MM-DD); `age` is derived server-side. */
  birthdate: string | null;
  latitude: number | null;
  longitude: number | null;
  fame_rating: number;
  tags: string[];
  pictures: Picture[];
}

/** Compact card used in browse suggestions and search results. */
export interface ProfileCard {
  id: string;
  username: string;
  first_name: string;
  age: number | null;
  gender: Gender;
  bio: string;
  tags: string[];
  profile_picture: string | null;
  fame_rating: number;
  /** Distance from the viewer, null if either location is unknown. */
  distance_km: number | null;
  online: boolean;
}

/** Another user's full profile page — NO email/last_name (subject rule). */
export interface PublicProfile {
  id: string;
  username: string;
  first_name: string;
  gender: Gender;
  sexual_preference: SexualPreference;
  age: number | null;
  bio: string;
  tags: string[];
  pictures: Picture[];
  fame_rating: number;
  distance_km: number | null;
  online: boolean;
  /** ISO timestamp — only meaningful when `online` is false. */
  last_seen: string | null;
  /** Viewer-relative interaction state: */
  liked: boolean; // you like them
  liked_you: boolean; // they like you
  connected: boolean; // mutual like
}

export interface Tag {
  /** Lowercase, without the leading '#'. */
  name: string;
}

export interface Message {
  id: string;
  from_id: string;
  to_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

/** One row in the chat conversations list. */
export interface Conversation {
  user: {
    id: string;
    username: string;
    first_name: string;
    profile_picture: string | null;
    online: boolean;
  };
  last_message: Message | null;
  unread_count: number;
}

export type NotificationType = "like" | "unlike" | "view" | "message" | "match";

export interface Notification {
  id: string;
  type: NotificationType;
  from_user: {
    id: string;
    username: string;
    profile_picture: string | null;
  };
  read: boolean;
  created_at: string;
}

/** Every backend error response uses this envelope. */
export interface ApiError {
  error: string;
  unverified?: boolean;
  email?: string;
}

/** Payload for POST /api/auth/register */
export interface RegisterPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

/** Payload for POST /api/auth/login */
export interface LoginPayload {
  username: string;
  password: string;
}

/** Response from POST /api/auth/login and GET /api/auth/me */
export interface AuthUserResponse {
  user: User;
}

/** Generic success message response */
export interface ApiMessageResponse {
  message: string;
}

/** GET /api/health */
export interface HealthStatus {
  status: "ok" | "degraded";
  neo4j: "up" | "down";
}
