import http from "src/app/_ezs/utils/http";

const ConfigAPI = {
  getName: (name) =>
    http.get(`/api/v3/config?cmd=getnames&names=${name}&ignore_root=1`),
  saveName: ({ name, body }) =>
    http.post(`/api/v3/ConfigJson@save?name=${name}`, JSON.stringify(body)),
  urlAction: ({ body, Token }) =>
    http.post(`/api/v3/UrlAction@invoke`, JSON.stringify(body), {
      headers: { Authorization: `Bearer ${Token}` },
    }),
};

export default ConfigAPI;
