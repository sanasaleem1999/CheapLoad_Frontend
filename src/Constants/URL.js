// Single source of truth for backend origins.
// Values come from the .env files (see .env / .env.production / .env.example).
// Reminder: CRA inlines REACT_APP_* at build time, so re-run the build after edits.

const stripTrailingSlash = (value) => (value || "").replace(/\/+$/, "")

export const BASE_URL = stripTrailingSlash(process.env.REACT_APP_API_URL)
export const SOCKET_URL = stripTrailingSlash(process.env.REACT_APP_SOCKET_URL) || BASE_URL

if (!BASE_URL) {
  // eslint-disable-next-line no-console
  console.error(
    "REACT_APP_API_URL is not set. Create a .env file (see .env.example) and restart the dev server / rebuild."
  )
}

const URL = BASE_URL

// AUTH API'S
export const REGISTRATION=URL+"/api/auth/register"
export const LOGIN=URL+"/api/auth/login"
export const VERIFY_OTP=URL+"/api/auth/verify-otp"
export const GET_PROFILE=URL+"/api/auth/me"
export const VERIFY=URL+"/api/auth/verify"
export const UPDATE_PASSWORD=URL+"/api/auth/update-password"

// USER API'S
export const GET_USER_INFO=URL+"/users/"
export const GET_USER=URL+"/api/users"
// POST API'S
export const POSTS=URL+"/api/post"
export const ALL_POSTS=URL+"/api/post/all"
export const CHATS=URL+"/api/chats"

export const GET_CARRIER=URL+"/api/post/get-carriers"
export const ASSIGN_DISPATCH=URL+"/api/post/assign-dispatch"
export const REMOVE_ASSIGNMENT=URL+"/api/post/remove-assignment"
