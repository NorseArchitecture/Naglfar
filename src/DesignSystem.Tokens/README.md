# Norse.DesignSystem.Tokens

Generated output of Naglfar's Style Dictionary pipeline. Two things ship in this package:

- `Norse.DesignSystem.FluentTokenSeed` — `AccentBaseColor`/`NeutralBaseColor` constants, for FluentUI Blazor's `DesignTokens`. Consumed by `Norse.Infrastructure.Components.Theme.FluentUI` (Midgard).
- `_content/Norse.DesignSystem.Tokens/norse-design-tokens.css` — plain semantic color custom properties, switched by `@media (prefers-color-scheme: dark)`. No third-party dependency. Consumed by `Norse.Infrastructure.Components.Theme` (Midgard).

Nothing in this package is hand-authored. Do not edit `FluentTokenSeed.g.cs` or `norse-design-tokens.css` directly — edit `tokens/*.json` and run `npm run build`.
