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

export class StateService {
  private initialDataLoaded: boolean = false;
  private tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));
  shippingDate: WritableSignal<Date> = signal<Date>(this.tomorrowDate);
  selectedWarehouse: WritableSignal<string> = signal<string>('');
  warehouseDropdownList: WritableSignal<string[]> = signal<string[]>([]);

  constructor(
    private apiService: ApiService,
    private ngZone: NgZone,
    protected dialog: MatDialog,
    protected localStorage: LocalStorageService,
  ) {


    //Check if user is authenticated to make request
    this.apiService.getAuthentication()
      .subscribe({
        next: (value: any) => {
          //value.username = Math.random().toString(36).substring(2, 10);
          AuthService.baldorUserId.set(value.username)
          AuthService.baldorSecret.set(value.secret)
        },
        error: (err) => {
          this.dialog.open(ServerNotReachableDialogComponent, {
            disableClose: true,
            data: {
              disableCancel: true,
              message: 'Authentication failed. Please try again.',
              onRetry: () => {
                window.location.reload();
              }
            }
          });
        }
      })

    //Load initial data from server if user is authenticated
    effect(() => {
      if (AuthService.baldorUserId() && !this.initialDataLoaded) {
        this.loadInitialState();
        this.initialDataLoaded = true;
      }
    });

    effect(() => {
      if(this.selectedWarehouse() == "") return;
      this.localStorage.setItem(SAVED_WAREHOUSE_ID, this.selectedWarehouse());
      this.loadDataOnFilterChanged(this.selectedWarehouse());
    });

  }


  private loadInitialState() {
    this.apiService.getInitialData().subscribe({
      next: value => {

        // Set warehouse dropdown and update warehouse settings
        this.warehouseDropdownList.set(["All", ...value]);
        //set location mode
        const location = String(this.localStorage.getItem(SAVED_WAREHOUSE_ID) ?? "All");


        console.log(location, "} =======>>");

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

    console.log(" ===>> ",location);
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
