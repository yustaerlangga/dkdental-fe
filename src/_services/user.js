import { API } from "../_api"

export const getUsers = async () => {
    const { data } = await API.get("/users", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
    });
    return data.data;
}

export const addUser = async (payload) => {
  const { data } = await API.post("/users", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data.data;
};

export const getUserById = async (id) => {
  const { data } = await API.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data;
};