import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getPasien } from "../../_services/pasien";
import { getDokter } from "../../_services/dokter";

export default function HeroPerawat() {
  // State Data
  const [totalPasien, setTotalPasien] = useState(0);
  const [totalDokter, setTotalDokter] = useState(0);
  const [chartData, setChartData] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Ambil Data dari API
        const [resPasien, resDokter] = await Promise.all([
          getPasien(),
          getDokter(),
        ]);

        // 2. Normalisasi Data Pasien (Array)
        let rawPasien = [];
        if (Array.isArray(resPasien)) rawPasien = resPasien;
        else if (resPasien.data && Array.isArray(resPasien.data))
          rawPasien = resPasien.data;

        // 3. Hitung Total Pasien & Dokter
        setTotalPasien(rawPasien.length);

        let countDokter = 0;
        if (Array.isArray(resDokter)) countDokter = resDokter.length;
        else if (resDokter.data && Array.isArray(resDokter.data))
          countDokter = resDokter.data.length;
        setTotalDokter(countDokter);

        // 4. --- LOGIKA PENGOLAHAN DATA GRAFIK (Pasien Bulan Ini) ---
        const processChartData = () => {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
          ).getDate();

          const dailyCounts = Array.from({ length: daysInMonth }, (_, i) => {
            return {
              tanggal: i + 1,
              jumlah: 0,
            };
          });

          rawPasien.forEach((pasien) => {
            const tglDaftar = new Date(pasien.created_at || pasien.updated_at);

            if (
              tglDaftar.getMonth() === currentMonth &&
              tglDaftar.getFullYear() === currentYear
            ) {
              const day = tglDaftar.getDate();
              if (dailyCounts[day - 1]) {
                dailyCounts[day - 1].jumlah += 1;
              }
            }
          });

          setChartData(dailyCounts);
        };

        processChartData();
      } catch (error) {
        console.error("Gagal ambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tanggal Hari Ini
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentMonthName = new Date().toLocaleDateString("id-ID", {
    month: "long",
  });

  return (
    <div className="flex-1 p-6 bg-[#f8f8f8] overflow-y-auto">
      {/* Header Section */}
      <h2 className="text-2xl font-bold text-[#7A6A42]">
        Selamat Datang di Dashboard DK DENTAL CARE
      </h2>
      <p className="text-gray-600 mb-6">
        Monitor dan kelola data anda dengan mudah dan efisien
      </p>

      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <img
          src="../../../public/DK Dental Care.png"
          alt="DK Dental Care"
          className="rounded-xl shadow-sm opacity-90 object-cover"
          style={{ width: "1600px", height: "750px" }}
        />
      </div>

      {/* --- STATISTIK CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow-sm border border-[#e0d9b6] rounded-xl p-5 text-center hover:shadow-md transition-all">
          <p className="text-gray-500 font-medium">Total Pasien</p>
          <h3 className="text-4xl font-bold text-[#b49b50] mt-2">
            {loading ? "..." : totalPasien}
          </h3>
        </div>

        <div className="bg-white shadow-sm border border-[#e0d9b6] rounded-xl p-5 text-center hover:shadow-md transition-all">
          <p className="text-gray-500 font-medium">Total Dokter</p>
          <h3 className="text-4xl font-bold text-[#b49b50] mt-2">
            {loading ? "..." : totalDokter}
          </h3>
        </div>

        <div className="bg-white shadow-sm border border-[#e0d9b6] rounded-xl p-5 text-center hover:shadow-md transition-all">
          <p className="text-gray-500 font-medium">Update Terakhir</p>
          <h3 className="text-lg font-bold text-[#b49b50] mt-3">
            {currentDate}
          </h3>
        </div>
      </div>

      {/* --- GRAFIK PASIEN --- */}
      <div className="bg-white shadow rounded-xl p-6 border border-[#e0d9b6]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[#3d342b] font-bold text-lg">
            Grafik Kunjungan Pasien
          </h4>
          <span className="text-sm bg-[#f8f5e7] text-[#b49b50] px-3 py-1 rounded-full font-medium">
            Bulan {currentMonthName}
          </span>
        </div>

        <div className="h-64 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400 animate-pulse">
              Memuat Grafik...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPasien" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b49b50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#b49b50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="tanggal"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="jumlah"
                  stroke="#b49b50"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPasien)"
                  name="Pasien Baru"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
