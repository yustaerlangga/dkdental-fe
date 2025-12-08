import { API } from "../_api";

// Tambah Perawatan
export const addPerawatan = async (payload) => {
  payload.harga = Number(payload.harga);

  const { data } = await API.post("/perawatan", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

// Ambil semua Perawatan
export const getPerawatan = async () => {
  const { data } = await API.get("/perawatan", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

// Ambil Perawatan berdasarkan ID
export const getPerawatanById = async (id) => {
  const { data } = await API.get(`/perawatan/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

// Update Perawatan
export const updatePerawatan = async (id, payload) => {
  payload.harga = Number(payload.harga);
  const { data } = await API.put(`/perawatan/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

// Hapus Perawatan
export const deletePerawatan = async (id) => {
  const { data } = await API.delete(`/perawatan/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};