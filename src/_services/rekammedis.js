import { API } from "../_api";

// TAMBAH PASIEN
export const addRekammedis = async (payload) => {
  const { data } = await API.post("/rekam-medis", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

// GET SEMUA DATA
export const getRekammedis = async () => {
  const { data } = await API.get("/rekam-medis?include=pasien,dokter,janjiTemu", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data; 
};

// GET DATA BY ID
export const getRekammedisById = async (id) => {
  const { data } = await API.get(`/rekam-medis/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

// UPDATE 
export const updateRekammedis = async (id, payload) => {
  const { data } = await API.put(`/rekam-medis/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

// DELETE 
export const deleteRekammedis = async (id) => {
  const { data } = await API.delete(`/rekam-medis/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};