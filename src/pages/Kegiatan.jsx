import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const emptyForm = {
  nama_kegiatan: "",
  tanggal: "",
  jam_mulai: "",
  jam_selesai: "",
  lokasi: "",
  deskripsi: "",
  status: "upcoming",
};

export default function Kegiatan() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const { data: rows } = await supabase
      .from("kegiatan")
      .select("*")
      .order("tanggal");
    setData(rows || []);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from("kegiatan").update(form).eq("id", editId);
    } else {
      await supabase.from("kegiatan").insert(form);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditId(null);
    fetchData();
  };

  const handleEdit = (row) => {
    setForm({
      nama_kegiatan: row.nama_kegiatan,
      tanggal: row.tanggal,
      jam_mulai: row.jam_mulai,
      jam_selesai: row.jam_selesai,
      lokasi: row.lokasi,
      deskripsi: row.deskripsi,
      status: row.status,
    });
    setEditId(row.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus kegiatan ini?")) return;
    await supabase.from("kegiatan").delete().eq("id", id);
    fetchData();
  };

  const statusColor = {
    upcoming: "bg-blue-100 text-blue-700",
    berlangsung: "bg-yellow-100 text-yellow-700",
    selesai: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Kegiatan</h1>
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
          + Tambah Kegiatan
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              {[
                "No",
                "Nama Kegiatan",
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
                <td className="px-4 py-3 font-medium">{row.nama_kegiatan}</td>
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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[row.status]}`}
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
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Belum ada kegiatan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit" : "Tambah"} Kegiatan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nama Kegiatan
                </label>
                <input
                  value={form.nama_kegiatan}
                  onChange={(e) =>
                    setForm({ ...form, nama_kegiatan: e.target.value })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
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
                  <input
                    type="time"
                    value={form.jam_mulai}
                    onChange={(e) =>
                      setForm({ ...form, jam_mulai: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={form.jam_selesai}
                    onChange={(e) =>
                      setForm({ ...form, jam_selesai: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
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
                  <option value="upcoming">Upcoming</option>
                  <option value="berlangsung">Berlangsung</option>
                  <option value="selesai">Selesai</option>
                </select>
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
