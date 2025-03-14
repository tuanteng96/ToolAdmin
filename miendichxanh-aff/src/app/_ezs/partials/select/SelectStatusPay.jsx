import React from "react";
import Select from "react-select";

let options = [
  {
    value: 'no',
    label: 'Còn nợ'
  },
  {
    value: 'khong',
    label: 'Hết nợ'
  }
]

const SelectStatusPay = ({ value, ...props }) => {
  return (
    <>
      <Select
        value={options?.filter((x) => x.value === value)}
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
        menuPortalTarget={document.body}
        classNamePrefix="select"
        options={options}
        placeholder="Chọn trạng thái thanh toán"
        noOptionsMessage={() => "Không có dữ liệu"}
        {...props}
      />
    </>
  );
};

export { SelectStatusPay };
