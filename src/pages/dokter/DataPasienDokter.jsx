import React, { useState, useEffect } from "react";
import SidebarDokter from "../../components/dokter/sidebar";
import { getPasien } from "../../_services/pasien";
import { getUserInfo } from "../../_services/auth";

export default function DataPasienDokter() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [pasienList, setPasienList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil role user
        const info = await getUserInfo();
        setUserRole(info.role);

        // Ambil data pasien
        const res = await getPasien();
        console.log("RESPONSE BACKEND ===>", res);
        setPasienList(Array.isArray(res) ? res : []);
      } catch (err) {
        console.log("ERROR BACKEND ===>", err);
        setPasienList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = pasienList.filter((p) =>
    p.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
  );

  // Hitung pasien dengan riwayat alergi
  const pasienDenganAlergi = pasienList.filter(
    (p) => p.riwayat_alergi && p.riwayat_alergi.trim() !== ""
  ).length;

  // Format tanggal untuk tampilan lebih singkat
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID");
  };

  // TOMBOL AKSI UNTUK DOKTER - DISABLED
  const ActionButtons = ({ item }) => {
    return (
      <div className="flex gap-2 justify-center">
        <button
          disabled
          className="px-3 py-1 bg-gray-300 text-gray-500 rounded cursor-not-allowed text-xs"
          title="Dokter tidak dapat mengedit data pasien"
        >
          Edit
        </button>
        <button
          disabled
          className="px-3 py-1 bg-gray-300 text-gray-500 rounded cursor-not-allowed text-xs"
          title="Dokter tidak dapat menghapus data pasien"
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="flex bg-[#f6f5ef] min-h-screen">
      {/* SIDEBAR DOKTER */}
      <SidebarDokter
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Konten utama */}
      <div
        className={`flex-1 transition-all duration-300 p-6`}
        style={{ marginLeft: isCollapsed ? "64px" : "256px" }}
      >
        {/* HEADER */}
        <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold">Data Pasien (View Only)</h1>
          <p className="text-sm opacity-80">
            Akses view only - tidak dapat mengubah data
          </p>
          <p className="text-xs text-yellow-200 mt-1">
            * Akses terbatas: Hanya dapat melihat data pasien
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-[#b49b50]">
              {pasienList.length}
            </p>
            <p className="text-sm text-gray-600">Total Pasien</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-green-600">
              {
                pasienList.filter((p) => {
                  const created = new Date(p.created_at);
                  const now = new Date();
                  return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
            <p className="text-sm text-gray-600">Pasien Baru Bulan Ini</p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-orange-500">
              {pasienDenganAlergi}
            </p>
            <p className="text-sm text-gray-600">
              Pasien dengan Riwayat Alergi
            </p>
          </div>

          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6] flex items-center justify-center bg-gray-50">
            <p className="text-lg font-semibold text-[#3d342b]">{today}</p>
          </div>
        </div>

        {/* TITLE + SEARCH */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3e3e3e]">
            Daftar Pasien (View Only)
          </h2>

          <div className="flex gap-3">
            {/* TOMBOL TAMBAH PASIEN - DISABLED UNTUK DOKTER */}
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed transition-colors"
              title="Dokter tidak dapat menambah data pasien"
            >
              + Tambah Pasien
            </button>

            <div className="relative w-72">
              <input
                type="text"
                placeholder="Cari Pasien"
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
                  <th className="p-4">Nama</th>
                  <th className="p-4">Tanggal Lahir</th>
                  <th className="p-4">Jenis Kelamin</th>
                  <th className="p-4">Nomor Telp</th>
                  <th className="p-4">Alamat</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Riwayat Alergi</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e0d9b6]">
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
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
                      <td className="p-4 font-medium text-gray-900">
                        <div>
                          <div className="font-semibold">
                            {item.nama_lengkap}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        {formatTanggal(item.tanggal_lahir)}
                      </td>
                      <td className="p-4 text-gray-700">
                        {item.jenis_kelamin === "L"
                          ? "Laki-laki"
                          : item.jenis_kelamin === "P"
                          ? "Perempuan"
                          : item.jenis_kelamin}
                      </td>
                      <td className="p-4 text-gray-700">
                        {item.nomor_telepon}
                      </td>
                      <td
                        className="p-4 text-gray-600 max-w-xs truncate"
                        title={item.alamat}
                      >
                        {item.alamat}
                      </td>
                      <td className="p-4 text-gray-700">{item.email}</td>
                      <td
                        className="p-4 text-gray-600 max-w-xs truncate"
                        title={item.riwayat_alergi}
                      >
                        {item.riwayat_alergi || "-"}
                      </td>
                      <td className="p-4">
                        <ActionButtons item={item} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {pasienList.length === 0 ? (
                          <p>Belum ada data pasien</p>
                        ) : (
                          <p>Data tidak ditemukan untuk pencarian "{search}"</p>
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
            3
          </button>
          <button className="px-3 py-1 bg-[#e8dfc8] rounded hover:bg-[#d8cfb8] transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
