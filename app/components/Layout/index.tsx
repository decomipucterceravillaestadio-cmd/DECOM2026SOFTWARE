import React from "react";
import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";
import { IconChevronLeft } from "@tabler/icons-react";

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
    <div className="min-h-screen bg-dashboard-bg flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#F49E2C]/15 rounded-full blur-3xl opacity-60 dark:opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#15539C]/20 rounded-full blur-3xl opacity-40 dark:opacity-10" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-dashboard-header backdrop-blur-md border-b border-dashboard-card-border transition-colors duration-300">
        <div className="px-4 py-4 max-w-7xl mx-auto w-full relative z-10">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-2">
              <ol className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-dashboard-text-muted">
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
                      <span className="text-[#F49E2C]/80">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dashboard-card border border-dashboard-card-border text-dashboard-text-secondary hover:text-[#F49E2C] hover:border-[#F49E2C]/30 transition-all group"
                  aria-label="Volver atrás"
                >
                  <IconChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Atrás</span>
                </Link>
              )}
              <div className="ml-2">
                <h1 className="text-xl font-bold text-dashboard-text-primary tracking-tight">{title}</h1>
                {subtitle && (
                  <p className="text-xs text-dashboard-text-secondary mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {rightElement}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full relative z-10">
        {error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </div>
              <h2 className="text-xl font-bold text-dashboard-text-primary">
                Algo salió mal
              </h2>
              <p className="text-dashboard-text-secondary max-w-md mx-auto">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-6 py-2 bg-[#F49E2C] text-[#16233B] rounded-xl hover:bg-[#F49E2C]/90 transition-colors font-bold text-sm shadow-lg shadow-[#F49E2C]/20"
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
              <p className="text-dashboard-text-muted font-bold uppercase tracking-widest text-[10px]">Cargando...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dashboard-card-border bg-dashboard-card/30 backdrop-blur-md py-8 px-4 text-center relative z-10 transition-colors duration-300">
        <p className="text-[10px] font-black uppercase tracking-widest text-dashboard-text-muted">Sistema DECOM &copy; 2026</p>
        <p className="text-[9px] font-bold text-[#F49E2C]/40 mt-1 uppercase tracking-tighter">Iglesia Pentecostal Unida • IPUC Villa Estadio</p>
        <p className="text-[8px] text-dashboard-text-muted/10 mt-2 hover:text-dashboard-text-muted transition-colors cursor-default select-none uppercase tracking-[0.2em]">
          Software by Juan Aguilar
        </p>
      </footer>
    </div>
  );
}
