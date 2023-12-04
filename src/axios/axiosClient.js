const axios = require('axios');

function buildHeaders(jwtToken){
    const headers = {
        Authorization: `Bearer ${jwtToken}`
    }
    return headers;
}

async function post(url, body, headers) {
    try {
        // console.log(url, body, {headers})
        const response = await axios.post(url, body, { headers });
        return response;
    } catch (e) {
        console.error('There was an issue with the request', e);
        throw e;
    }
}

async function get(url, headers) {
    try {
        // console.log(url, body, {headers})
        const response = await axios.get(url, { headers });
        return response;
    } catch (e) {
        console.error('There was an issue with the request', e);
        throw e;
    }
}


module.exports = {
    buildHeaders,
    post,
    get
}