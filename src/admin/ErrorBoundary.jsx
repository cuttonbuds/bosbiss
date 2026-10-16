import { Component } from 'react';

/** Keeps one broken editor from blanking the whole dashboard. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="admin-card" role="alert">
          <p className="admin-title">Something went wrong.</p>
          <p className="auth-msg err">{String(this.state.error.message || this.state.error)}</p>
          <button className="btn btn-ghost" type="button" onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
