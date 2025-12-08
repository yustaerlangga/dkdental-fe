import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getjanjiById } from "../../_services/janji";
import { addRekammedis, getRekammedis } from "../../_services/rekammedis";
import SidebarDokter from "../../components/dokter/sidebar";

export default function FormRekamMedis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [janjiData, setJanjiData] = useState(null);
  const [riwayatPasien, setRiwayatPasien] = useState([]);

  const [form, setForm] = useState({
    anamnesis: "",
    diagnosa: "",
    catatan: "",
    tanggal_perawatan: new Date().toISOString().split("T")[0],
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseJanji = await getjanjiById(id);
        const dataJanji = responseJanji.data || responseJanji;

        if (!dataJanji) {
          throw new Error("Data janji temu tidak ditemukan");
        }

        setJanjiData(dataJanji);

        if (dataJanji.id_pasien) {
          await fetchRiwayatPasien(dataJanji.id_pasien);
        }
      } catch (err) {
        alert("Gagal memuat data janji temu");
        navigate("/dokter/antrean-hari-ini");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // --- FETCH RIWAYAT PASIEN ---
  const fetchRiwayatPasien = async (idPasien) => {
    try {
      const response = await getRekammedis();
      const semuaRekamMedis = response.data || response;

      if (Array.isArray(semuaRekamMedis)) {
        const riwayat = semuaRekamMedis.filter(
          (rm) => rm.id_pasien === idPasien
        );
        setRiwayatPasien(riwayat);
      }
    } catch (err) {
      // Tidak menampilkan error jika gagal mengambil riwayat
    }
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.anamnesis.trim() || !form.diagnosa.trim()) {
      alert("Anamnesis dan Diagnosa wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id_janji_temu: parseInt(id),
        id_pasien: janjiData.id_pasien,
        id_dokter: janjiData.id_dokter,
        anamnesis: form.anamnesis.trim(),
        diagnosa: form.diagnosa.trim(),
        catatan: form.catatan.trim(),
        tanggal_perawatan: form.tanggal_perawatan,
      };

      const response = await addRekammedis(payload);
      const rekamMedisId = response.data?.id || response.id;

      alert("Rekam medis berhasil disimpan");
      navigate(`/dokter/detail-rekam-medis/${rekamMedisId}`);
    } catch (err) {
      alert(`Gagal menyimpan rekam medis`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Data yang sudah diinput akan hilang. Yakin ingin kembali?"
      )
    ) {
      navigate("/dokter/antrean-hari-ini");
    }
  };

  // --- FORMAT TANGGAL ---
  const formatTanggal = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString || "-";
    }
  };

  // --- LOADING STATE ---
  if (initialLoading) {
    return (
      <div className="flex bg-[#f6f5ef] min-h-screen">
        <SidebarDokter
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div className={`flex-1 p-6 ${isCollapsed ? "ml-16" : "ml-64"}`}>
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#b49b50] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
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
        <div className={`flex-1 p-6 ${isCollapsed ? "ml-16" : "ml-64"}`}>
          <div className="text-center py-20">
            <p className="text-gray-600">Data tidak ditemukan</p>
            <button
              onClick={() => navigate("/dokter/antrean-hari-ini")}
              className="mt-4 bg-[#b49b50] text-white px-4 py-2 rounded-lg"
            >
              Kembali ke Antrean
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
      <SidebarDokter
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className={`flex-1 p-6 ${isCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="bg-[#b49b50] text-white p-6 rounded-xl mb-6">
            <h1 className="text-2xl font-bold">Rekam Medis Baru</h1>
            <p className="text-sm opacity-80">
              Isi data rekam medis untuk pasien
            </p>
          </div>

          {/* INFORMASI PASIEN */}
          <div className="bg-white rounded-xl border border-[#e0d9b6] p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#3d342b] mb-4">
              Informasi Pasien
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Nama Pasien:</span>
                <p className="text-gray-900">
                  {janjiData.pasien?.nama_lengkap || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Tanggal Janji:
                </span>
                <p className="text-gray-900">
                  {formatTanggal(janjiData.tanggal_janji)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Keluhan:</span>
                <p className="text-gray-900">{janjiData.keluhan || "-"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">No. Janji:</span>
                <p className="text-gray-900">{id}</p>
              </div>
            </div>

            {/* RIWAYAT REKAM MEDIS SEBELUMNYA */}
            {riwayatPasien.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Riwayat Rekam Medis
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {riwayatPasien
                    .slice()
                    .reverse()
                    .map((rm, idx) => (
                      <div
                        key={rm.id || idx}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">
                            {formatTanggal(rm.tanggal_perawatan)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Kunjungan {riwayatPasien.length - idx}
                          </span>
                        </div>

                        <div className="text-sm">
                          <div className="mb-1">
                            <span className="font-medium text-gray-600">
                              Diagnosa:
                            </span>
                            <p className="text-gray-800">
                              {rm.diagnosa || "-"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Anamnesis:
                            </span>
                            <p className="text-gray-800 line-clamp-2">
                              {rm.anamnesis || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* FORM REKAM MEDIS BARU */}
          <div className="bg-white rounded-xl border border-[#e0d9b6] p-6">
            <h2 className="text-xl font-bold text-[#3d342b] mb-6">
              Data Rekam Medis Baru
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Tanggal Perawatan
                  </label>
                  <input
                    type="date"
                    name="tanggal_perawatan"
                    value={form.tanggal_perawatan}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Anamnesis <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="anamnesis"
                    value={form.anamnesis}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] resize-vertical"
                    placeholder="Masukkan hasil anamnesis..."
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Diagnosa <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="diagnosa"
                    value={form.diagnosa}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] resize-vertical"
                    placeholder="Masukkan diagnosa..."
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#3d342b]">
                    Catatan Tambahan
                  </label>
                  <textarea
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-[#f8f5e7] focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] resize-vertical"
                    placeholder="Catatan tambahan (opsional)..."
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-[#e0d9b6]">
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
                    <>Simpan Rekam Medis</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-gray-600 border border-gray-600 hover:bg-gray-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-6 py-3 transition-all"
                >
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
