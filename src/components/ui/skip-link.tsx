export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-6 focus:py-3 focus:rounded-full focus:shadow-xl focus:font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
    >
      Saltar al contenido principal
    </a>
  );
}
