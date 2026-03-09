# MaBoule Festival — Notes pour Claude

## Projet
Application de gestion des bénévoles pour le festival de marionnettes MaBoule à Genappe (TOF Théâtre).

## Stack
- Next.js 16 App Router + TypeScript + Tailwind CSS
- Données en localStorage (pas de backend pour l'instant)
- `date-fns/locale fr` pour les dates françaises
- Police : Roboto Slab (titres) + Inter (corps)

## Palette officielle (maboule.be)
- Fond sombre : `#111111` / `#1a1a1a`
- Teal : `#168D8F` (bénévoles, disponibilités)
- Vert lime : `#b2cc46` (agenda)
- Violet : `#964d86` (salles, assignations)
- Orange : `#ff9722` (spectacles, alertes)

## Conventions
- Toujours écrire l'UI en **français**
- Clés localStorage préfixées `maboulefest_*`
- Composants interactifs → `'use client'`
- Pas d'auth pour l'instant (accès libre)

## Déploiement
- Vercel CLI : `vercel` (première fois) ou `vercel --prod`
