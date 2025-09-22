import { useState } from "react";
import { PixteryxLogo } from "./Logo";
import { Link } from "react-router-dom";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const navItem = (
    <ul className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 font-medium">
      <li><a href="/#services" className="hover:text-sky-300">Services</a></li>
      <li><a href="/#about" className="hover:text-sky-300">À propos</a></li>
      <li><a href="/#contact" className="hover:text-sky-300">Contact</a></li>
      <li><Link to="/cases" className="hover:text-sky-300">Cas</Link></li>
      <li><Link to="/devis-rapide" className="hover:text-sky-300">Devis</Link></li>
        <li><Link to="/faq" className="hover:text-sky-300">FAQ</Link></li>
    </ul>
  );
  return (
    <header role="banner" className="sticky top-0 z-40 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-950 ring-sky-400 rounded-lg">
          <PixteryxLogo size={36} />
        </Link>
        <nav role="navigation" aria-label="Navigation principale" className="hidden md:block text-slate-200">{navItem}</nav>
        <button className="md:hidden p-2 rounded-lg border border-white/10" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      </div>
      {open && <div className="md:hidden px-4 pb-4 text-slate-200">{navItem}</div>}
    </header>
  );
}
