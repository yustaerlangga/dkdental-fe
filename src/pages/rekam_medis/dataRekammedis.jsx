import React, { useState, useEffect } from "react";
import SidebarPerawat from "../../components/perawat/sidebar";
import SidebarAdmin from "../../components/admin/sidebar";
import { deleteRekammedis, getRekammedis } from "../../_services/rekammedis";
import { getPasien } from "../../_services/pasien";
import { getDokter } from "../../_services/dokter";

export default function DataRekamMedis() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [rekamMedisList, setRekamMedisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
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


  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const resRekamMedis = await getRekammedis();
        let rekamMedisData = [];
        
        if (Array.isArray(resRekamMedis)) {
          rekamMedisData = resRekamMedis;
        } else if (resRekamMedis && Array.isArray(resRekamMedis.data)) {
          rekamMedisData = resRekamMedis.data;
        } else if (resRekamMedis.success && Array.isArray(resRekamMedis.data)) {
          rekamMedisData = resRekamMedis.data;
        }
        
        setRekamMedisList(rekamMedisData);
        
        try {
          const resPasien = await getPasien();
          const pasienData = Array.isArray(resPasien) ? resPasien : 
                           (resPasien?.data || []);
          setPasienList(pasienData);
        } catch (error) {
          console.error("Error fetch pasien:", error);
        }
        
        try {
          const resDokter = await getDokter();
          const dokterData = Array.isArray(resDokter) ? resDokter : 
                           (resDokter?.data || []);
          setDokterList(dokterData);
        } catch (error) {
          console.error("Error fetch dokter:", error);
        }
        
      } catch (err) {
        console.error("ERROR:", err);
        setRekamMedisList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getNamaPasien = (idPasien) => {
    if (!idPasien) return "ID Pasien tidak ada";
    const pasien = pasienList.find(p => p.id == idPasien);
    return pasien ? (pasien.nama_lengkap || pasien.nama) : `Pasien #${idPasien}`;
  };
  
  const getNamaDokter = (idDokter) => {
    if (!idDokter) return "ID Dokter tidak ada";
    const dokter = dokterList.find(d => d.id == idDokter || d.user_id == idDokter);
    return dokter ? (dokter.nama_lengkap || dokter.nama) : `Dokter #${idDokter}`;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch (error) {
      return "-";
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Apakah Anda yakin ingin menghapus data Rekam Medis ini?");
    if (confirm) {
      try {
        await deleteRekammedis(id);
        setRekamMedisList(rekamMedisList.filter(p => p.id !== id));
        alert("Data Rekam Medis berhasil dihapus");
      } catch (err) {
        console.error("Gagal menghapus Rekam Medis:", err);
        alert("Gagal menghapus Rekam Medis");
      }
    }
  };

  const countNewThisMonth = () => {
    const now = new Date();
    return rekamMedisList.filter(rm => {
      const createdDate = new Date(rm.tanggal_perawatan || rm.created_at);
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length;
  };
  
  const uniquePasienCount = [...new Set(rekamMedisList.map(rm => rm.id_pasien))].length;
  const COLSPAN_COUNT = 9;

  const searchedData = rekamMedisList.filter((item) => {
    const term = search.toLowerCase();
    const namaPasien = getNamaPasien(item.id_pasien).toLowerCase();
    const namaDokter = getNamaDokter(item.id_dokter).toLowerCase();
    
    return item.id?.toString().toLowerCase().includes(term) || 
           item.id_pasien?.toString().toLowerCase().includes(term) || 
           item.diagnosa?.toLowerCase().includes(term) ||
           namaPasien.includes(term) ||
           namaDokter.includes(term);
  });

  const totalPages = Math.ceil(searchedData.length / dataPerPage);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = searchedData.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
    
    return [...new Set(pageNumbers)].map((num, index) => {
      if (num === '...') {
        return <span key={index} className="px-3 py-1 text-gray-500">...</span>;
      }
      return (
        <button
          key={index}
          onClick={() => paginate(num)}
          className={`px-3 py-1 rounded transition-colors ${
            num === currentPage 
            ? "bg-[#b49b50] text-white font-semibold" 
            : "bg-[#e8dfc8] hover:bg-[#d8cfb8]"
          }`}
        >
          {num}
        </button>
      );
    });
  };

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
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
      
      <div className={`flex-1 p-6 transition-all duration-300`} style={{ marginLeft: isCollapsed ? "64px" : "320px" }}>
        <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold">Data Rekam Medis (Perawatan)</h1>
          <p className="text-sm opacity-80">Ringkasan dan daftar riwayat perawatan pasien</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white text-center p-5 rounded-xl shadow border">
            <p className="text-3xl font-bold text-[#b49b50]">{rekamMedisList.length}</p>
            <p className="text-sm">Total Rekam Medis</p>
          </div>
          <div className="bg-white text-center p-5 rounded-xl shadow border">
            <p className="text-3xl font-bold text-green-600">{uniquePasienCount}</p>
            <p className="text-sm">Jumlah Pasien Unik</p>
          </div>
          <div className="bg-white text-center p-5 rounded-xl shadow border">
            <p className="text-3xl font-bold text-red-600">{countNewThisMonth()}</p>
            <p className="text-sm">RM Baru Bulan Ini</p>
          </div>
          <div className="bg-white text-center p-5 rounded-xl shadow border flex items-center justify-center">
            <p className="text-xl font-semibold">{today}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3e3e3e]">Daftar Rekam Medis</h2>
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Cari Nama Pasien, Dokter, atau Diagnosa"
              className="w-full pl-10 p-2 border rounded-xl bg-[#f8f5e7]"
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#e8dfc8] text-[#3f3f3f]">
              <tr>
                <th className="p-3 text-center">No</th>
                <th className="p-3 text-center">RM ID</th>
                <th className="p-3">Pasien</th>
                <th className="p-3">Dokter</th>
                <th className="p-3">ID Janji Temu</th>
                <th className="p-3">Anamnesis</th>
                <th className="p-3">Diagnosa</th>
                <th className="p-3">Catatan</th>
                <th className="p-3">Tgl Perawatan</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLSPAN_COUNT} className="text-center py-6 text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#b49b50] mr-2"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-[#faf7ee] transition">
                    <td className="p-3 text-center text-gray-500">{indexOfFirstData + index + 1}</td>
                    <td className="p-3 text-center font-mono">
                      <span className="font-bold text-[#b49b50]">RM-{String(item.id).padStart(4, "0")}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{getNamaPasien(item.id_pasien)}</div>
                      <div className="text-xs text-gray-500">ID: {item.id_pasien}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{getNamaDokter(item.id_dokter)}</div>
                      <div className="text-xs text-gray-500">ID: {item.id_dokter}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">{item.id_janji_temu || "-"}</span>
                    </td>
                    <td className="p-3 max-w-[150px]">
                      <div className="truncate" title={item.anamnesis}>{item.anamnesis || "-"}</div>
                    </td>
                    <td className="p-3 max-w-[150px]">
                      <div className="truncate font-medium" title={item.diagnosa}>{item.diagnosa}</div>
                    </td>
                    <td className="p-3 max-w-[150px]">
                      <div className="truncate" title={item.catatan}>{item.catatan || "-"}</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="font-medium">{formatDate(item.tanggal_perawatan)}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={COLSPAN_COUNT} className="text-center py-6 text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <p>Tidak ada data Rekam Medis ditemukan</p>
                      {search && <p className="text-sm text-gray-400">Hasil pencarian: "{search}"</p>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <p className="text-gray-600">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> ({searchedData.length} total data)
            </p>
            <div className="flex gap-2">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] disabled:opacity-50">
                Sebelumnya
              </button>
              {renderPageNumbers()}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] disabled:opacity-50">
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}