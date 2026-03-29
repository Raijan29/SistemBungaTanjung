import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSupervisorAccount,
  MdCalendarToday,
  MdEvent,
  MdFactCheck,
} from "react-icons/md";

const menus = [
  { to: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" },
  { to: "/anggota", icon: <MdPeople size={20} />, label: "Anggota" },
  { to: "/pelatih", icon: <MdSupervisorAccount size={20} />, label: "Pelatih" },
  {
    to: "/jadwal",
    icon: <MdCalendarToday size={20} />,
    label: "Jadwal Latihan",
  },
  { to: "/kegiatan", icon: <MdEvent size={20} />, label: "Kegiatan" },
  { to: "/absensi", icon: <MdFactCheck size={20} />, label: "Absensi" },
];

export default function Sidebar() {
  return (
    <div
      className="w-64 text-white flex flex-col shadow-xl"
      style={{ backgroundColor: "#0b91d2" }}
    >
      <div
        className="p-6 border-b flex items-center gap-3"
        style={{ borderColor: "#0a7fb8" }}
      >
        <img
          src="/logo.png"
          alt="Logo Bunga Tanjung"
          className="h-13 w-13 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold leading-tight"> Bunga Tanjung</h1>
          <p className="text-white font-bold text-xs mt-1">
            Manajemen Seni Tari
          </p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menus.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-white shadow" : "hover:bg-blue-700 text-rose-100"
              }`
            }
            style={({ isActive }) => (isActive ? { color: "#0b91d2" } : {})}
          >
            {m.icon}
            {m.label}
          </NavLink>
        ))}
      </nav>
      <div
        className="p-4 border-t  text-xs text-blue-700 text-center"
        style={{ backgroundColor: "#0b91d2" }}
      >
        v1.0.0 © 2025 Bunga Tanjung
      </div>
    </div>
  );
}
