import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import AffsAPI from "src/app/_ezs/api/affs";
import { v4 as uuid } from "uuid";
import Table, { AutoResizer } from "react-base-table";
import Text from "react-texty";
import "react-texty/styles.css";
import "src/app/_ezs/plugins/react-base-table/react-base-table.css";
import { formatString } from "src/app/_ezs/utils/formatString";
import { InputDatePicker, InputNumber } from "src/app/_ezs/partials/forms";
import { SelectStocks } from "src/app/_ezs/partials/select";
import moment from "moment";
import { useAuth } from "src/app/_ezs/core/Auth";
import { toast } from "react-toastify";

const convertArray = (arrays) => {
  const newArray = [];
  if (!arrays || arrays.length === 0) {
    return newArray;
  }
  for (let [index, obj] of arrays.entries()) {
    if (obj.Items && obj.Items.length > 0) {
      for (let [x, order] of obj.Items.entries()) {
        let newOrder = {};
        for (const property in order) {
          newOrder["child_" + property] = order[property];
        }
        const newObj = {
          ...newOrder,
          ...obj,
          rowIndex: index,
          Ids: uuid(),
        };
        if (x !== 0) delete newObj.Items;
        newArray.push(newObj);
      }
    } else {
      newArray.push({ ...obj, rowIndex: index, Ids: uuidv4() });
    }
  }
  return newArray;
};

