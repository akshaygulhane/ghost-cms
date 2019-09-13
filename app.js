const axios = require('axios');

const CONTENT_API_KEY = "c63b5a3e40e018c9c91c513cbe";
const ADMIN_API_KEY = "5d7b633ae68d124c5fc569e3:c4d3fa4fca8d13d4bb37e21b2ce4677a4551d6fda4265d5609bd0ae35c7a02df";
const API_URL = "http://localhost:2368";

// curl -H "Authorization: Ghost $token" ?https://{admin_domain}/ghost/api/{version}/admin/{resource}/

axios.post(`${API_URL}/ghost/api/v2/admin`,
    {
        headers: {
            'Authorization': 'Ghost ' + ADMIN_API_KEY
        }
    })
    .then(response => {
        console.log(response.status)
    })
    .catch(err => {
        console.error(err);
    })