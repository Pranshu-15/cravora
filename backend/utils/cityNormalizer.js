// City alias normalization — maps common alternate names to their canonical form.
// This handles cases where the geocoding API returns a different name than what
// the user typed when creating their shop (e.g. "Gurgaon" vs "Gurugram").
const CITY_ALIASES = {
    "gurgaon":   "gurugram",
    "gurugram":  "gurugram",
    "bengaluru": "bangalore",
    "bangalore": "bangalore",
    "bombay":    "mumbai",
    "mumbai":    "mumbai",
    "calcutta":  "kolkata",
    "kolkata":   "kolkata",
    "madras":    "chennai",
    "chennai":   "chennai",
    "new delhi": "delhi",
    "delhi":     "delhi",
    "noida":     "noida",
    "faridabad": "faridabad",
    "ghaziabad": "ghaziabad",
    "hyderabad": "hyderabad",
    "pune":      "pune",
    "ahmedabad": "ahmedabad",
    "surat":     "surat",
    "jaipur":    "jaipur",
    "lucknow":   "lucknow",
    "chandigarh":"chandigarh",
}

/**
 * Normalizes a city name to its canonical form using the alias map.
 * Returns the canonical name if a mapping exists, otherwise returns the original (lowercased).
 */
export function normalizeCity(city = "") {
    const lower = city.trim().toLowerCase()
    return CITY_ALIASES[lower] || lower
}

/**
 * Returns a MongoDB regex query that matches all known aliases of a city.
 * e.g. for "gurgaon" it matches both "Gurgaon" and "Gurugram" in the DB.
 */
export function cityQuery(city = "") {
    const canonical = normalizeCity(city)
    // Collect all alias keys that map to this canonical value
    const variants = Object.entries(CITY_ALIASES)
        .filter(([, v]) => v === canonical)
        .map(([k]) => k)

    // Also add the city as typed, in case it's not in the alias map
    const allVariants = [...new Set([city.trim(), ...variants, canonical])]
    const pattern = allVariants.map(v => `(^${v}$)`).join("|")
    return { $regex: new RegExp(pattern, "i") }
}
