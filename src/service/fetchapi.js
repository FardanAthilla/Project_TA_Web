import axios from 'axios';

const API_URL = 'https://rdo-app-o955y.ondigitalocean.app/login';

export const login = async (username, password) => {
  try {
    console.log('Mengirim data:', { username, password });
    const response = await axios.post(API_URL, {
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
