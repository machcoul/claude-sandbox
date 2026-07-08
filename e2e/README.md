# Tests E2E (Playwright)

## Réseau mocké, PAS la base dev

Le test E2E **intercepte et mocke les appels réseau Supabase** (`page.route` sur
`**/rest/v1/messages**`). Il ne touche **jamais** la base dev ni la prod.

### Pourquoi ce choix

- **Déterminisme** : on maîtrise entièrement les données. Pas de dépendance à
  l'état de la base (données résiduelles, autres tests, RLS), donc pas de flaky.
- **Hors ligne** : aucun secret Supabase requis, aucun accès réseau. Le test
  tourne en local et en CI de façon identique et isolée.
- **Sécurité / propreté** : on n'écrit pas de données de test dans une vraie base
  partagée, et on ne risque pas de la polluer ou de déclencher des quotas.

Le serveur Vite est démarré avec des valeurs Supabase **factices**
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` dans `playwright.config.js`) : elles
suffisent à faire démarrer l'app, puisque tout le trafic est intercepté.

### Quand pointer sur la base dev à la place ?

Si un jour on veut un vrai test d'intégration bout-en-bout (schéma réel, RLS,
policies), on ferait un job séparé qui :
- charge de vrais secrets dev (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`),
- retire le `page.route` de mock,
- nettoie les données après coup.
C'est plus lourd et plus fragile — d'où le mock par défaut ici.

## Lancer les tests

```bash
npm run test:e2e            # exécute le parcours
npx playwright test --ui    # mode interactif (debug)
npx playwright show-report  # ouvre le dernier rapport HTML
```
