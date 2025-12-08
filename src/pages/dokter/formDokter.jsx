import React, { useEffect, useState } from "react";
import { addDokter } from "../../_services/dokter";
import SidebarPerawat from "../../components/perawat/sidebar";
import SidebarAdmin from "../../components/admin/sidebar";

export default function FormDokter() {
  const [form, setForm] = useState({
    nama_lengkap: "",
    password: "", 
    nomor_str: "",
    spesialisasi: "",
    nomor_telepon: "",
    email: "",
    status_aktif: true, 
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        console.log("ROLE LOADED:", parsed.role);
        setRole(parsed.role);
      } catch (e) {
        console.error("Gagal parse userInfo", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Konversi khusus untuk status_aktif
    if (name === "status_aktif") {
      setForm({
        ...form,
        [name]: value === "true" 
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format payload sesuai backend requirements
    const payload = {
      // Field untuk User (WAJIB)
      email: form.email,
      password: form.password,
      
      // Field untuk Dokter (WAJIB)
      nomor_str: form.nomor_str,
      nama_lengkap: form.nama_lengkap,
      spesialisasi: form.spesialisasi,
      nomor_telepon: form.nomor_telepon,
      
      // Status aktif sebagai boolean
      status_aktif: form.status_aktif,
    };

    console.log("Payload yang dikirim:", payload);
    console.log("Tipe status_aktif:", typeof payload.status_aktif);

    try {
      await addDokter(payload);
      alert("Data dokter berhasil ditambahkan!");
      window.location.href = "/dataDokter"; 
    } catch (err) {
      console.error("Error detail:", err);
      
      // Tampilkan error message yang lebih informatif
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        alert(`Validasi gagal:\n${errorMessages}`);
      } else if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Gagal menyimpan data dokter. Cek console untuk detail.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      nama_lengkap: "",
      password: "",
      nomor_str: "",
      spesialisasi: "",
      nomor_telepon: "",
      email: "",
      status_aktif: true, 
    });
  };

  if (role === null) return <div>Loading...</div>;

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen font-sans">
      {/* Sidebar */}
      {role === "admin" ? (
        <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      ) : (
        <SidebarPerawat isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}

      {/* Content */}
      <div className={`flex-1 transition-all duration-300 p-6 ${isCollapsed ? "ml-16" : "ml-64"}`}>
        <section className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-[#b49b50] px-8 py-4 mb-6 rounded-t-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Form Dokter
            </h2>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e0d9b6]/60 overflow-hidden p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 mb-6 sm:grid-cols-2">
                
                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nama_lengkap"
                    value={form.nama_lengkap}
                    onChange={handleChange}
                    placeholder="Contoh: Dr. Hippocrates"
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] transition-all"
                    required
                  />
                </div>

                {/* Nomor STR */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Nomor STR <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomor_str"
                    value={form.nomor_str}
                    onChange={handleChange}
                    placeholder="1821XXXXXXXXXX"
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] transition-all"
                    required
                  />
                </div>

                {/* Spesialisasi */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Spesialisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="spesialisasi"
                    value={form.spesialisasi}
                    onChange={handleChange}
                    placeholder="Contoh: Bedah Mulut"
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] transition-all"
                    required
                  />
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomor_telepon"
                    value={form.nomor_telepon}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password untuk akun dokter (minimal 8 karakter)"
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] transition-all"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    *Password digunakan untuk login dokter ke sistem (minimal 8 karakter).
                  </p>
                </div>

                {/* Status Aktif - DROPDOWN */}
                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Status Aktif <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status_aktif"
                    value={form.status_aktif.toString()} 
                    onChange={handleChange}
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-3 focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] transition-all"
                    required
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Tidak Aktif</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    *Dokter yang "Tidak Aktif" tidak bisa login ke sistem.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-gray-500 bg-white border border-gray-300 font-medium rounded-lg text-sm px-6 py-2.5 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 transition-all"
                  disabled={loading}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="text-white bg-[#b49b50] hover:bg-[#a38742] font-medium rounded-lg text-sm px-8 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-[#b49b50]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
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
                      Simpan Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}