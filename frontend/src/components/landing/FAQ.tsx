import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const faqs = [
  {
    q: '¿Necesito crear una cuenta para reservar?',
    a: 'No. Solo necesitas tu nombre, correo y teléfono. Recibirás un enlace seguro por correo para administrar tu cita.',
  },
  {
    q: '¿Puedo cancelar o reagendar mi cita?',
    a: 'Sí, desde el enlace que recibiste por correo. Cancelar requiere al menos 24 horas de anticipación, y reagendar al menos 2 horas.',
  },
  {
    q: '¿Qué pasa si llego tarde?',
    a: 'Te recomendamos llegar 5 minutos antes. Si tienes un imprevisto, reagenda tu cita desde tu correo con anticipación.',
  },
  {
    q: '¿Atienden los domingos?',
    a: 'No, permanecemos cerrados los domingos. Consulta el resto de nuestros horarios en la sección de arriba.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas" className="bg-paper-dim py-24 dark:bg-ink-soft">
      <div className="container-app max-w-2xl">
        <div className="mb-12">
          <span className="text-xs font-medium uppercase tracking-wide text-brass">Preguntas frecuentes</span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
            Antes de que preguntes.
          </h2>
        </div>

        <div className="divide-y divide-ink/10 dark:divide-paper/10">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={clsx('shrink-0 text-ash transition-transform', open === i && 'rotate-180')}
                />
              </button>
              {open === i && <p className="pb-5 text-sm text-ash">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
