const testimonials = [
  {
    name: 'Ricardo M.',
    text: 'Reservé mi cita desde el celular en un minuto y no esperé ni cinco minutos al llegar.',
  },
  {
    name: 'Daniela V.',
    text: 'Le llevé a mi hijo por primera vez y el trato fue excelente. La confirmación por correo da mucha confianza.',
  },
  {
    name: 'Jorge A.',
    text: 'El diseño de barba quedó perfecto. Ahora reservo cada tres semanas sin pensarlo dos veces.',
  },
];

export function Testimonials() {
  return (
    <section className="bg-ink py-24 text-paper">
      <div className="container-app">
        <div className="mb-14 max-w-lg">
          <span className="text-xs font-medium uppercase tracking-wide text-brass-bright">Testimonios</span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
            Lo que dicen nuestros clientes.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="rounded-lg border border-paper/10 bg-paper/[0.03] p-6">
              <p className="text-sm leading-relaxed text-paper/80">"{t.text}"</p>
              <footer className="mt-4 text-xs font-medium text-brass-bright">— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
