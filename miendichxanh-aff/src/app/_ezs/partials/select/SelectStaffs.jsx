import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import StaffsAPI from '../../api/staffs.api'

const SelectStaffs = ({ isMulti, value, loading, disabled, StockRoles, ...props }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ListStaffs'],
    queryFn: async () => {
      const { data } = await StaffsAPI.list()
      const { Items } = {
        Items: data?.data?.map((x) => ({ ...x, label: x.text, value: x.id })) || []
      }
      let newData = []

      if (Items && Array.isArray(Items)) {
        for (let key of Items) {
          const { group, groupid, text, id } = key
          const index = newData.findIndex((item) => item.groupid === groupid)
          if (index > -1) {
            newData[index].options.push({
              label: text,
              value: id,
              ...key
            })
          } else {
            const newItem = {}
            newItem.label = group
            newItem.groupid = groupid
            newItem.options = [
              {
                label: text,
                value: id,
                ...key
              }
            ]
            newData.push(newItem)
          }
        }
      }

      if (StockRoles && StockRoles.length > 0) {
        newData = newData.filter((x) => StockRoles.some((s) => s.value === x.groupid))
      }

      return {
        nested: newData || [],
        list: Items || []
      }
    }
  })

  return (
    <>
      <Select
        isMulti={isMulti}
        isLoading={loading || isLoading}
        isDisabled={disabled || isLoading}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={data?.nested || []}
        value={
          isMulti
            ? data?.list?.filter((x) => value && value.some((k) => k === x.value))
            : data?.list?.filter((x) => x.value === value)
        }
        placeholder='Chọn nhân viên'
        noOptionsMessage={() => 'Không có nhân viên'}
        {...props}
      />
    </>
  )
}

export { SelectStaffs }
