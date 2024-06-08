import axios from 'axios';

const baseUrl = "https://rdo-app-o955y.ondigitalocean.app";

export const login = async (username, password) => {
  try {
    console.log('Mengirim data:', { username, password });
    const response = await axios.post(`${baseUrl}/login`, {
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

export const register = async (username, password, address, no_handphone, image) => {
  try {
    console.log('Mengirim data:', { username, password, address, no_handphone, image });

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('address', address);
    formData.append('no_handphone', no_handphone);
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
