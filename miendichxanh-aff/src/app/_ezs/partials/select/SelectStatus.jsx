import React from "react";
import Select from "react-select";

let options = [
  {
    value: 1,
    label: "Đang vận hành",
  },
  {
    value: 2,
    label: "Đã kết thúc",
  },
];

const SelectStatus = ({ value, ...props }) => {
  return (
    <>
      <Select
        value={options?.filter((x) => Number(x.value) === Number(value))}
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
        placeholder="Chọn trạng thái"
        noOptionsMessage={() => "Không có dữ liệu"}
        {...props}
      />
    </>
  );
};

export { SelectStatus };
