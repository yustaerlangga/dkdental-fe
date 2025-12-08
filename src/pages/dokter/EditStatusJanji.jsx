import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarDokter from "../../components/dokter/sidebar";
import { getjanjiById, updatejanji } from "../../_services/janji";
import { getPasien } from "../../_services/pasien";
import { getDokter } from "../../_services/dokter";

export default function EditStatusJanji() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({
    status: "Menunggu",
  });

  const [janjiData, setJanjiData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const janjiData = await getjanjiById(id);

        if (janjiData) {
          const data = janjiData.data || janjiData;
          setJanjiData(data);

          setForm({
            status: data.status || "Menunggu",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Gagal memuat data janji temu");
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
      // DOKTER: hanya kirim STATUS saja
      const payload = {
        status: form.status,
      };

      console.log("Dokter mengupdate status:", payload);

      await updatejanji(id, payload);
      alert("Status janji temu berhasil diperbarui!");
      navigate("/dokter/antrean-hari-ini");
    } catch (err) {
      console.error("Error response:", err.response?.data);
      alert(
        `Gagal memperbarui status: ${
          JSON.stringify(err.response?.data) || "Cek console"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dokter/antrean-hari-ini");
  };

  if (initialLoading) {
    return (
      <div className="flex bg-[#f6f5ef] min-h-screen">
        <SidebarDokter
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
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

  if (!janjiData) {
    return (
      <div className="flex bg-[#f6f5ef] min-h-screen">
        <SidebarDokter
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div
          className={`flex-1 transition-all duration-300 p-6`}
          style={{ marginLeft: isCollapsed ? "64px" : "256px" }}
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600">Data janji temu tidak ditemukan</p>
              <button
                onClick={() => navigate("/dokter/jadwal")}
                className="mt-4 text-white bg-[#b49b50] hover:bg-[#a38742] px-4 py-2 rounded-lg"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
      {/* Sidebar DOKTER */}
      <SidebarDokter
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

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
            <h1 className="text-2xl font-bold">Update Status Janji Temu</h1>
            <p className="text-sm opacity-80">
              Update status janji temu pasien
            </p>
            <p className="text-xs mt-2 bg-yellow-600 inline-block px-2 py-1 rounded">
              Mode Dokter: Hanya dapat mengubah status
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-md border border-[#e0d9b6] p-8">
            <h2 className="mb-6 text-2xl font-bold text-[#3d342b] border-b pb-3">
              Update Status Janji Temu
            </h2>

            {/* Informasi Janji Temu */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">
                Informasi Janji Temu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">ID Janji Temu:</span>
                  <span className="ml-2">{id}</span>
                </div>
                <div>
                  <span className="font-medium">Pasien:</span>
                  <span className="ml-2">
                    {janjiData.pasien?.nama_lengkap || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Tanggal:</span>
                  <span className="ml-2">{janjiData.tanggal_janji}</span>
                </div>
                <div>
                  <span className="font-medium">Waktu:</span>
                  <span className="ml-2">{janjiData.waktu_janji}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Keluhan:</span>
                  <span className="ml-2">{janjiData.keluhan}</span>
                </div>
                <div>
                  <span className="font-medium">Status Saat Ini:</span>
                  <span className="ml-2 font-semibold">{janjiData.status}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="status"
                  className="block mb-3 text-sm font-semibold text-[#3d342b]"
                >
                  Update Status Janji Temu
                  <span className="text-[#b49b50] ml-2">
                    *(Pilih status baru)
                  </span>
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
                <p className="text-xs text-gray-500 mt-2">
                  Status saat ini:{" "}
                  <span className="font-semibold">{janjiData.status}</span>
                </p>
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
                      Update Status
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-gray-600 border border-gray-600 hover:bg-gray-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-6 py-3 transition-all"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
