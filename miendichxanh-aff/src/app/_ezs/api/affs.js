import http from "src/app/_ezs/utils/http"


const AffsAPI = {
    list: (data) => http.post(`/api/brand/MienDichXanh@GetF`, JSON.stringify(data)),
    addWallet: ({
        data
    }) => http.post("/api/v3/MemberMoney27@adds", data),
}

export default AffsAPI