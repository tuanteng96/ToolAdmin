import React from "react";
import Select from "react-select";
import { useAuth } from "../../core/Auth";

const SelectStocks = ({ value, isMulti, StockRoles, ...props }) => {
  const { Stocks } = useAuth();

  return (
    <>
      <Select
        isMulti={isMulti}
        value={
          isMulti
            ? Stocks?.filter((x) => value && value.some((k) => k === x.value))
            : Stocks?.filter((x) => x.value === Number(value))
        }
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
        menuPortalTarget={document.body}
        classNamePrefix="select"
        options={StockRoles || Stocks}
        placeholder="Chọn cơ sở"
        noOptionsMessage={() => "Không có dữ liệu"}
        {...props}
      />
    </>
  );
};

export { SelectStocks };
