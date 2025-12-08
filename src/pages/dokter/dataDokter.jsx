import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarAdmin from "../../components/admin/sidebar";
import { getDokter, deleteDokter } from "../../_services/dokter";

export default function DataDokter() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [dokterList, setDokterList] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Fetch Data Dokter
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDokter();
        console.log("RESPONSE BACKEND ===>", res);
        setDokterList(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("ERROR BACKEND ===>", err);
        setDokterList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Pencarian
  const filtered = dokterList.filter(
    (d) =>
      d.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
      d.spesialisasi?.toLowerCase().includes(search.toLowerCase()) ||
      d.nomor_str?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin menghapus data dokter ini?"
    );
    if (confirm) {
      try {
        await deleteDokter(id);
        setDokterList(dokterList.filter((d) => d.id !== id));
        alert("Data dokter berhasil dihapus");
      } catch (err) {
        console.error("Gagal menghapus dokter:", err);
        alert("Gagal menghapus dokter");
      }
    }
  };

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
      {/* SIDEBAR ADMIN */}
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Konten utama */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* HEADER */}
        <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold">Manajemen Dokter</h1>
          <p className="text-sm opacity-80">
            Kelola data dokter, spesialisasi, dan status aktif
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-[#b49b50]">
              {dokterList.length}
            </p>
            <p className="text-sm text-gray-600">Total Dokter</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-green-600">
              {dokterList.filter((d) => Number(d.status_aktif) === 1).length}
            </p>
            <p className="text-sm text-gray-600">Dokter Aktif</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-red-600">
              {dokterList.filter((d) => Number(d.status_aktif) === 0).length}
            </p>
            <p className="text-sm text-gray-600">Dokter Tidak Aktif</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6] flex items-center justify-center bg-gray-50">
            <p className="text-lg font-semibold text-[#3d342b]">{today}</p>
          </div>
        </div>

        {/* TITLE + SEARCH + ADD BUTTON */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3e3e3e]">Daftar Dokter</h2>

          <div className="flex gap-3">
            {/* Tombol Tambah Dokter */}
            <Link
              to="/formDokter"
              className="bg-[#b49b50] text-white px-4 py-2 rounded-lg hover:bg-[#a38c45] transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>+ Tambah Dokter</span>
            </Link>

            <div className="relative w-72">
              <input
                type="text"
                placeholder="Cari Nama / STR / Spesialis"
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
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Nomor STR</th>
                  <th className="p-4">Spesialisasi</th>
                  <th className="p-4">No. Telepon</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e0d9b6]">
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-8 text-gray-500 animate-pulse"
                    >
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

                      {/* Nama Lengkap */}
                      <td className="p-4 font-semibold text-gray-900">
                        {item.nama_lengkap}
                      </td>

                      {/* Nomor STR */}
                      <td className="p-4 text-gray-600 font-mono text-xs">
                        {item.nomor_str || "-"}
                      </td>

                      {/* Spesialisasi */}
                      <td className="p-4 text-[#b49b50] font-medium">
                        {item.spesialisasi}
                      </td>

                      {/* No Telepon */}
                      <td className="p-4 text-gray-700">
                        {item.nomor_telepon}
                      </td>

                      {/* Email */}
                      <td className="p-4 text-gray-700">{item.email}</td>

                      {/* Status Aktif (1 = Aktif, 0 = Tidak) */}
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            Number(item.status_aktif) === 1
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {Number(item.status_aktif) === 1
                            ? "Aktif"
                            : "Tidak Aktif"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/editDokter/${item.id}`}
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
                    <td colSpan="8" className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {dokterList.length === 0 ? (
                          <p>Belum ada data dokter</p>
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
          <button className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-[#b49b50] text-white rounded">
            1
          </button>
          <button className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] transition-colors">
            2
          </button>
          <button className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
