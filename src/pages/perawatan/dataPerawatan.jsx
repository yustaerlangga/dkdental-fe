import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarAdmin from "../../components/admin/sidebar"; 
import { getPerawatan, deletePerawatan } from "../../_services/perawatan";

export default function DataPerawatan() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [perawatanList, setPerawatanList] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPerawatan();
        console.log("RESPONSE BACKEND ===>", res);
        setPerawatanList(Array.isArray(res) ? res : []);
      } catch (err) {
        console.log("ERROR BACKEND ===>", err);
        setPerawatanList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Search
  const filtered = perawatanList.filter((p) =>
    p.nama_perawatan?.toLowerCase().includes(search.toLowerCase()) ||
    p.kode_perawatan?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("Apakah Anda yakin ingin menghapus layanan perawatan ini?");
    if (confirm) {
      try {
        await deletePerawatan(id);
        setPerawatanList(perawatanList.filter(p => p.id !== id));
        alert("Data perawatan berhasil dihapus");
      } catch (err) {
        console.error("Gagal menghapus perawatan:", err);
        alert("Gagal menghapus perawatan");
      }
    }
  };

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Statistik Sederhana
  const layananTermahal = perawatanList.length > 0 
    ? Math.max(...perawatanList.map(p => p.harga)) 
    : 0;

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
      
      {/* SIDEBAR ADMIN */}
      <SidebarAdmin
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Konten utama */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* HEADER */}
        <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold">Manajemen Data Perawatan</h1>
          <p className="text-sm opacity-80">Kelola daftar harga dan jenis tindakan medis klinik</p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Layanan */}
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-[#b49b50]">{perawatanList.length}</p>
            <p className="text-sm text-gray-600">Total Jenis Layanan</p>
          </div>

          {/* Card 2: Status (Dummy) */}
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-green-600">
               {perawatanList.length > 0 ? "Aktif" : "0"}
            </p>
            <p className="text-sm text-gray-600">Status Katalog</p>
          </div>

          {/* Card 3: Layanan Termahal */}
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-lg font-bold text-orange-500 truncate px-2">
               {formatRupiah(layananTermahal)}
            </p>
            <p className="text-sm text-gray-600">Harga Tertinggi</p>
          </div>

          {/* Card 4: Tanggal */}
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6] flex items-center justify-center bg-gray-50">
            <p className="text-lg font-semibold text-[#3d342b]">{today}</p>
          </div>
        </div>

        {/* TITLE + SEARCH */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3e3e3e]">
            Daftar Harga & Tindakan
          </h2>

          <div className="flex gap-3">
            {/* Tombol Tambah */}
            <Link 
              to="/formPerawatan" 
              className="bg-[#b49b50] text-white px-4 py-2 rounded-lg hover:bg-[#a38c45] transition-colors flex items-center gap-2"
            >
              <span>+ Tambah Data</span>
            </Link>
            
            {/* Search Bar */}
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Cari Kode / Nama Perawatan"
                className="w-full pl-10 p-2.5 border border-[#c8c19c] rounded-xl bg-white focus:ring-2 focus:ring-[#b49b50] outline-none transition"
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                className="w-5 h-5 absolute left-3 top-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow border border-[#e0d9b6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#f2f0d6] text-[#3d342b] uppercase text-xs font-bold">
                <tr>
                  <th className="p-4 text-center w-16">No</th>
                  <th className="p-4 w-32">Kode</th>
                  <th className="p-4">Nama Perawatan</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 w-1/3">Deskripsi</th>
                  <th className="p-4 text-center w-32">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e0d9b6]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 animate-pulse">
                      Sedang memuat data...
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr
                      key={item?.id || index}
                      className="hover:bg-[#faf9f4] transition duration-150"
                    >
                      <td className="p-4 text-center font-medium text-gray-500">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="p-4 font-semibold text-[#b49b50]">
                        {item.kode_perawatan}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {item.nama_perawatan}
                      </td>
                      <td className="p-4 text-gray-900 font-bold">
                        {formatRupiah(item.harga)}
                      </td>
                      <td className="p-4 text-gray-600 truncate max-w-xs" title={item.deskripsi}>
                        {item.deskripsi}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Link 
                            to={`/editPerawatan/${item.id}`}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                          >
                            Edit
                          </Link>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {perawatanList.length === 0 ? (
                          <p>Belum ada data perawatan</p>
                        ) : (
                          <p>Data tidak ditemukan untuk "{search}"</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end mt-4 gap-2 text-sm">
          <button className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] transition-colors">Previous</button>
          <button className="px-3 py-1 bg-[#b49b50] text-white rounded">1</button>
          <button className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] transition-colors">2</button>
          <button className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}