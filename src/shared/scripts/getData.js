import axios from 'axios';

async function getData(url, params = {}) {
  url = url.replace(/^\/api/, import.meta.env.VITE_API_BASE);
  console.log(url);

  const response = await axios.get(url, {
    params,
  });

  return response.data;
}

export { getData };
