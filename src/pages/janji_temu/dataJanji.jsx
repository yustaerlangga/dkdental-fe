import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { deletejanji, getjanji } from "../../_services/janji";
import { getUserInfo } from "../../_services/auth";
import SidebarPerawat from "../../components/perawat/sidebar";
import SidebarAdmin from "../../components/admin/sidebar";

export default function DataJanji({ showTodayOnly = false }) {
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const outletContext = useOutletContext();
  const isInLayout = outletContext !== null && outletContext !== undefined;

  const [dataState, setDataState] = useState({
    appointments: [],
    loading: true,
  });

  let appointments, loading, refreshData;

  if (isInLayout) {
    const contextAppointments = outletContext?.appointments || [];
    const todayAppointments = outletContext?.todayAppointments || [];
    loading = outletContext?.loading || false;
    refreshData = outletContext?.refreshData || (() => {});
    appointments = showTodayOnly ? todayAppointments : contextAppointments;
  } else {
    appointments = dataState.appointments;
    loading = dataState.loading;
    refreshData = async () => {
      try {
        setDataState((prev) => ({ ...prev, loading: true }));
        const res = await getjanji();
        const dataFix = Array.isArray(res) ? res : res.data || [];
        setDataState({ appointments: dataFix, loading: false });
      } catch (err) {
        console.error("Gagal refresh data:", err);
        setDataState((prev) => ({ ...prev, loading: false }));
      }
    };
  }

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setUserRole(parsed.role);
      } catch (e) {
        console.error("Gagal parse userInfo", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isInLayout) {
      const fetchData = async () => {
        try {
          setDataState((prev) => ({ ...prev, loading: true }));
          const info = await getUserInfo();
          setUserRole(info.role);

          const res = await getjanji();
          const dataFix = Array.isArray(res) ? res : res.data || [];
          setDataState({ appointments: dataFix, loading: false });
        } catch (err) {
          console.error("ERROR:", err);
          setDataState({ appointments: [], loading: false });
        }
      };
      fetchData();
    }
  }, [isInLayout]);

  useEffect(() => {
    if (isInLayout) {
      const fetchRole = async () => {
        try {
          const info = await getUserInfo();
          setUserRole(info.role);
        } catch (e) {
          console.log("Gagal load role", e);
        }
      };
      fetchRole();
    }
  }, [isInLayout]);

  const filtered = safeAppointments.filter((item) => {
    if (!item) return false;
    const term = search.toLowerCase();
    const namaPasien =
      item.pasien?.nama_lengkap?.toLowerCase() || item.pasien?.nama?.toLowerCase() || "";
    const idPasien = String(item.id_pasien || "").toLowerCase();
    const status = item.status?.toLowerCase() || "";
    return namaPasien.includes(term) || idPasien.includes(term) || status.includes(term);
  });

  const handleDelete = async (id) => {
    if (userRole === "dokter") return;
    const confirm = window.confirm("Apakah Anda yakin ingin menghapus data janji temu ini?");
    if (confirm) {
      try {
        await deletejanji(id);
        if (refreshData) await refreshData();
        alert("Data janji temu berhasil dihapus");
      } catch (err) {
        console.error("Gagal menghapus data:", err);
        alert("Gagal menghapus data. Cek koneksi server.");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "menunggu";
    switch (statusLower) {
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "dikonfirmasi":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "dibatalkan":
        return "bg-red-100 text-red-800 border-red-200";
      case "diperiksa":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const shouldDisableActions = userRole === "dokter" && !showTodayOnly;

  const ActionButtons = ({ item }) => {
    const status = item?.status?.toLowerCase();

    if (shouldDisableActions) {
      return (
        <button
          disabled
          className="p-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
          title="Aksi hanya tersedia di halaman Antrean Hari Ini"
        >
          Disabled
        </button>
      );
    }

    if (userRole === "dokter") {
      return (
        <div className="flex gap-2">
          {status !== "selesai" && (
            <Link
              to={`/dokter/edit-status/${item?.id}`}
              className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
            >
              Edit
            </Link>
          )}
          {status === "dikonfirmasi" && (
            <Link
              to={`/dokter/rekam-medis/${item?.id}`}
              className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              Mulai
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <Link
          to={`/editJanji/${item?.id}`}
          className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
        >
          Edit
        </Link>
        {!showTodayOnly && (
          <button
            onClick={() => handleDelete(item?.id)}
            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
          >
            Hapus
          </button>
        )}
      </div>
    );
  };

  const content = (
    <div className="p-6 bg-[#f6f5ef] min-h-screen rounded-xl">
      {/* HEADER */}
      <div className="bg-[#b49b50] text-white p-6 rounded-xl shadow-md mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {showTodayOnly ? "Antrean Hari Ini" : "Data Janji Temu"}
          </h1>
          <p className="text-sm opacity-80">
            {showTodayOnly
              ? "Daftar pasien yang memiliki janji temu hari ini"
              : userRole === "dokter"
              ? "Daftar antrian pasien Anda"
              : "Kelola jadwal kunjungan pasien"}
          </p>
          {shouldDisableActions && (
            <p className="text-xs text-yellow-200 mt-1">
              * Akses edit hanya tersedia di halaman "Antrean Hari Ini"
            </p>
          )}
        </div>
        {userRole !== "dokter" && !showTodayOnly && (
          <Link
            to="/formJanji"
            className="bg-white text-[#b49b50] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-sm flex items-center gap-2"
          >
            Tambah Janji
          </Link>
        )}
      </div>

      {/* STAT CARDS */}
      {!showTodayOnly && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-[#b49b50]">{safeAppointments.length}</p>
            <p className="text-sm text-gray-500">Total Jadwal</p>
          </div>
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-green-600">
              {safeAppointments.filter((j) => j?.status?.toLowerCase() === "selesai").length}
            </p>
            <p className="text-sm text-gray-500">Selesai</p>
          </div>
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6]">
            <p className="text-3xl font-bold text-yellow-500">
              {safeAppointments.filter((j) => j?.status?.toLowerCase() === "menunggu").length}
            </p>
            <p className="text-sm text-gray-500">Menunggu</p>
          </div>
          <div className="bg-white text-center p-5 rounded-xl shadow border border-[#e0d9b6] flex items-center justify-center bg-gray-50">
            <p className="text-lg font-semibold text-[#3d342b]">{today}</p>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3d342b]">
          {showTodayOnly ? "Daftar Pasien Hari Ini" : `Daftar Pasien ${userRole === "dokter" ? "(Milik Saya)" : ""}`}
        </h2>
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Cari Pasien / Status..."
            className="w-full pl-10 p-2.5 border border-[#c8c19c] rounded-xl bg-white focus:ring-2 focus:ring-[#b49b50] outline-none transition"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-[#e0d9b6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f2f0d6] text-[#3d342b] uppercase text-xs font-bold">
              <tr>
                <th className="p-4 text-center w-16">No</th>
                <th className="p-4">Pasien</th>
                <th className="p-4">Dokter</th>
                <th className="p-4">Jadwal</th>
                <th className="p-4">Keluhan</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
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
                  <tr key={item?.id || index} className="hover:bg-[#faf9f4] transition duration-150">
                    <td className="p-4 text-center font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">
                      {item?.pasien?.nama_lengkap || item?.pasien?.nama || `ID: ${item?.id_pasien || "N/A"}`}
                      <div className="text-xs text-gray-400 mt-0.5">{item?.pasien?.nomor_telepon || "-"}</div>
                    </td>
                    <td className="p-4 text-gray-700">
                      {item?.dokter?.nama_lengkap || item?.dokter?.nama || `ID: ${item?.id_dokter || "N/A"}`}
                      <div className="text-xs text-gray-400 mt-0.5">{item?.dokter?.spesialisasi || "-"}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{formatDate(item?.tanggal_janji)}</div>
                      <div className="text-xs text-gray-500">{item?.waktu_janji?.substring(0,5) || "-"} WIB</div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate" title={item?.keluhan}>
                      {item?.keluhan || "-"}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item?.status)}`}>
                        {item?.status || "Menunggu"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <ActionButtons item={item} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      {safeAppointments.length === 0 ? (
                        <p>{showTodayOnly ? "Belum ada antrean hari ini" : "Belum ada data janji temu"}</p>
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
    </div>
  );

  if (isInLayout) {
    return content;
  } else {
    return (
      <div className="flex bg-[#f6f5ef] min-h-screen">
        {userRole === "admin" ? (
          <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        ) : (
          <SidebarPerawat isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        )}
        <div className={`flex-1 transition-all duration-300`} style={{ marginLeft: isCollapsed ? "64px" : "256px" }}>
          {content}
        </div>
      </div>
    );
  }
}
