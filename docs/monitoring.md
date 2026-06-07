# Surveillance — procédure d'activation par client

Stack : HetrixTools · Umami · Clarity · Axiom · GlitchTip

**Aucun code à écrire dans ce repo.** Umami et Clarity sont déjà câblés dans `src/layouts/Layout.astro` via des variables d'environnement. Les scripts ne s'injectent que si la variable est définie.

---

## Résumé des actions par nouveau client

| Outil | Action | Où | Fréquence |
|---|---|---|---|
| HetrixTools | Ajouter le domaine dans le dashboard | dashboard.hetrixtools.com | Une fois par site |
| Umami | Créer le site → copier l'ID | app.umami.is | Une fois par site |
| Clarity | Créer le projet → copier l'ID | clarity.microsoft.com | Une fois par site |
| Axiom | Rien | — intégration Netlify globale | Une seule fois pour tout le compte |
| GlitchTip | Optionnel — JS complexe uniquement | glitchtip.com | Rarement (sites vitrines : ignorer) |

---

## 1. HetrixTools — uptime monitoring

**Quand :** dès que le site est en ligne sur son domaine définitif.

**Action :**
1. Aller sur [dashboard.hetrixtools.com](https://dashboard.hetrixtools.com)
2. → **Add Monitor** → type **Website**
3. URL : `https://[domaine-client.fr]`
4. Nom : `[Prénom Nom — Activité]`
5. Intervalle : 5 min, notification par email
6. Sauvegarder

**Aucune variable d'environnement, aucun code.**

---

## 2. Umami — analytics respectueux RGPD

**Quand :** avant le premier déploiement en production.

**Action :**
1. Aller sur [app.umami.is](https://app.umami.is)
2. → **Add website** → entrer le domaine
3. Copier le **Website ID** (format UUID)
4. Dans Netlify → **Site configuration → Environment variables**
5. Ajouter : `UMAMI_WEBSITE_ID` = `[uuid]`
6. Redéployer

Le script Umami s'injecte automatiquement dans le `<head>` via `Layout.astro`.

---

## 3. Clarity — enregistrements de session et heatmaps

**Quand :** avant le premier déploiement en production.

**Action :**
1. Aller sur [clarity.microsoft.com](https://clarity.microsoft.com)
2. → **New project** → entrer le nom et l'URL du site
3. Copier le **Project ID** (chaîne courte, ex. `abc123xyz`)
4. Dans Netlify → **Site configuration → Environment variables**
5. Ajouter : `CLARITY_PROJECT_ID` = `[project-id]`
6. Redéployer

Le script Clarity s'injecte automatiquement dans le `<head>` via `Layout.astro`.

---

## 4. Axiom — logs Netlify

**Quand :** une seule fois pour l'ensemble du compte Netlify.

**Action :**
1. Aller sur [app.netlify.com](https://app.netlify.com) → **Integrations**
2. Chercher **Axiom** → connecter le compte
3. Tous les sites du compte Netlify envoient leurs logs automatiquement

**Rien à faire par site.**

---

## 5. GlitchTip — error tracking JS

**Quand :** uniquement si le site contient du JavaScript complexe (SPA, interactions riches). Pour les sites vitrines simples → **ignorer**.

**Action si nécessaire :**
1. Créer un projet sur [glitchtip.com](https://glitchtip.com)
2. Copier le DSN
3. Dans Netlify → ajouter `GLITCHTIP_DSN` = `[dsn]`
4. Ajouter l'initialisation dans `Layout.astro` ou un composant dédié

---

## Variables d'environnement Netlify — récapitulatif

| Variable | Source | Obligatoire |
|---|---|---|
| `UMAMI_WEBSITE_ID` | app.umami.is | Oui |
| `CLARITY_PROJECT_ID` | clarity.microsoft.com | Oui |
| `GLITCHTIP_DSN` | glitchtip.com | Non (sites vitrines) |

> Le formulaire de contact (Resend) est optionnel. Variables associées (`RESEND_API_KEY`, `NOTIFICATION_EMAIL`) à ajouter uniquement si le skill `/add-contact-form` a été exécuté sur ce site.

---

## Checklist de mise en ligne

- [ ] Domaine configuré sur Netlify
- [ ] HetrixTools : monitor ajouté
- [ ] Umami : `UMAMI_WEBSITE_ID` ajouté dans Netlify
- [ ] Clarity : `CLARITY_PROJECT_ID` ajouté dans Netlify
- [ ] Axiom : déjà actif si le compte est connecté
- [ ] *(si formulaire contact)* `RESEND_API_KEY` + `NOTIFICATION_EMAIL` ajoutés + test d'envoi
