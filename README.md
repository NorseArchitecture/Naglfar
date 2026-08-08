# Naglfar

> Assembled from the unglamorous remnants — tokens, radii, deprecated variants — into something seaworthy enough to carry everything we've built into battle. Naglfar doesn't survive Ragnarök. It delivers.

<p align="center">
  <img src="https://github.com/user-attachments/assets/9ee526e5-9e4e-4f92-a8ec-cd619aec9587" alt="Naglfar — the ship of the dead, assembled from the nails of the slain, bound for Ragnarök" title="Naglfar — the ship built to deliver everything to where it's going" />
</p>

*Image credit: [@norsemythologyclips](https://www.instagram.com/norsemythologyclips/) — go follow them.*

The design system home for the Norse Architecture — **`Norse.DesignSystem`**. Every design system eventually gets replaced; that's not a flaw to design around, it's the premise. Naglfar isn't built to outlive itself — it's built to deliver everything else to where it's going.

## The pipeline

Design decisions are authored once, as structured JSON, and compiled into every format the platform consumes. Nine token files — [color](tokens/color.json), [typography](tokens/typography.json), [spacing](tokens/spacing.json), [radius](tokens/radius.json), [elevation](tokens/elevation.json), and component tokens for [button](tokens/components/button.json), [input](tokens/components/input.json), [card](tokens/components/card.json), and [the bridge itself](tokens/components/bifrost.json) (the `--bifrost-seam` gradient rides the pipeline like any other decision) — build through [Style Dictionary](https://styledictionary.com/) ([`style-dictionary.config.js`](style-dictionary.config.js)) into four outputs: CSS custom properties (dark-mode-switched), a JS module, flattened JSON, and a generated C# seed (`FluentTokenSeed`) for FluentUI Blazor's `DesignTokens` API.

The build dual-ships: `@norsearchitecture/design-tokens` to GitHub Packages (npm), and [`DesignSystem.Tokens`](src/DesignSystem.Tokens) packing the same generated seed and CSS as `Norse.DesignSystem.Tokens` (NuGet), versioned identically and released in the same step. **This repo is JS-first with that one 100%-generated .NET exception — no hand-authored C# anywhere.** The component story catalog lives in [Bragi](https://github.com/NorseArchitecture/Bragi); Naglfar ships tokens, Bragi ships stories.

## Why Style Dictionary

If you haven't met [Style Dictionary](https://styledictionary.com/), the pitch is simple: **it's a build system for design decisions.** Born at Amazon to end per-platform drift, it treats every color, type ramp, spacing step, radius, and shadow as data — one JSON source of truth — and compiles that truth into whatever each consuming platform natively speaks: CSS, JS, JSON, C# here; iOS and Android formats when a platform needs them. A design decision stops being a value someone remembers to copy and becomes data with a compiler behind it.

That mattered before AI. It's close to existential now. Coding assistants generate UI at a volume no reviewer can eyeball, and every generated hex code, magic spacing value, and improvised radius is drift waiting to compound — ask an assistant to make forty components look right and you'll get forty subtly different opinions. Tokens invert the game: the sanctioned vocabulary is `var(--color-semantic-primary)` and `FluentTokenSeed.AccentBaseColor` — generated artifacts the assistant *references*, not taste it's asked to *imitate*. The design can't drift in generated code because the design was never in the code. It lives upstream, in nine JSON files, with a deterministic build between it and every surface it touches.

The payoffs stack. A palette change is a one-file PR with a build-time blast radius, not a forty-file find-and-replace. A wrong value is a diff caught in `tokens/`, not a scavenger hunt through screenshots. And when the next component gets written — by a human or a machine — the pit of success is the token: reaching for it is easier than inventing a value. In a world where more of the code is written by machines, design integrity survives by being data the machines must consume, not judgment they're asked to reproduce.

**The palette itself is provisional, not final brand taste.** It exists to prove the pipeline end to end and is expected to be replaced when real design expertise arrives — see the [full design](https://github.com/NorseArchitecture/Glitnir/blob/master/docs/Naglfar/specs/2026-07-09-style-dictionary-tokens-design.md) for the standing caveat. Never edit the generated artifacts (`FluentTokenSeed.g.cs`, `norse-design-tokens.css`) — edit `tokens/*.json` and rebuild.

## Build and test

```shell
npm run build              # tokens/*.json → dist/ (css, js, json, csharp) via Style Dictionary
npm test                   # rebuilds first, then pins the emitted output — node --test
dotnet test Naglfar.slnx   # FluentTokenSeed + packaging tests over the generated .NET surface
```

Requires Node ≥ 22 and the .NET 11 preview SDK pinned by `global.json`. The pipeline's output is test-pinned from both directions: [`test/build.test.js`](test/build.test.js) asserts what the build emits (the `--bifrost-seam` gradient included), and [`tests/DesignSystem.Tokens.Tests`](tests/DesignSystem.Tokens.Tests) asserts what the .NET package carries.

## The cosmos

Naglfar rides as a submodule of [Bifröst](https://github.com/NorseArchitecture/Bifrost), the Norse Architecture's meta-repository, alongside every other realm. How design work here gets recorded — standalone, or threaded through Glitnir's design court like the rest of the platform — is still open, left that way on purpose until there's real work to decide it for.

## Soundtrack: Devoured By Naglfar
[![Soundtrack: Devoured By Naglfar](https://img.youtube.com/vi/ZmCvDupTShI/maxresdefault.jpg)](https://www.youtube.com/watch?v=ZmCvDupTShI)
