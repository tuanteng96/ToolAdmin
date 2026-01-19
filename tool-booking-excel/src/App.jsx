import { useMutation } from "@tanstack/react-query";
import moment from "moment/moment";
import { useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import axios from "axios";

function App() {
  let fileRef = useRef();

  const { control, handleSubmit, watch, getValues, setValue } = useForm({
    defaultValues: {
      hostname: "https://huongbeautyspa.ezs.vn",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjExMzExMTAyODU1MDAwMDQiLCJuYmYiOjE3NjQyMjk0MDIsImV4cCI6MTg1MDYyOTQwMiwiaWF0IjoxNzY0MjI5NDAyfQ.H73iyUoNhP3cn_pXTY0ETK7dp8oJPysQ1dvlG7o9jWA",
      files: null,
      Items: null,
    },
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "Items",
  });

  const updateMutation = useMutation({
    mutationFn: async ({ Items, hostname, token }) => {
      const newItems = [...Items];

      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];

        if (item.Status !== "success") {
          newItems[i].Status = "pending";
          setValue("Items", [...newItems]);

          const obj = {
            CreateDate: "2025-01-01 00:00",
            MemberID: item.memberid,
            RootIdS: item.rootid,
            BookDate: moment(item.bookdate, "YYYY-MM-DD HH:mm").format(
              "YYYY-MM-DD HH:mm"
            ),
            Desc: "Số lượng khách: 1\nGhi chú: ",
            StockID: item.stockid,
            UserServiceIDs: "",
            AtHome: false,
            AmountPeople: {
              label: "1 khách",
              value: 1,
            },
            TagSetting: "",
            FullName: "",
            Phone: "",
            TreatmentJson: "",
            Status: "XAC_NHAN",
            IsAnonymous: false,
            InfoMore: {
              Member: {
                ID: item.memberid,
                FullName: item.fullname,
                MobilePhone: item.phone,
              },
              Roots: [
                {
                  ID: item.rootid,
                  Title: item.roottitle,
                },
              ],
            },
            History: [
              {
                Edit: [
                  {
                    CreateDate: "2025-01-01 00:00",
                    Staff: {
                      ID: 1,
                      FullName: "Admin System",
                    },
                    Booking: {
                      MemberID: item.memberid,
                      RootIdS: item.rootid,
                      BookDate: moment(
                        item.bookdate,
                        "YYYY-MM-DD HH:mm"
                      ).format("YYYY-MM-DD HH:mm"),
                      Desc: "Số lượng khách: 1\nGhi chú: ",
                      StockID: item.stockid,
                      UserServiceIDs: "",
                      AtHome: false,
                      AmountPeople: {
                        label: "1 khách",
                        value: 1,
                      },
                      TagSetting: "",
                      FullName: "",
                      Phone: "",
                      TreatmentJson: "",
                      Status: "XAC_NHAN",
                      IsAnonymous: false,
                      InfoMore: {
                        Member: {
                          ID: item.memberid,
                          FullName: item.fullname,
                          MobilePhone: item.phone,
                        },
                        Roots: [
                          {
                            ID: item.rootid,
                            Title: item.roottitle,
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          };

          try {
            let rs = await axios.post(
              `${hostname}/api/v3/mbookadmin?cmd=AdminBooking&CurrentStockID=${item.stockid}`,
              JSON.stringify({ booking: [obj] }),
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
              }
            );

            if (rs?.data?.data?.items && rs.data.data.items.length > 0) {
              newItems[i].BookID = rs.data.data.items[0].ID;
              newItems[i].Status = "success";
            } else {
              newItems[i].Status = "error";
              newItems[i].Error = "Đặt lịch không thành công";
            }
          } catch (err) {
            newItems[i].Status = "error";
            newItems[i].Error = "Timeout khi đặt lịch";
          }

          // Delay 0.3s để tránh quá tải server
          await new Promise((resolve) => setTimeout(resolve, 3000));

          setValue("Items", [...newItems]);
        }
      }

      return newItems;
    },
  });

  const excelMutation = useMutation({
    mutationFn: async (file) => {
      if (!file) throw new Error("No file provided");

      const readFile = () =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const workbook = XLSX.read(event.target.result, {
                type: "binary",
              });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const json = XLSX.utils.sheet_to_json(worksheet);
              resolve(json);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;

          reader.readAsBinaryString(file);
        });

      const result = await readFile();
      return result;
    },
  });

  const onSubmit = (values) => {
    if (values.files) {
      excelMutation.mutate(values.files, {
        onSuccess: (data) => {
          setValue(
            "Items",
            data
              ? data.map((x) => ({
                  ...x,
                  Status: "",
                  Error: "",
                  BookID: "",
                }))
              : []
          );
        },
      });
    }
  };

  let { files, Items, hostname, token } = watch();

  return (
    <form className="page-scrollbar" onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4 max-w-[500px]">
        <Controller
          name="hostname"
          control={control}
          render={({ field, fieldState }) => (
            <div className="mb-3">
              <input
                className="rounded border w-full border-gray-300 outline-none px-4 py-2 h-12"
                type="text"
                placeholder="Nhập tên miền ..."
                onChange={field.onChange}
                value={field.value}
              />
            </div>
          )}
        />
        <Controller
          name="token"
          control={control}
          render={({ field, fieldState }) => (
            <div className="mb-3">
              <textarea
                rows={6}
                className="rounded border w-full border-gray-300 outline-none px-4 py-3"
                type="text"
                placeholder="Nhập token authen ..."
                onChange={field.onChange}
                value={field.value}
              />
            </div>
          )}
        />
        <div className="mb-3">
          <Controller
            name="files"
            control={control}
            render={({ field, fieldState }) => (
              <div
                className="flex items-center justify-center w-full cursor-pointer"
                onClick={() => fileRef?.current?.click()}
              >
                <div className="flex flex-col items-center justify-center w-full h-52 border  border-dashed rounded border-gray-300">
                  <div className="flex flex-col items-center justify-center text-body pt-5 pb-6 px-4 text-center">
                    <svg
                      className="w-8 h-8 mb-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                      />
                    </svg>
                    <p className="mb-2">
                      {field.value?.name || "Click the button below to upload"}
                    </p>
                    <p className="text-xs mb-4 text-gray-400">
                      Max. File Size:{" "}
                      <span className="font-semibold">30MB</span>
                    </p>
                  </div>
                </div>
                {/* Hidden File Input (Outside Label) */}
                <input
                  id="dropzone-file-2"
                  type="file"
                  className="hidden"
                  ref={fileRef}
                  onChange={(e) => field.onChange(e.target.files[0])}
                  value=""
                />
              </div>
            )}
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#3E97FF] rounded text-white w-full h-12 px-4 flex items-center justify-center uppercase disabled:opacity-40 relative cursor-pointer"
            disabled={excelMutation.isPending || !files}
          >
            {excelMutation.isPending ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
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
            ) : (
              "Lấy dữ liệu Excel"
            )}
          </button>
        </div>
      </div>
      {fields && fields.length > 0 && (
        <>
          <div className="px-4 pb-4 h-[500px]">
            <div className="overflow-x-auto border border-[#eee] relative h-full">
              <table className="min-w-full border-separate border-spacing-0">
                <thead
                  className="sticky top-0 bg-[#f8f8f8] z-[1000] border-b border-b-[#eee]"
                  style={{
                    boxShadow: "0 10px 30px 0 rgba(82, 63, 105, .08)",
                  }}
                >
                  <tr>
                    <th className="capitalize px-4 py-3 font-semibold text-left min-w-[150px] max-w-[150px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      Thời gian
                    </th>
                    <th className="capitalize px-4 py-3 font-semibold text-left min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      Member ID
                    </th>
                    <th className="capitalize px-4 py-3 font-semibold text-left min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      Họ và tên
                    </th>
                    <th className="capitalize px-4 py-3 font-semibold text-left min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      Số điện thoại
                    </th>

                    <th className="capitalize px-4 py-3 font-semibold text-left min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      ID Dịch vụ
                    </th>
                    <th className="capitalize px-4 py-3 font-semibold text-left min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      Tên Dịch vụ
                    </th>
                    <th className="capitalize px-4 py-3 font-semibold text-left min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      ID Cơ sở
                    </th>
                    <th className="sticky right-0 bg-[#f8f8f8] z-10 capitalize px-4 py-3 font-semibold text-left min-w-[200px] max-w-[200px] border-b border-l border-l-[#eee] border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields && fields.length > 0 && (
                    <>
                      {fields.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 text-sm text-gray-700 min-w-[150px] max-w-[150px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {item.bookdate ? (
                              moment(item.bookdate, "YYYY-MM-DD HH:mm").format(
                                "HH:mm DD-MM-YYYY"
                              )
                            ) : (
                              <></>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {item.memberid}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {item.fullname}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {item.phone}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700 min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {item.rootid}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 min-w-[300px] max-w-[300px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {item.roottitle}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {item.stockid}
                          </td>
                          <td className="sticky right-0 bg-white border-l border-l-[#eee] font-medium z-10 px-4 py-4 text-sm text-gray-700 min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                            {Items[index].Status === "pending" && (
                              <div className="absolute w-full h-full top-0 left-0 flex items-center px-4 gap-2">
                                <div role="status">
                                  <svg
                                    aria-hidden="true"
                                    className="w-6 h-6 text-[#3699ff] animate-spin fill-[#3699ff]"
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
                                <div>Đang thực hiện ...</div>
                              </div>
                            )}
                            {Items[index].Status === "success" && (
                              <>
                                {Items[index].BookID && (
                                  <span className="text-[#1bc5bd]">
                                    {Items[index].BookID}
                                  </span>
                                )}
                              </>
                            )}
                            {Items[index].Status === "error" && (
                              <>
                                {Items[index].Error && (
                                  <span className="text-[#F64E60]">
                                    {Items[index].Error}
                                  </span>
                                )}
                              </>
                            )}
                            {!Items[index].Status && (
                              <span className="text-[#FFA800]">
                                Chưa thực hiện
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="px-4 pb-4 flex justify-end">
            <button
              type="button"
              className="bg-[#3E97FF] rounded text-white h-12 px-4 flex items-center justify-center uppercase disabled:opacity-40 relative cursor-pointer min-w-[170px]"
              disabled={updateMutation.isPending}
              onClick={() => {
                updateMutation.mutate(
                  {
                    Items: getValues("Items")?.slice() || [],
                    hostname,
                    token,
                  },
                  {
                    onSuccess: (rs) => {
                      console.log(rs);
                    },
                  }
                );
              }}
            >
              {updateMutation.isPending ? (
                <div className="flex items-center justify-between gap-3 w-full">
                  {Items.filter((x) => x.Status).length} / {Items.length}
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
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
              ) : (
                "Thực hiện đặt lịch"
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default App;
