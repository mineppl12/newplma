import axios from 'axios';

function changeURL(url) {
    url = url.replace(/^\/api/, import.meta.env.VITE_API_BASE);

    return url;
}

async function getData(url, params = {}) {
    url = changeURL(url);

    const response = await axios.get(url, {
        params,
    });

    return response.data;
}

async function postData(url, body = {}) {
    url = changeURL(url);

    const response = await axios.post(url, body);
    return response.data;
}

export { getData, postData };
