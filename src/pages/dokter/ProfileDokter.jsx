import React, { useState, useEffect } from "react";
import { 
  User, 
  Stethoscope, 
  Phone, 
  CheckCircle, 
  XCircle, 
  FileText,
  Edit3,
  Save,
  X
} from "lucide-react";
import { getProfileDokter, updateProfileDokter } from "../../_services/dokter"; // IMPORT

export default function ProfileDokter() {
    
  const [profileData, setProfileData] = useState({
    nomor_str: "",
    nama_lengkap: "",
    spesialisasi: "",
    nomor_telepon: "",
    status_aktif: true
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ambil data dokter dari API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProfileDokter();
        setProfileData(data);
        setOriginalData(data);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
        setError("Gagal memuat data profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
  setSaving(true);
  setError("");
  
  try {
    if (!profileData.nomor_str.trim()) {
      throw new Error("Nomor STR harus diisi");
    }
    if (!profileData.nama_lengkap.trim()) {
      throw new Error("Nama lengkap harus diisi");
    }
    if (!profileData.spesialisasi.trim()) {
      throw new Error("Spesialisasi harus diisi");
    }
    if (!profileData.nomor_telepon.trim()) {
      throw new Error("Nomor telepon harus diisi");
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo.id || userInfo.user_id;
    
    await updateProfileDokter(userId, profileData);
    
    setOriginalData(profileData);
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
    
  } catch (error) {
    console.error("Gagal menyimpan profil:", error);
    setError(error.message || "Gagal menyimpan perubahan");
  } finally {
    setSaving(false);
  }
};

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-[#f6f5ef] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b49b50] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-[#f6f5ef] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Profil Dokter</h1>
              <p className="text-white/80 mt-1">Informasi profil Anda</p>
              {error && (
                <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-200 text-sm">
                  ⚠️ {error}
                </div>
              )}
            </div>
            
            {/* Tombol Aksi */}
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-[#b49b50] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
                >
                  <Edit3 size={18} />
                  Edit Profil
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <X size={18} />
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-[#b49b50] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detail Informasi Saja */}
        <div className="bg-white rounded-xl shadow-md border border-[#e0d9b6] p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#b49b50] to-[#8a6e2f] rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{profileData.nama_lengkap || "Data Tidak Tersedia"}</h2>
              <p className="text-[#b49b50] font-medium">{profileData.spesialisasi || "Spesialisasi"}</p>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                profileData.status_aktif 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {profileData.status_aktif ? (
                  <><CheckCircle size={14} /> Aktif</>
                ) : (
                  <><XCircle size={14} /> Non-Aktif</>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div className="space-y-6">
              {/* Nomor STR */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="text-[#b49b50]" size={16} />
                  Nomor STR
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.nomor_str}
                    onChange={(e) => handleChange('nomor_str', e.target.value)}
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-white focus:ring-2 focus:ring-[#b49b50] focus:border-transparent transition"
                    placeholder="Masukkan nomor STR"
                  />
                ) : (
                  <div className="p-3 bg-[#faf9f4] rounded-lg border border-[#e0d9b6]">
                    <p className="text-gray-800 font-medium">
                      {profileData.nomor_str || "Belum diatur"}
                    </p>
                  </div>
                )}
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="text-[#b49b50]" size={16} />
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.nama_lengkap}
                    onChange={(e) => handleChange('nama_lengkap', e.target.value)}
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-white focus:ring-2 focus:ring-[#b49b50] focus:border-transparent transition"
                    placeholder="Masukkan nama lengkap"
                  />
                ) : (
                  <div className="p-3 bg-[#faf9f4] rounded-lg border border-[#e0d9b6]">
                    <p className="text-gray-800 font-medium">
                      {profileData.nama_lengkap || "Data tidak tersedia"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-6">
              {/* Spesialisasi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Stethoscope className="text-[#b49b50]" size={16} />
                  Spesialisasi
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.spesialisasi}
                    onChange={(e) => handleChange('spesialisasi', e.target.value)}
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-white focus:ring-2 focus:ring-[#b49b50] focus:border-transparent transition"
                    placeholder="Masukkan spesialisasi"
                  />
                ) : (
                  <div className="p-3 bg-[#faf9f4] rounded-lg border border-[#e0d9b6]">
                    <p className="text-gray-800 font-medium">
                      {profileData.spesialisasi || "Belum diatur"}
                    </p>
                  </div>
                )}
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="text-[#b49b50]" size={16} />
                  Nomor Telepon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.nomor_telepon}
                    onChange={(e) => handleChange('nomor_telepon', e.target.value)}
                    className="w-full p-3 border border-[#c8c19c] rounded-lg bg-white focus:ring-2 focus:ring-[#b49b50] focus:border-transparent transition"
                    placeholder="Masukkan nomor telepon"
                  />
                ) : (
                  <div className="p-3 bg-[#faf9f4] rounded-lg border border-[#e0d9b6]">
                    <p className="text-gray-800 font-medium">
                      {profileData.nomor_telepon || "Belum diatur"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Aktif - Read Only */}
          <div className="mt-6 pt-6 border-t border-[#e0d9b6]">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status Akun
                </label>
                <p className="text-sm text-gray-500">
                  Status akun tidak dapat diubah melalui halaman ini
                </p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                profileData.status_aktif 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {profileData.status_aktif ? (
                  <><CheckCircle size={18} /> Aktif</>
                ) : (
                  <><XCircle size={18} /> Non-Aktif</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}