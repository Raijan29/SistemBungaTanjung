import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyForm = {
  nama: "",
  email: "",
  no_hp: "",
  spesialisasi: "",
  status: "aktif",
};

export default function Pelatih() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const { data: rows } = await supabase
      .from("pelatih")
      .select("*")
      .order("created_at", { ascending: false });
    setData(rows || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from("pelatih").update(form).eq("id", editId);
    } else {
      await supabase.from("pelatih").insert(form);
    }
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
      spesialisasi: row.spesialisasi,
      status: row.status,
    });
    setEditId(row.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus pelatih ini?")) return;
    await supabase.from("pelatih").delete().eq("id", id);
    fetchData();
  };

  return (
    <div>
      onClick={() => setShowModal(true)}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Pelatih</h1>
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
          + Tambah Pelatih
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              {[
                "No",
                "Nama",
                "Email",
                "No. HP",
                "Spesialisasi",
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
                <td className="px-4 py-3 font-medium">{row.nama}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.no_hp}</td>
                <td className="px-4 py-3">{row.spesialisasi}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
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
                  Belum ada data pelatih
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
              {editId ? "Edit" : "Tambah"} Pelatih
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Nama", key: "nama", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "No. HP", key: "no_hp", type: "text" },
                { label: "Spesialisasi", key: "spesialisasi", type: "text" },
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
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
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
