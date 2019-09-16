const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const GhostAdminAPI = require('@tryghost/admin-api');

const ADMIN_API_KEY = "5d7df1c9330bc543ae0572cd:e4486904ef29c1157c2e31e8fac92080ad1687cae5632f061443b6f71ad63abf";
const API_URL = "http://3.17.187.37:2368";
const ADMIN_API_URL = 'http://3.17.187.37:2368/ghost/api/v2/admin/posts/';
const PORT = process.env.PORT || 3001;

let contentNo = 1;

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
                        { html: `<ul><li>Name: ${name}</li> <li>Phone #: ${phoneNo}</li> <li>Email: ${email}</li> <li>Comments: ${comments}</li></ul>` }
                    ])
                    console.log('content ', content);
                    contentNo += 1;
                    sections.push([10, contentNo]);

                    let mobiledocJSOn = JSON.stringify(
                        {
                            "version": "0.3.1",
                            "atoms": [],
                            "cards": content,
                            "markups": [],
                            "sections": sections
                        }
                    )

                    api.posts.edit({ id: '5d7df19b330bc543ae0572c5', title: 'Leads Data', updated_at: updated_at, mobiledoc: mobiledocJSOn })
                        .then(response => {
                            return res.status(200).send(response.mobiledoc);
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(200).send(err);
                        })
                }
                else {

                }
            })
            .catch(error => {
                console.error(error)
            });

    }
    else {
        return res.status(201).send({
            "message": "invalid data"
        });
    }

})


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})