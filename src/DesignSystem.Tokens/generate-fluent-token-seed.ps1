#!/usr/bin/env pwsh
#
# generate-fluent-token-seed.ps1
#
# Reads tokens/color.json directly (not Style Dictionary's build output) and emits
# FluentTokenSeed.g.cs. Runs as an MSBuild target BeforeTargets="CoreCompile" — this
# is the .NET side's own generation step, deliberately independent of `npm run build`,
# so `dotnet build`/`dotnet test`/`dotnet pack` on this project never need npm to have
# run first. color.amber.700 and color.neutral.500 are literal $value leaves in the
# source (not {reference}-style tokens), so no reference-resolution logic is needed
# here — a real requirement would mean this script and Style Dictionary's own resolver
# have drifted apart, not that this script grew one.

param(
	[Parameter(Mandatory)]
	[string]$ColorTokensPath,

	[Parameter(Mandatory)]
	[string]$OutputPath
)

$ErrorActionPreference = 'Stop'

$Tokens = Get-Content $ColorTokensPath -Raw | ConvertFrom-Json
$Accent = $Tokens.color.amber.'700'.'$value'
$Neutral = $Tokens.color.neutral.'500'.'$value'

if (-not $Accent) { throw "color.amber.700.`$value not found in $ColorTokensPath" }
if (-not $Neutral) { throw "color.neutral.500.`$value not found in $ColorTokensPath" }

$Content = @"
namespace Norse.DesignSystem;

// Generated at build time from tokens/color.json — do not edit by hand.
/// <summary>Seed color values for FluentUI Blazor's DesignTokens, generated from Naglfar's color tokens.</summary>
public static class FluentTokenSeed
{
	/// <summary>Accent base color (color.amber.700).</summary>
	public const string AccentBaseColor = "$Accent";

	/// <summary>Neutral base color (color.neutral.500).</summary>
	public const string NeutralBaseColor = "$Neutral";
}
"@

Set-Content -Path $OutputPath -Value $Content -NoNewline
Write-Host "Generated $OutputPath (AccentBaseColor=$Accent, NeutralBaseColor=$Neutral)"
