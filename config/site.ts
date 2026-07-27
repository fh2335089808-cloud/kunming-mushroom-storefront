export const siteConfig = {
  brandName: '菌鲜到',
  deliveryArea: '官渡区全范围',
  minOrderAmount: 80,
  deliverySpeed: '支持当日达/次日达',
  businessDescription: '自云南菌市直发·服务本地街坊超过一年',
  contactPhoneDisplay: '188-8698-3687',
  contactPhoneHref: '18886983687',
  wechatNumber: '17387628526',
  businessAddress: '云南省昆明市官渡区广居路934号',
  orderFormUrl: 'https://order.kunming-mushroom.asia/',
} as const;

export const siteCopy = {
  deliverySummary: `配送范围：${siteConfig.deliveryArea}·满 ${siteConfig.minOrderAmount} 元起送·${siteConfig.deliverySpeed}`,
  brandSummary: `${siteConfig.brandName}，${siteConfig.businessDescription}`,
} as const;
