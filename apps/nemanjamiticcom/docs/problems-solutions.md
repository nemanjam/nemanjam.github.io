1.

- problem: tailwind is double loaded
- solution: when loading with custom directives (@layer base) disable default base loading in astro.config.mjs

```ts
// in astro.config.mjs
// applyBaseStyles: false prevents double loading of tailwind
tailwind({ applyBaseStyles: false }),
```

---
