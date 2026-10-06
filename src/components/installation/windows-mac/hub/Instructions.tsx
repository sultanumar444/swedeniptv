import Link from "next/link";

export default function WindowsMacHubInstructions() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/installationsguider/windows-mac/windows"
          className="rounded-lg bg-button px-8 py-4 font-semibold text-white transition-colors"
        >
          Windows
        </Link>
        <Link
          href="/installationsguider/windows-mac/mac"
          className="rounded-lg bg-button px-8 py-4 font-semibold text-white transition-colors"
        >
          MAC
        </Link>
      </div>
    </section>
  );
}
