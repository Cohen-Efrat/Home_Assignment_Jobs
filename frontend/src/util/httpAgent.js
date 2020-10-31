import axios from 'axios';
const BASE_URL = (path) => `http://localhost:5000${path}`;


const get = async (url, body, headers) => {
  try {
    const res = await axios.get(BASE_URL(url), { headers });
    return res.data;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('data');
      window.location.href = '/';
    }
    return error.response;
  }
};

const post = async (url, body, headers) => {
  try {
    const res = await axios.post(BASE_URL(url), body, { headers });
    return res.data;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('data');
      window.location.href = '/';
    }
    return error.response;
  }
};

const del = async (url, body, headers) => {
  try {
    const res = await axios.delete(BASE_URL(url), { headers });
    return res.data;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('data');
      window.location.href = '/';
    }
    return error.response;
  }
};

const patch = async (url, body, headers) => {
  try {
    const res = await axios.patch(BASE_URL(url), body, { headers });
    return res.data;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('data');
      window.location.href = '/';
    }
    return error.response;
  }
};

export default {
  get, post, patch, del,
};
