import React, { useContext, useEffect, useState } from "react";
import { FloatingPortal } from "@floating-ui/react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { formatString } from "src/app/_ezs/utils/formatString";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { useRoles } from "src/app/_ezs/hooks/useRoles";
import moment from "moment";
import ReportsAPI from "src/app/_ezs/api/reports.api";
import { formatArray } from "src/app/_ezs/utils/formatArray";
import { ReportContext } from "src/app/_ezs/contexts";

var heightlegend = 50;

function PickerViewsSells({ children, filters }) {
  const { setStore } = useContext(ReportContext);
  const { report, bao_cao_ngay_tong_quan } = useRoles([
    "bao_cao_ngay_tong_quan",
    "report",
  ]);
  let [visible, setVisible] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["ReportsSellsChart2", visible],
    queryFn: async () => {
      let Stocks = bao_cao_ngay_tong_quan?.hasRight
        ? bao_cao_ngay_tong_quan?.StockRoles
        : report.StockRoles;

      let newFilters = {
        ...filters,
        Type: "ban-hang",
        DateStart: filters?.CrDate
          ? moment(filters?.CrDate).format("DD/MM/YYYY")
          : null,
        DateEnd: filters?.CrDate
          ? moment(filters?.CrDate).format("DD/MM/YYYY")
          : null,
        BrandIds: "",
        CategoriesIds: "",
        IsMember: "",
        Payment: "",
        Pi: 1,
        ProductIds: "",
        StockID:
          filters?.StockID && filters?.StockID.length > 0
            ? filters?.StockID.toString()
            : Stocks.map((x) => x.ID).toString(),
        TimeToReal: 1,
        Voucher: "",
      };

      let { data } = await ReportsAPI.saleout(newFilters);

      let rs = {
        SP: {
          Items: [],
          labels: [],
          series: [],
        },
        DV: {
          Items: [],
          labels: [],
          series: [],
        },
        TT: {
          Items: [],
          labels: [],
          series: [],
        },
      };

      if (data.result) {
        for (let item of data.result) {
          if (item.Format === 1) {
            rs["SP"].Items.push(item);
            rs["SP"].labels.push(item.ProdTitle);
            rs["SP"].series.push(item.SumTopay);
          }
          if (item.Format === 2) {
            rs["DV"].Items.push(item);
            rs["DV"].labels.push(item.ProdTitle);
            rs["DV"].series.push(item.SumTopay);
          }
          if (item.Format === 3) {
            rs["TT"].Items.push(item);
            rs["TT"].labels.push(item.ProdTitle);
            rs["TT"].series.push(item.SumTopay);
          }
        }
      }

      rs.TOTAL = {
        labels: ["Sản phẩm / NVL", "Dịch vụ / Phụ phí", "Thẻ tiền"],
        series: [
          formatArray.sumTotal(rs.SP.Items, "SumTopay"),
          formatArray.sumTotal(rs.DV.Items, "SumTopay"),
          formatArray.sumTotal(rs.TT.Items, "SumTopay"),
        ],
      };

      return rs;
    },
    //enabled: visible,
  });

  useEffect(() => {
    setStore((prevState) => ({
      ...prevState,
      SellsChart: data,
      isLoadingSellsChart: false,
    }));
  }, [data]);

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
                  <div className="relative flex justify-between px-5 py-4 border-b md:py-5 border-light">
                    <div className="text-lg font-bold md:text-2xl">
                      Biểu đồ bán hàng
                    </div>
                    <div
                      className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                      onClick={onHide}
                    >
                      <XMarkIcon className="w-6 md:w-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-4 overflow-auto md:grid-cols-2 grow">
                    <Chart
                      options={{
                        title: { text: "Tổng quan", align: "center" },
                        labels: data?.TOTAL?.labels || [],
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
                      series={data?.TOTAL?.series || []}
                      type="pie"
                      height="auto"
                    />
                    <Chart
                      options={{
                        title: {
                          text: "Sản phẩm, Nguyên vật liệu",
                          align: "center",
                        },
                        labels: data?.SP?.labels || [],
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
                          text: "Sản phẩm, NVL trống",
                          align: "center",
                          verticalAlign: "middle",
                          offsetX: 0,
                          offsetY: 0,
                        },
                      }}
                      series={data?.SP?.series || []}
                      type="pie"
                      height="auto"
                    />

                    <Chart
                      options={{
                        title: {
                          text: "Dịch vụ, Phụ phí",
                          align: "center",
                        },
                        labels: data?.DV?.labels || [],
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
                          text: "Dịch vụ, Phụ phí trống",
                          align: "center",
                          verticalAlign: "middle",
                          offsetX: 0,
                          offsetY: 0,
                        },
                      }}
                      series={data?.DV?.series || []}
                      type="pie"
                      height="auto"
                    />
                    <Chart
                      options={{
                        title: { text: "Thẻ tiền", align: "center" },
                        labels: data?.TT?.labels || [],
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
                          text: "Thẻ tiền trống",
                          align: "center",
                          verticalAlign: "middle",
                          offsetX: 0,
                          offsetY: 0,
                        },
                      }}
                      series={data?.TT?.series || []}
                      type="pie"
                      height="auto"
                    />
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

export default PickerViewsSells;
