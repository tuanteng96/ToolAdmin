import { useMutation } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import axios from "axios";

function chunkArray(arr, max) {
  const result = [];
  for (let i = 0; i < arr.length; i += max) {
    result.push(arr.slice(i, i + max));
  }
  return result;
}

function App() {
  const { control, handleSubmit, watch, getValues, setValue } = useForm({
    defaultValues: {
      hostname: "https://cserbeauty.com",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjExMzExMTAyODU1MDAwMDQiLCJuYmYiOjE3NjQyMjk0MDIsImV4cCI6MTg1MDYyOTQwMiwiaWF0IjoxNzY0MjI5NDAyfQ.H73iyUoNhP3cn_pXTY0ETK7dp8oJPysQ1dvlG7o9jWA",
      content: "",
      max: 10,
      Items: [],
    },
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "Items",
  });

  const updateMutation = useMutation({
    mutationFn: async ({ Items, hostname, token, max }) => {
      const maxCount = Number(max) || 1;
      const newItems = chunkArray(Items, maxCount);

      for (let i = 0; i < newItems.length; i++) {
        const items = newItems[i];
        const startIndex = i * maxCount;

        for (let j = 0; j < items.length; j++) {
          setValue(`Items.${startIndex + j}.Status`, "pending");
          setValue(`Items.${startIndex + j}.Error`, "");
        }

        try {
          let rs = await axios.post(
            `${hostname}/api/v3/MemberPoint27@onOrder`,
            JSON.stringify({ OrderIDs: items.map((x) => Number(x.ID)) }),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              timeout: 10000,
            },
          );

          if (i !== newItems.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 2500));
          }

          if (rs?.data?.error) {
            for (let j = 0; j < items.length; j++) {
              setValue(`Items.${startIndex + j}.Status`, "error");
              setValue(`Items.${startIndex + j}.Error`, rs?.data?.error);
            }
          } else {
            for (let j = 0; j < items.length; j++) {
              setValue(`Items.${startIndex + j}.Status`, "success");
              setValue(`Items.${startIndex + j}.Error`, "");
            }
          }
        } catch (e) {
          for (let j = 0; j < items.length; j++) {
            setValue(`Items.${startIndex + j}.Status`, "error");
            setValue(`Items.${startIndex + j}.Error`, "Lỗi Catch");
          }
        }
      }

      return newItems;
    },
  });

  const onSubmit = (values) => {
    let newItems = values.content.split(",").map((x) => ({
      ID: x,
    }));
    setValue("Items", newItems);

    updateMutation.mutate(
      {
        Items: newItems,
        hostname: values.hostname,
        token: values.token,
        max: values.max || 1,
      },
      {
        onSuccess: () => {
          alert("Thực hiện xong.");
        },
      },
    );
  };

  let { Items, content } = watch();

  return (
    <form
      className="flex h-screen gap-4 p-4 page-scrollbar"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-[500px] flex flex-col">
        <div className="flex flex-col gap-4 overflow-auto grow">
          <Controller
            name="hostname"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <div className="mb-px">Tên miền</div>
                <input
                  className="w-full h-12 px-4 py-2 border border-gray-300 rounded outline-none"
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
              <div>
                <div className="mb-px">Token</div>
                <textarea
                  rows={6}
                  className="block w-full px-4 py-3 border border-gray-300 rounded outline-none"
                  type="text"
                  placeholder="Nhập token authen ..."
                  onChange={field.onChange}
                  value={field.value}
                />
              </div>
            )}
          />

          <Controller
            name="content"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <div className="mb-px">ID Đơn hàng</div>
                <textarea
                  rows={6}
                  className="block w-full px-4 py-3 border border-gray-300 rounded outline-none"
                  type="text"
                  placeholder="Nhập ID đơn hàng ..."
                  onChange={field.onChange}
                  value={field.value}
                />
              </div>
            )}
          />
          <Controller
            name="max"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <div className="mb-px">Tối đa đơn hàng mỗi lần</div>
                <input
                  className="w-full h-12 px-4 py-2 border border-gray-300 rounded outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-moz-appearance:textfield]"
                  type="number"
                  placeholder="Nhập số lần"
                  onChange={field.onChange}
                  value={field.value}
                  min={1}
                />
              </div>
            )}
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#3E97FF] rounded text-white w-full h-12 px-4 flex items-center justify-center uppercase disabled:opacity-40 relative cursor-pointer"
            disabled={updateMutation.isPending || !content}
          >
            {updateMutation.isPending ? (
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
              "Thực hiện ngay"
            )}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="overflow-x-auto border border-[#eee] relative h-full">
          <table className="min-w-full border-separate border-spacing-0">
            <thead
              className="sticky top-0 bg-[#f8f8f8] z-[1000] border-b border-b-[#eee]"
              style={{
                boxShadow: "0 10px 30px 0 rgba(82, 63, 105, .08)",
              }}
            >
              <tr>
                <th className="capitalize px-4 py-3 font-semibold text-left min-w-[150px] max-w-[150px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] uppercase text-sm">
                  ID đơn hàng
                </th>
                <th className="sticky right-0 bg-[#f8f8f8] z-10 capitalize px-4 py-3 font-semibold text-left min-w-[200px] max-w-[200px] border-b border-l border-l-[#eee] border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] uppercase text-sm">
                  Trạng thái (
                  {
                    Items.filter((x) => x.Status && x.Status !== "pending")
                      .length
                  }
                  / {Items.length})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields && fields.length > 0 && (
                <>
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 text-gray-700 min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                        {item.ID}
                      </td>
                      <td className="sticky right-0 bg-white border-l border-l-[#eee] font-medium z-10 px-4 py-4 text-gray-700 min-w-[200px] max-w-[200px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                        {Items[index].Status === "pending" && (
                          <div className="absolute top-0 left-0 flex items-center w-full h-full gap-2 px-4">
                            <div role="status">
                              <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-[#3699ff] animate-spin fill-gray-300"
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
                            <span className="text-[#1bc5bd]">Thành công</span>
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
                          <span className="text-[#FFA800]">Chưa thực hiện</span>
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
    </form>
  );
}

export default App;
