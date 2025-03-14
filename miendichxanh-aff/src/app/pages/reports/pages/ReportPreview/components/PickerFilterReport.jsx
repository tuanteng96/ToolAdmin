import React, { useEffect, useState } from "react";
import { FloatingPortal } from "@floating-ui/react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { Button } from "src/app/_ezs/partials/button";
import { InputDatePicker } from "src/app/_ezs/partials/forms";
import { SelectStocks } from "src/app/_ezs/partials/select";
import moment from "moment";
import { useRoles } from "src/app/_ezs/hooks/useRoles";
import { useAuth } from "src/app/_ezs/core/Auth";

function PickerFilterReport({ children, data, onSubmits }) {
  const [visible, setVisible] = useState(false);

  let { CrStocks } = useAuth();
  const { report, bao_cao_ngay_tong_quan } = useRoles([
    "bao_cao_ngay_tong_quan",
    "report",
  ]);

  const onHide = () => {
    setVisible(false);
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      Type: "",
      StockID: CrStocks?.ID ? [CrStocks?.ID] : null,
      CrDate: moment().toDate(),
    },
  });

  useEffect(() => {
    if (visible && data) {
      reset(data);
    }
  }, [data, visible]);

  const onSubmit = (values) => {
    onSubmits(values);
    onHide();
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
            <LayoutGroup>
              <Dialog open={visible} onClose={onHide}>
                <m.div
                  className="fixed inset-0 bg-black/[.2] z-[1003]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></m.div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="fixed inset-0 flex items-center justify-center z-[1003]"
                  autoComplete="off"
                >
                  <m.div
                    className="absolute flex flex-col justify-center h-full py-10 max-w-[500px] w-full px-5 md:px-0"
                    initial={{ opacity: 0, top: "60%" }}
                    animate={{ opacity: 1, top: "auto" }}
                    exit={{ opacity: 0, top: "60%" }}
                  >
                    <Dialog.Panel
                      tabIndex={0}
                      className="flex flex-col w-full max-h-full bg-white rounded shadow-lg"
                    >
                      <Dialog.Title className="relative flex justify-between px-5 py-4 border-b md:py-5 border-light">
                        <div className="text-lg font-bold md:text-2xl">
                          Bộ lọc
                        </div>
                        <div
                          className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                          onClick={onHide}
                        >
                          <XMarkIcon className="w-6 md:w-8" />
                        </div>
                      </Dialog.Title>
                      <div className="p-5 overflow-auto grow">
                        <div className="mb-3.5">
                          <div className="font-light">Ngày</div>
                          <div className="mt-1">
                            <Controller
                              name="CrDate"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState,
                              }) => (
                                <InputDatePicker
                                  //popperPlacement='top-start'
                                  placeholderText="Từ ngày"
                                  autoComplete="off"
                                  onChange={field.onChange}
                                  selected={
                                    field.value ? new Date(field.value) : null
                                  }
                                  dateFormat="dd/MM/yyyy"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-light">Cơ sở</div>
                          <div className="mt-1">
                            <Controller
                              name="StockID"
                              control={control}
                              render={({
                                field: { ref, ...field },
                                fieldState,
                              }) => (
                                <SelectStocks
                                  isMulti
                                  isClearable={true}
                                  className="select-control w-[300px]"
                                  value={field.value}
                                  onChange={(val) => {
                                    field.onChange(
                                      val ? val.map((x) => x.value) : []
                                    );
                                  }}
                                  StockRoles={
                                    bao_cao_ngay_tong_quan?.hasRight
                                      ? bao_cao_ngay_tong_quan?.StockRoles
                                      : report.StockRoles
                                  }
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end p-5 border-t border-light">
                        <button
                          type="button"
                          className="relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none"
                          onClick={onHide}
                        >
                          Đóng
                        </button>
                        <Button
                          type="submit"
                          className="relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                        >
                          Tìm kiếm
                        </Button>
                      </div>
                    </Dialog.Panel>
                  </m.div>
                </form>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}

export default PickerFilterReport;
