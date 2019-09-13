const axios = require('axios');
const jwt = require('jsonwebtoken');

const CONTENT_API_KEY = "c63b5a3e40e018c9c91c513cbe";
const ADMIN_API_KEY = "5d7b633ae68d124c5fc569e3:c4d3fa4fca8d13d4bb37e21b2ce4677a4551d6fda4265d5609bd0ae35c7a02df";
const API_URL = "http://localhost:2368";

const [id, secret] = ADMIN_API_KEY.split(':');

// Create the token (including decoding secret)
const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/v2/admin/`
});

const url = 'http://localhost:2368/ghost/api/v2/admin/posts/';
const headers = { Authorization: `Ghost ${token}` };
const payload = { posts: [{ title: 'Hello World' }] };

axios.get(url, { headers })
    .then(response => {
        
        if (response.data.posts.length > 0) {
            const updated_at = response.data.posts[0].updated_at;
            const mobiledoc = JSON.parse(response.data.posts[0].mobiledoc);
            const content = mobiledoc.sections;
            const length = content.length;
// console.log(content)
            // console.log(JSON.stringify(content[0][2]));
           for(let i = 0; i < length; i++) {
               console.log(content[i]);
           }

            const payload = { posts: [{ title: 'Leads', "updated_at": updated_at }] };

            axios.put('http://localhost:2368/ghost/api/v2/admin/posts/5d7b676de68d124c5fc569e4/',
                payload,
                {
                    headers
                })
                .then(response => {
                    console.log(response.status)
                })
                .catch(err => {
                    console.error(err);
                })


        }
    })
    .catch(error => {
        console.error(error)
    });