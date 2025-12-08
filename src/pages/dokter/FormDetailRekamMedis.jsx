import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarDokter from "../../components/dokter/sidebar";
import { createDetailRekamMedis } from "../../_services/detailRekamMedis";
import { getPerawatan } from "../../_services/perawatan";

export default function FormDetailRekamMedis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [perawatanList, setPerawatanList] = useState([]);
  const [detailItems, setDetailItems] = useState([]);

  const [form, setForm] = useState({
    id_perawatan: "",
    nomor_gigi: "",
    harga: "",
    catatan: "",
  });

  // Fetch data perawatan
  useEffect(() => {
    const fetchPerawatan = async () => {
      const response = await getPerawatan();

      if (response && Array.isArray(response)) {
        setPerawatanList(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setPerawatanList(response.data);
      }
    };

    fetchPerawatan();
  }, []);

  // Auto-set harga ketika pilih perawatan
  useEffect(() => {
    if (form.id_perawatan) {
      const selected = perawatanList.find((p) => p.id == form.id_perawatan);
      if (selected) {
        setForm((prev) => ({ ...prev, harga: selected.harga || "" }));
      }
    }
  }, [form.id_perawatan, perawatanList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDetail = () => {
    if (!form.id_perawatan || !form.nomor_gigi || !form.harga) {
      alert("Harap lengkapi semua field wajib!");
      return;
    }

    const selectedPerawatan = perawatanList.find(
      (p) => p.id == form.id_perawatan
    );
    const newItem = {
      id_perawatan: form.id_perawatan,
      nama_perawatan: selectedPerawatan?.nama_perawatan || "Perawatan",
      nomor_gigi: form.nomor_gigi,
      harga: parseInt(form.harga),
      catatan: form.catatan || "",
    };

    setDetailItems([...detailItems, newItem]);
    setForm({ id_perawatan: "", nomor_gigi: "", harga: "", catatan: "" });
  };

  const handleRemoveDetail = (index) => {
    setDetailItems(detailItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (detailItems.length === 0) {
      alert("Tambahkan minimal satu detail perawatan!");
      return;
    }

    setLoading(true);

    try {
      // Simpan setiap detail
      for (const item of detailItems) {
        const payload = {
          id_rekam_medis: parseInt(id),
          id_perawatan: item.id_perawatan,
          nomor_gigi: item.nomor_gigi,
          harga: item.harga,
          catatan: item.catatan,
        };

        await createDetailRekamMedis(payload);
      }

      alert("Detail perawatan berhasil disimpan!");
      navigate("/dokter/antrean-hari-ini");
    } catch (err) {
      alert("Gagal menyimpan detail perawatan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Batalkan penambahan detail perawatan?")) {
      navigate("/dokter/antrean-hari-ini");
    }
  };

  const totalHarga = detailItems.reduce((sum, item) => sum + item.harga, 0);

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
      <SidebarDokter
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
            <h1 className="text-2xl font-bold">Tambah Detail Perawatan</h1>
            <p className="text-sm opacity-80">
              Rekam Medis ID: <strong>RM-{String(id).padStart(4, "0")}</strong>
            </p>
          </div>

          {/* FORM INPUT DETAIL */}
          <div className="bg-white rounded-xl shadow-md border border-[#e0d9b6] p-6 mb-6">
            <h2 className="text-xl font-bold text-[#3d342b] mb-6">
              Input Detail Perawatan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* JENIS PERAWATAN */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                  Jenis Perawatan *
                </label>
                <select
                  name="id_perawatan"
                  value={form.id_perawatan}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50]"
                  required
                >
                  <option value="">Pilih Perawatan</option>
                  {perawatanList.map((perawatan) => (
                    <option key={perawatan.id} value={perawatan.id}>
                      {perawatan.nama_perawatan} - Rp{" "}
                      {perawatan.harga?.toLocaleString("id-ID")}
                    </option>
                  ))}
                </select>
              </div>

              {/* NOMOR GIGI */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                  Nomor Gigi *
                </label>
                <input
                  type="text"
                  name="nomor_gigi"
                  value={form.nomor_gigi}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50]"
                  placeholder="Contoh: 16, 21, 32"
                  required
                />
              </div>

              {/* HARGA */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
                  name="harga"
                  value={form.harga}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50]"
                  placeholder="500000"
                  min="0"
                  required
                />
              </div>

              {/* TOMBOL TAMBAH */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  + Tambah ke List
                </button>
              </div>
            </div>

            {/* CATATAN */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                Catatan (Opsional)
              </label>
              <textarea
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50]"
                placeholder="Catatan tambahan..."
              />
            </div>
          </div>

          {/* LIST DETAIL YANG SUDAH DITAMBAHKAN */}
          {detailItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-[#e0d9b6] p-6 mb-6">
              <h3 className="text-lg font-semibold text-[#3d342b] mb-4">
                Detail Perawatan ({detailItems.length} item)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#f2f0d6] text-[#3d342b] uppercase text-xs font-bold">
                    <tr>
                      <th className="p-3 text-left">Perawatan</th>
                      <th className="p-3 text-left">Nomor Gigi</th>
                      <th className="p-3 text-right">Harga</th>
                      <th className="p-3 text-left">Catatan</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0d9b6]">
                    {detailItems.map((item, index) => (
                      <tr key={index} className="hover:bg-[#faf9f4]">
                        <td className="p-3">{item.nama_perawatan}</td>
                        <td className="p-3 font-mono">{item.nomor_gigi}</td>
                        <td className="p-3 text-right">
                          Rp {item.harga.toLocaleString("id-ID")}
                        </td>
                        <td className="p-3">
                          <div
                            className="truncate max-w-[200px]"
                            title={item.catatan}
                          >
                            {item.catatan || "-"}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleRemoveDetail(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Hapus"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#f8f5e7]">
                    <tr>
                      <td colSpan="2" className="p-3 font-semibold text-right">
                        Total:
                      </td>
                      <td className="p-3 text-right font-bold text-[#b49b50]">
                        Rp {totalHarga.toLocaleString("id-ID")}
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex items-center gap-4 pt-6 border-t border-[#e0d9b6]">
            <button
              onClick={handleSubmit}
              disabled={loading || detailItems.length === 0}
              className="flex items-center gap-2 text-white bg-[#b49b50] hover:bg-[#a38742] font-medium rounded-lg text-sm px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Simpan Detail Perawatan
                </>
              )}
            </button>

            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 border border-gray-600 hover:bg-gray-600 hover:text-white font-medium rounded-lg text-sm px-6 py-3"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
