import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Select from 'react-select'
import ClientsAPI from '../../api/clients.api'
import clsx from 'clsx'

const SelectOrderItemsClient = ({ value, MemberID, OrderID, errorMessage, errorMessageForce, className, ...props }) => {
  const SelectOrders = useQuery({
    queryKey: ['SelectOrdersItems'],
    queryFn: async () => {
      let { data } = await ClientsAPI.listOrdersSelect({
        MemberIDs: [MemberID]
      })
      let rs = []

      if (data.Orders && data.Orders.length > 0) {
        if (OrderID) {
          let OrderItemsIndex = data.Orders.findIndex((x) => x.ID === Number(OrderID))
          if (OrderItemsIndex > -1) {
            if (data.Orders[OrderItemsIndex].Items && data.Orders[OrderItemsIndex].Items.length > 0) {
              rs = data.Orders[OrderItemsIndex].Items.map((x) => ({ ...x, label: x.ProdTitle, value: x.ID }))
            }
          }
        }
      }
      return rs.filter(x => !x.CourseMemberID)
    },
    initialData: [],
    enabled: Number(MemberID) > 0 && Number(OrderID) > 0
  })

  return (
    <>
      <Select
        className={clsx(className, errorMessageForce && 'select-control-error')}
        isDisabled={SelectOrders.isLoading || !MemberID || !OrderID}
        isLoading={SelectOrders.isLoading}
        value={value ? SelectOrders?.data?.filter((x) => x.value === Number(value)) : ''}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={SelectOrders.data || []}
        placeholder='Chọn'
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
      {errorMessage && errorMessageForce && <div className='mt-1.5 text-sm text-danger'>{errorMessage}</div>}
    </>
  )
}

export { SelectOrderItemsClient }
