/*
 * © 2021 Thoughtworks, Inc.
 */

import { CSSProperties } from "react";
import {
  createTheme as createMuiTheme,
  Theme,
  ThemeOptions,
} from "@material-ui/core/styles";
import {
  Palette,
  PaletteOptions,
} from "@material-ui/core/styles/createPalette";

export type CCFPaletteAdditions = {
  chart: Palette["primary"][];
  primaryBlue: CSSProperties["color"];
  lightBlue: CSSProperties["color"];
  lightTitle: "rgba(255,255,255,0.87)";
  lightMessage: "#ffffff";
  extLink: CSSProperties["color"];
};

export type CCFOptionsPaletteAdditions = {
  chart: PaletteOptions["primary"][];
  primaryBlue: CSSProperties["color"];
  lightBlue: CSSProperties["color"];
  lightTitle: "rgba(255,255,255,0.87)";
  lightMessage: "#ffffff";
  extLink: CSSProperties["color"];
};

export type CCFPalette = Palette & CCFPaletteAdditions;

export type CCFPaletteOptions = PaletteOptions & CCFOptionsPaletteAdditions;

export interface CCFTheme extends Theme {
  palette: CCFPalette;
}

export interface CCFThemeOptions extends ThemeOptions {
  palette: CCFPaletteOptions;
}

export type SimpleThemeOptions = {
  palette: CCFPaletteOptions;
};

export function createThemeOptions(options: CCFThemeOptions): CCFThemeOptions {
  const { palette } = options;

  return { palette };
}

const defaultTheme = () => {
  return createTheme({
    palette: {
      type: "light",
      background: {
        paper: "#282828",
        default: "#121212",
      },
      primary: {
        main: "#BB86FC",
        light: "#ffffff",
      },
      secondary: {
        main: "#03DAC6",
      },
      chart: [
        // primary
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        { main: "#BB86FC" },
        // secondary
        { main: "#03DAC6" },
        { main: "#03DAC6" },
        { main: "#03DAC6" },
        { main: "#03DAC6" },
        { main: "#03DAC6" },
        { main: "#03DAC6" },
        { main: "#03DAC6" },
      ],
      primaryBlue: "#03DAC6",
      lightBlue: "rgba(181,181,181,0.08)",
      lightTitle: "rgba(255,255,255,0.87)",
      lightMessage: "#ffffff",
      // leaving this here in case the color theme changes base on dark mode
      extLink: "#66A8C3",
    },
  });
};

export function createTheme(options: SimpleThemeOptions): CCFTheme {
  const themeOptions = createThemeOptions(options);
  const baseTheme = createMuiTheme(themeOptions) as CCFTheme;
  const theme = { ...baseTheme };
  return theme;
}

const getChartColors = (theme: CCFTheme) => {
  return theme.palette.chart.map(({ main }) => main);
};

export { defaultTheme, getChartColors };