const ButtonReward = ({ rowData, loading, filters }) => {
  let [show, setShow] = useState(true);
  const addMutation = useMutation({
    mutationFn: async (body) => {
      let data = await AffsAPI.addWallet(body);
      return data;
    },
  });

  const onReward = () => {
    if (!rowData || rowData.length === 0) return;
    if (window.confirm("Bạn có muốn thực hiện trả thưởng không?")) {
      let dataPost = rowData
        .filter((x) => x.Items)
        .map((item) => ({
          Value: item?.TongHoaHong || 0,
          MethodPayID: "-1",
          Desc:
            `Thanh toán hoa hồng (${
              filters.DateFrom
                ? moment(filters.DateFrom).format("DD/MM/YYYY")
                : "--/--/----"
            } - ${
              filters.DateTo
                ? moment(filters.DateTo).format("DD/MM/YYYY")
                : "--/--/----"
            }) : ` +
            (item?.Items && item?.Items.length > 0
              ? item?.Items.map((x) => x.ID).join(", ")
              : ""),
          MemberID: item?.ID,
          StockID: 11425,
        }));

      addMutation.mutate(
        {
          data: {
            lst: dataPost,
          },
        },
        {
          onSuccess: ({ data }) => {
            toast.success("Trả thưởng thành công. Vui lòng không thực hiện lại.");
            setShow(false);
          },
        }
      );
    }
  };

  if (!show) return <></>;

  return (
    <div className="flex justify-center">
      <button
        onClick={onReward}
        className="text-white bg-primary py-2.5 px-3 rounded flex items-center disabled:opacity-70"
        type="button"
        disabled={addMutation.isPending || loading}
      >
        Trả thưởng
        {(addMutation.isPending || loading) && (
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-5 ml-2 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

function AffsPage(props) {
  const { Stocks } = useAuth();
  const [filters, setFilters] = useState({
    DateFrom: new Date(),
    DateTo: new Date(),
    StockID: Stocks && Stocks.length > 0 ? Stocks?.map((x) => x.ID) : [],
    Percent: 100,
  });

  const { isLoading, data } = useQuery({
    queryKey: ["Aff", { filters: filters }],
    queryFn: async () => {
      let { data } = await AffsAPI.list({
        ...filters,
        DateFrom: filters.DateFrom
          ? moment(filters.DateFrom).format("DD/MM/YYYY")
          : null,
        DateTo: filters.DateTo
          ? moment(filters.DateTo).format("DD/MM/YYYY")
          : null,
      });

      return convertArray(data?.lst);
    },
  });

  const TableCell = ({ className, cellData }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {cellData}
    </Text>
  );

  const TableHeaderCell = ({ className, column }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {column.title}
    </Text>
  );

  const columns = useMemo(
    () => [
      {
        key: "index",
        title: "STT",
        dataKey: "index",
        cellRenderer: ({ rowData }) => {
          return rowData?.rowIndex + 1;
        },
        width: 60,
        sortable: false,
        align: "center",
        //frozen: true,
        rowSpan: ({ rowData }) =>
          rowData.Items && rowData.Items.length > 0 ? rowData.Items.length : 1,
      },
      {
        key: "ID",
        title: "ID Khách hàng",
        dataKey: "ID",
        width: 150,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.Items && rowData.Items.length > 0 ? rowData.Items.length : 1,
      },
      {
        key: "MobilePhone",
        title: "Số điện thoại",
        dataKey: "MobilePhone",
        width: 150,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.Items && rowData.Items.length > 0 ? rowData.Items.length : 1,
      },
      {
        key: "FullName",
        title: "Tên khách hàng",
        dataKey: "FullName",
        width: 250,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.Items && rowData.Items.length > 0 ? rowData.Items.length : 1,
      },
      {
        key: "child_ID",
        title: "ID Đơn hàng",
        dataKey: "child_ID",
        width: 120,
        sortable: false,
      },
      {
        key: "child_SenderName",
        title: "Họ và tên",
        dataKey: "child_SenderName",
        width: 250,
        sortable: false,
      },
      {
        key: "child_SenderPhone",
        title: "Số điện thoại",
        dataKey: "child_SenderPhone",
        width: 180,
        sortable: false,
      },
      {
        key: "child_ToPay",
        title: "Giá trị",
        dataKey: "child_ToPay",
        width: 180,
        cellRenderer: ({ rowData }) =>
          formatString.formatVND(rowData.child_ToPay),
        sortable: false,
      },
      {
        key: "child_HoaHong",
        title: "Hoa hồng",
        dataKey: "child_HoaHong",
        cellRenderer: ({ rowData }) =>
          formatString.formatVND(rowData.child_HoaHong),
        width: 180,
        sortable: false,
      },
      {
        key: "TongHoaHong",
        title: "Tổng",
        dataKey: "TongHoaHong",
        cellRenderer: ({ rowData }) =>
          formatString.formatVND(rowData.TongHoaHong),
        width: 150,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.Items && rowData.Items.length > 0 ? rowData.Items.length : 1,
      },
    ],
    [filters]
  );

  const rowRenderer = ({ rowData, rowIndex, cells, columns, isScrolling }) => {
    if (isScrolling)
      return (
        <div className="absolute z-50 flex items-center w-full h-full bg-white">
          <div className="spinner spinner-primary w-40px"></div> Đang tải ...
        </div>
      );
    const indexList = [0, 1, 2, 3, 9];
    for (let index of indexList) {
      const rowSpan = columns[index].rowSpan({ rowData, rowIndex });
      if (rowSpan > 1) {
        const cell = cells[index];
        const style = {
          ...cell.props.style,
          backgroundColor: "#fff",
          height: rowSpan * 60 - 1,
          alignSelf: "flex-start",
          zIndex: 1,
        };
        cells[index] = React.cloneElement(cell, { style });
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between px-4 pt-4">
        <div className="flex gap-4">
          <div className="w-[250px]">
            <InputDatePicker
              //popperPlacement='top-start'
              placeholderText="Từ ngày"
              autoComplete="off"
              onChange={(e) => {
                console.log(e);
                setFilters((prevState) => ({
                  ...prevState,
                  DateFrom: e,
                }));
              }}
              selected={filters.DateFrom ? new Date(filters.DateFrom) : null}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="w-[250px]">
            <InputDatePicker
              //popperPlacement='top-start'
              placeholderText="Đến ngày"
              autoComplete="off"
              onChange={(e) =>
                setFilters((prevState) => ({
                  ...prevState,
                  DateTo: e,
                }))
              }
              selected={filters.DateTo ? new Date(filters.DateTo) : null}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <SelectStocks
              isMulti
              isClearable={true}
              className="select-control w-[400px]"
              value={filters.StockID}
              onChange={(val) => {
                setFilters((prevState) => ({
                  ...prevState,
                  StockID: val ? val.map((x) => x.value) : [],
                }));
              }}
            />
          </div>
          <div className="w-[100px]">
            <InputNumber
              placeholderText="Nhập giá trị"
              onValueChange={(val) =>
                setFilters((prevState) => ({
                  ...prevState,
                  Percent: val.floatValue ? val.floatValue : val.value,
                }))
              }
              value={filters.Percent}
            />
          </div>
        </div>
        <ButtonReward rowData={data} loading={isLoading} filters={filters} />
      </div>
      <div className="p-4 grow">
        <AutoResizer>
          {({ width, height }) => (
            <Table
              fixed
              rowKey="Ids"
              width={width}
              height={height}
              columns={columns}
              data={data}
              overlayRenderer={() => (
                <>
                  {isLoading && (
                    <div className="flex items-center justify-center w-full h-full">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              emptyRenderer={() =>
                !isLoading && (
                  <div className="flex items-center justify-center w-full h-full">
                    Không có dữ liệu
                  </div>
                )
              }
              rowHeight={60}
              rowRenderer={rowRenderer}
              components={{ TableCell, TableHeaderCell }}
              // ignoreFunctionInColumnCompare={true}
              overscanRowCount={100}
            />
          )}
        </AutoResizer>
      </div>
    </div>
  );
}

export default AffsPage;
