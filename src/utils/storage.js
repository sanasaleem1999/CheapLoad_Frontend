// Safe localStorage helpers.
// Guards against the literal string "undefined"/"null" being stored,
// which would otherwise throw `SyntaxError: "undefined" is not valid JSON`.
export const safeParse = (value) => {
    if (!value || value === "undefined" || value === "null") return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

// Read and parse the stored user object (or null).
export const getStoredUser = () => {
    if (typeof window === "undefined") return null;
    return safeParse(localStorage.getItem("user"));
};
