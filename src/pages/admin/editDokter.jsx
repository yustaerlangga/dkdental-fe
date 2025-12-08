import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getDokterById, updateDokter } from "../../_services/dokter";
import SidebarAdmin from "../../components/admin/sidebar";

export default function EditDokter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // State Form
  const [form, setForm] = useState({
    nomor_str: "",
    nama_lengkap: "",
    spesialisasi: "",
    nomor_telepon: "",
    email: "",
    status_aktif: "1", 
  });

  // 1. Fetch Data Saat Halaman Dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDokterById(id);
        if (data) {
          setForm({
            nomor_str: data.nomor_str || "",
            nama_lengkap: data.nama_lengkap || "",
            spesialisasi: data.spesialisasi || "",
            nomor_telepon: data.nomor_telepon || "",
            email: data.email || "",
            status_aktif: String(data.status_aktif), 
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        alert("Data dokter tidak ditemukan!");
        navigate("/dataDokter");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // 2. Handle Perubahan Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Handle Submit (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...form, 
        status_aktif: parseInt(form.status_aktif) 
      };
      
      await updateDokter(id, payload);
      alert("Data dokter berhasil diperbarui!");
      navigate("/dataDokter");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui data dokter");
    }
  };

  // Loading UI
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
      
      {/* Sidebar Admin */}
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Content Wrapper */}
      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header Judul Halaman */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#3d342b]">Edit Data Dokter</h1>
            <p className="text-gray-500 text-sm mt-1">Perbarui informasi profil, kontak, atau status aktif dokter</p>
        </div>

        <section className="max-w-4xl mx-auto">
          {/* Kartu Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e0d9b6]/60 overflow-hidden">
            
            {/* Header Form (Warna Emas) */}
            <div className="bg-[#b49b50] px-8 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Formulir Edit Dokter
                </h2>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 sm:grid-cols-2">
                  
                  {/* Nama Lengkap */}
                  <div className="sm:col-span-2">
                    <label htmlFor="nama_lengkap" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Nama Lengkap (dengan Gelar)
                    </label>
                    <input
                      type="text"
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={form.nama_lengkap}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Nomor STR */}
                  <div>
                    <label htmlFor="nomor_str" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Nomor STR
                    </label>
                    <input
                      type="text"
                      id="nomor_str"
                      name="nomor_str"
                      value={form.nomor_str}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Spesialisasi */}
                  <div>
                    <label htmlFor="spesialisasi" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Spesialisasi
                    </label>
                    <input
                      type="text"
                      id="spesialisasi"
                      name="spesialisasi"
                      value={form.spesialisasi}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label htmlFor="nomor_telepon" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      id="nomor_telepon"
                      name="nomor_telepon"
                      value={form.nomor_telepon}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Status Aktif Dropdown */}
                  <div className="sm:col-span-2">
                    <label htmlFor="status_aktif" className="block mb-2 text-sm font-semibold text-[#3d342b]">
                      Status Keaktifan
                    </label>
                    <select
                      id="status_aktif"
                      name="status_aktif"
                      value={form.status_aktif}
                      onChange={handleChange}
                      className={`border text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all ${
                        form.status_aktif === "1" 
                          ? "bg-green-50 border-green-300 text-green-900" 
                          : "bg-red-50 border-red-300 text-red-900"
                      }`}
                    >
                      <option value="1">Aktif (Praktik Berjalan)</option>
                      <option value="0">Tidak Aktif (Cuti/Resign)</option>
                    </select>
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
                  <Link
                    to="/dataDokter"
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