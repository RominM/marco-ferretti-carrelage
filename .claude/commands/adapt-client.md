# adapt-client

Génère un site complet pour un client depuis `my-workspace`, en s'appuyant sur l'architecture et les conventions du repo courant.

## Usage

```
/adapt-client [slug-client]
```

Exemple : `/adapt-client john-doe-tanatopracteur`

---

## Architecture disponible — à connaître avant d'écrire une ligne

Ce repo est un template agnostique. Il contient l'infrastructure commune à tous les sites MGL Studio. **Ne pas recréer ce qui existe déjà.**

### Fichiers présents et leur rôle

| Fichier | Rôle | À modifier ? |
|---|---|---|
| `src/layouts/Layout.astro` | HTML shell, SEO (meta, OG, canonical), schema.org JSON-LD, Umami + Clarity (via env vars) | Non |
| `src/config/site.ts` | Données structurées du client (nom, url, adresse, horaires, zone) | Oui |
| `src/styles/reset.scss` | Reset CSS universel | Non |
| `src/styles/global.scss` | Importe reset + styles globaux | Oui — ajouter les styles globaux après `@use 'reset'` |
| `src/styles/foundations/_variables.scss` | Variables SCSS (couleurs, typo, spacing, ombres, rayons) | Oui — reconstruire depuis `site.design.*` |
| `src/styles/foundations/_mixins.scss` | Mixins utilitaires | Non — utiliser tels quels |
| `src/styles/foundations/_animations.scss` | Animations — vide par défaut | Oui si le design le justifie |
| `src/styles/foundations/index.scss` | `@forward` les 3 fichiers foundations | Non |
| `astro.config.mjs` | Config Astro + sitemap | Oui — `site:` à mettre à jour |
| `src/pages/index.astro` | Page d'accueil — vide | Oui — assembler les composants créés |

### Mixins disponibles (`@use '../styles/foundations' as *`)

```scss
@include flex-center          // display:flex centré
@include flex-between         // display:flex space-between
@include container            // max-width $container-max, padding responsive
@include card                 // bg card, border, radius md, shadow sm
@include respond-to('md')     // media min-width 768px
@include respond-to('lg')     // media min-width 1024px
```

### Variables SCSS disponibles après `_variables.scss` reconstruit

Couleurs : `$color-bg`, `$color-bg-alt`, `$color-bg-card`, `$color-border`,
`$color-accent`, `$color-accent-dark`, `$color-accent-bg`,
`$color-secondary`, `$color-secondary-bg`,
`$color-text`, `$color-text-muted`, `$color-text-subtle`

Autres : `$font-sans`, `$section-padding`, `$container-max`,
`$radius-sm/md/lg/pill`, `$shadow-sm/md/lg`, `$transition`

### Monitoring — aucun code à écrire

Umami et Clarity sont déjà intégrés dans `Layout.astro` via `UMAMI_WEBSITE_ID` et `CLARITY_PROJECT_ID`. Zéro code à toucher — voir `docs/monitoring.md` pour les actions manuelles.

---

## Étape 0 — Lire et comprendre le client

Lire :
- `my-workspace/clients/[slug]/site.ts` — données structurées + palette + style
- `my-workspace/clients/[slug]/brief.md` — activité, besoins, ton, inspirations

Si `site.ts` n'existe pas, le signaler et arrêter.

Formuler en 2-3 phrases la **signature de ce site** : ce qui le rend unique parmi tous les sites MGL Studio. Cette signature guide chaque décision de structure, typographie, ton et copywriting.

---

## Étape 1 — Mettre à jour les fichiers de config

### `astro.config.mjs`
Remplacer `site:` par `site.url`.

### `src/config/site.ts`
Remplacer le contenu par les données du client :
- `name`, `fullName`, `url`, `title`, `description`
- `address`, `areaServed`, `priceRange`, `openingHours`
- Ne pas copier le bloc `design` — il reste dans `my-workspace`

### `src/styles/foundations/_variables.scss`
Reconstruire entièrement depuis `site.design.*` :

