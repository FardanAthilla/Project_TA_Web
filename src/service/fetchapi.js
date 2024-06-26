import axios from 'axios';

const baseUrl = "https://rdo-app-o955y.ondigitalocean.app";

// Login
export const login = async (username, password) => {
  try {
    console.log('Mengirim data:', { username, password });
    const response = await axios.post(`${baseUrl}/login/owner`, {
      username: username,
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Respon dari server:', response);

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: 'Login gagal. Silakan cek kembali username dan password Anda.',
      };
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.response ? error.response.data.message : error.message,
    };
  }
};

// User
export const getUser = async (token) => {
  try {
    const response = await axios.post(`${baseUrl}/userAuth/getUser`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { success: false, message: error.message };
  }
};

// Account
export const register = async (username, password, address, no_handphone, role, image) => {
  try {
    console.log('Mengirim data:', { username, password, address, no_handphone, role, image });

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('address', address);
    formData.append('no_handphone', no_handphone);
    formData.append('role', role);
    formData.append('image', image);

    const response = await axios.post(`${baseUrl}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Response from server:', response);

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: 'Registration failed. Please check the details and try again.',
      };
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.response ? error.response.data.message : error.message,
    };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/user/all`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${baseUrl}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error: ", error.response.data);
    return { success: false, message: error.response.data.message || 'Terjadi kesalahan saat menghapus data.' };
  }
};
export const updateUser = async (userData) => {
  try {
    const response = await axios.put(`${baseUrl}/user`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const updateUserPhoto = async (userId, image) => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await axios.put(`${baseUrl}/user/foto/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};



// Machine
export const fetchMachines = async (searchName = "", searchCategories = "") => {
  try {
    const url = `${baseUrl}/search/machine`;
    const params = new URLSearchParams();
    if (searchName) params.append("name", searchName);
    if (searchCategories) params.append("categories", searchCategories);

    const response = await axios.get(`${url}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching machines:", error);
    throw error;
  }
};
export const deleteMachine = async (machineId) => {
  try {
    const response = await axios.delete(`${baseUrl}/store/items/${machineId}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error: ", error.response.data);
    return { success: false, message: error.response.data.message || 'Terjadi kesalahan saat menghapus data.' };
  }
};

// Sparepart
export const fetchSparepart = async (searchName = "", searchCategories = "") => {
  try {
    const url = `${baseUrl}/search/sparePart`;
    const params = new URLSearchParams();
    if (searchName) params.append("name", searchName);
    if (searchCategories) params.append("categories", searchCategories);

    const response = await axios.get(`${url}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sparepart:", error);
    throw error;
  }
};

export const getCategory = async () => {
  try {
    const response = await axios.get(`${baseUrl}/category/machine`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching category machine:", error);
    return { success: false, message: error.message };
  }
};

export const fetchCategoryMachine = async () => {
  try {
    const response = await axios.get(`${baseUrl}/category/machine`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchCategorySpareParts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/category/spare/part`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const addMachine = async (machineData) => {
  try {
    const response = await axios.post(`${baseUrl}/category/machine`, machineData);
    return response.data;
  } catch (error) {
    console.error("Error adding machine:", error);
    throw error;
  }
};