export const inventoryStatuses = [
  '今日到货',
  '少量现货',
  '已售罄',
  '今日鲜货整理中',
] as const;

export type InventoryStatus = (typeof inventoryStatuses)[number];

export type TodayProduct = {
  id: string;
  name: string;
  image: string;
  price: string;
  unit: string;
  status: InventoryStatus;
  description: string;
  updatedAt: string;
  featured: boolean;
  registrationUrl: string;
  /** 未经业务确认的数据必须保持 true，并在前台明确显示为演示配置。 */
  demo?: boolean;
};

/**
 * “今日限量鲜货”和“今日现货”的唯一数据源。
 * 当前项目没有可核实的当日价格与库存接口，因此先保留一条明确标注的演示配置。
 * 上线正式商品前，请替换价格、单位、状态、更新时间并移除 demo。
 */
export const todayProducts: TodayProduct[] = [
  {
    id: 'jizong-demo',
    name: '鸡枞菌（演示配置）',
    image: '/images/mushrooms/jizong.webp',
    price: '待当日确认',
    unit: '以当日到货规格为准',
    status: '今日鲜货整理中',
    description: '当日品相、价格与可登记数量整理完成后更新。',
    updatedAt: '等待今日更新',
    featured: true,
    registrationUrl: '/order',
    demo: true,
  },
];

export const featuredTodayProducts = todayProducts
  .filter((product) => product.featured)
  .slice(0, 1);