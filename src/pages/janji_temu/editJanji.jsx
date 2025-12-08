import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarPerawat from "../../components/perawat/sidebar";
import { getjanjiById, updatejanji } from "../../_services/janji";
import { getPasien } from "../../_services/pasien";
import { getDokter } from "../../_services/dokter";

export default function EditJanji() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({
    id_pasien: "",
    id_dokter: "",
    tanggal_janji: "",
    waktu_janji: "",
    keluhan: "",
    status: "menunggu",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- FETCH DATA (Pasien & Dokter) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data secara paralel agar lebih cepat
        const [pasienData, dokterData, janjiData] = await Promise.all([
          getPasien(),
          getDokter(),
          getjanjiById(id)
        ]);
        
        // Validasi agar data selalu berupa array
        setPasienList(Array.isArray(pasienData) ? pasienData : []);
        setDokterList(Array.isArray(dokterData) ? dokterData : []);
        
        // Set form dengan data janji temu
        if (janjiData) {
          // Handle nested data structure
          const data = janjiData.data || janjiData;
          
          // Format waktu ke HH:mm
          const formattedWaktu = data.waktu_janji ? 
            data.waktu_janji.substring(0, 5) : 
            data.waktu_janji;

          setForm({
            id_pasien: data.id_pasien || "",
            id_dokter: data.id_dokter || "",
            tanggal_janji: data.tanggal_janji || "",
            waktu_janji: formattedWaktu || "",
            keluhan: data.keluhan || "",
            status: data.status || "menunggu",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format waktu ke H:i (HH:mm)
      const formattedWaktuJanji = form.waktu_janji ? 
        form.waktu_janji.substring(0, 5) : 
        form.waktu_janji;

      // Convert ke number untuk id_pasien dan id_dokter
      const payload = {
        ...form,
        id_pasien: Number(form.id_pasien),
        id_dokter: Number(form.id_dokter),
        waktu_janji: formattedWaktuJanji,
      };
      
      console.log("Payload yang dikirim:", payload);
      
      await updatejanji(id, payload);
      alert("Data janji temu berhasil diperbarui!");
      navigate("/dataJanji");
    } catch (err) {
      console.error("Error response:", err.response?.data);
      alert(`Gagal memperbarui data: ${JSON.stringify(err.response?.data) || "Cek console"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dataJanji");
  };

  // Helper: Mendapatkan tanggal hari ini (YYYY-MM-DD)
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (initialLoading) {
    return (
      <div className="flex bg-[#f6f5ef] min-h-screen">
        <SidebarPerawat isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div 
          className={`flex-1 transition-all duration-300 p-6`}
          style={{ marginLeft: isCollapsed ? "64px" : "256px" }}
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#b49b50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data janji temu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
      {/* Sidebar */}
      <SidebarPerawat isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

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
            <h1 className="text-2xl font-bold">Edit Janji Temu</h1>
            <p className="text-sm opacity-80">Edit data janji temu pasien</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-md border border-[#e0d9b6] p-8">
            <h2 className="mb-6 text-2xl font-bold text-[#3d342b] border-b pb-3">
              Edit Data Janji Temu
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
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
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
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
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
                      Memperbarui...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Perbarui Janji Temu
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-gray-600 border border-gray-600 hover:bg-gray-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-6 py-3 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}