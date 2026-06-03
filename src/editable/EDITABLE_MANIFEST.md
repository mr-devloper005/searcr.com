# Editable Manifest

This folder contains the presentation layer for the editable site experience.

## Contract

- Edit only `src/editable/**` for UI redesign work.
- Keep route wiring, SEO, APIs, and data-fetching logic outside this folder untouched.
- Preserve exported component/function names and prop compatibility.
- Make posts render safely even when optional fields such as image, summary, category, or contact details are missing.

## Editable Surface

```txt
src/editable/shell/EditableSiteShell.tsx
src/editable/shell/EditableNavbar.tsx
src/editable/shell/EditableFooter.tsx
src/editable/shell/EditableReaderNavbar.tsx
src/editable/pages/*.tsx
src/editable/cards/*.tsx
src/editable/sections/*.tsx
src/editable/components/*.tsx
src/editable/content/*.ts
src/editable/theme/*.ts
src/editable/theme/editable-global.css
```

## Redesign Rule

The editable surface may fully redesign:

- body and background treatment
- home layout and sections
- archive and detail page layouts
- card systems and content blocks
- navbar, footer, forms, empty states, and loading states

The editable surface must not change:

- API behavior
- routing structure
- backend behavior
- core data flow or post-fetching logic

## Protected Areas

```txt
src/app/**
src/lib/**
src/config/**
src/components/**
.github/**
Dockerfile
package.json
next.config.*
```
