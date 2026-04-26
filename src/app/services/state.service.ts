import {effect, Injectable, NgZone, signal, WritableSignal} from "@angular/core";

import { ApiService } from './api.service';
import {MatDialog} from "@angular/material/dialog";
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { ServerNotReachableDialogComponent } from '../components/dialogs/server-not-reachable-dialog.component';
const DOCK_MODE_KEY = 'dockMode';
const SAVED_WAREHOUSE_ID = 'warehouseId';

@Injectable({
  providedIn: 'root',
})
export class PlannerStateService {
  private initialDataLoaded: boolean = false;
  selectedWarehouse: WritableSignal<string> = signal<string>('');
  warehouseDropdownList: WritableSignal<string[]> = signal<string[]>([]);
  public warehouse: WritableSignal<string> = signal<string>('BNY');

  constructor(
    private apiService: ApiService,
    private ngZone: NgZone,
    protected dialog: MatDialog,
    protected localStorage: LocalStorageService,
  ) {

    //Load initial data from server if user is authenticated
    effect(() => {
      if (AuthService.baldorUserId() && !this.initialDataLoaded) {
        this.loadInitialState();
        this.initialDataLoaded = true;
      }
    });

    effect(() => {
      if (this.selectedWarehouse() == '') { return; }
      this.localStorage.setItem(SAVED_WAREHOUSE_ID, this.selectedWarehouse());
      this.loadDataOnFilterChanged(this.selectedWarehouse());
    });

  }


  private loadInitialState() {
    this.apiService.getInitialData().subscribe({
      next: value => {
        // Set warehouse dropdown and update warehouse settings
        this.warehouseDropdownList.set(
          value?.warehouse.map((warehouse: any) => warehouse.divisionId),
        );

        //set location mode
        const location = String(this.localStorage.getItem(SAVED_WAREHOUSE_ID) ?? "101");
        //Trigger initial data fetch for location
        this.selectedWarehouse.set(location);

        this.pollForOrders();
        this.pollForStats();
      },
      error: () => {
        this.dialog.closeAll();
        this.dialog.open(ServerNotReachableDialogComponent, {
          disableClose: true,
        });
      },
    });
  }

  private loadDataOnFilterChanged(location: string) {

  }

  private pollForOrders() {
    this.ngZone.runOutsideAngular(() => {

    });
  }

  private pollForStats() {
    this.ngZone.runOutsideAngular(() => {

    });
  }

}
