import { API } from "../_api";

// TAMBAH PASIEN
export const addPasien = async (payload) => {
  const { data } = await API.post("/pasien", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};

// GET SEMUA PASIEN
export const getPasien = async () => {
  const { data } = await API.get("/pasien", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};

// GET PASIEN BY ID
export const getPasienById = async (id) => {
  const { data } = await API.get(`/pasien/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};

// UPDATE PASIEN
export const updatePasien = async (id, payload) => {
  const { data } = await API.put(`/pasien/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};

// DELETE PASIEN
export const deletePasien = async (id) => {
  const { data } = await API.delete(`/pasien/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};