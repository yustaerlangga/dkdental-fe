import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarAdmin from "../../components/admin/sidebar"; 
import SidebarPerawat from "../../components/perawat/sidebar";
import { getDetailRekamMedis, deleteDetailRekamMedis } from "../../_services/detailRekamMedis";
import { getPerawatan } from "../../_services/perawatan"; 

export default function DataDetailRekamMedis() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [listPerawatan, setListPerawatan] = useState([]);
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
        const [resDetail, resPerawatan] = await Promise.all([
          getDetailRekamMedis(),
          getPerawatan()
        ]);

        console.log("DATA DETAIL LOADED:", resDetail);
        
        setDataList(Array.isArray(resDetail) ? resDetail : []);
        setListPerawatan(Array.isArray(resPerawatan) ? resPerawatan : []);

      } catch (err) {
        console.error("ERROR FETCHING DATA ===>", err);
        setDataList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getNamaPerawatan = (id) => {
    const item = listPerawatan.find((p) => String(p.id) === String(id));
    return item ? item.nama_perawatan : `ID: ${id}`;
  };

  const filtered = dataList.filter((item) => {
    const term = search.toLowerCase();
    const namaPerawatan = getNamaPerawatan(item.id_perawatan).toLowerCase();
    const idRm = String(item.id_rekam_medis).toLowerCase();
    const catatan = item.catatan ? item.catatan.toLowerCase() : "";
    const noGigi = String(item.nomor_gigi);

    return (
      idRm.includes(term) ||
      namaPerawatan.includes(term) ||
      catatan.includes(term) ||
      noGigi.includes(term)
    );
  });

  const handleDelete = async (id) => {
    const confirm = window.confirm("Apakah Anda yakin ingin menghapus data detail tindakan ini?");
    if (confirm) {
      try {
        await deleteDetailRekamMedis(id);
        setDataList((prev) => prev.filter((item) => item.id !== id));
        alert("Data berhasil dihapus");
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Gagal menghapus data");
      }
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const totalHarga = dataList.reduce((acc, curr) => acc + Number(curr.harga), 0);

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
      
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold">Manajemen Detail Tindakan</h1>
          <p className="text-sm opacity-80">Rincian perawatan gigi per kunjungan pasien</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-[#b49b50]">{dataList.length}</p>
            <p className="text-sm text-gray-600">Total Item Tindakan</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-lg font-bold text-green-600 truncate px-2">
               {formatRupiah(totalHarga)}
            </p>
            <p className="text-sm text-gray-600">Total Nominal</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-orange-500">
               {dataList.length > 0 ? "AKTIF" : "-"}
            </p>
            <p className="text-sm text-gray-600">Status Data</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6] flex items-center justify-center bg-gray-50">
            <p className="text-lg font-semibold text-[#3d342b]">{today}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3e3e3e]">
            Daftar Detail
          </h2>

          <div className="flex gap-3">
            <Link 
              to="/formDetailRekamMedis" 
              className="bg-[#b49b50] text-white px-4 py-2 rounded-lg hover:bg-[#a38c45] transition-colors flex items-center gap-2"
            >
              <span>+ Tambah Data</span>
            </Link>
            
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Cari ID RM / Tindakan / Catatan"
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

        <div className="bg-white rounded-xl shadow border border-[#e0d9b6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#f2f0d6] text-[#3d342b] uppercase text-xs font-bold">
                <tr>
                  <th className="p-4 text-center w-12">No</th>
                  <th className="p-4">ID Rekam Medis</th>
                  <th className="p-4">Tindakan / Perawatan</th>
                  <th className="p-4 text-center">Gigi</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 w-1/4">Catatan</th>
                  <th className="p-4 text-center w-32">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e0d9b6]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500 animate-pulse">
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
                        {item.id_rekam_medis}
                      </td>

                      <td className="p-4 font-medium text-gray-900">
                        {getNamaPerawatan(item.id_perawatan)}
                      </td>

                      <td className="p-4 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded border border-gray-300 text-xs font-bold text-gray-600">
                            {item.nomor_gigi}
                        </span>
                      </td>

                      <td className="p-4 text-gray-900 font-bold">
                        {formatRupiah(item.harga)}
                      </td>

                      <td className="p-4 text-gray-600 truncate max-w-xs text-xs" title={item.catatan}>
                        {item.catatan || "-"}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Link 
                            to={`/editDetailRekamMedis/${item.id}`}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                          >
                            Edit
                          </Link>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {dataList.length === 0 ? (
                          <p>Belum ada data detail tindakan.</p>
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