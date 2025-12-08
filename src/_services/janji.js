import { API } from "../_api";

// TAMBAH JANJI TEMU 
export const addJanji = async (payload) => {
  const { data } = await API.post("/janji-temu", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};


// GET SEMUA JANJI TEMU
export const getjanji = async () => {
  const { data } = await API.get("/janji-temu", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};


// GET JANJI TEMU BY ID
export const getjanjiById = async (id) => {
  const { data } = await API.get(`/janji-temu/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};


// UPDATE JANJI TEMU
export const updatejanji = async (id, payload) => {
  const { data } = await API.put(`/janji-temu/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};


// DELETE JANJI TEMU
export const deletejanji = async (id) => {
  const { data } = await API.delete(`/janji-temu/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};