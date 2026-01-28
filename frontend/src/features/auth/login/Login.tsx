import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";

const Login = () => {
  return (
    <div className="w-full h-screen flex bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 items-center justify-center relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-size[72px_72px]"></div>
      
      {/* Ambient glow effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Security badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-4">
              <Shield className="w-8 h-8 text-blue-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
              Welcome
            </h1>
            <p className="text-slate-400 text-sm font-light">
              Secure authentication via Google
            </p>
          </div>

          {/* Divider with lock icon */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-slate-900 px-4">
                <Lock className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Link
            to="http://localhost:3334/api/auth/login-google"
            className="group relative w-full bg-white hover:bg-gray-50 text-slate-900 py-3.5 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center gap-3">
              <FcGoogle size={22} />
              <span className="text-sm tracking-wide">Continue with Google</span>
            </span>
          </Link>

          {/* Security notice */}
          <div className="mt-6 flex items-start gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.5} />
            <p className="leading-relaxed">
              Your data is encrypted and protected with enterprise-grade security
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-slate-600 mt-6 font-light">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Login;