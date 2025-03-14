import http from 'src/app/_ezs/utils/http'

const ClientsAPI = {
  listSelect: ({ Key, StockID }) =>
    http.get(`/api/gl/select2?cmd=member&q=${Key || ''}&CurrentStockID=${StockID || 0}`),
  listOrdersSelect: (body) => http.post('/api/v3/course@MemberOrderList', JSON.stringify(body))
}

export default ClientsAPI
