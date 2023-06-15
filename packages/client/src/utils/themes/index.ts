/*
 * © 2021 Thoughtworks, Inc.
 */

import { CSSProperties } from 'react'
import {
  createTheme as createMuiTheme,
  Theme,
  ThemeOptions,
} from '@material-ui/core/styles'
import { Palette, PaletteOptions } from '@material-ui/core/styles/createPalette'

export type CCFPaletteAdditions = {
  chart: Palette['primary'][]
  primaryBlue: CSSProperties['color']
  lightBlue: CSSProperties['color']
  lightTitle: CSSProperties['color']
  lightMessage: CSSProperties['color']
  extLink: CSSProperties['color']
}

export type CCFOptionsPaletteAdditions = {
  chart: PaletteOptions['primary'][]
  primaryBlue: CSSProperties['color']
  lightBlue: CSSProperties['color']
  lightTitle: CSSProperties['color']
  lightMessage: CSSProperties['color']
  extLink: CSSProperties['color']
}

export type CCFPalette = Palette & CCFPaletteAdditions

export type CCFPaletteOptions = PaletteOptions & CCFOptionsPaletteAdditions

export interface CCFTheme extends Theme {
  palette: CCFPalette
}

export interface CCFThemeOptions extends ThemeOptions {
  palette: CCFPaletteOptions
}

export type SimpleThemeOptions = {
  palette: CCFPaletteOptions
}

export function createThemeOptions(options: CCFThemeOptions): CCFThemeOptions {
  const { palette } = options

  return { palette }
}

const defaultTheme = () => {
  return createTheme({
    palette: {
      type: 'light',
      background: {
        default: '#F7F8F8',
      },
      primary: {
        main: '#EC6559',
      },
      secondary: {
        main: '#566C80',
      },
      chart: [
        // primary
        { main: '#E62314' },
        { main: '#6D797F' },
        { main: '#566C80' },
        { main: '#66A8C3' },
        { main: '#F7BDB8' },
        { main: '#D3C661' },
        { main: '#B01B10' },
        { main: '#70ADA3' },
        { main: '#5D8F79' },
        { main: '#FAD3D0' },
        // secondary
        { main: '#5F696E' },
        { main: '#8796BE' },
        { main: '#66A8C3' },
        { main: '#8796BE' },
        { main: '#CBABAE' },
        { main: '#9A9985' },
        { main: '#BF7474' },
      ],
      primaryBlue: '#566C80',
      lightBlue: 'rgba(63, 81, 181, 0.08)',
      lightTitle: 'rgba(0, 0, 0, 0.87)',
      lightMessage: '#b0bec5',
      // leaving this here in case the color theme changes base on dark mode
      extLink: '#66A8C3',
    },
  })
}

const darkTheme = () => {
  return createTheme({
    palette: {
      type: 'dark',
      background: {
        default: '#303030',
      },
      primary: {
        main: '#FF6E00',
      },
      secondary: {
        main: '#90CAF9',
      },
      chart: [
        // primary
        { main: '#FF6E00' },
        { main: '#FFC107' },
        { main: '#90CAF9' },
        { main: '#9C27B0' },
        { main: '#F06292' },
        { main: '#4CAF50' },
        { main: '#607D8B' },
        { main: '#FF4081' },
        { main: '#8D6E63' },
        { main: '#FF5252' },
        // secondary
        { main: '#FF9800' },
        { main: '#FFEB3B' },
        { main: '#2196F3' },
        { main: '#673AB7' },
        { main: '#E91E63' },
        { main: '#8BC34A' },
        { main: '#9E9E9E' },
      ],
      primaryBlue: '#90CAF9',
      lightBlue: 'rgba(63, 81, 181, 0.08)',
      lightTitle: '#FFFFFF',
      lightMessage: '#90A4AE',
      extLink: '#2196F3',
    },
  })
}


export function createTheme(options: SimpleThemeOptions): CCFTheme {
  const themeOptions = createThemeOptions(options)
  const baseTheme = createMuiTheme(themeOptions) as CCFTheme
  const theme = { ...baseTheme }
  return theme
}

const getChartColors = (theme: CCFTheme) => {
  return theme.palette.chart.map(({ main }) => main)
}

export { defaultTheme, darkTheme, getChartColors }
