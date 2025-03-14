import http from "src/app/_ezs/utils/http"


const StaffsAPI = {
    list: (key = '') => http.get(`/api/gl/select2?cmd=user&q=${key}`),
    listService: ({ StockID = '', key = '', All = '' }) =>
        http.get(`/api/gl/select2?cmd=user&roles=DV&crstockid=${StockID}&q=${key}${All ? '&all=1' : ''}`)
}

export default StaffsAPI