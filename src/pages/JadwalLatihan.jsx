import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const emptyForm = {
  judul: "",
  jenis_tari_id: "",
  pelatih_id: "",
  tanggal: "",
  jam_mulai: "",
  jam_selesai: "",
  lokasi: "",
  keterangan: "",
  status: "terjadwal",
};

export default function JadwalLatihan() {
  const [data, setData] = useState([]);
  const [pelatih, setPelatih] = useState([]);
  const [jenisTari, setJenisTari] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchAll = async () => {
    const [jadwal, p, jt] = await Promise.all([
      supabase
        .from("jadwal_latihan")
        .select(`*, pelatih(nama), jenis_tari(nama_tari)`)
        .order("tanggal"),
      supabase.from("pelatih").select("id, nama"),
      supabase.from("jenis_tari").select("id, nama_tari"),
    ]);
    setData(jadwal.data || []);
    setPelatih(p.data || []);
    setJenisTari(jt.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from("jadwal_latihan").update(form).eq("id", editId);
    } else {
      await supabase.from("jadwal_latihan").insert(form);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditId(null);
    fetchAll();
  };

  const handleEdit = (row) => {
    setForm({
      judul: row.judul,
      jenis_tari_id: row.jenis_tari_id,
      pelatih_id: row.pelatih_id,
      tanggal: row.tanggal,
      jam_mulai: row.jam_mulai,
      jam_selesai: row.jam_selesai,
      lokasi: row.lokasi,
      keterangan: row.keterangan,
      status: row.status,
    });
    setEditId(row.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus jadwal ini?")) return;
    await supabase.from("jadwal_latihan").delete().eq("id", id);
    fetchAll();
  };

  const statusColor = {
    terjadwal: "bg-blue-100 text-blue-700",
    selesai: "bg-green-100 text-green-700",
    dibatalkan: "bg-red-100 text-red-600",
  };
  // Tambahkan array jam di atas return, setelah useState
  const jamOptions = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Jadwal Latihan</h1>
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
          + Tambah Jadwal
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              {[
                "No",
                "Judul",
                "Jenis Tari",
                "Pelatih",
                "Tanggal",
                "Waktu",
                "Lokasi",
                "Status",
                "Aksi",
              ].map((h) => (
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
                <td className="px-4 py-3 font-medium text-gray-800">
                  {row.judul}
                </td>
                <td className="px-4 py-3">
                  {row.jenis_tari?.nama_tari || "-"}
                </td>
                <td className="px-4 py-3">{row.pelatih?.nama || "-"}</td>
                <td className="px-4 py-3">
                  {row.tanggal
                    ? format(new Date(row.tanggal), "dd MMM yyyy", {
                        locale: id,
                      })
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  {row.jam_mulai} - {row.jam_selesai}
                </td>
                <td className="px-4 py-3">{row.lokasi}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[row.status] || ""}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
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
                <td colSpan={9} className="text-center py-10 text-gray-400">
                  Belum ada jadwal
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit" : "Tambah"} Jadwal Latihan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Judul
                </label>
                <input
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Jenis Tari
                  </label>
                  <select
                    value={form.jenis_tari_id}
                    onChange={(e) =>
                      setForm({ ...form, jenis_tari_id: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="">Pilih...</option>
                    {jenisTari.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama_tari}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Pelatih
                  </label>
                  <select
                    value={form.pelatih_id}
                    onChange={(e) =>
                      setForm({ ...form, pelatih_id: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="">Pilih...</option>
                    {pelatih.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) =>
                    setForm({ ...form, tanggal: e.target.value })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Jam Mulai
                  </label>
                  <select
                    value={form.jam_mulai}
                    onChange={(e) =>
                      setForm({ ...form, jam_mulai: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="">Pilih jam...</option>
                    {[
                      "07:00",
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                      "21:00",
                      "22:00",
                      "23:00",
                    ].map((jam) => (
                      <option key={jam} value={jam}>
                        {jam}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Jam Selesai
                  </label>
                  <select
                    value={form.jam_selesai}
                    onChange={(e) =>
                      setForm({ ...form, jam_selesai: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="">Pilih jam...</option>
                    {[
                      "07:00",
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                      "21:00",
                      "22:00",
                      "23:00",
                    ].map((jam) => (
                      <option key={jam} value={jam}>
                        {jam}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Lokasi
                </label>
                <input
                  value={form.lokasi}
                  onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
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
                  <option value="terjadwal">Terjadwal</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
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
