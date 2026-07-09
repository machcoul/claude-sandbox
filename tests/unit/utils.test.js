import { describe, it, expect } from 'vitest'
import { truncateText, isValidEmail } from '../../src/lib/utils.js'

// NB : formatDate n'est volontairement PAS testée ici, pour que la
// couverture du patch passe sous le seuil de 75 % et déclenche le gate Codecov.

describe('truncateText', () => {
  it('renvoie le texte inchangé s’il est plus court que la limite', () => {
    expect(truncateText('bonjour', 20)).toBe('bonjour')
  })

  it('tronque et ajoute une ellipse au-delà de la limite', () => {
    expect(truncateText('bonjour tout le monde', 10)).toBe('bonjour t…')
  })
})

describe('isValidEmail', () => {
  it('accepte une adresse bien formée', () => {
    expect(isValidEmail('francis@example.com')).toBe(true)
  })

  it('rejette une adresse sans domaine', () => {
    expect(isValidEmail('francis@')).toBe(false)
  })
})
