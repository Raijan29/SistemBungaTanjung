import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Absensi() {
  const [data, setData] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [form, setForm] = useState({
    jadwal_id: "",
    anggota_id: "",
    status: "hadir",
    keterangan: "",
  });
  const [showModal, setShowModal] = useState(false);

  const fetchAll = async () => {
    const [abs, j, a] = await Promise.all([
      supabase
        .from("absensi")
        .select(`*, jadwal_latihan(judul), anggota(nama)`)
        .order("created_at", { ascending: false }),
      supabase.from("jadwal_latihan").select("id, judul"),
      supabase.from("anggota").select("id, nama"),
    ]);
    setData(abs.data || []);
    setJadwal(j.data || []);
    setAnggota(a.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from("absensi").insert(form);
    setShowModal(false);
    setForm({ jadwal_id: "", anggota_id: "", status: "hadir", keterangan: "" });
    fetchAll();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Absensi</h1>
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
              {["No", "Jadwal", "Anggota", "Status", "Keterangan"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3">
                  {row.jadwal_latihan?.judul || "-"}
                </td>
                <td className="px-4 py-3">{row.anggota?.nama || "-"}</td>
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
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Belum ada data absensi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Catat Absensi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Jadwal Latihan
                </label>
                <select
                  value={form.jadwal_id}
                  onChange={(e) =>
                    setForm({ ...form, jadwal_id: e.target.value })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">Pilih jadwal...</option>
                  {jadwal.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.judul}
                    </option>
                  ))}
                </select>
              </div>
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
                  className="flex-1 bg-rose-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-rose-700"
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
