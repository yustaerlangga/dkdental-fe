import React, { useState, useEffect } from "react";
import SidebarPerawat from "../../components/perawat/sidebar";
import SidebarAdmin from "../../components/admin/sidebar";
import { addJanji } from "../../_services/janji";
import { getPasien } from "../../_services/pasien";
import { getDokter } from "../../_services/dokter";

export default function FormJanji() {
  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({
    id_pasien: "",
    id_dokter: "",
    tanggal_janji: "",
    waktu_janji: "",
    keluhan: "",
    status: "Menunggu",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);


  // --- FETCH DATA (Pasien & Dokter) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pasienData, dokterData] = await Promise.all([
          getPasien(),
          getDokter(),
        ]);

        //  DEBUG: CEK STRUCTURE DATA
        console.log("=== DATA PASIEN ===", pasienData);
        console.log("=== DATA DOKTER ===", dokterData);

        setPasienList(Array.isArray(pasienData) ? pasienData : []);
        setDokterList(Array.isArray(dokterData) ? dokterData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

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
  

  // --- HANDLERS ---
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  VALIDASI CLIENT-SIDE
    if (
      !form.id_pasien ||
      !form.id_dokter ||
      !form.tanggal_janji ||
      !form.waktu_janji ||
      !form.keluhan
    ) {
      alert("Harap lengkapi semua field yang wajib diisi!");
      return;
    }

    setLoading(true);

    //  TRANSFORM DATA & CONVERT KE INTEGER
    const payload = {
      id_pasien: parseInt(form.id_pasien),
      id_dokter: parseInt(form.id_dokter),
      tanggal_janji: form.tanggal_janji,
      waktu_janji: form.waktu_janji,
      keluhan: form.keluhan,
      status: form.status,
    };

    console.log("📤 Payload yang dikirim:", payload);

    try {
      await addJanji(payload);
      alert("Data janji temu berhasil ditambahkan!");
      window.location.href = "/dataJanji";
    } catch (err) {
      console.error("❌ Full error:", err);

      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        console.log("🔍 Validation errors detail:", validationErrors);

        const errorMessages = Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("\n");

        alert(`Validasi gagal:\n${errorMessages}`);
      } else {
        alert("Gagal menyimpan data. Cek koneksi atau isian form.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      id_pasien: "",
      id_dokter: "",
      tanggal_janji: "",
      waktu_janji: "",
      keluhan: "",
      status: "Menunggu",
    });
  };

  // Helper: Mendapatkan tanggal hari ini (YYYY-MM-DD)
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
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

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 p-6`}
        style={{
          marginLeft: isCollapsed ? "64px" : "256px",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
            <h1 className="text-2xl font-bold">Form Janji Temu</h1>
            <p className="text-sm opacity-80">
              Buat janji temu baru untuk pasien
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-md border border-[#e0d9b6] p-8">
            <h2 className="mb-6 text-2xl font-bold text-[#3d342b] border-b pb-3">
              Data Janji Temu
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                {/* --- PILIH PASIEN --- */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="id_pasien"
                    className="block mb-3 text-sm font-semibold text-[#3d342b]"
                  >
                    Pilih Pasien
                  </label>
                  <select
                    id="id_pasien"
                    name="id_pasien"
                    value={form.id_pasien}
                    onChange={handleChange}
                    className="bg-[#f8f5e7] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 cursor-pointer"
                    required
                  >
                    <option value="">-- Pilih Pasien --</option>
                    {pasienList.map((pasien) => (
                      <option key={pasien.id} value={pasien.id}>
                        {pasien.nama_lengkap} - {pasien.nomor_telepon}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- PILIH DOKTER --- */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="id_dokter"
                    className="block mb-3 text-sm font-semibold text-[#3d342b]"
                  >
                    Pilih Dokter
                  </label>
                  <select
                    id="id_dokter"
                    name="id_dokter"
                    value={form.id_dokter}
                    onChange={handleChange}
                    className="bg-[#f8f5e7] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 cursor-pointer"
                    required
                  >
                    <option value="">-- Pilih Dokter --</option>
                    {dokterList.map((dokter) => (
                      <option key={dokter.id} value={dokter.id}>
                        {dokter.nama_lengkap} - {dokter.spesialisasi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- TANGGAL JANJI --- */}
                <div>
                  <label
                    htmlFor="tanggal_janji"
                    className="block mb-3 text-sm font-semibold text-[#3d342b]"
                  >
                    Tanggal Janji Temu
                  </label>
                  <input
                    type="date"
                    id="tanggal_janji"
                    name="tanggal_janji"
                    value={form.tanggal_janji}
                    onChange={handleChange}
                    min={getTodayDate()}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="bg-[#f8f5e7] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 cursor-pointer"
                    required
                  />
                </div>

                {/* --- WAKTU JANJI --- */}
                <div>
                  <label
                    htmlFor="waktu_janji"
                    className="block mb-3 text-sm font-semibold text-[#3d342b]"
                  >
                    Waktu Janji Temu
                  </label>
                  <input
                    type="time"
                    id="waktu_janji"
                    name="waktu_janji"
                    value={form.waktu_janji}
                    onChange={handleChange}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="bg-[#f8f5e7] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 cursor-pointer"
                    required
                  />
                </div>

                {/* --- KELUHAN --- */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="keluhan"
                    className="block mb-3 text-sm font-semibold text-[#3d342b]"
                  >
                    Keluhan Pasien
                  </label>
                  <textarea
                    id="keluhan"
                    name="keluhan"
                    value={form.keluhan}
                    onChange={handleChange}
                    placeholder="Masukkan keluhan utama pasien..."
                    rows={4}
                    className="bg-[#f8f5e7] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 resize-none"
                    required
                  />
                </div>

                {/* --- STATUS --- */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="status"
                    className="block mb-3 text-sm font-semibold text-[#3d342b]"
                  >
                    Status Janji Temu
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="bg-[#f8f5e7] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 cursor-pointer"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* --- BUTTONS --- */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#e0d9b6]">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 text-white bg-[#b49b50] hover:bg-[#a38742] focus:ring-4 focus:outline-none focus:ring-[#b49b50]/50 font-medium rounded-lg text-sm px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Simpan Janji Temu
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3 transition-all"
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
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
