import { useQuery } from "@tanstack/react-query";
import React from "react";
import Select from "react-select";
import ConfigAPI from "../../api/config.api";

const SelectTags = ({ value, ...props }) => {
  const SettingTagsCourse = useQuery({
    queryKey: ["SelectTagsCourse"],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName(`daotaotag`);
      let rs = [];
      if (data?.data && data?.data?.length > 0) {
        const result = JSON.parse(data?.data[0].Value);

        if (result && result.length > 0) {
          rs = result.map((x) => ({
            ...x,
            groupid: x.label,
            options: x?.children
              ? x?.children.map((o) => ({ ...o, value: o.label }))
              : [],
          }));
        }
      }
      return rs;
    },
    initialData: [],
  });
  
  return (
    <>
      <Select
        isLoading={SettingTagsCourse.isLoading}
        value={value}
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
        menuPortalTarget={document.body}
        classNamePrefix="select"
        options={SettingTagsCourse.data || []}
        placeholder="Chọn tags"
        noOptionsMessage={() => "Không có dữ liệu"}
        {...props}
      />
    </>
  );
};

export { SelectTags };
