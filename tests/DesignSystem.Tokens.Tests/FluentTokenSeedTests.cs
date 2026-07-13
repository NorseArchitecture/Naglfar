using System.Text.RegularExpressions;

namespace Norse.DesignSystem.Tokens.Tests;

public sealed partial class FluentTokenSeedTests
{
	[Fact]
	void AccentBaseColor_IsAValidHexColor()
	{
		HexColor().IsMatch(FluentTokenSeed.AccentBaseColor).ShouldBeTrue();
	}

	[Fact]
	void NeutralBaseColor_IsAValidHexColor()
	{
		HexColor().IsMatch(FluentTokenSeed.NeutralBaseColor).ShouldBeTrue();
	}

	[GeneratedRegex("^#[0-9a-fA-F]{6}$")]
	private static partial Regex HexColor();
}
