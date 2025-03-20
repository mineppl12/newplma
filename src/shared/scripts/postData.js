import axios from 'axios';

async function postData(url, params = {}) {
  const response = await axios.post(url, {
    data: params,
  });

  return response.data;
}

export default postData;
