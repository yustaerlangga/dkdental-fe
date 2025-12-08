import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPerawatanById, updatePerawatan } from "../../_services/perawatan";
import SidebarAdmin from "../../components/admin/sidebar";

export default function EditPerawatan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // State Form
  const [form, setForm] = useState({
    kode_perawatan: "",
    nama_perawatan: "",
    deskripsi: "",
    harga: "",
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPerawatanById(id);
        if (data) {
          setForm({
            kode_perawatan: data.kode_perawatan || "",
            nama_perawatan: data.nama_perawatan || "",
            deskripsi: data.deskripsi || "",
            harga: data.harga || 0,
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        alert("Data perawatan tidak ditemukan!");
        navigate("/dataPerawatan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, harga: parseInt(form.harga) };
      await updatePerawatan(id, payload);
      alert("Data perawatan berhasil diperbarui!");
      navigate("/dataPerawatan");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui data perawatan (Pastikan Kode tidak duplikat)");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f5ef]">
        <div className="text-[#b49b50] font-bold text-lg animate-pulse">
          Memuat data...
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen font-sans">
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#3d342b]">Edit Layanan Medis</h1>
            <p className="text-gray-500 text-sm mt-1">Perbarui informasi tindakan atau harga layanan</p>
        </div>

        <section className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-[#e0d9b6]/60 overflow-hidden">
            
            <div className="bg-[#b49b50] px-8 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Formulir Edit Perawatan
                </h2>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="kode_perawatan" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Kode Perawatan
                    </label>
                    <input
                      type="text"
                      id="kode_perawatan"
                      name="kode_perawatan"
                      value={form.kode_perawatan}
                      onChange={handleChange}
                      placeholder="Contoh: PRW-001"
                    
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-yellow-600">
                      *Pastikan kode unik dan tidak duplikat.
                    </p>
                  </div>

                  {/* Harga */}
                  <div>
                    <label htmlFor="harga" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      id="harga"
                      name="harga"
                      value={form.harga}
                      onChange={handleChange}
                      min="0"
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Nama Perawatan */}
                  <div className="sm:col-span-2">
                    <label htmlFor="nama_perawatan" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Nama Perawatan
                    </label>
                    <input
                      type="text"
                      id="nama_perawatan"
                      name="nama_perawatan"
                      value={form.nama_perawatan}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Deskripsi */}
                  <div className="sm:col-span-2">
                    <label htmlFor="deskripsi" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Deskripsi
                    </label>
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      value={form.deskripsi}
                      onChange={handleChange}
                      rows="4"
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
                  <Link
                    to="/dataPerawatan"
                    className="text-gray-500 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-2.5 text-center hover:bg-gray-50 hover:text-gray-700 transition-all"
                  >
                    Batal
                  </Link>
                  
                  <button
                    type="submit"
                    className="text-white bg-[#b49b50] hover:bg-[#a38742] focus:ring-4 focus:outline-none focus:ring-[#b49b50]/50 font-medium rounded-lg text-sm px-8 py-2.5 text-center shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}