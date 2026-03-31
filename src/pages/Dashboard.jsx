// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// export default function Dashboard() {
//   const [data, setData] = useState([]);
//   const [stats, setStats] = useState({
//     anggota: 0,
//     pelatih: 0,
//     jadwal: 0,
//     kegiatan: 0,
//   });

//   const fetchStats = async () => {
//     const [a, p, j, k] = await Promise.all([
//       supabase.from("anggota").select("*", { count: "exact", head: true }),
//       supabase.from("pelatih").select("*", { count: "exact", head: true }),
//       supabase
//         .from("jadwal_latihan")
//         .select("*", { count: "exact", head: true }),
//       supabase.from("kegiatan").select("*", { count: "exact", head: true }),
//     ]);
//     setStats({
//       anggota: a.count || 0,
//       pelatih: p.count || 0,
//       jadwal: j.count || 0,
//       kegiatan: k.count || 0,
//     });
//   };
//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const cards = () => {[
//     {
//       label: "Total Anggota",
//       value: stats.anggota,
//       color: "bg-blue-500",
//       emoji: "👥",
//     },
//     {
//       label: "Total Pelatih",
//       value: stats.pelatih,
//       color: "bg-green-500",
//       emoji: "🧑‍🏫",
//     },
//     {
//       label: "Jadwal Latihan",
//       value: stats.jadwal,
//       color: "bg-rose-500",
//       emoji: "📅",
//     },
//     {
//       label: "Kegiatan",
//       value: stats.kegiatan,
//       color: "bg-purple-500",
//       emoji: "🎭",
//     },
//   ]};
//   console.log(stats);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {cards.map((c) => (
//           <div
//             key={c.label}
//             className={`${c.color} rounded-xl p-6 text-white shadow-lg`}
//           >
//             <div className="text-4xl mb-2">{c.emoji}</div>
//             <div className="text-3xl font-bold">{c.value}</div>
//             <div className="text-sm opacity-80 mt-1">{c.label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
    anggota: 0,
    pelatih: 0,
    jadwal: 0,
    kegiatan: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);

    const [a, p, j, k] = await Promise.all([
      supabase.from("anggota").select("*", { count: "exact", head: true }),
      supabase.from("pelatih").select("*", { count: "exact", head: true }),
      supabase
        .from("jadwal_latihan")
        .select("*", { count: "exact", head: true }),
      supabase.from("kegiatan").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      anggota: a.count || 0,
      pelatih: p.count || 0,
      jadwal: j.count || 0,
      kegiatan: k.count || 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Anggota",
      value: stats.anggota,
      color: "bg-blue-500",
      emoji: "👥",
    },
    {
      label: "Total Pelatih",
      value: stats.pelatih,
      color: "bg-green-500",
      emoji: "🧑‍🏫",
    },
    {
      label: "Jadwal Latihan",
      value: stats.jadwal,
      color: "bg-rose-500",
      emoji: "📅",
    },
    {
      label: "Kegiatan",
      value: stats.kegiatan,
      color: "bg-purple-500",
      emoji: "🎭",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div
              key={c.label}
              className={`${c.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="text-4xl mb-2">{c.emoji}</div>
              <div className="text-3xl font-bold">{c.value}</div>
              <div className="text-sm opacity-80 mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
