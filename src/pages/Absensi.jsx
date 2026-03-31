// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// export default function Absensi() {
//   const [data, setData] = useState([]);
//   const [jadwal, setJadwal] = useState([]);
//   const [anggota, setAnggota] = useState([]);
//   const [form, setForm] = useState({
//     jadwal_id: "",
//     anggota_id: "",
//     status: "hadir",
//     keterangan: "",
//   });
//   const [showModal, setShowModal] = useState(false);

//   const fetchAll = async () => {
//     const [abs, j, a] = await Promise.all([
//       supabase
//         .from("absensi")
//         .select(`*, jadwal_latihan(judul), anggota(nama)`)
//         .order("created_at", { ascending: false }),
//       supabase.from("jadwal_latihan").select("id, judul"),
//       supabase.from("anggota").select("id, nama"),
//     ]);
//     setData(abs.data || []);
//     setJadwal(j.data || []);
//     setAnggota(a.data || []);
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await supabase.from("absensi").insert(form);
//     setShowModal(false);
//     setForm({ jadwal_id: "", anggota_id: "", status: "hadir", keterangan: "" });
//     fetchAll();
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Absensi</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.backgroundColor = "#1d4ed8")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.backgroundColor = "#0b91d2")
//           }
//           className="text-white px-5 py-2 rounded-lg text-sm font-medium"
//           style={{ backgroundColor: "#0b91d2" }}
//         >
//           + Catat Absensi
//         </button>
//       </div>
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
//             <tr>
//               {["No", "Jadwal", "Anggota", "Status", "Keterangan"].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {data.map((row, i) => (
//               <tr key={row.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 text-gray-500">{i + 1}</td>
//                 <td className="px-4 py-3">
//                   {row.jadwal_latihan?.judul || "-"}
//                 </td>
//                 <td className="px-4 py-3">{row.anggota?.nama || "-"}</td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       row.status === "hadir"
//                         ? "bg-green-100 text-green-700"
//                         : row.status === "izin"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     {row.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-gray-500">
//                   {row.keterangan || "-"}
//                 </td>
//               </tr>
//             ))}
//             {data.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="text-center py-10 text-gray-400">
//                   Belum ada data absensi
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
//             <h2 className="text-lg font-bold mb-4">Catat Absensi</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Jadwal Latihan
//                 </label>
//                 <select
//                   value={form.jadwal_id}
//                   onChange={(e) =>
//                     setForm({ ...form, jadwal_id: e.target.value })
//                   }
//                   required
//                   className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
//                 >
//                   <option value="">Pilih jadwal...</option>
//                   {jadwal.map((j) => (
//                     <option key={j.id} value={j.id}>
//                       {j.judul}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Anggota
//                 </label>
//                 <select
//                   value={form.anggota_id}
//                   onChange={(e) =>
//                     setForm({ ...form, anggota_id: e.target.value })
//                   }
//                   required
//                   className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
//                 >
//                   <option value="">Pilih anggota...</option>
//                   {anggota.map((a) => (
//                     <option key={a.id} value={a.id}>
//                       {a.nama}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Status
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) => setForm({ ...form, status: e.target.value })}
//                   className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
//                 >
//                   <option value="hadir">Hadir</option>
//                   <option value="izin">Izin</option>
//                   <option value="alpha">Alpha</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Keterangan
//                 </label>
//                 <input
//                   value={form.keterangan}
//                   onChange={(e) =>
//                     setForm({ ...form, keterangan: e.target.value })
//                   }
//                   className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
//                 />
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 bg-rose-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-rose-700"
//                   style={{ backgroundColor: "#0b91d2" }}
//                 >
//                   Simpan
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function Absensi() {
  const [jadwal, setJadwal] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [data, setData] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [form, setForm] = useState({
    jadwal_id: "",
    anggota_id: "",
    status: "hadir",
    keterangan: "",
  });
  const [showModal, setShowModal] = useState(false);

  // Fetch semua jadwal untuk card
  const fetchJadwal = async () => {
    const { data: rows } = await supabase
      .from("jadwal_latihan")
      .select(`*, pelatih(nama), jenis_tari(nama_tari)`)
      .order("tanggal", { ascending: false });
    setJadwal(rows || []);
  };

  // Fetch absensi berdasarkan jadwal yang dipilih
  const fetchAbsensi = async (jadwalId) => {
    const [abs, ang] = await Promise.all([
      supabase
        .from("absensi")
        .select(`*, anggota(nama)`)
        .eq("jadwal_id", jadwalId)
        .order("created_at", { ascending: false }),
      supabase.from("anggota").select("id, nama"),
    ]);
    setData(abs.data || []);
    setAnggota(ang.data || []);
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const handlePilihJadwal = (j) => {
    setSelectedJadwal(j);
    fetchAbsensi(j.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from("absensi").insert({
      ...form,
      jadwal_id: selectedJadwal.id,
    });
    setShowModal(false);
    setForm({ jadwal_id: "", anggota_id: "", status: "hadir", keterangan: "" });
    fetchAbsensi(selectedJadwal.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data absensi ini?")) return;
    await supabase.from("absensi").delete().eq("id", id);
    fetchAbsensi(selectedJadwal.id);
  };

  const statusColor = {
    terjadwal: "bg-blue-100 text-blue-700",
    selesai: "bg-green-100 text-green-700",
    dibatalkan: "bg-red-100 text-red-600",
  };

  // Tampilan card jadwal
  if (!selectedJadwal) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Absensi</h1>
        <p className="text-sm text-gray-500 mb-4">
          Pilih jadwal latihan untuk melihat atau mencatat absensi.
        </p>

        {jadwal.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            Belum ada jadwal latihan
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jadwal.map((j) => (
            <div
              key={j.id}
              onClick={() => handlePilihJadwal(j)}
              className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md hover:border-blue-300 border border-transparent transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">📋</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[j.status] || "bg-gray-100 text-gray-500"}`}
                >
                  {j.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                {j.judul}
              </h3>
              <p className="text-xs text-gray-500 mb-1">
                🎭 {j.jenis_tari?.nama_tari || "-"}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                👤 {j.pelatih?.nama || "-"}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                📅{" "}
                {j.tanggal
                  ? format(new Date(j.tanggal), "dd MMM yyyy", { locale: id })
                  : "-"}
              </p>
              <p className="text-xs text-gray-500">
                🕐 {j.jam_mulai} - {j.jam_selesai}
              </p>
              <div
                className="mt-4 text-center text-xs font-medium text-white py-2 rounded-lg"
                style={{ backgroundColor: "#0b91d2" }}
              >
                Lihat Absensi →
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Tampilan detail absensi setelah card diklik
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setSelectedJadwal(null)}
          className="text-sm text-blue-700 hover:text-red-700 flex items-center gap-1"
        >
          ← Kembali
        </button>
        <span className="text-gray-300">|</span>
        <h1 className="text-2xl font-bold text-gray-800">
          {selectedJadwal.judul}
        </h1>
      </div>

      {/* Info jadwal */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-400 text-xs mb-1">Tanggal</p>
          <p className="font-medium text-gray-700">
            {selectedJadwal.tanggal
              ? format(new Date(selectedJadwal.tanggal), "dd MMM yyyy", {
                  locale: id,
                })
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Waktu</p>
          <p className="font-medium text-gray-700">
            {selectedJadwal.jam_mulai} - {selectedJadwal.jam_selesai}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Pelatih</p>
          <p className="font-medium text-gray-700">
            {selectedJadwal.pelatih?.nama || "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Lokasi</p>
          <p className="font-medium text-gray-700">
            {selectedJadwal.lokasi || "-"}
          </p>
        </div>
      </div>

      {/* Tabel absensi */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Daftar Absensi ({data.length} anggota)
        </h2>
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#1d4ed8")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#0b91d2")
          }
          className="text-white px-5 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "#0b91d2" }}
        >
          + Catat Absensi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              {["No", "Nama Anggota", "Status", "Keterangan", "Aksi"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {row.anggota?.nama || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "hadir"
                        ? "bg-green-100 text-green-700"
                        : row.status === "izin"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {row.keterangan || "-"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Belum ada data absensi untuk jadwal ini
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal catat absensi */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-1">Catat Absensi</h2>
            <p className="text-xs text-gray-400 mb-4">{selectedJadwal.judul}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Anggota
                </label>
                <select
                  value={form.anggota_id}
                  onChange={(e) =>
                    setForm({ ...form, anggota_id: e.target.value })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">Pilih anggota...</option>
                  {anggota.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="hadir">Hadir</option>
                  <option value="izin">Izin</option>
                  <option value="alpha">Alpha</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Keterangan
                </label>
                <input
                  value={form.keterangan}
                  onChange={(e) =>
                    setForm({ ...form, keterangan: e.target.value })
                  }
                  placeholder="Opsional"
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 text-white rounded-lg py-2 text-sm font-medium"
                  style={{ backgroundColor: "#0b91d2" }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
