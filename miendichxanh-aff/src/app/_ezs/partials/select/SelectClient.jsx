import React from 'react'
import AsyncSelect from 'react-select/async'
import ClientsAPI from '../../api/clients.api'
import clsx from 'clsx'

const SelectClient = ({ StockID = 0, StockRoles, errorMessage, errorMessageForce, className, ...props }) => {

  const promiseOptions = (inputValue) =>
    new Promise(async (resolve) => {
      const data = await ClientsAPI.listSelect({
        Key: inputValue,
        StockID: StockID || 0
      })

      let newData = []
      if (data?.data?.data) {
        for (let key of data?.data?.data) {
          const { StockTitle, StockID, text, id } = key
          const index = newData.findIndex((item) => item.groupid === StockID)
          if (index > -1) {
            newData[index].options.push({
              label: text,
              value: id,
              ...key
            })
          } else {
            const newItem = {}
            newItem.label = StockTitle || 'Khác'
            newItem.groupid = StockID
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

      resolve(data?.data?.data?.length > 0 ? data?.data?.data.map((x) => ({ ...x, value: x.id, label: x.text })) : [])
    })

  return (
    <>
      <AsyncSelect
        cacheOptions
        defaultOptions
        className={clsx(className, errorMessageForce && 'select-control-error')}
        key={StockID}
        classNamePrefix='select'
        loadOptions={promiseOptions}
        placeholder='Chọn học viên'
        noOptionsMessage={() => 'Không có dữ liệu'}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        {...props}
      />
      {errorMessage && errorMessageForce && <div className='mt-1.5 text-sm text-danger'>{errorMessage}</div>}
    </>
  )
}

export { SelectClient }
