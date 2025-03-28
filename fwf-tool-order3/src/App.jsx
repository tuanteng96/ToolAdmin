import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const StockIDs = urlParams.get("stockids");
  const DynamicIDs = urlParams.get("dynamicids");
  const MachineID = urlParams.get("machineid");

  const [filters, setFilters] = useState({
    Date: new Date(),
    StockID: [StockIDs],
    fns: [
      {
        DynamicID: [...(DynamicIDs ? DynamicIDs.split(",") : [])],
        Ratio: 1.08,
      },
      {
        PreodOrService: [1, 4],
        Ratio: 1.08,
      },
      {
        PreodOrService: [0],
        Ratio: 1.1,
      },
    ],
    include: ["Cash"],
    MachineID: MachineID || "17000096",
  });

  let [Content, setContent] = useState("");

  const updateMutation = useMutation({
    mutationFn: async (body) => {
      let data = await axios.post(
        `${
          import.meta.env.MODE === "development"
            ? import.meta.env.VITE_HOST
            : window.location.origin
        }/api/brand/Facewashfox@HourValue2`,
        body
      );
      return data;
    },
  });

  const onSubmit = () => {
    updateMutation.mutate(
      JSON.stringify({
        ...filters,
        Date: filters.Date ? moment(filters.Date).format("DD-MM-YYYY") : "",
      }),
      {
        onSuccess: ({ data }) => {
          if (data.hours) {
            let Values = [];
            for (let item of data.hours) {
              let arr = [
                MachineID || 17000096,
                moment(filters.Date).format("DDMMYYYY"),
                moment(filters.Date).format("DDMMYYYY"),
                item.Hour < 10 ? `0${item.Hour}` : item.Hour,
                item.OrderCount,
                `${item?.Value1 || 0}.00`,
                `${item?.TM + item?.CK + item?.QT - item?.Value1}.00`,
                ...Array.from(Array(3).keys()).map((x) => "0.00"),
                `${item?.TM1 || 0}.00`,
                `${item?.CK1 || 0}.00`,
                `${item?.QT1 || 0}.00`,
                ...Array.from(Array(4).keys()).map((x) => "0.00"),
                "Y",
              ];
              Values.push(arr.join("|"));
            }
            Values.push([].join("|"));
            Values.push("TỔNG");
            let arr = [
              17000096,
              moment(filters.Date).format("DDMMYYYY"),
              moment(filters.Date).format("DDMMYYYY"),
              "0.00",
              data.hours.reduce((n, { OrderCount }) => n + OrderCount, 0),
              `${data.hours.reduce((n, { Value1 }) => n + Value1, 0)}.00`,
              `${data.hours
                .map((x) => ({ TONG: x?.TM + x?.CK + x?.QT - x?.Value1 }))
                .reduce((n, { TONG }) => n + TONG, 0)}.00`,
              ...Array.from(Array(3).keys()).map((x) => "0.00"),
              `${data.hours.reduce((n, { TM1 }) => n + TM1, 0)}.00`,
              `${data.hours.reduce((n, { CK1 }) => n + CK1, 0)}.00`,
              `${data.hours.reduce((n, { QT1 }) => n + QT1, 0)}.00`,
              ...Array.from(Array(4).keys()).map((x) => "0.00"),
              "Y",
            ];
            Values.push(arr.join("|"));

            setContent(Values.join("\n"));
          } else {
            setContent("");
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-4 pt-4 flex gap-2.5">
        <div className="md:w-52">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            className="w-full h-12 px-4 border rounded outline-none focus:border-primary"
            selected={filters.Date}
            onChange={(date) =>
              setFilters((prevState) => ({ ...prevState, Date: date }))
            }
          />
        </div>
        <button
          className="flex-1 h-12 px-5 text-white rounded bg-primary md:flex-none"
          type="button"
          onClick={onSubmit}
        >
          Thực hiện
        </button>
      </div>
      <div className="p-4 grow">
        <div className="relative w-full h-full">
          <textarea
            className="w-full h-full p-4 border rounded outline-none resize-none"
            value={Content}
            readOnly
          ></textarea>
          {Content && (
            <CopyToClipboard
              text={Content}
              onCopy={() => toast.success("Đã Copy")}
            >
              <div className="absolute bottom-0 right-0 w-12 h-12 text-gray-800 cursor-pointer">
                <ClipboardDocumentIcon className="w-6" />
              </div>
            </CopyToClipboard>
          )}
          {updateMutation.isPending && (
            <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full rounded bg-white/90">
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
        </div>
      </div>
    </div>
  );
}

export default App;
