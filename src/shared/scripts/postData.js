import axios from 'axios';

async function postData(url, body) {
  const response = await axios.post(url, body);
  return response.data;
}

export default postData;
