// Utilities for resolving and formatting user display details (name, avatar, initials)
// across Supabase Auth metadata, local database user record, and email fallback.

export interface UserLike {
  id?: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
    [key: string]: any;
  } | null;
}

/**
 * Returns a human-friendly display name for the user.
 * Priority:
 * 1. user.user_metadata.display_name
 * 2. user.user_metadata.full_name
 * 3. user.user_metadata.name
 * 4. user.name (from database)
 * 5. Intelligent email fallback (e.g. "samama.karim" -> "Samama Karim")
 * 6. "Member" as a warm fallback
 */
export function getUserDisplayName(user?: UserLike | null): string {
  if (!user) return "";

  // 1. Supabase metadata display_name
  if (user.user_metadata?.display_name?.trim()) {
    return user.user_metadata.display_name.trim();
  }

  // 2. Supabase metadata full_name
  if (user.user_metadata?.full_name?.trim()) {
    return user.user_metadata.full_name.trim();
  }

  // 3. Supabase metadata name (often provided by Google OAuth)
  if (user.user_metadata?.name?.trim()) {
    return user.user_metadata.name.trim();
  }

  // 4. Prisma DB user name
  if (user.name?.trim()) {
    return user.name.trim();
  }

  // 5. Intelligent email fallback
  if (user.email && user.email.includes("@")) {
    const rawPrefix = user.email.split("@")[0].trim();
    if (rawPrefix) {
      // Split on dots, underscores, dashes, plus signs
      const segments = rawPrefix
        .replace(/[._\-+]/g, " ")
        .replace(/\d+/g, "") // remove trailing or embedded numbers for cleaner names
        .trim();

      if (segments.length > 0) {
        return segments
          .split(/\s+/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(" ");
      }

      // If removing digits emptied the string (e.g. "12345"), return capitalized raw prefix
      return rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);
    }
  }

  return "Member";
}

/**
 * Returns the best available avatar URL.
 */
export function getUserAvatarUrl(user?: UserLike | null): string | null {
  if (!user) return null;

  return (
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.avatarUrl ||
    null
  );
}

/**
 * Returns 1 or 2 uppercase initials for avatar fallback.
 */
export function getUserInitials(user?: UserLike | null): string {
  const name = getUserDisplayName(user);
  if (!name) return "U";

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return name[0].toUpperCase();
}
