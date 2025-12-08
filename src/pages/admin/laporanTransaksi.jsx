import { useEffect, useState } from "react";
import { API } from "../../_api";
import SidebarAdmin from "../../components/admin/sidebar";
import * as XLSX from "xlsx";

export default function RiwayatTransaksi() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // 1. Ambil semua data yang diperlukan
      const [detailRes, rekamRes, pasienRes, dokterRes, perawatanRes] = await Promise.all([
        API.get("/detail-rekam-medis", { headers: token }),
        API.get("/rekam-medis", { headers: token }),
        API.get("/pasien", { headers: token }),
        API.get("/dokter", { headers: token }),
        API.get("/perawatan", { headers: token })
      ]);

      const details = detailRes.data.data || detailRes.data || [];
      const rekamList = rekamRes.data.data || rekamRes.data || [];
      const pasienList = pasienRes.data.data || pasienRes.data || [];
      const dokterList = dokterRes.data.data || dokterRes.data || [];
      const perawatanList = perawatanRes.data.data || perawatanRes.data || [];

      // 2. Gabungkan data
      const combined = details
        .filter(detail => detail.harga > 0) 
        .map(detail => {
          const rekam = rekamList.find(r => r.id === detail.id_rekam_medis);
          const pasien = pasienList.find(p => p.id === rekam?.id_pasien);
          const dokter = dokterList.find(d => d.id === rekam?.id_dokter);
          const perawatan = perawatanList.find(p => p.id === detail.id_perawatan);

          return {
            id: detail.id,
            tanggal: rekam?.tanggal_perawatan || rekam?.created_at,
            nama_pasien: pasien?.nama_lengkap || `Pasien ${rekam?.id_pasien}`,
            nama_dokter: dokter?.nama_lengkap || `Dokter ${rekam?.id_dokter}`,
            nama_perawatan: perawatan?.nama_perawatan || `Perawatan ${detail.id_perawatan}`,
            harga: Number(detail.harga) || 0,
            nomor_gigi: detail.nomor_gigi || "-",
          };
        });

      setTransactions(combined);
      setFiltered(combined);

    } catch (error) {
      console.error("Error:", error);
      setTransactions([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  useEffect(() => {
    let data = transactions;

    // Filter bulan
    if (selectedMonth !== "") {
      data = data.filter((item) => {
        if (!item.tanggal) return false;
        const bulan = new Date(item.tanggal).getMonth() + 1;
        return bulan === Number(selectedMonth);
      });
    }

    // Filter pencarian
    if (search !== "") {
      data = data.filter((item) =>
        item.nama_pasien.toLowerCase().includes(search.toLowerCase()) ||
        item.nama_dokter.toLowerCase().includes(search.toLowerCase()) ||
        item.nama_perawatan.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [selectedMonth, search, transactions]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Perhitungan
  const bulanIni = new Date().getMonth() + 1;
  const pemasukanBulanan = filtered
    .filter((item) => {
      if (!item.tanggal) return false;
      const bulanTransaksi = new Date(item.tanggal).getMonth() + 1;
      return bulanTransaksi === bulanIni;
    })
    .reduce((total, item) => total + item.harga, 0);

  const totalSemuaTransaksi = filtered.reduce((total, item) => total + item.harga, 0);

  // Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Export Excel
  const exportExcel = () => {
    if (filtered.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const dataForExcel = filtered.map((item, index) => ({
      "No": index + 1,
      "Tanggal": item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID") : "-",
      "Pasien": item.nama_pasien,
      "Dokter": item.nama_dokter,
      "Perawatan": item.nama_perawatan,
      "Gigi": item.nomor_gigi,
      "Harga": item.harga,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Transaksi");
    XLSX.writeFile(workbook, `Transaksi_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Format tanggal
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    try {
      return new Date(tanggal).toLocaleDateString("id-ID");
    } catch {
      return "-";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* CONTENT */}
      <div className={`flex-1 p-6 ${isCollapsed ? "ml-16" : "ml-64"}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Riwayat Transaksi
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xl font-bold text-blue-600">
                  {formatRupiah(pemasukanBulanan)}
                </p>
                <p className="text-sm text-gray-600">Pemasukan Bulan Ini</p>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xl font-bold text-green-600">
                  {formatRupiah(totalSemuaTransaksi)}
                </p>
                <p className="text-sm text-gray-600">Total Transaksi</p>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xl font-bold text-gray-700">
                  {filtered.length}
                </p>
                <p className="text-sm text-gray-600">Jumlah Transaksi</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Cari..."
                className="flex-1 px-4 py-2 border rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="px-4 py-2 border rounded-lg"
                onChange={(e) => setSelectedMonth(e.target.value)}
                value={selectedMonth}
              >
                <option value="">Semua Bulan</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>

              <button
                onClick={fetchTransactions}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">No</th>
                      <th className="p-3 text-left">Tanggal</th>
                      <th className="p-3 text-left">Pasien</th>
                      <th className="p-3 text-left">Dokter</th>
                      <th className="p-3 text-left">Perawatan</th>
                      <th className="p-3 text-left">Harga</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-6 text-center text-gray-500">
                          {transactions.length === 0 
                            ? "Belum ada data transaksi" 
                            : "Tidak ada data yang sesuai dengan filter"}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item, index) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">{formatTanggal(item.tanggal)}</td>
                          <td className="p-3">{item.nama_pasien}</td>
                          <td className="p-3">{item.nama_dokter}</td>
                          <td className="p-3">{item.nama_perawatan}</td>
                          <td className="p-3 font-bold text-blue-600">
                            {formatRupiah(item.harga)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export */}
            {filtered.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={exportExcel}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Export Excel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}