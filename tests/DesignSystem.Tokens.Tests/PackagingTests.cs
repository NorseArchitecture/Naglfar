using System.Diagnostics;
using System.IO.Compression;
using System.Runtime.CompilerServices;

namespace Norse.DesignSystem.Tokens.Tests;

public sealed class PackagingTests
{
	[Fact]
	void Pack_IncludesNorseDesignTokensCssAsAStaticWebAsset()
	{
		var packOutputDirectory = Directory.CreateTempSubdirectory("norse-design-tokens-pack-").FullName;
		try
		{
			using var pack = Process.Start(new ProcessStartInfo("dotnet", $"pack \"{ProjectPath()}\" -c Release -o \"{packOutputDirectory}\" --nologo")
			{
				RedirectStandardOutput = true,
				RedirectStandardError = true,
			})!;
			var output = pack.StandardOutput.ReadToEnd();
			var error = pack.StandardError.ReadToEnd();
			pack.WaitForExit();
			pack.ExitCode.ShouldBe(0, $"{output}\n{error}");

			var nupkgPath = Directory.GetFiles(packOutputDirectory, "*.nupkg").ShouldHaveSingleItem();
			using var archive = ZipFile.OpenRead(nupkgPath);

			archive.GetEntry("staticwebassets/norse-design-tokens.css").ShouldNotBeNull();
		}
		finally
		{
			Directory.Delete(packOutputDirectory, recursive: true);
		}
	}

	static string ProjectPath([CallerFilePath] string testFilePath = "") =>
		Path.GetFullPath(Path.Combine(Path.GetDirectoryName(testFilePath)!, "..", "..", "src", "DesignSystem.Tokens", "DesignSystem.Tokens.csproj"));
}
