import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev; plug in Sentry/LogRocket here in prod
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          background: "var(--color-bg)",
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{ fontSize: 44 }}>⚠️</div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Something went wrong
        </h1>

        <p style={{ fontSize: 14, color: "var(--color-muted)", margin: 0, textAlign: "center", maxWidth: 380 }}>
          An unexpected error occurred. Your data is safe — try refreshing the page.
        </p>

        {/* Show error detail in dev only */}
        {import.meta.env.DEV && this.state.error && (
          <pre
            style={{
              fontSize: 11,
              background: "var(--color-accent-bg)",
              color: "var(--color-accent)",
              padding: "12px 16px",
              borderRadius: 8,
              maxWidth: 560,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            {this.state.error.message}
          </pre>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-muted)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <button
            onClick={() => window.location.replace("/")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "var(--color-primary)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
}