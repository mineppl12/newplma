import axios from 'axios';

async function getData(url, params = {}) {
  const response = await axios.get(url, {
    params,
  });

  return response.data;
}

export default getData;
