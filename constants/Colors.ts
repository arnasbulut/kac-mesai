export const colors = {
  light: {
    primary: "#2f95dc",
    text: "#000000",
    secondaryText: "#666666",
    background: "#f9f9f9",
    secondaryBackground: "#eeeeee",
    card: "#ffffff",
    border: "#e0e0e0",
    placeholder: "#aaaaaa",
    error: "#ff3b30",
    success: "#34c759",
    tint: "#2f95dc",
    tabIconDefault: "#cccccc",
    tabIconSelected: "#2f95dc",
  },
  dark: {
    primary: "#2f95dc",
    text: "#ffffff",
    secondaryText: "#aaaaaa",
    background: "#121212",
    secondaryBackground: "#1e1e1e",
    card: "#1c1c1e",
    border: "#2c2c2e",
    placeholder: "#666666",
    error: "#ff453a",
    success: "#30d158",
    tint: "#2f95dc",
    tabIconDefault: "#666666",
    tabIconSelected: "#2f95dc",
  },
};

export type ColorTheme = typeof colors.light;

export default colors as Record<NonNullable<ColorSchemeName>, ColorTheme>;
