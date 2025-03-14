import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Select from 'react-select'
import ClientsAPI from '../../api/clients.api'
import clsx from 'clsx'

const SelectOrderClient = ({ value, MemberID, errorMessage, errorMessageForce, className, ...props }) => {
  const SelectOrders = useQuery({
    queryKey: ['SelectOrders'],
    queryFn: async () => {
      let { data } = await ClientsAPI.listOrdersSelect({
        MemberIDs: [MemberID]
      })
      let res = []

      if (data.Orders && data.Orders.length > 0) {
        res = data.Orders.map((x) => ({
          ...x,
          label: 'Đơn hàng #' + x.ID,
          value: x.ID,
          options: x.Items
            ? x.Items.map((o) => ({
                ...o,
                label: o.ProdTitle,
                value: o.ID + '-' + x.ID,
                disabled: o.CourseMemberID > 0,
                DayToPay: x.DayToPay
              }))
            : []
        }))
      }
      return res
    },
    initialData: [],
    enabled: Number(MemberID) > 0
  })

  const getValue = () => {
    if (!value || !SelectOrders?.data || SelectOrders?.data.length === 0) return null
    
    let keySplit = value.split('-')
    let newValue = null
    
    let firstIndex = SelectOrders?.data.findIndex((x) => x.ID === Number(keySplit[1]))
    
    if (firstIndex > -1) {
      let lastIndex = SelectOrders?.data[firstIndex].options?.findIndex((x) => x.ID === Number(keySplit[0]))
      if (lastIndex > -1) return SelectOrders?.data[firstIndex].options[lastIndex]
    }
    return newValue
  }

  return (
    <>
      <Select
        className={clsx(className, errorMessageForce && 'select-control-error')}
        isDisabled={SelectOrders.isLoading || !MemberID}
        isLoading={SelectOrders.isLoading}
        value={getValue()}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        isOptionDisabled={(option) => option.disabled}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={SelectOrders?.data || []}
        placeholder='Chọn đơn hàng'
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </>
  )
}

export { SelectOrderClient }
