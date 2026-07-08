import { Link } from 'react-router-dom';
import { Instagram, Facebook, Scissors } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-ink/10 bg-paper-soft dark:border-paper/10 dark:bg-ink-soft">
      <div className="container-app grid gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <Scissors size={18} className="text-brass" />
            BarberFlow
          </div>
          <p className="max-w-xs text-sm text-ash">
            Cortes de precisión, atención personalizada y una agenda que respeta tu tiempo.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ash">Contacto</h4>
          <ul className="space-y-2 text-sm text-ink/80 dark:text-paper/80">
            <li>Av. Venustiano Carranza 123, Saltillo, Coahuila</li>
            <li>+52 844 123 4567</li>
            <li>contacto@barberflow.com</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ash">Síguenos</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 hover:bg-brass hover:text-ink hover:border-brass dark:border-paper/15">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 hover:bg-brass hover:text-ink hover:border-brass dark:border-paper/15">
              <Facebook size={16} />
            </a>
          </div>
          <Link to="/admin/login" className="mt-6 inline-block text-xs text-ash hover:text-brass">
            Acceso administrador
          </Link>
        </div>
      </div>
      <div className="border-t border-ink/10 py-6 text-center text-xs text-ash dark:border-paper/10">
        © {new Date().getFullYear()} BarberFlow. Proyecto demostrativo — Computación en la Nube.
      </div>
    </footer>
  );
}
