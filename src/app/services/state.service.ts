import { computed, effect, Injectable, NgZone, Signal, signal, WritableSignal } from '@angular/core';

import { ApiService } from './api.service';
import {MatDialog} from "@angular/material/dialog";
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { ServerNotReachableDialogComponent } from '../components/dialogs/server-not-reachable-dialog.component';
import { HeaderStateService } from '../components/header/header-state.service';
import { Orders } from '../shared/interface';
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
  pollTimestamp: WritableSignal<number> = signal<number>(0);
  orders: WritableSignal<Orders[]> = signal<Orders[]>([]);
  localShippingDate: Signal<string>;

  constructor(
    private apiService: ApiService,
    private ngZone: NgZone,
    protected dialog: MatDialog,
    protected header: HeaderStateService,
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
      this.loadDataOnFilterChanged();
    });

    // Computed signal that returns date string in NYC timezone
    this.localShippingDate = computed(() => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };

      const formatter = new Intl.DateTimeFormat('en-CA', options);
      return formatter.format(this.shippingDate());
    });

  }


  private loadInitialState() {
    this.apiService.getInitialData().subscribe({
      next: value => {
        // Set warehouse dropdown and update warehouse settings
        this.warehouseDropdownList.set(["All", ...value]);
        //set location mode
        const location = String(this.localStorage.getItem(SAVED_WAREHOUSE_ID) ?? "All");
        //Trigger initial data fetch for location
        this.selectedWarehouse.set(location);
        this.pollForUpdate();
      },
      error: () => {
        this.dialog.closeAll();
        this.dialog.open(ServerNotReachableDialogComponent, {
          disableClose: true,
        });
      },
    });
  }

  private loadDataOnFilterChanged() {
    this.header.showBuffering.set(true)
    this.apiService.getOrderUpdate(0,
      this.localShippingDate(),
      this.selectedWarehouse()).subscribe({
      next: (result) => {
        this.orders.set(result);
        //this.pollTimestamp.set(result.lastTimestamp)
      },
      error: (err) => {
        this.dialog.open(ServerNotReachableDialogComponent, {disableClose: true});
        //this.header.showBuffering.set(false)
      }

    })
  }

  /**
   * Periodically checks for route updates
   * @private
   */
  private pollForUpdate() {
    this.ngZone.runOutsideAngular(() => {
      this.apiService.pollOrderUpdate(
        this.pollTimestamp,
        this.localShippingDate,
        this.selectedWarehouse)
        .subscribe({
          next: (result) => {
            this.orders.set(result);
            //this.syncIncomingOrders(result.orders)
            //this.pollTimestamp.set(result.lastTimestamp)
          },
          error: (err) => {
            this.dialog.closeAll();
            this.dialog.open(ServerNotReachableDialogComponent, {
              disableClose: true,
            });
          }
        });
    })
  }

  private syncIncomingOrders(orders: Orders[]) {
    const ordersById: Record<string, Orders> = Object.fromEntries(
      orders.map(order => [order.orderId, order])
    );

    this.orders.update(orders => {
      orders.map((order) => {
        if (ordersById[order.orderId]) {
          const updatedOrder = ordersById[order.orderId];
          delete ordersById[order.orderId];
          return {
            ...updatedOrder
          };
        }
        return order;
      })

      orders = [...orders, ...Object.values(ordersById)]

     return orders
        .slice() // avoid mutating original array
        .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
        .slice(0, 20);

    })
  }
}
