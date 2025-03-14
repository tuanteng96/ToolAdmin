import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {
  arrow,
  FloatingArrow,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  flip,
  autoUpdate
} from '@floating-ui/react'

import moment from 'moment'

const InputDatePickerInline = ({
  wrapClasName,
  className,
  value,
  valueText,
  iconClassName,
  onChange,
  placeholderText,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)
  const { x, y, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      offset(8),
      flip(),
      arrow({
        element: arrowRef
      })
    ],
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss
  ])

  return (
    <>
      <button
        type="button"
        className={className}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {valueText || value
          ? moment(value).format('dd, D MMMM, YYYY')
          : placeholderText}
        <ChevronDownIcon
          className={clsx(iconClassName, isOpen ? 'rotate-180 transform' : '')}
        />
      </button>
      {isOpen && (
        <div
          className="fixed"
          style={{
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 1009
          }}
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          <DatePicker
            placeholderText={placeholderText}
            onChange={date => {
              onChange(date, () => setIsOpen(false))
            }}
            inline
            {...props}
          />
          <FloatingArrow
            className="fill-white dark:fill-[#1e1e2d]"
            ref={arrowRef}
            context={context}
          />
        </div>
      )}
    </>
  )
}

InputDatePickerInline.propTypes = {
  ClassName: PropTypes.string,
  iconClassName: PropTypes.string
}

export { InputDatePickerInline }
