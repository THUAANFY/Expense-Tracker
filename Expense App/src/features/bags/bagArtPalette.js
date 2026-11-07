import { getBagColor } from './bags'
import { getDarkBagVisual } from './bagVisuals'

// Recolor the original illustration without changing its paths or structure.
const darkFills = {
  '#f8f8e9': '#2d3b53',
  '#fffcf1': '#2d3b53',
  '#fffdf1': '#2d3b53',
  '#fff9e8': '#3e3c59',
  '#fff9e9': '#2d3b53',
  '#fff9ef': '#3e3c59',
  '#fffdf6': '#c2cce5',
  '#fffdf7': '#2d3b53',
  '#fffaf0': '#2d3b53',
  '#fffef8': '#d4e9e4',
  '#f6e4ed': '#594663',
  '#f8f1e9': '#4b4462',
  '#f6f1fb': '#4b5673',
  '#d9d7ee': '#263e59',
  '#cabbdc': '#657590',
  '#e4ad91': '#e2a2b0',
  '#f3d887': '#e5b989',
  '#bad0a0': '#77ac93',
  '#bdd3a7': '#76b399',
  '#c3d6af': '#88bba0',
  '#eac2d0': '#ae719d',
  '#dfadc0': '#c487b5',
  '#e3adbf': '#c285b2',
  '#f3d4df': '#d7abce',
  '#e8b2bf': '#e29dc4',
  '#e9c6ad': '#728ca1',
  '#f2d8c2': '#9bb4c2',
  '#e2c7a5': '#8da3b7',
  '#bba184': '#42546c',
  '#f6e0a4': '#b99bdc',
}
const darkStrokes = {
  '#a8b48b': '#8fbeab',
  '#cad3b3': '#5e8c82',
  '#b4c898': '#78ad98',
  '#8da675': '#a6cfb4',
  '#b9856b': '#ddb0cd',
  '#c3ad85': '#92aacb',
  '#cbb58f': '#92aacb',
  '#b9a078': '#aac0db',
  '#baa67f': '#9bb6d6',
  '#d3c29c': '#83a2c4',
  '#c8b58e': '#a395bf',
  '#c49db1': '#e0b4d3',
  '#d8bac9': '#b68cae',
  '#b78ca0': '#e0b4d3',
  '#b68298': '#e0b4d3',
  '#b78596': '#e0b4d3',
  '#b8a4bc': '#b8a2cf',
  '#d0bdd9': '#83769f',
  '#d3c1dd': '#83769f',
  '#b8a17c': '#a5b6d0',
  '#839c6d': '#a2ceb4',
  '#8b9f77': '#a2ceb4',
  '#dce9c6': '#d6edd7',
  '#b48c70': '#b4c8d1',
  '#9b86b3': '#b8a6df',
  '#f9f7ff': '#a6c8e4',
  '#f8f5fe': '#c0d4ef',
  '#baa06b': '#967cc0',
}

export function getBagArtPalette(variant, color, theme) {
  const original = getBagColor(color)
  if (theme !== 'dark') return { ...original, detail: (value) => value }
  const tone = getDarkBagVisual(variant, color)
  return {
    ...original,
    paper: tone.fold,
    body: tone.side,
    ink: tone.edge,
    detail: (value, attribute) => {
      if (attribute === 'fill') return darkFills[value] || value
      if (value.startsWith('#fff')) return '#d0dcef'
      return darkStrokes[value] || value
    },
  }
}
