import React, { useState } from "react";
import { addPerawatan } from "../../_services/perawatan"; 
import SidebarAdmin from "../../components/admin/sidebar";

export default function FormPerawatan() {
  const [form, setForm] = useState({
    kode_perawatan: "",
    nama_perawatan: "",
    deskripsi: "",
    harga: "",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

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
      
      await addPerawatan(payload);
      alert("Data perawatan berhasil ditambahkan!");
      window.location.href = "/dataPerawatan"; 
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data perawatan");
    }
  };

  const handleReset = () => {
    setForm({
      kode_perawatan: "",
      nama_perawatan: "",
      deskripsi: "",
      harga: "",
    });
  };

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen font-sans">
      
      {/* Sidebar */}
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Content Wrapper */}
      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header Judul Halaman */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#3d342b]">Manajemen Layanan</h1>
            <p className="text-gray-500 text-sm mt-1">Input data perawatan atau tindakan medis baru</p>
        </div>

        <section className="max-w-4xl mx-auto">
          {/* Kartu Form dengan style 'Pop' shadow halus */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e0d9b6]/60 overflow-hidden">
            
            {/* Header Form dengan warna Emas (#b49b50) */}
            <div className="bg-[#b49b50] px-8 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {/* Icon Medical Kit / Plus */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Formulir Tambah Perawatan
                </h2>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 sm:grid-cols-2">
                  
                  {/* Kode Perawatan */}
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
                      placeholder="Contoh: 150000"
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
                      placeholder="Contoh: Scaling Gigi / Cabut Gigi Bungsu"
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
                      placeholder="Jelaskan detail tindakan atau perawatan ini..."
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-gray-500 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-2.5 text-center hover:bg-gray-50 hover:text-gray-700 transition-all"
                  >
                    Reset
                  </button>
                  
                  <button
                    type="submit"
                    className="text-white bg-[#b49b50] hover:bg-[#a38742] focus:ring-4 focus:outline-none focus:ring-[#b49b50]/50 font-medium rounded-lg text-sm px-8 py-2.5 text-center shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Simpan Perawatan
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