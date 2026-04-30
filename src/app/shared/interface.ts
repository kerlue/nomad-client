
export type IntegrationStatus = 'OPEN' | 'COMPLETED' | 'PARTIAL' | 'ERROR'

export interface InitialState{
  warehouse: WarehouseSettings[]
}
export interface Stats{

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
