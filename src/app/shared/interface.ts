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

export interface Orders {

}

export interface WarehouseSettings {
  divisionId: string;
}