```scss
// Remplacées par /adapt-client depuis my-workspace/clients/[slug]/site.ts
$color-bg:           [design.bg];
$color-bg-alt:       [légèrement plus colorée que design.bg];
$color-bg-card:      #ffffff;
$color-border:       [design.accentBg teinté];

$color-accent:       [design.accent];
$color-accent-dark:  [design.accentDark];
$color-accent-bg:    [design.accentBg];

$color-secondary:    [design.secondary];
$color-secondary-bg: [design.secondaryBg];

$color-text:         [design.text];
$color-text-muted:   [design.textMuted];
$color-text-subtle:  [encore plus atténuée];

$shadow-sm: 0 1px 4px rgba([R,G,B accent], 0.08);
$shadow-md: 0 4px 16px rgba([R,G,B accent], 0.12);
$shadow-lg: 0 8px 32px rgba([R,G,B accent], 0.16);

$font-sans: '[design.font ou Inter]', system-ui, -apple-system, sans-serif;

$section-padding:  clamp(4rem, 10vw, 7rem);
$container-max:    1100px;

$radius-sm:   10px;
$radius-md:   18px;
$radius-lg:   28px;
$radius-pill: 100px;

$transition: 0.2s ease;
```

---

## Étape 2 — Concevoir la structure du site

À partir du brief, **décider** quelles sections et pages le site nécessite. Il n'y a pas de liste imposée — la structure doit correspondre à l'activité et aux objectifs du client.

Questions à se poser :
- Quelles informations le visiteur cherche-t-il en priorité ?
- Quelles actions veut-on qu'il effectue ?
- Quels contenus le client a-t-il fournis ou mentionnés ?

Exemples de sections possibles (non exhaustif) : accroche, services, réalisations, à propos, témoignages, FAQ, zone d'intervention, formulaire de contact, tarifs, équipe…

---

## Étape 3 — Créer les composants

**`src/components/` est vide** — créer uniquement les composants justifiés par la structure définie à l'étape 2.

Règles pour chaque composant `.astro` :
- Importer `{ site }` depuis `@/config/site` si les données structurées sont nécessaires
- Utiliser `@use '../styles/foundations' as *` pour accéder aux variables et mixins
- Contenu écrit spécifiquement pour CE client — jamais reformulé depuis un modèle générique
- Voix du client, pas voix d'une agence web

### `src/pages/index.astro`
Assembler les composants dans l'ordre défini à l'étape 2 :

```astro
---
import Layout from '../layouts/Layout.astro'
import MonComposant from '../components/MonComposant.astro'
// ...
---
<Layout>
  <main>
    <MonComposant />
    <!-- ... -->
  </main>
</Layout>
```

---

## Étape 4 — Appliquer le style visuel

Traduire `design.style` et `design.notes` en décisions concrètes de mise en page, typographie et animation. Le style doit être cohérent avec l'identité du client, pas avec une catégorie générique.

Si des références visuelles sont fournies dans le brief, s'en inspirer explicitement.

---

## Étape 5 — Vérifications avant commit

- [ ] `_variables.scss` : aucune valeur du template par défaut ne subsiste
- [ ] `src/config/site.ts` : tous les champs remplis, aucun placeholder
- [ ] `astro.config.mjs` : URL correcte
- [ ] Composants : aucun lorem ipsum, contenu réaliste et spécifique au client
- [ ] `title` < 60 car., `description` < 160 car.
- [ ] `npm run build` passe sans erreur
- [ ] Relecture identité : ce site pourrait-il appartenir à un autre client MGL Studio ? Si oui, recommencer.

---

## Étape 6 — Commit

```
feat: adapt template for [site.fullName]
```

---

## Étape 7 — Rappel post-exécution

Afficher :
```
Site créé et poussé sur la branche de travail.

□ Merger sur main pour déclencher le déploiement Netlify :
  git checkout main && git merge [branch] && git push origin main
```

---

## Règles absolues

- Ne jamais recréer ce qui existe déjà dans le template (monitoring, SEO, reset, mixins)
- Aucune valeur du template par défaut ne doit subsister dans `_variables.scss`
- Ne jamais inventer des données absentes de `site.ts` ou `brief.md`
- La structure du site émerge du brief — pas d'une liste de sections prédéfinie
- Si `my-workspace` n'est pas accessible, demander à l'utilisateur d'y ajouter le repo avant de continuer
