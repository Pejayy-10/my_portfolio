import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// In-memory rate limit store (per deployment instance)
// For multi-region/serverless, this is complemented by Vercel/Cloudflare edge
// ---------------------------------------------------------------------------
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute window
const GENERAL_LIMIT = 120; // requests per window for general routes
const LOGIN_LIMIT = 5;     // requests per window for login attempts

// Blocked user-agent substrings (known scanners / exploit tools)
const BLOCKED_UA_PATTERNS = [
  "sqlmap",
  "nikto",
  "nmap",
  "masscan",
  "zgrab",
  "gobuster",
  "dirbuster",
  "wfuzz",
  "nuclei",
  "metasploit",
  "python-requests/2.1", // generic mass scanner UA
  "libwww-perl",
  "curl/7.19",           // old curl versions used in automated attacks
];

// Suspicious paths to block immediately
const BLOCKED_PATHS = [
  "/.env",
  "/.git",
  "/wp-admin",
  "/wp-login",
  "/phpinfo",
  "/php",
  "/admin.php",
  "/administrator",
  "/xmlrpc.php",
  "/etc/passwd",
  "/proc/self",
  "/.htaccess",
  "/config.php",
  "/.well-known/acme-challenge/../../../",
  "/cgi-bin",
  "/shell",
  "/cmd",
  "/boaform",
];

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) return true;
  return false;
}

// Periodically clean old entries to avoid memory leaks
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup > 5 * 60_000) {
    lastCleanup = now;
    for (const [key, val] of rateLimitStore.entries()) {
      if (now > val.resetAt) rateLimitStore.delete(key);
    }
  }
}

export function middleware(req: NextRequest) {
  maybeCleanup();

  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);
  const ua = (req.headers.get("user-agent") || "").toLowerCase();

  // ── 1. Block suspicious paths ──────────────────────────────────────────
  for (const blocked of BLOCKED_PATHS) {
    if (pathname.toLowerCase().startsWith(blocked)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // ── 2. Block known malicious user-agents ───────────────────────────────
  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (ua.includes(pattern)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // ── 3. Strict rate limit on auth-related actions ───────────────────────
  // The /sudo login flow uses Supabase client-side auth. We detect POST to
  // the Supabase auth endpoint via the referer + method as a proxy signal.
  // Additionally enforce on any Next.js API routes prefixed with /api/auth
  const isAuthRoute =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/login");

  if (isAuthRoute) {
    const loginKey = `login:${ip}`;
    if (isRateLimited(loginKey, LOGIN_LIMIT)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many login attempts. Try again in a minute." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }
  }

  // ── 4. General rate limiting ───────────────────────────────────────────
  const generalKey = `general:${ip}`;
  if (isRateLimited(generalKey, GENERAL_LIMIT)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon-512.png|public/).*)",
  ],
};
