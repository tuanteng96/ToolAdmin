import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Select from 'react-select'
import ConfigAPI from '../../api/config.api'

const SelectDormitory = ({ value, ...props }) => {
  const SettingDormitoryCourse = useQuery({
    queryKey: ['SelectDormitoryCourse'],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName(`daotaoktx`)
      let rs = []
      if (data?.data && data?.data?.length > 0) {
        const result = JSON.parse(data?.data[0].Value)
        if (result && result.length > 0) {
          rs = result
        }
      }
      return rs
    },
    initialData: []
  })

  return (
    <>
      <Select
        isLoading={SettingDormitoryCourse.isLoading}
        value={value}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={SettingDormitoryCourse.data || []}
        placeholder='Chọn ký túc xá'
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </>
  )
}

export { SelectDormitory }
