import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles } from 'vtex.css-handles'
import { IOMessageWithMarkers } from 'vtex.native-types'

import { StorefrontFC, PriceRangeProps } from './types'

const CSS_HANDLES = [
  'sellingPriceRange',
  'sellingPriceRangeMinValue',
  'sellingPriceRangeMinWithTax',
  'sellingPriceRangeMaxValue',
  'sellingPriceRangeMaxWithTax',
  'sellingPriceRangeUniqueValue',
  'sellingPriceRangeUniqueWithTax',
] as const

const SellingPriceRange: StorefrontFC<PriceRangeProps> = props => {
  const { message, noRangeMessage, markers } = props
  const handles = useCssHandles(CSS_HANDLES)
  const { product, selectedItem } = useContext(ProductContext)

  const priceRange = product?.priceRange
  if (!priceRange) {
    return null
  }

  const commercialOffer = selectedItem?.sellers[0]?.commertialOffer
  if (!commercialOffer || commercialOffer?.AvailableQuantity <= 0) {
    return null
  }

  const minPrice: number = priceRange.sellingPrice.lowPrice
  const maxPrice: number = priceRange.sellingPrice.highPrice
  const hasRange = minPrice !== maxPrice
  const minPriceWithTax = minPrice + minPrice * commercialOffer.taxPercentage
  const maxPriceWithTax = maxPrice + maxPrice * commercialOffer.taxPercentage

  if (hasRange) {
    return (
      <span className={handles.sellingPriceRange}>
        <IOMessageWithMarkers
          message={message}
          markers={markers}
          handleBase="sellingPriceRange"
          values={{
            minPriceValue: (
              <span
                key="minPriceValue"
                className={handles.sellingPriceRangeMinValue}
              >
                <FormattedCurrency value={minPrice} />
              </span>
            ),
            maxPriceValue: (
              <span
                key="maxPriceValue"
                className={handles.sellingPriceRangeMaxValue}
              >
                <FormattedCurrency value={maxPrice} />
              </span>
            ),
            minPriceWithTax: (
              <span
                key="minPriceWithTax"
                className={handles.sellingPriceRangeMinWithTax}
              >
                <FormattedCurrency value={minPriceWithTax} />
              </span>
            ),
            maxPriceWithTax: (
              <span
                key="maxPriceWithTax"
                className={handles.sellingPriceRangeMaxWithTax}
              >
                <FormattedCurrency value={maxPriceWithTax} />
              </span>
            ),
          }}
        />
      </span>
    )
  }

  return (
    <span className={handles.sellingPriceRange}>
      <IOMessageWithMarkers
        message={noRangeMessage}
        markers={markers}
        handleBase="sellingPriceRange"
        values={{
          sellingPriceValue: (
            <span
              key="sellingPriceValue"
              className={handles.sellingPriceRangeUniqueValue}
            >
              <FormattedCurrency value={maxPrice} />
            </span>
          ),
          sellingPriceWithTax: (
            <span
              key="sellingPriceWithTax"
              className={handles.sellingPriceRangeUniqueWithTax}
            >
              <FormattedCurrency value={maxPriceWithTax} />
            </span>
          ),
        }}
      />
    </span>
  )
}

const messages = defineMessages({
  title: {
    id: 'admin/selling-price-range.title',
  },
  messageTitle: {
    id: 'admin/selling-price-range-message.title',
  },
  messageDescription: {
    id: 'admin/selling-price-range-message.description',
  },
  messageDefault: {
    id: 'store/selling-price-range-message.default',
  },
  noRangeMessageTitle: {
    id: 'admin/selling-price-range-no-range-message.title',
  },
  noRangeMessageDescription: {
    id: 'admin/selling-price-range-no-range-message.description',
  },
  noRangeMessageDefault: {
    id: 'store/selling-price-range-no-range-message.default',
  },
})

SellingPriceRange.schema = {
  title: messages.title.id,
  type: 'object',
  properties: {
    message: {
      title: messages.messageTitle.id,
      description: messages.messageDescription.id,
    },
    noRangeMessage: {
      title: messages.noRangeMessageTitle.id,
      description: messages.noRangeMessageDescription.id,
    },
  },
}

export default SellingPriceRange
