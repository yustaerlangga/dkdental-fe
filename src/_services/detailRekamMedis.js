import { API } from "../_api";

// TAMBAH DETAIL REKAM MEDIS
export const createDetailRekamMedis = async (payload) => {
  try {
    const { data } = await API.post("/detail-rekam-medis", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error createDetailRekamMedis:", error);
    throw error;
  }
};

// GET DETAIL REKAM MEDIS BY ID REKAM MEDIS
export const getDetailRekamMedisByRekamMedisId = async (rekamMedisId) => {
  try {
    const { data } = await API.get(`/detail-rekam-medis/rekam-medis/${rekamMedisId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getDetailRekamMedisByRekamMedisId:", error);
    throw error;
  }
};

// GET SEMUA DETAIL REKAM MEDIS
export const getDetailRekamMedis = async () => {
  try {
    const { data } = await API.get("/detail-rekam-medis", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getDetailRekamMedis:", error);
    throw error;
  }
};

// GET DETAIL BY ID
export const getDetailRekamMedisById = async (id) => {
  try {
    const { data } = await API.get(`/detail-rekam-medis/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getDetailRekamMedisById:", error);
    throw error;
  }
};

// UPDATE DETAIL REKAM MEDIS
export const updateDetailRekamMedis = async (id, payload) => {
  try {
    const { data } = await API.put(`/detail-rekam-medis/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error updateDetailRekamMedis:", error);
    throw error;
  }
};

// DELETE DETAIL REKAM MEDIS
export const deleteDetailRekamMedis = async (id) => {
  try {
    const { data } = await API.delete(`/detail-rekam-medis/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleteDetailRekamMedis:", error);
    throw error;
  }
};

// GET PERAWATAN OPTIONS (dropdown)
export const getPerawatanOptions = async () => {
  try {
    const { data } = await API.get("/perawatan", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getPerawatanOptions:", error);
    throw error;
  }
};