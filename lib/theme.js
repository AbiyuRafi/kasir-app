"use client";

import { createContext, useContext } from "react";

export const THEMES = {
  gold: {
    label: "Gold Elegan",
    swatch: "#C9A227",
    ink: "#1D2B33",
    inkSoft: "#28363F",
    primary: "#C9A227",
    primaryDark: "#9C7D1D",
    primaryBg: "#FBF6E7",
    gradA: "rgba(201,162,39,.22)",
    gradB: "rgba(59,111,160,.20)",
  },
  blue: {
    label: "Biru Modern",
    swatch: "#2F6FED",
    ink: "#101828",
    inkSoft: "#1B2537",
    primary: "#2F6FED",
    primaryDark: "#1E54C4",
    primaryBg: "#EAF1FE",
    gradA: "rgba(47,111,237,.22)",
    gradB: "rgba(16,185,129,.16)",
  },
  emerald: {
    label: "Hijau Emerald",
    swatch: "#12A570",
    ink: "#0E2A22",
    inkSoft: "#163A30",
    primary: "#12A570",
    primaryDark: "#0C8058",
    primaryBg: "#E7F8F1",
    gradA: "rgba(18,165,112,.22)",
    gradB: "rgba(201,162,39,.16)",
  },
  sunrise: {
    label: "Kuning Tosca",
    swatch: "linear-gradient(135deg, #FFC93C 50%, #0FA8A0 50%)",
    ink: "#0B3B39",
    inkSoft: "#124E4A",
    primary: "#FFC93C",
    primaryDark: "#E0A80F",
    primaryBg: "#FFF6DE",
    secondary: "#0FA8A0",
    secondaryDark: "#0B857F",
    secondaryBg: "#E1F7F5",
    gradA: "rgba(255,201,60,.24)",
    gradB: "rgba(15,168,160,.20)",
  },
};

export const NEUTRAL = {
  paper: "#FAF9F6",
  panel: "#FFFFFF",
  green: "#3F7D58",
  greenBg: "#E7F1EA",
  red: "#C4432B",
  redBg: "#FBEAE5",
  line: "#E5E1D8",
  text: "#26251F",
  textMuted: "#7A776D",
};

export const ThemeCtx = createContext(THEMES.gold);
export const useTheme = () => useContext(ThemeCtx);
