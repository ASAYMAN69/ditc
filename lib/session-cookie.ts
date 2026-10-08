// Single source for the session cookie name/age. Import-leaf: no other
// imports allowed here so middleware (edge-safe) can use it.
export const SESSION_COOKIE = "ditc_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
