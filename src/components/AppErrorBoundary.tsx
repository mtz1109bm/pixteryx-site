import React from "react";
import { brand } from "../brand";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

class ErrorBoundaryImpl extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_error: unknown): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Log côté client (Sentry captera aussi si tu l’as branché)
    console.error("AppErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className={`${brand.bg} ${brand.text} min-h-screen flex items-center`}>
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Oups…</h1>
            <p className="mt-2 text-slate-400">
              Une erreur est survenue. Recharge la page ou réessaie.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-6 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50"
            >
              Réessayer
            </button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

export function AppErrorBoundary({ children }: Props) {
  return <ErrorBoundaryImpl>{children}</ErrorBoundaryImpl>;
}
