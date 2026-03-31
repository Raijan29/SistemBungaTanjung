import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyForm = { nama: "", email: "", no_hp: "", status: "aktif" };

export default function Anggota() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const { data: rows, error } = await supabase
      .from("anggota")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("DATA:", rows);
    console.log("ERROR:", error);

    setData(rows || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      await supabase.from("anggota").update(form).eq("id", editId);
    } else {
      await supabase.from("anggota").insert(form);
    }
    setLoading(false);
    setShowModal(false);
    setForm(emptyForm);
    setEditId(null);
    fetchData();
  };

  const handleEdit = (row) => {
    setForm({
      nama: row.nama,
      email: row.email,
      no_hp: row.no_hp,
      status: row.status,
    });
    setEditId(row.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus anggota ini?")) return;
    await supabase.from("anggota").delete().eq("id", id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Anggota</h1>
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
          + Tambah Anggota
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">No. HP</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {row.nama}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.email}</td>
                <td className="px-4 py-3 text-gray-600">{row.no_hp}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "aktif"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
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
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Belum ada data anggota
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit" : "Tambah"} Anggota
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Nama", key: "nama", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "No. HP", key: "no_hp", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="aktif">Aktif</option>
                  <option value="tidak aktif">Tidak Aktif</option>
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
                  disabled={loading}
                  className="flex-1  text-white rounded-lg py-2 text-sm font-medium hover:bg-rose-700 disabled:opacity-60"
                  style={{ backgroundColor: "#0b91d2" }}
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
