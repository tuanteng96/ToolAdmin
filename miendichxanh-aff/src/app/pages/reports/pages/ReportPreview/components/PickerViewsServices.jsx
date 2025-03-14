import React, { useEffect, useState } from "react";
import { FloatingPortal } from "@floating-ui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { formatString } from "src/app/_ezs/utils/formatString";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { useRoles } from "src/app/_ezs/hooks/useRoles";
import moment from "moment";
import ReportsAPI from "src/app/_ezs/api/reports.api";
import clsx from "clsx";

var heightlegend = 50;

function PickerViewsServices({ children, filters }) {
  const { report, bao_cao_ngay_tong_quan } = useRoles([
    "bao_cao_ngay_tong_quan",
    "report",
  ]);
  let [visible, setVisible] = useState(false);
  let [active, setActive] = useState(true);

  const { isLoading, data } = useQuery({
    queryKey: ["ReportsSellsChart2", visible],
    queryFn: async () => {
      let Stocks = bao_cao_ngay_tong_quan?.hasRight
        ? bao_cao_ngay_tong_quan?.StockRoles
        : report.StockRoles;

      let newFilters = {
        From: filters?.CrDate
          ? moment(filters?.CrDate).format("YYYY-MM-DD")
          : null,
        To: filters?.CrDate
          ? moment(filters?.CrDate).format("YYYY-MM-DD")
          : null,
        StockIDs:
          filters?.StockID && filters?.StockID.length > 0
            ? filters?.StockID.toString()
            : Stocks.map((x) => x.ID).toString(),
        Status: "done",
      };

      let { data } = await ReportsAPI.serviceChart(newFilters);
      let rs = [
        {
          Name: "Nhom",
          Title: "Dịch vụ theo Nhóm KH",
          labels: [],
          seriesValue: [],
          seriesCount: [],
        },
        {
          Name: "Gioi_Tinh",
          Title: "Dịch vụ theo giới tính",
          labels: [],
          seriesValue: [],
          seriesCount: [],
        },
        {
          Name: "Cu_moi",
          Title: "Dịch vụ theo loại KH cũ mới",
          labels: [],
          seriesValue: [],
          seriesCount: [],
        },
        {
          Name: "Thanh_toan",
          Title: "Dịch vụ theo phương thức thanh toán",
          labels: [],
          seriesValue: [],
          seriesCount: [],
        },
      ];

      if (data) {
        for (const property in data) {
          let index = rs.findIndex((x) => x.Name === property);
          if (index > -1) {
            let NameEmpty = "";
            if (property === "Nhom") {
              NameEmpty = "Chưa có nhóm";
            }
            if (property === "Gioi_Tinh") {
              NameEmpty = "Chưa chọn giới tính";
            }
            if (property === "Cu_moi") {
              NameEmpty = "Chưa xác định loại khách";
            }
            if (property === "Thanh_toan") {
              NameEmpty = "Chưa thanh toán";
            }

            rs[index].labels = data[property].map((x) => x?.Name || NameEmpty);
            rs[index].seriesValue = data[property].map((x) => x?.Value);
            rs[index].seriesCount = data[property].map((x) => x?.Count);
          }
        }
      }

      return rs;
    },
    enabled: visible,
  });

  const onHide = () => {
    setVisible(false);
  };

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: onHide,
      })}
      <AnimatePresence>
        {visible && (
          <FloatingPortal>
            <div
              className="fixed inset-0 flex items-center justify-center z-[1003]"
              autoComplete="off"
            >
              <m.div
                className="absolute flex flex-col justify-center w-full h-full md:px-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col w-full h-full bg-white rounded shadow-lg">
                  <div className="relative flex justify-between px-5 py-4 border-b border-light">
                    <div className="flex">
                      <div
                        className={clsx(
                          "px-4 py-3 font-medium rounded-l-lg text-[15px] cursor-pointer",
                          active ? "bg-primary text-white" : "bg-gray-200"
                        )}
                        onClick={() => setActive(true)}
                      >
                        Biểu đồ doanh số dịch vụ
                      </div>
                      <div
                        className={clsx(
                          "px-4 py-3 font-medium rounded-r-lg text-[15px] cursor-pointer",
                          !active ? "bg-primary text-white" : "bg-gray-200"
                        )}
                        onClick={() => setActive(false)}
                      >
                        Biểu đồ số lượng dịch vụ
                      </div>
                    </div>
                    <div
                      className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                      onClick={onHide}
                    >
                      <XMarkIcon className="w-6 md:w-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-4 overflow-auto md:grid-cols-2 grow">
                    {active && (
                      <>
                        {data &&
                          data.map((item, index) => (
                            <Chart
                              key={index}
                              options={{
                                title: { text: item.Title, align: "center" },
                                labels: item.labels || [],
                                legend: {
                                  //show: false,
                                  position: "bottom",
                                  height: heightlegend,
                                },
                                dataLabels: {
                                  formatter: function (val) {
                                    return Math.round(val) + "%";
                                  },
                                },
                                tooltip: {
                                  y: {
                                    formatter: function (val) {
                                      return formatString.formatVND(val);
                                    },
                                  },
                                },
                                noData: {
                                  text: "Không có dữ liệu",
                                  align: "center",
                                  verticalAlign: "middle",
                                  offsetX: 0,
                                  offsetY: 0,
                                },
                              }}
                              series={item.seriesValue || []}
                              type="pie"
                              height="auto"
                            />
                          ))}
                      </>
                    )}
                    {!active && (
                      <>
                        {data &&
                          data.map((item, index) => (
                            <Chart
                              key={index}
                              options={{
                                title: { text: item.Title, align: "center" },
                                labels: item.labels || [],
                                legend: {
                                  //show: false,
                                  position: "bottom",
                                  height: heightlegend,
                                },
                                dataLabels: {
                                  formatter: function (val) {
                                    return Math.round(val) + "%";
                                  },
                                },
                                tooltip: {
                                  y: {
                                    formatter: function (val) {
                                      return val;
                                    },
                                  },
                                },
                                noData: {
                                  text: "Không có dữ liệu",
                                  align: "center",
                                  verticalAlign: "middle",
                                  offsetX: 0,
                                  offsetY: 0,
                                },
                              }}
                              series={item.seriesCount || []}
                              type="pie"
                              height="auto"
                            />
                          ))}
                      </>
                    )}
                  </div>
                </div>
              </m.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}

export default PickerViewsServices;
