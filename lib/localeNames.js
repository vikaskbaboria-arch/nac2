const languageNames = new Intl.DisplayNames(["en-US"], {
  type: "language",
});

const regionNames = new Intl.DisplayNames(["en-US"], {
  type: "region",
});

export function getLanguageName(code) {
  if (!code) return "N/A";

  try {
    return languageNames.of(code) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export function getCountryNames(codes) {
  if (!Array.isArray(codes) || codes.length === 0) return "N/A";

  return codes
    .map((code) => {
      try {
        return regionNames.of(code) || code.toUpperCase();
      } catch {
        return code.toUpperCase();
      }
    })
    .join(", ");
}