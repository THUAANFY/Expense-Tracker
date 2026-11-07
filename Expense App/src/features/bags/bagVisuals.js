const tones = {
  lilac: { edge: '#ebd9ff', face: '#bb89ff', fold: '#bd8bff', side: '#7041be' },
  peach: { edge: '#ffe0d0', face: '#ffac96', fold: '#ffa186', side: '#cf5b70' },
  mint: { edge: '#cefff0', face: '#62efc0', fold: '#4de2b0', side: '#14836e' },
  butter: { edge: '#fff5c5', face: '#ffe079', fold: '#ffe181', side: '#b88125' },
}
const accents = { trip: '#78b7ff', gift: '#ef92d6', home: '#75dec0', tech: '#7ad9ee' }

export function getDarkBagVisual(style, color) {
  return { ...(tones[color] || tones.lilac), accent: accents[style] || accents.trip }
}
