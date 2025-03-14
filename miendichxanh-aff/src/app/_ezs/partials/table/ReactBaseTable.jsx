import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Table, { AutoResizer } from 'react-base-table'
import Text from 'react-texty'
import { Menu, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

import Pagination from '../pagination'
import { SpinnerComponent } from '../../components/spinner'

import 'src/app/_ezs/plugins/react-base-table/react-base-table.css'

ReactBaseTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool
}

const sizePerPage = [15, 30, 50, 100, 500, 1000]

function ReactBaseTable({
  columns,
  data,
  onPagesChange,
  loading,
  isPreviousData,
  pageCount,
  pageOffset,
  pageSizes,
  rowKey,
  rowRenderer,
  components,
  wrapClassName,
  emptyRenderer,
  onChange,
  pagination,
  footerClass = 'flex items-center justify-between w-full mt-4',
  ...props
}) {
  //const tableRef = useRef(null)

  //   useEffect(() => {
  //     tableRef?.current?.scrollToRow(0, 'start')
  //   }, [filters])

  const TableCell = ({ className, cellData }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {cellData}
    </Text>
  )

  const TableHeaderCell = ({ className, column }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {column.title}
    </Text>
  )

  return (
    <>
      <div className={wrapClassName}>
        <AutoResizer>
          {({ width, height }) => (
            <Table
              {...props}
              fixed
              rowKey={rowKey}
              width={width}
              height={height}
              columns={columns}
              data={data}
              overlayRenderer={() => (
                <SpinnerComponent
                  bgClassName={clsx('bg-white', isPreviousData && 'bg-opacity-70')}
                  top='top-[50px]'
                  height='h-[calc(100%-50px)]'
                  loading={loading}
                />
              )}
              emptyRenderer={() =>
                !loading && emptyRenderer ? (
                  emptyRenderer
                ) : (
                  <div className='flex flex-col items-center justify-center h-full dark:bg-dark-aside'>
                    <svg className='w-16' viewBox='0 0 56 60' xmlns='http://www.w3.org/2000/svg'>
                      <g fillRule='evenodd'>
                        <path
                          d='M1 14c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1h42c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H1zM15 22c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h22c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM17 6c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h10c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H17zM13 10c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h18c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H13zM36 8h7c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-8c-.5522847 0-1-.44771525-1-1V1c0-.55228475.4477153-1 1-1s1 .44771525 1 1v7zM7 24c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 30c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h6.052c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM7 32c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 38c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h4c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1h-4zM7 40c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM15 46c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h7.624c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H15zM7 48c-.55228475 0-1-.4477153-1-1v-4c0-.5522847.44771525-1 1-1h4c.5522847 0 1 .4477153 1 1v4c0 .5522847-.4477153 1-1 1H7zm1-2h2v-2H8v2zM50.4161068 57.3851932c.8194757.8194757 2.1493107.8194757 2.9690786-.000292.8200861-.819409.8200861-2.1487934-.0003531-2.9685554l-5.8009391-5.801939c-.8194757-.8194757-2.1493107-.8194757-2.9687864 0-.8204757.8204757-.8204757 2.1493107 0 2.9697864l5.801 5.801zm-1.4142136 1.4142136l-5.801-5.801c-1.6015243-1.6015243-1.6015243-4.1966893 0-5.7982136 1.6005243-1.6005243 4.1966893-1.6005243 5.7972745.000061l5.8006469 5.801647c1.6019139 1.600591 1.6019139 4.1972066.0002922 5.7975056-1.6005243 1.6005243-4.1966893 1.6005243-5.7972136 0z'
                          fillRule='nonzero'
                        />
                        <path
                          d='M44.2767682 49.0854427c-.0796855.1431637-.1409432.2915959-.1839798.4449137-.2066214.7360886-1.129285.9774606-1.6698952.4368504l-3.071-3.071c-.4227588-.4227589-.3825419-1.1195578.0860482-1.4908709.7296849-.5782061 1.3890884-1.2376096 1.9672945-1.9672945.3713131-.4685901 1.068112-.508807 1.4908709-.0860482l3.071 3.071c.5409662.5409663.298863 1.4642816-.4379449 1.6702017-.1524408.0426036-.299632.1034181-.4698447.1976596-.0184888.0094983-.0184888.0094983-.0310432.015818-.1740347.1024444-.3053389.2007059-.4131672.3085343-.1052752.1052752-.2029509.2352593-.2975553.3920191-.0189673.0378655-.0189673.0378655-.0407833.0782168zm.7492923-.7780213c-.0150164.0082337-.0150277.0082399-.0041919.0024769a3.21566785 3.21566785 0 0 1 .0041919-.0024769zm-3.4977824-2.0632569l1.3399831 1.3399832c.1030122-.1362829.2127271-.2632496.332632-.3831545.1205479-.1205479.2483304-.2309889.3829023-.3328841l-1.339731-1.3397311c-.2299487.2471101-.4686764.4858378-.7157864.7157865zm.9945169 1.8804997l.0060477-.0112071a4.15519983 4.15519983 0 0 0-.004591.0082705l-.0014567.0029366z'
                          fillRule='nonzero'
                        />
                        <path
                          d='M2 54.0002h39c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H1c-.55228475 0-1-.4477153-1-1v-54c0-.55228475.44771525-1 1-1h34c.2652165 0 .5195704.10535684.7071068.29289322l8 8C43.8946432 8.4806296 44 8.73498351 44 9.0002v14.094c0 .5522847-.4477153 1-1 1s-1-.4477153-1-1V9.41441356L34.5857864 2.0002H2v52z'
                          fillRule='nonzero'
                        />
                        <path
                          d='M44 36.0005c0-6.6277153-5.3722847-12-12-12s-12 5.3722847-12 12 5.3722847 12 12 12 12-5.3722847 12-12zm2 0c0 7.7322847-6.2677153 14-14 14s-14-6.2677153-14-14 6.2677153-14 14-14 14 6.2677153 14 14zM50.4161068 57.3851932c.8194757.8194757 2.1493107.8194757 2.9690786-.000292.8200861-.819409.8200861-2.1487934-.0003531-2.9685554l-5.8009391-5.801939c-.8194757-.8194757-2.1493107-.8194757-2.9687864 0-.8204757.8204757-.8204757 2.1493107 0 2.9697864l5.801 5.801zm-1.4142136 1.4142136l-5.801-5.801c-1.6015243-1.6015243-1.6015243-4.1966893 0-5.7982136 1.6005243-1.6005243 4.1966893-1.6005243 5.7972745.000061l5.8006469 5.801647c1.6019139 1.600591 1.6019139 4.1972066.0002922 5.7975056-1.6005243 1.6005243-4.1966893 1.6005243-5.7972136 0z'
                          fillRule='nonzero'
                        />
                        <path
                          d='M40 36.0005c0-4.4184153-3.5815847-8-8-8-4.4184153 0-8 3.5815847-8 8 0 4.4184153 3.5815847 8 8 8 4.4184153 0 8-3.5815847 8-8zm2 0c0 5.5229847-4.4770153 10-10 10s-10-4.4770153-10-10 4.4770153-10 10-10 10 4.4770153 10 10z'
                          fillRule='nonzero'
                        />
                        <path d='M33.41421356 36l1.41421356 1.41421356c.39052426.39052426.39052426 1.0236893 0 1.41421356-.39052425.39052426-1.0236893.39052426-1.41421356 0L32 37.41421356l-1.41421356 1.41421356c-.39052426.39052426-1.0236893.39052426-1.41421356 0-.39052426-.39052425-.39052426-1.0236893 0-1.41421356L30.58578644 36l-1.41421356-1.41421356c-.39052426-.39052426-.39052426-1.0236893 0-1.41421356.39052425-.39052426 1.0236893-.39052426 1.41421356 0L32 34.58578644l1.41421356-1.41421356c.39052426-.39052426 1.0236893-.39052426 1.41421356 0 .39052426.39052425.39052426 1.0236893 0 1.41421356L33.41421356 36z' />
                      </g>
                    </svg>
                    <div className='my-3 mt-6 text-2xl font-semibold'>Không có dữ liệu</div>
                    <div className='max-w-[400px] text-center font-light'>
                      Hãy thử sử dụng các tùy chọn bộ lọc khác nhau để tìm thấy những gì bạn đang tìm kiếm
                    </div>
                  </div>
                )
              }
              rowRenderer={rowRenderer}
              components={{ TableCell, TableHeaderCell, ...components }}
              ignoreFunctionInColumnCompare={false}
            />
          )}
        </AutoResizer>
      </div>
      {pagination && (
        <div className={footerClass}>
          <div className='flex font-medium'>
            Hiển thị
            <Menu as='div' className='relative'>
              <div>
                <Menu.Button className='flex items-center px-2 font-semibold font-inter'>
                  {pageSizes}
                  <ChevronUpIcon className='w-4 ml-1' aria-hidden='true' />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Menu.Items className='z-[1001] bottom-full absolute rounded px-0 py-2 border-0 w-[150px] bg-white shadow-lg shadow-blue-gray-500/10'>
                  <div>
                    {sizePerPage &&
                      sizePerPage.map((size, index) => (
                        <Menu.Item
                          key={index}
                          onClick={() =>
                            onChange({
                              pageIndex: 1,
                              pageSize: size
                            })
                          }
                        >
                          <button
                            className={clsx(
                              'w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium',
                              size === pageSizes && 'text-primary bg-[#F4F6FA]'
                            )}
                          >
                            {size}
                          </button>
                        </Menu.Item>
                      ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            trên trang
          </div>
          <div>
            <Pagination pageCount={pageCount} pageOffset={pageOffset} pageSizes={pageSizes} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  )
}

export default ReactBaseTable
