import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HeroDokter({ user, appointments = [], dokterData }) {
  
  const [stats, setStats] = useState({
    todayPatients: 0,
    waiting: 0,
    completed: 0
  });
  
  const [chartData, setChartData] = useState([]); 

  useEffect(() => {
    if (!Array.isArray(appointments)) return;
    processDashboardData();
  }, [appointments]);

  const processDashboardData = () => {
    const today = new Date().toISOString().split('T')[0];

    // A. STATISTIK HARI INI
    const todaysAppts = appointments.filter(apt => {
      return apt.tanggal_janji === today;
    });

    const waitingCount = todaysAppts.filter(apt => 
      apt.status?.toLowerCase() === 'menunggu'
    ).length;
    
    const completedCount = todaysAppts.filter(apt => 
      apt.status?.toLowerCase() === 'selesai'
    ).length;

    setStats({
      todayPatients: todaysAppts.length,
      waiting: waitingCount,
      completed: completedCount
    });

    // B. STATISTIK 7 HARI TERAKHIR
    const weeklyData = [
      { hari: "Minggu", jumlah: 0, tanggal: "" },
      { hari: "Senin", jumlah: 0, tanggal: "" },
      { hari: "Selasa", jumlah: 0, tanggal: "" },
      { hari: "Rabu", jumlah: 0, tanggal: "" },
      { hari: "Kamis", jumlah: 0, tanggal: "" },
      { hari: "Jumat", jumlah: 0, tanggal: "" },
      { hari: "Sabtu", jumlah: 0, tanggal: "" },
    ];

    // Generate 7 hari terakhir
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = getDayName(date.getDay());
      
      const dayIndex = weeklyData.findIndex(item => item.hari === dayName);
      if (dayIndex !== -1) {
        weeklyData[dayIndex].tanggal = dateString;
        weeklyData[dayIndex].hari = dayName;
      }
      
      last7Days.push(dateString);
    }

    // Hitung pasien untuk setiap hari dalam 7 hari terakhir
    appointments.forEach(apt => {
      const tanggalField = apt.tanggal_janji;
      if (!tanggalField) return;

      if (last7Days.includes(tanggalField)) {
        const aptDate = new Date(tanggalField);
        const dayName = getDayName(aptDate.getDay());
        const chartIndex = weeklyData.findIndex(item => item.tanggal === tanggalField);
        
        if (chartIndex !== -1) {
          weeklyData[chartIndex].jumlah += 1;
        }
      }
    });

    setChartData(weeklyData);
  };

  const getDayName = (dayIndex) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[dayIndex];
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  return (
    <div className="p-6 bg-[#f8f8f8]">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#7A6A42]">
            Selamat Datang, {user?.name || "Dokter"}
          </h2>
          <p className="text-gray-600">Siap melayani pasien hari ini?</p>
        </div>
        
        <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e0d9b6]">
          <span className="text-[#b49b50] font-semibold">📅 {currentDate}</span>
        </div>
      </div>

      {/* --- LOGO / IMAGE SECTION--- */}
      <div className="flex justify-center mb-8">
        <img
          src="/DK Dental Care.png" 
          alt="DK Dental Care"
          className="rounded-xl shadow-sm opacity-90 object-cover w-full"
          style={{ height: "750px" , width: "1600px"}} 
        />
      </div>

      {/* --- STATISTIK CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Pasien Hari Ini" count={stats.todayPatients} color="blue" />
        <StatCard title="Sedang Menunggu" count={stats.waiting} color="amber" />
        <StatCard title="Selesai Diperiksa" count={stats.completed} color="emerald" />
      </div>

      {/* --- GRAFIK --- */}
      <div className="bg-white shadow rounded-xl p-6 border border-[#e0d9b6]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[#3d342b] font-bold text-lg">Statistik Pasien 7 Hari Terakhir</h4>
          <span className="text-sm text-gray-500">Termasuk pasien kemarin & sebelumnya</span>
        </div>

        <div className="h-64 w-full" style={{ minHeight: '250px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hari" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  allowDecimals={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8f5e7' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value} pasien`, 'Jumlah']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      const tanggal = payload[0].payload.tanggal;
                      const dateObj = new Date(tanggal);
                      const formattedDate = dateObj.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                      });
                      return `${label}, ${formattedDate}`;
                    }
                    return label;
                  }}
                />
                <Bar 
                  dataKey="jumlah" 
                  fill="#b08e4a" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                  name="Jumlah Pasien" 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Belum ada pasien dalam 7 hari terakhir
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, count, color }) => {
  const colors = {
    blue: { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-100" },
    amber: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-100" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-100" }
  };
  
  const colorConfig = colors[color] || colors.blue;
  
  return (
    <div className={`bg-white shadow-sm border ${colorConfig.border} rounded-xl p-5 text-center relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${colorConfig.bg}`}></div>
      <p className="text-gray-500 font-medium">{title}</p>
      <h3 className={`text-4xl font-bold mt-2 ${colorConfig.text}`}>{count}</h3>
    </div>
  );
};
