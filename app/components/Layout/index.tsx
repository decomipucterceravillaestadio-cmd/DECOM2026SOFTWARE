import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  breadcrumbs?: BreadcrumbItem[];
  rightElement?: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function Layout({
  title,
  subtitle,
  showBackButton = true,
  backHref,
  breadcrumbs,
  rightElement,
  isLoading = false,
  error,
  onRetry,
  children,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#16233B] via-[#15539C] to-[#1a2847] flex flex-col relative overflow-hidden">
      {/* Animated Background Beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#F49E2C]/15 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#15539C]/20 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Header - Without white background */}
      <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-4 max-w-7xl mx-auto w-full relative z-10">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-2">
              <ol className="flex items-center space-x-2 text-sm text-white/70">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-[#F49E2C] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Title Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {showBackButton && (
                <Link
                  href={backHref || "/"}
                  className="text-[#F49E2C] hover:text-white transition-colors p-2 -m-2"
                  aria-label="Volver atrás"
                >
                  ← Atrás
                </Link>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-white/70 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {rightElement}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full relative z-10">
        {error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <svg className="w-16 h-16 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-white">
                Algo salió mal
              </h2>
              <p className="text-white/70 max-w-md">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-[#F49E2C] text-[#16233B] rounded-lg hover:bg-[#F49E2C]/90 transition-colors font-semibold"
                >
                  Intentar nuevamente
                </button>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-[#F49E2C]/30 border-t-[#F49E2C] rounded-full animate-spin mx-auto"></div>
              <p className="text-white/70">Cargando...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Footer - Without white background */}
      <footer className="border-t border-white/10 bg-white/5 py-6 px-4 text-center text-sm text-white/50 mt-auto relative z-10">
        <p>Sistema DECOM &copy; 2026 - Iglesia Pentecostal Unida</p>
      </footer>
    </div>
  );
}
