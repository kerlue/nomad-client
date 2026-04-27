
export enum GridStatus {
  Pending = 'pending',
  Completed = 'completed',
  ActionRequired = 'action_required'
}

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

  createdDate: string; // ISO datetime string
  shippingDate: string;

  source: string;

  // integration timestamps from target
  intranetIntegratedAt: string;
  ortecIntegratedAt: string;
  invoicedIntegratedAt: string;
  waveIntegratedAt: string;
  driverAppIntegratedAt: string;
  highJumpIntegratedAt: string;
  orderVoidedAt: string;
}

export interface WarehouseSettings {
  divisionId: string;
}
