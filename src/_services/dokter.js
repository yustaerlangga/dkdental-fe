import { API } from "../_api";

export const addDokter = async (payload) => {
    const {data} = await API.post("/dokter", payload,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return data.data;
};

export const getDokter = async () => {
    const {data} = await API.get("/dokter",{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return data;
};

export const getDokterByUserId = async (userId) => {
  try {
    const response = await API.get(`/dokter/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Dokter tidak ditemukan');
    }
    
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const allDokters = await getDokter();
        const dokterData = allDokters.find(d => d.user_id == userId);
        if (dokterData) {
          return dokterData;
        }
      } catch (fallbackError) {
        // Continue to throw original error
      }
    }
    
    throw error;
  }
};

// Dokter Service
export const getProfileDokter = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo.id || userInfo.user_id;
    
    if (!userId) {
      throw new Error("User ID tidak ditemukan");
    }
    const dokterData = await getDokterByUserId(userId);
    
    return {
      nomor_str: dokterData.nomor_str || "",
      nama_lengkap: dokterData.nama_lengkap || userInfo.nama || "",
      spesialisasi: dokterData.spesialisasi || "",
      nomor_telepon: dokterData.nomor_telepon || "",
      status_aktif: dokterData.status_aktif !== false
    };
    
  } catch (error) {
    console.error("Error getProfileDokter:", error);
    throw error;
  }
};

export const updateDokter = async (id, payload) => {
  const { data } = await API.put(`/dokter/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

export const deleteDokter = async (id) => {
  const { data } = await API.delete(`/dokter/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

export const updateProfileDokter = async (payload) => {
  const { data } = await API.put('/dokter/profile/update', payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

export const getDokterById = async (id) => {
  const { data } = await API.get(`/dokter/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};
