// Keeps one broken component from blanking the whole OS.
import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode; label: string; onReset?: () => void }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(`[${this.props.label}]`, error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash" role="alert">
        <b>{this.props.label} stopped responding.</b>
        <span className="mono">Nothing was lost.</span>
        <button
          className="btn btn--sm"
          onClick={() => {
            this.setState({ error: null });
            this.props.onReset?.();
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
