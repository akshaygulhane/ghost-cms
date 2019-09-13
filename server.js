const GhostAdminAPI = require('@tryghost/admin-api');
const ADMIN_API_KEY = "5d7b633ae68d124c5fc569e3:c4d3fa4fca8d13d4bb37e21b2ce4677a4551d6fda4265d5609bd0ae35c7a02df";
const API_URL = "http://localhost:2368";

const api = new GhostAdminAPI({
    url: 'http://localhost:2368',
    key: ADMIN_API_KEY,
    version: 'v2'
  });
  
  api.posts.add({
      title: 'My first draft API post',
      mobiledoc: '{\"version\":\"0.3.1\",\"atoms\":[],\"cards\":[],\"markups\":[],\"sections\":[[1,\"p\",[[0,[],0,\"My post content. Work in progress...\"]]]]}'
  });
