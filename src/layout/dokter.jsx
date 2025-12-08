import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SidebarDokter from "../components/dokter/sidebar";
import HeroDokter from "../components/dokter/hero";
import { getjanji, updatejanji } from "../_services/janji";
import { addRekammedis } from "../_services/rekammedis";
import { getUserInfo } from "../_services/auth";
import { getDokterByUserId, getDokter } from "../_services/dokter";

function DokterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [dokterId, setDokterId] = useState(null);
  const [dokterData, setDokterData] = useState(null);

  const hideHeroPaths = [
    "/dokter/jadwal",
    "/dokter/antrean-hari-ini",
    "/dokter/pasien-search", 
    "/dokter/profile"
  ];

  const shouldShowHero = !hideHeroPaths.includes(location.pathname);

  const initData = useCallback(async () => {
    try {
      setLoading(true);
      
      const userData = await getUserInfo();
      setCurrentUser(userData);

      if (userData?.id) {
        await fetchDokterData(userData.id);
      }

      await fetchAppointments(); 
      
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    } else {
      initData();
    }
  }, [initData, navigate]); 

  const fetchDokterData = async (userId) => {
    try {
      const dokter = await getDokterByUserId(userId);
      
      if (dokter?.id) {
        setDokterId(dokter.id);
        setDokterData(dokter);
      } else {
        throw new Error("Data dokter tidak valid");
      }
      
    } catch {
      try {
        const allDokters = await getDokter();
        const foundDokter = allDokters.find(d => d.user_id == userId);
        
        if (foundDokter) {
          setDokterId(foundDokter.id);
          setDokterData(foundDokter);
        }
      } catch {
        // Silently handle error
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await getjanji();
      const allJanji = Array.isArray(res) ? res : (res.data || []);
      setAppointments(allJanji);
    } catch {
      setAppointments([]);
    }
  };

  const getTodayAppointments = () => {
    if (!appointments.length || !dokterId) {
      return [];
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppointments = appointments.filter(appointment => {
      const isToday = appointment.tanggal_janji === today;
      const isMyPatient = parseInt(appointment.id_dokter) === parseInt(dokterId);
      return isToday && isMyPatient;
    });

    return todayAppointments;
  };

  const getMyAppointments = () => {
    if (!appointments.length || !dokterId) {
      return [];
    }
    
    const myAppointments = appointments.filter(appointment => {
      return parseInt(appointment.id_dokter) === parseInt(dokterId);
    });

    return myAppointments;
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updatejanji(id, { status: newStatus });
      setAppointments((prev) => 
        prev.map((item) => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch {
      alert("Gagal mengubah status janji temu.");
    }
  };

  const handleSaveRekamMedis = async (payload) => {
    const idJanji = payload.janji_id || payload.appointment_id;
    
    if (idJanji) {
      await handleUpdateStatus(idJanji, 'Selesai');
    }
    
    return addRekammedis(payload);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <SidebarDokter isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        isCollapsed ? "ml-16" : "ml-64"
      }`}>
        {shouldShowHero && (
          <HeroDokter 
            user={currentUser} 
            appointments={getMyAppointments()}
            dokterData={dokterData}
          />
        )}

        <main className="p-6 flex-1">
          <Outlet 
            context={{ 
              currentUser,
              dokterData,
              appointments: getMyAppointments(),
              todayAppointments: getTodayAppointments(),
              loading,
              refreshData: fetchAppointments,
              updateStatus: handleUpdateStatus,
              saveRekamMedis: handleSaveRekamMedis, 
              isCollapsed, 
              setIsCollapsed
            }} 
          />
        </main>
      </div>
    </div>
  );
}

export default DokterLayout;