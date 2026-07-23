import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFoundPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 text-zinc-900">
      <div className="w-full max-w-lg bg-white border border-zinc-200/80 p-8 md:p-12 rounded-3xl shadow-xl shadow-zinc-200/50 text-center space-y-6">
        
        {/* Animated Amber Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 text-amber-600 rounded-3xl border border-amber-500/20 shadow-inner">
          <span className="text-3xl font-black tracking-tight">404</span>
        </div>

        {/* Header & Typography */}
        <div className="space-y-2">
          <div className="h-1.5 w-12 bg-amber-500 rounded-full mx-auto mb-3"></div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-950">
            Route Off Grid
          </h1>
          <p className="text-sm text-zinc-500 font-medium max-w-sm mx-auto">
            The requested location could not be located in the Fleet System registry. It may have been moved or decommissioned.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-zinc-950/20 active:scale-[0.985] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {user ? "Return to Fleet Dashboard" : "Return to Sign In"}
          </Link>
        </div>
      </div>
    </div>
  );
}
