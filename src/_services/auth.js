import { useJwt } from "react-jwt";
import { API } from "../_api";

export const login = async ({ email, password }) => {
  try {
    const response = await API.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const register = async ({ email, name, password }) => {
  try {
    const { data } = await API.post("/register",{email, name, password}); 

    return data; 
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async ({token}) => {
    try {
        const {data} =await API.post('/logout', {token}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        localStorage.removeItem('accessToken')
        return data
        
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await API.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error getUserInfo:", error);
    throw error;
  }
};

export const useDecodedToken = (token) => {
  const { decodedToken, isExpired } = useJwt(token);

  try {
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null,
      };
    }

    if (isExpired) {
      return {
        success: false,
        message: "Token expired",
        data: null,
      };
    }

    return {
      success: true,
      message: "Token valid",
      data: decodedToken,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};
