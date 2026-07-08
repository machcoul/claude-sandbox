import { test, expect } from '@playwright/test'

// Parcours principal : ouvrir la page, saisir un nom + un message, cliquer sur
// « Signer », puis vérifier que le message apparaît dans la liste.
//
// CHOIX : on MOCKE les appels réseau Supabase (REST) via page.route().
// Voir e2e/README.md pour la justification détaillée.
test('un visiteur signe le livre d’or et voit son message apparaître', async ({ page }) => {
  // Base de données en mémoire, propre à ce test.
  const rows = []
  let nextId = 1

  // Intercepte tous les appels REST Supabase (aucun trafic réseau réel).
  await page.route('**/rest/v1/messages**', async (route) => {
    const request = route.request()
    const method = request.method()

    if (method === 'GET') {
      // select('*').order('created_at', { ascending: false })
      const sorted = [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at))
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sorted),
      })
    }

    if (method === 'POST') {
      // insert({ author, content })
      const payload = request.postDataJSON()
      const record = {
        id: nextId++,
        author: payload.author ?? null,
        content: payload.content,
        created_at: new Date().toISOString(),
      }
      rows.push(record)
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([record]),
      })
    }

    // Préflight CORS ou autre méthode : réponse neutre.
    return route.fulfill({ status: 204, body: '' })
  })

  await page.goto('/')

  // Au départ : état vide. (sous-texte sans apostrophe pour éviter les
  // ambiguïtés apostrophe droite ' vs typographique ’)
  await expect(page.getByText('Aucun message pour')).toBeVisible()

  // Saisie du nom et du message.
  await page.getByLabel('Nom').fill('Camille')
  await page.getByLabel('Message').fill('Bravo pour ce livre d’or !')

  // Soumission.
  await page.getByRole('button', { name: 'Signer' }).click()

  // Le message apparaît dans la liste, avec son auteur.
  const message = page.locator('article.message')
  await expect(message).toHaveCount(1)
  await expect(message).toContainText('Bravo pour ce livre d’or !')
  await expect(message).toContainText('Camille')
})
