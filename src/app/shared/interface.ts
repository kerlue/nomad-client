
export type IntegrationStatus = 'OPEN' | 'COMPLETED' | 'PARTIAL' | 'ERROR'
export type OrderSource = 'none' | 'website' | 'oe' | 'pierless' | 'edi'; // must match website
export type OrderStatus = 'none' | 'dynamics' | 'integrated' | 'routed' | 'shipped';
export const ORDER_FILTER = 'order-filter';
export const SAVED_WAREHOUSE_ID = 'nomad-global-warehouseId';

export interface InitialState{
  warehouse: WarehouseSettings[]
}


export interface DashboardStat {
  title: string;
  headerIcon: string;
  accentColor: string;
  stats: StatItem[];
}

export interface StatItem {
  icon: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface OrderResult {
  orders: Orders[];
  lastTimestamp: number;
}

export interface Orders {
  lastModifiedTs: number;
  orderId: string;
  customerCode: string;
  customerName: string;
  originalOrderId: string;
  locationId: string;
  divisionId: string;
  isDropShipOrder: boolean;
  erpIntegrated: boolean;
  createdDate: string; // ISO datetime string
  shippingDate: string;
  source: string;
  orderNeedsAttention: boolean

  // integration timestamps from target
  intraDbIntegrateAt: string;
  waveDbIntegratedAt: string;
  driverDbIntegratedAt: string;
  hJumpDbIntegratedAt: string;
  routedAt: string;
  invoicedAt: string;
  voidedAt: string;
  integrationStatus: IntegrationStatus
}

export interface WarehouseSettings {
  divisionId: string;
}

export interface FilterObject {
  queryString: string;
  orderSource: OrderSource;
  orderStatus: OrderStatus;
}
