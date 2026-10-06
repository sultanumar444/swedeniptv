export default function AppleTvAppGuideDeviceSelector({
  heading,
  devices,
}: {
  heading: string;
  devices: { label: string; href: string }[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {devices.map((device) => (
          <a
            key={device.label}
            href={device.href}
            className="rounded-lg bg-button px-10 py-4 text-center font-bold text-white transition-colors"
          >
            {device.label}
          </a>
        ))}
      </div>
    </section>
  );
}
