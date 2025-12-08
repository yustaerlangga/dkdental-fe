import React, { useEffect, useState } from "react";
import { addPasien } from "../../_services/pasien";
import SidebarPerawat from "../../components/perawat/sidebar";
import SidebarAdmin from "../../components/admin/sidebar";

export default function FormPasien() {
  const [form, setForm] = useState({
    nomor_rekam_medis: "",
    nama_lengkap: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    nomor_telepon: "",
    alamat: "",
    email: "",
    riwayat_alergi: "",
    tanggalDibuat: "", 
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [role, setRole] = useState(null);

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
  
  if (role === null) {
    return <div>Loading...</div>;
  }
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPasien(form);
      alert("Data pasien berhasil ditambahkan!");
      window.location.href = "/dataPasien"; 
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data pasien");
    }
  };

  const handleReset = () => {
    setForm({
      nomor_rekam_medis: "",
      nama_lengkap: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      nomor_telepon: "",
      alamat: "",
      email: "",
      riwayat_alergi: "",
      tanggalDibuat: "",
    });
  };

  return (
    
    <div className="flex bg-[#f6f5ef] min-h-screen font-sans">
      {/* Sidebar */}
      {role === "admin" ? (
        <SidebarAdmin
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      ) : (
        <SidebarPerawat
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}

      {/* Content Wrapper */}
      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header Judul Halaman */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#3d342b]">
            Manajemen Pasien
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Input data pasien baru ke dalam sistem
          </p>
        </div>

        <section className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-[#e0d9b6]/60 overflow-hidden">
            <div className="bg-[#b49b50] px-8 py-4">
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
                Formulir Pasien Baru
              </h2>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 sm:grid-cols-2">
                  {/* Nama Lengkap */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="nama_lengkap"
                      className="block mb-2 text-sm font-semibold text-[#3d342b]"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={form.nama_lengkap}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap pasien"
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label
                      htmlFor="tanggal_lahir"
                      className="block mb-2 text-sm font-semibold text-[#3d342b]"
                    >
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      value={form.tanggal_lahir}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label
                      htmlFor="jenis_kelamin"
                      className="block mb-2 text-sm font-semibold text-[#3d342b]"
                    >
                      Jenis Kelamin
                    </label>
                    <select
                      id="jenis_kelamin"
                      name="jenis_kelamin"
                      value={form.jenis_kelamin}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    >
                      <option value="">-- Pilih --</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label
                      htmlFor="nomor_telepon"
                      className="block mb-2 text-sm font-semibold text-[#3d342b]"
                    >
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      id="nomor_telepon"
                      name="nomor_telepon"
                      value={form.nomor_telepon}
                      onChange={handleChange}
                      placeholder="08xxxxxxxxxx"
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-semibold text-[#3d342b]"
                    >
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                    />
                  </div>

                  {/* Alamat */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="alamat"
                      className="block mb-2 text-sm font-semibold text-[#3d342b]"
                    >
                      Alamat Lengkap
                    </label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={form.alamat}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Jalan, RT/RW, Kelurahan..."
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                      required
                    />
                  </div>

                  {/* Riwayat Alergi */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="riwayat_alergi"
                      className="block mb-2 text-sm font-semibold text-[#3d342b]"
                    >
                      Riwayat Alergi
                    </label>
                    <textarea
                      id="riwayat_alergi"
                      name="riwayat_alergi"
                      value={form.riwayat_alergi}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Contoh: Debu, Obat Antibiotik, Makanan Laut (Kosongkan jika tidak ada)"
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
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