import React from 'react'
import Select from 'react-select'

let options = [
  {
    value: 2,
    label: 'Chưa tốt nghiệp'
  },
  {
    value: 4,
    label: 'Chờ tốt nghiệp'
  },
  {
    value: 1,
    label: 'Đã tốt nghiệp'
  },
  {
    value: 3,
    label: 'Đang tạm dừng'
  }
]

const SelectStatusStudent = ({ value, ...props }) => {
  return (
    <>
      <Select
        value={options?.filter((x) => Number(x.value) === Number(value))}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={options}
        placeholder='Chọn trạng thái'
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </>
  )
}

export { SelectStatusStudent }
