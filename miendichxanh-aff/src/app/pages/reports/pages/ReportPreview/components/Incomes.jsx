import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import ReportsAPI from "src/app/_ezs/api/reports.api";
import { useRoles } from "src/app/_ezs/hooks/useRoles";
import { formatArray } from "src/app/_ezs/utils/formatArray";
import { formatString } from "src/app/_ezs/utils/formatString";
import { PickerViews } from ".";
import { ReportContext } from "src/app/_ezs/contexts";

function Incomes({ filters }) {
  const { setStore } = useContext(ReportContext);

  const { report, bao_cao_ngay_tong_quan } = useRoles([
    "bao_cao_ngay_tong_quan",
    "report",
  ]);

  const { isLoading, data } = useQuery({
    queryKey: ["ReportsIncomes", filters],
    queryFn: async () => {
      let Stocks = bao_cao_ngay_tong_quan?.hasRight
        ? bao_cao_ngay_tong_quan?.StockRoles
        : report.StockRoles;

      let newFilters = {
        ...filters,
        Type: "thu-chi",
        DateStart: filters?.CrDate
          ? moment(filters?.CrDate).format("DD/MM/YYYY")
          : null,
        DateEnd: filters?.CrDate
          ? moment(filters?.CrDate).format("DD/MM/YYYY")
          : null,
        StockID:
          filters?.StockID && filters?.StockID.length > 0
            ? filters?.StockID
            : Stocks.map((x) => x.ID),
      };

      let { data } = await ReportsAPI.incomes(newFilters);

      let newResult = {
        data: null,
        totalGroups: [],
      };

      if (data?.result?.Items) {
        let newItems = data.result.Items.reverse();
        newResult.data = newItems.map((item) => ({
          ...item,
          Groups: item.Groups
            ? item.Groups.map((group) => ({
                ...group,
                Title: group.GroupTitle,
                Keys: group.Keys
                  ? group.Keys.map((key) => {
                      return {
                        ...key,
                        Title: key.Key,
                        Value: {
                          Count: formatArray.sumTotal(key.Values, "Count"),
                          Qty: formatArray.sumTotal(key.Values, "Qty"),
                          Value: formatArray.sumTotal(key.Values, "Value"),
                        },
                      };
                    })
                  : [],
              }))
            : [],
        }));
        
        for (let group of newResult.data[0].Groups) {
          let newObj = {
            ...group,
            Keys: [],
            KeyID: formatString.convertViToEnKey(group.Title),
          };

          newObj.GroupCount = formatArray.sumTotalNested({
            Items: newResult.data,
            name: "GroupCount",
            key: group.GroupTitle,
          });
          newObj.GroupQty = formatArray.sumTotalNested({
            Items: newResult.data,
            name: "GroupQty",
            key: group.GroupTitle,
          });
          newObj.GroupValue = formatArray.sumTotalNested({
            Items: newResult.data,
            name: "GroupValue",
            key: group.GroupTitle,
          });

          for (let key of group.Keys) {
            newObj.Keys.push({
              ...key,
              KeyID: formatString.convertViToEnKey(key.Title),
              Value: {
                Count: formatArray.sumTotalNested({
                  Items: newResult.data,
                  name: "Count",
                  key: key.Key,
                }),
                Qty: formatArray.sumTotalNested({
                  Items: newResult.data,
                  name: "Qty",
                  key: key.Key,
                }),
                Value: formatArray.sumTotalNested({
                  Items: newResult.data,
                  name: "Value",
                  key: key.Key,
                }),
              },
            });
          }

          newResult.totalGroups.push(newObj);
        }
      }

      return newResult;
    },
  });
  
  useEffect(() => {
    setStore((prevState) => ({
      ...prevState,
      Incomes: data?.totalGroups || [],
      isLoadingIncomes: false,
    }));
  }, [data]);

  return (
    <div className="col-span-2 p-6 rounded shadow-xxl">
      <div className="mb-6 text-xl font-semibold">Thu Chi</div>
      {isLoading && (
        <div>
          <div className="pb-4 mb-4 border-b last:pb-0 last:mb-0 last:border-0">
            <div className="flex justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#ecf2ff] flex items-center justify-center rounded text-primary"></div>
                <div className="pl-3 text-[#2a3547]">
                  <div className="font-semibold">
                    <div className="w-[200px] h-3 mb-1.5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="text-sm font-light">
                    <div className="w-[100px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="min-w-10 h-10 bg-[#ecf2ff] flex items-center justify-center rounded text-primary font-medium text-base animate-pulse"></div>
            </div>
            <div>
              <div className="flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-300 animate-pulse"></div>
                  <div className="pl-2 font-light">
                    <div className="w-[150px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-end font-semibold text-center min-w-10">
                  <div className="w-6 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-300 animate-pulse"></div>
                  <div className="pl-2 font-light">
                    <div className="w-[150px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-end font-semibold text-center min-w-10">
                  <div className="w-6 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-4 mb-4 border-b last:pb-0 last:mb-0 last:border-0">
            <div className="flex justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#EEE5FF] flex items-center justify-center rounded text-info"></div>
                <div className="pl-3 text-[#2a3547]">
                  <div className="font-semibold">
                    <div className="w-[200px] h-3 mb-1.5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="text-sm font-light">
                    <div className="w-[100px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="min-w-10 h-10 bg-[#EEE5FF] flex items-center justify-center rounded text-info font-medium text-base animate-pulse"></div>
            </div>
            <div>
              <div className="flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-300 animate-pulse"></div>
                  <div className="pl-2 font-light">
                    <div className="w-[150px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-end font-semibold text-center min-w-10">
                  <div className="w-6 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-300 animate-pulse"></div>
                  <div className="pl-2 font-light">
                    <div className="w-[150px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-end font-semibold text-center min-w-10">
                  <div className="w-6 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-4 mb-4 border-b last:pb-0 last:mb-0 last:border-0">
            <div className="flex justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#F3F6F9] flex items-center justify-center rounded text-success"></div>
                <div className="pl-3 text-[#2a3547]">
                  <div className="font-semibold">
                    <div className="w-[200px] h-3 mb-1.5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="text-sm font-light">
                    <div className="w-[100px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="min-w-10 h-10 bg-[#F3F6F9] flex items-center justify-center rounded text-success font-medium text-base animate-pulse"></div>
            </div>
            <div>
              <div className="flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-300 animate-pulse"></div>
                  <div className="pl-2 font-light">
                    <div className="w-[150px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-end font-semibold text-center min-w-10">
                  <div className="w-6 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-300 animate-pulse"></div>
                  <div className="pl-2 font-light">
                    <div className="w-[150px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-end font-semibold text-center min-w-10">
                  <div className="w-6 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-300 animate-pulse"></div>
                  <div className="pl-2 font-light">
                    <div className="w-[150px] h-3 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-end font-semibold text-center min-w-10">
                  <div className="w-6 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isLoading && (
        <div>
          {data?.totalGroups.map((item, index) => (
            <div
              className="pb-4 mb-4 border-b last:pb-0 last:mb-0 last:border-0"
              key={index}
            >
              <PickerViews
                group={item}
                api={{
                  path: "/api/v3/r23/hang-ngay/danh-sach#thu-chi",
                  filter: {
                    ...filters,
                    GroupTitle: item.GroupTitle,
                    Type: "thu-chi",
                  },
                }}
              >
                {({ open }) => (
                  <div
                    className={clsx(
                      "flex justify-between cursor-pointer",
                      item.GroupTitle !== "Tồn ngày" && "mb-6"
                    )}
                    onClick={open}
                    data-key={item.KeyID}
                  >
                    <div className="flex items-center">
                      <div
                        className={clsx(
                          "w-10 h-10 flex items-center justify-center rounded",
                          index === 0 && "bg-[#ecf2ff] text-primary",
                          index === 1 && "bg-[#EEE5FF] text-info",
                          index === 2 && "bg-[#F3F6F9] text-success"
                        )}
                      >
                        <BanknotesIcon className="w-6" />
                      </div>
                      <div className="pl-3 text-[#2a3547]">
                        <div className="font-semibold text-[15px] md:text-base">
                          {item.GroupTitle}
                        </div>
                        <div className="text-sm font-light">Tổng tiền</div>
                      </div>
                    </div>
                    <div
                      className={clsx(
                        "min-w-10 h-10 flex items-center justify-center rounded font-medium text-[15px] px-2",
                        index === 0 && "bg-[#ecf2ff] text-primary",
                        index === 1 && "bg-[#EEE5FF] text-info",
                        index === 2 && "bg-[#F3F6F9] text-success"
                      )}
                    >
                      {item.GroupValue >= 0 ? "+" : "-"}
                      {formatString.formatVNDPositive(item.GroupValue)}
                    </div>
                  </div>
                )}
              </PickerViews>
              {item.GroupTitle !== "Tồn ngày" && (
                <div>
                  {item.Keys.map((key, i) => (
                    <PickerViews
                      key={i}
                      group={item}
                      item={key}
                      api={{
                        path: "/api/v3/r23/hang-ngay/danh-sach#thu-chi",
                        filter: {
                          ...filters,
                          GroupTitle: item.GroupTitle,
                          Key: key.Key,
                          Type: "thu-chi",
                        },
                      }}
                    >
                      {({ open }) => (
                        <div
                          className="cursor-pointer flex justify-between text-[15px] leading-6 border-b border-dashed pb-2 mb-2 last:border-0 last:pb-0 last:mb-0"
                          onClick={open}
                          data-key={key.KeyID}
                        >
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-sm bg-gray-300"></div>
                            <div className="pl-2 font-light">{key.Key}</div>
                          </div>
                          <div className="font-semibold text-center min-w-10 text-[14px]">
                            {formatString.formatVND(key.Value.Value)}
                          </div>
                        </div>
                      )}
                    </PickerViews>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Incomes;
