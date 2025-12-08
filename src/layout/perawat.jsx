// File: src/layout/perawat.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// --- COMPONENTS ---
import Footer from "../components/footer";
import SidebarPerawat from "../components/perawat/sidebar";
import HeroPerawat from "../components/perawat/hero";

// --- SERVICES ---
import { getPasien, addPasien as serviceAddPasien } from "../_services/pasien";
import { getDokter } from "../_services/dokter";

function PerawatLayout() {
  const navigate = useNavigate();
  
  // State UI
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // State Data Global
  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);

  // 1. Cek Login & Ambil Data saat Layout dimuat
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.warn("Token tidak ditemukan, redirect ke login.");
      navigate("/login");
    } else {
      fetchGlobalData();
    }
  }, []); 

  // 2. Fungsi Fetch Data Global
  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      
      // Gunakan Promise.all agar request jalan berbarengan
      const [resPasien, resDokter] = await Promise.all([
        getPasien(),
        getDokter()
      ]);

      // Normalisasi Data Pasien
      const dataPasienFix = Array.isArray(resPasien) ? resPasien : (resPasien.data || []);
      setPasienList(dataPasienFix);

      // Normalisasi Data Dokter
      const dataDokterFix = Array.isArray(resDokter) ? resDokter : (resDokter.data || []);
      setDokterList(dataDokterFix);

    } catch (err) {
      console.error("Error fetch data global di Layout:", err);
      if (err.response && err.response.status === 401) {
         navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Fungsi Tambah Pasien
  const handleAddPasien = async (dataInput) => {
    try {
      const payload = {
        nama_lengkap: dataInput.nama_lengkap,
        tanggal_lahir: dataInput.tanggal_lahir,
        jenis_kelamin: dataInput.jenis_kelamin,
        nomor_telepon: dataInput.nomor_telepon,
        alamat: dataInput.alamat,
        email: dataInput.email || null,
        riwayat_alergi: dataInput.riwayat_alergi,
      };

      // Panggil API lewat Service
      const res = await serviceAddPasien(payload);
      
      // Update state lokal agar UI langsung berubah tanpa refresh
      const newPasien = res.data || res; 
      setPasienList((prev) => [...prev, newPasien]);

      return newPasien;
    } catch (err) {
      console.error("Error addPasien:", err);
      throw err; 
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      {/* Sidebar Global */}
      <SidebarPerawat isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Wrapper Konten Utama */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header Global */}
        <HeroPerawat />

        <main className="p-6">
          
          {/* Outlet mengirim Context ke semua halaman anak (Dashboard, DataJanji, dll) */}
          <Outlet 
            context={{ 
              // Data
              pasienList, 
              dokterList,
              loading,

              // Actions
              addPasien: handleAddPasien, 
              refreshData: fetchGlobalData, 
              
              // UI Control
              isCollapsed, 
              setIsCollapsed
            }} 
          />
        </main>
      </div>
    </div>
  );
}

export default PerawatLayout;