# Norse.DesignSystem.Tokens

Generated output of Naglfar's Style Dictionary pipeline. Two things ship in this package:

- `Norse.DesignSystem.FluentTokenSeed` — `AccentBaseColor`/`NeutralBaseColor` constants, for FluentUI Blazor's theme API. `AccentBaseColor` is consumed by `Norse.Infrastructure.Components.Theme.FluentUI` (Midgard) via `IThemeService`; `NeutralBaseColor` is generated but currently unconsumed — FluentUI Blazor v5 derives its neutral ramp algorithmically from the accent color alone, with no neutral-color input in its theme API. See `../Glitnir/docs/Platform/specs/2026-07-11-blazor-component-architecture-design.md`, Addendum 2.
- `_content/Norse.DesignSystem.Tokens/norse-design-tokens.css` — plain semantic color custom properties, switched by `@media (prefers-color-scheme: dark)`. No third-party dependency. Consumed by `Norse.Infrastructure.Components.Theme` (Midgard).

Nothing in this package is hand-authored. Do not edit `FluentTokenSeed.g.cs` or `norse-design-tokens.css` directly — edit `tokens/*.json` and run `npm run build`.
