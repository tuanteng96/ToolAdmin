import React, { Fragment, useState } from "react";
import { FloatingPortal } from "@floating-ui/react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
function PickerViewMobile({ children, columns, row }) {
  let [visible, setVisible] = useState(false);

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
            <LayoutGroup>
              <Dialog open={visible} onClose={onHide}>
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
                    <Dialog.Panel
                      tabIndex={0}
                      className="flex flex-col w-full h-full bg-white rounded shadow-lg"
                    >
                      <Dialog.Title className="relative flex justify-between px-5 py-4 border-b md:py-5 border-light">
                        <div className="text-lg font-bold md:text-2xl">
                          Chi tiết
                        </div>
                        <div
                          className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                          onClick={onHide}
                        >
                          <XMarkIcon className="w-6 md:w-8" />
                        </div>
                      </Dialog.Title>

                      <div className="grow overflow-auto">
                        {columns &&
                          columns.map((cell, i) => (
                            <Fragment key={i}>
                              <div className="flex justify-between border-b last:bottom-0 text-[14px] leading-6">
                                <div className="p-3 w-[135px] text-[#6c7293] font-light">
                                  {cell.title}
                                </div>
                                <div className="text-right p-3 flex-1 font-semibold">
                                  {typeof cell.cellRenderer !== "function"
                                    ? row[cell.dataKey]
                                    : cell.cellRenderer({
                                        rowData: {
                                          ...row,
                                        },
                                      })}
                                </div>
                              </div>
                            </Fragment>
                          ))}
                      </div>
                    </Dialog.Panel>
                  </m.div>
                </div>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}

export default PickerViewMobile;
