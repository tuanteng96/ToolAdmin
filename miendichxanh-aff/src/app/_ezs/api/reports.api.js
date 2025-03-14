import http from "src/app/_ezs/utils/http";

const ReportsAPI = {
  customers: (body) => http.post(`/api/v3/r23/hang-ngay/tong#khach-hang`, JSON.stringify(body)),
  sells: (body) => http.post(`/api/v3/r23/hang-ngay/tong#ban-hang`, JSON.stringify(body)),
  orders: (body) => http.post(`/api/v3/r23/hang-ngay/danh-sach#ban-hang`, JSON.stringify(body)),
  services: (body) => http.post(`/api/v3/r23/hang-ngay/tong#dich-vu`, JSON.stringify(body)),
  incomes: (body) => http.post(`/api/v3/r23/hang-ngay/tong#thu-chi`, JSON.stringify(body)),
  members: (body) => http.post(`/api/v3/r23/hang-ngay/tong#nhan-vien`, JSON.stringify(body)),
  saleout: (body) => http.post(`/api/v3/r23/ban-hang/doanh-so-chi-tiet-ngay`, JSON.stringify(body)),
  serviceChart: (body) => http.post(`/api/v3/OrderService25@groups`, JSON.stringify(body))
};

export default ReportsAPI;
