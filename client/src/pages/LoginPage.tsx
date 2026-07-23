import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 pattern-grid text-zinc-900">
      <div className="w-full max-w-md bg-white border border-zinc-200/80 p-8 md:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 space-y-8">
        
        {/* Editorial Typography Header */}
        <div className="space-y-2">
          <div className="h-2 w-12 bg-amber-500 rounded-full mb-4"></div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Sign in to Fleet.
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Enter your workstation security credentials below.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold p-3.5 rounded-xl flex items-center gap-2.5" role="alert">
            <svg className="w-4 h-4 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest">
              Corporate Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
              placeholder="operator@system.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs font-bold text-zinc-700 uppercase tracking-widest">
                Security Key
              </label>
              <Link to="/forget-password" className="text-xs text-zinc-500 hover:text-zinc-950 font-semibold transition-colors underline underline-offset-4">
                Reset Key
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all placeholder-zinc-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-zinc-950 hover:bg-zinc-900 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-zinc-950/20 disabled:opacity-40 transition-all duration-150 transform active:scale-[0.985] cursor-pointer mt-2"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying Credentials...
              </span>
            ) : "Access System Workspace"}
          </button>
        </form>

        <div className="text-center pt-5 border-t border-zinc-100">
          <p className="text-sm text-zinc-500 font-medium">
            Not registered?{" "}
            <Link to="/register" className="text-zinc-950 hover:text-amber-600 font-bold transition-colors ml-1 underline underline-offset-4">
              Request Platform Invitation
            </Link>
          </p>
        </div>
      </div>
    </div>
    );  
}