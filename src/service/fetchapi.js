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

export const register = async (username, password, address, no_handphone) => {
  try {
    console.log('Mengirim data:', { username, password, address, no_handphone });
    const response = await axios.post(`${baseUrl}/register`, {
      username,
      password,
      address,
      no_handphone
    }, {
      headers: {
        'Content-Type': 'application/json'
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
