interface PlaceholderProps {
  title: string;
  task: string;
}

/** Stand-in page until the owning roadmap task ships the real one. */
export default function Placeholder({ title, task }: PlaceholderProps) {
  return (
    <section className="flex flex-col items-center gap-3 py-20 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-500">
        Coming soon — implemented by roadmap task <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">{task}</code>.
      </p>
    </section>
  );
}
