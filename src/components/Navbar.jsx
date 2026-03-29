import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Navbar({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
      <h2 className="text-gray-700 font-semibold text-lg">
        Sistem Informasi Manajemen Latihan & Jadwal
      </h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{session?.user?.email}</span>
        <div
          className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: "#0b91d2" }}
        >
          A
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-blue-700 hover:text-red-700 font-medium transition"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
