# CLAUDE.md — Naglfar (`Norse.DesignSystem`)

## 0. Wrong Root — Halt

Session root must be **Bifröst**, not this repo directly — org-wide settings (`superpowers`, permission rules) only apply from the actual root, and Claude Code never merges a submodule's own `.claude/settings.json` into a parent-launched session. If `claude` was run from inside **Naglfar**, stop: don't read further, don't propose changes, don't run anything — tell the user to `cd ../Bifrost` and start there. (This repo's `.claude/settings.json` carries a `SessionStart` hook meant to block this before you ever see this file; if you're reading this anyway, the hook was bypassed, disabled, or failed — halt regardless.)

> **Do not commit, push, or rewrite git history** — stage (`git add`), show the diff, stop; the human reviews and commits. This applies even when a skill's flow includes a commit step. **US English spelling** everywhere — code, comments, docs, commits.

## 1. What This Repository Is

Naglfar is **the token pipeline** — `Norse.DesignSystem`: colors, typography, spacing, radius, elevation, and a first pass at component tokens (button/input/card), authored as `tokens/*.json` and built with [Style Dictionary](https://styledictionary.com/) into `@norsearchitecture/design-tokens`, published to GitHub Packages. **This repo is JS-first, npm-only** — no hand-authored C# anywhere in it.

**One 100%-generated .NET exception:** `src/DesignSystem.Tokens` packs `Norse.DesignSystem.Tokens`, versioned identically to the npm package and released alongside it in the same step. It ships two things, both generated, neither hand-editable: `FluentTokenSeed` (`AccentBaseColor`/`NeutralBaseColor` constants for FluentUI Blazor's theme API — `AccentBaseColor` is consumed by Midgard's `Infrastructure.Components.Theme.FluentUI` via `IThemeService`; `NeutralBaseColor` is generated but currently unconsumed, since FluentUI Blazor v5 derives its neutral ramp algorithmically from the accent color alone) and `norse-design-tokens.css` (plain semantic custom properties, dark-mode-switched via `@media (prefers-color-scheme: dark)`, consumed by Midgard's `Infrastructure.Components.Theme`). Never edit `FluentTokenSeed.g.cs` or `norse-design-tokens.css` directly — edit `tokens/*.json` and run `npm run build`. Full design: `../Glitnir/docs/Naglfar/specs/2026-07-09-style-dictionary-tokens-design.md`; the FluentUI v5 neutral-color gap: `../Glitnir/docs/Platform/specs/2026-07-11-blazor-component-architecture-design.md` Addendum 2.

**`DesignSystem.Stories` split out to its own repo, Bragi, on 2026-07-12** — the same day `DesignSystem.Tokens` landed here. Naglfar ships the token pipeline; Bragi ships the `.stories.razor` component catalog that Yggdrasil's BlazingStory host (`Hosting.Stories.Client`/`.Server`) serves. The two don't share a publish cadence or toolchain (npm vs. NuGet) and don't belong wearing one repo's clothes.

**The palette is provisional, not final brand taste.** It exists to prove the pipeline works end to end and is expected to be replaced once real design expertise is brought in — do not treat current token values as settled design decisions.

**Design-system content here is exempt from the platform's brainstorm → spec → plan → TDD cycle** — the standing call for this realm and Bragi alike (`../Bifrost/CLAUDE.md` §6). Token values, naming, and pipeline wiring are content/mechanical decisions, not behavioral code. If genuine behavioral logic (not just token authoring or generation wiring) ever lands here, reassess — that would warrant the standard TDD discipline like any other realm.

**Ungated CI** — like Bragi, little unit-testable logic lives in this repo directly; the `gate / build` check runs but isn't required by branch protection. Revisit if that changes.

How design work here gets recorded going forward — standalone, or threaded through Glitnir's design court like the rest of the platform — is still open, left that way on purpose until there's real work to decide it for.

See `../Bifrost/CLAUDE.md` (§2 The Naming Model) and `../Glitnir/CLAUDE.md` (§3 Bounded Context Map) for the full realm table and how Naglfar fits the rest of the cosmos.
