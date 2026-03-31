import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah.");
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="mx-auto h-18 w-16" />
          <h1 className="text-2xl font-bold " style={{ color: "#0b91d2" }}>
            Bunga Tanjung
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistem Informasi Manajemen Seni Tari
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
            style={{ backgroundColor: "#0b91d2" }}
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Daftar di sini
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Lembaga Bunga Tanjung
        </p>
      </div>
    </div>
  );
}
