const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const GhostAdminAPI = require('@tryghost/admin-api');

const ADMIN_API_KEY = "5d7ca97a3e875054be6b0bde:e565502e89a9883296d6509d519fac493410b8c440820e7a78df1140a80066a4";
const API_URL = "http://13.235.78.175:2368";
const ADMIN_API_URL = 'http://13.235.78.175:2368/ghost/api/v2/admin/posts/';
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const api = new GhostAdminAPI({
    url: API_URL,
    key: ADMIN_API_KEY,
    version: 'v2'
});

//Token for admin authentication
const [id, secret] = ADMIN_API_KEY.split(':');

const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/v2/admin/`
});

const headers = { Authorization: `Ghost ${token}` };

app.get('/', (req, res) => {
    res.status(200).send({
        "message": "Success"
    })
})

app.post('/leads', (req, res) => {
    let name = req.body.name || "";
    let phoneNo = req.body.phoneNo || "";
    let email = req.body.email || "";
    let comments = req.body.comments || "";

    console.log("data: ", name, phoneNo, email, comments);

    if (name && phoneNo && email && comments) {

        axios.get(ADMIN_API_URL, { headers })
            .then(response => {

                if (response.data.posts.length > 0) {
                    const updated_at = response.data.posts[0].updated_at;
                    const mobiledoc = JSON.parse(response.data.posts[0].mobiledoc);
                    const content = mobiledoc.cards;
                    console.log('mobiledoc ', mobiledoc);
                    console.log('prev content ', content)
                    console.log('sections: ', mobiledoc.sections);
                    const sections = mobiledoc.sections;

                    content.push([
                        'html',
                        { html: `<ul><li>Name: ${name}, Phone #: ${phoneNo}, Email: ${email}, Comments: ${comments}</li></ul>` }
                    ])
                    console.log('content ', content)
                    sections.push([10, 1]);

                    let mobiledocJSOn = JSON.stringify(
                        {
                            "version": "0.3.1",
                            "atoms": [],
                            "cards": content,
                            "markups": [],
                            "sections": mobiledoc.sections
                        }
                    )

                    api.posts.edit({ id: '5d7c8bc13e875054be6b0bd4', title: 'Leads Data', updated_at: updated_at, mobiledoc: mobiledocJSOn })
                        .then(response => {
                            res.status(200).send(response.mobiledoc);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(200).send(err);
                        })
                }
            })
            .catch(error => {
                console.error(error)
            });

    }

})


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})