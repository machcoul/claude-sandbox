// Petites fonctions utilitaires réutilisables côté UI.

/**
 * Tronque un texte à `maxLength` caractères, en ajoutant une ellipse « … »
 * si le texte est plus long. Utile pour les aperçus de messages.
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength - 1).trimEnd() + '…'
}

/**
 * Validation simple d'une adresse e-mail (présence d'un local, d'un domaine
 * et d'une extension). Suffisant pour un garde-fou de formulaire côté client.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Formate une date ISO en `JJ/MM/AAAA à HH:MM` (format lisible FR).
 * Renvoie une chaîne vide si la date est invalide.
 * NB : volontairement laissé SANS test pour la démo du gate de couverture.
 */
export function formatDate(isoString) {
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) {
    return ''
  }
  const jour = String(d.getDate()).padStart(2, '0')
  const mois = String(d.getMonth() + 1).padStart(2, '0')
  const annee = d.getFullYear()
  const heures = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${jour}/${mois}/${annee} à ${heures}:${minutes}`
}
