const images = [
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
];

export function Gallery() {
  return (
    <section id="galeria" className="bg-paper-dim py-24 dark:bg-ink-soft">
      <div className="container-app">
        <div className="mb-14 max-w-lg">
          <span className="text-xs font-medium uppercase tracking-wide text-brass">Galería</span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
            El espacio y el oficio.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((src, i) => (
            <div key={i} className="aspect-[3/4] overflow-hidden rounded-lg bg-ink/5">
              <img src={src} alt="Barbería BarberFlow" className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
