import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Anggota from "./pages/Anggota";
import Pelatih from "./pages/Pelatih";
import JadwalLatihan from "./pages/JadwalLatihan";
import Kegiatan from "./pages/Kegiatan";
import Absensi from "./pages/Absensi";
import Login from "./pages/Login";

function PrivateRoute({ children, session }) {
  return session ? children : <Navigate to="/login" />;
}

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Masih loading session
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Memuat...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <PrivateRoute session={session}>
            <div className="flex h-screen bg-gray-50">
              <Sidebar session={session} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar session={session} />
                <main className="flex-1 overflow-y-auto p-6">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/anggota" element={<Anggota />} />
                    <Route path="/pelatih" element={<Pelatih />} />
                    <Route path="/jadwal" element={<JadwalLatihan />} />
                    <Route path="/kegiatan" element={<Kegiatan />} />
                    <Route path="/absensi" element={<Absensi />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </main>
              </div>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
