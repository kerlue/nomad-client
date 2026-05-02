import { computed, effect, Injectable, NgZone, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { addDays, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

import { ApiService } from './api.service';
import {MatDialog} from "@angular/material/dialog";
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { ServerNotReachableDialogComponent } from '../components/dialogs/server-not-reachable-dialog.component';
import { HeaderStateService } from '../components/header/header-state.service';
import { FilterObject, ORDER_FILTER, Orders, OrderStatus, SAVED_WAREHOUSE_ID, Stats } from '../shared/interface';


@Injectable({
  providedIn: 'root',
})

export class StateService implements OnDestroy {
  private timeoutRef: ReturnType<typeof setTimeout> | null = null;
  private initialDataLoaded: boolean = false;
  private tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));
  shippingDate: WritableSignal<Date> = signal<Date>(this.tomorrowDate);
  selectedWarehouse: WritableSignal<string> = signal<string>('');
  warehouseDropdownList: WritableSignal<string[]> = signal<string[]>([]);
  pollTimestamp: WritableSignal<number> = signal<number>(0);
  globalFilterOrderId: WritableSignal<string | null> = signal<string | null>(null);
  selectedOrder: WritableSignal<Orders | null> = signal<Orders | null>(null);
  orders: WritableSignal<Orders[]> = signal<Orders[]>([]);
  stats: WritableSignal<Stats[]> = signal<Stats[]>([]);
  filter: WritableSignal<FilterObject> = signal<FilterObject>({queryString: "", orderSource:"none", orderStatus: 'none'});
  localShippingDate: Signal<string>;

  constructor(
    private apiService: ApiService,
    private ngZone: NgZone,
    protected dialog: MatDialog,
    protected header: HeaderStateService,
    protected localStorage: LocalStorageService,
  ) {

    //Reload the client to look at next deliver order date
    this.scheduleNextReload();

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
        //Trigger initial data fetch for location
        const location = String(this.localStorage.getItem(SAVED_WAREHOUSE_ID) ?? "All");
        this.selectedWarehouse.set(location);

        const orderFilter = JSON.parse(this.localStorage.getItem(ORDER_FILTER) ?? "{}");
        //this.filter.set(orderFilter) maybe

        this.pollForOrderUpdate();
        this.pollForStatsUpdate();
      },
      error: () => {
        this.dialog.closeAll();
        this.dialog.open(ServerNotReachableDialogComponent, {
          disableClose: true,
        });
        this.autoReloadBrowser(15000)
      },
    });
  }

  private loadDataOnFilterChanged() {
    this.header.showBuffering.set(true)

    this.apiService.getOrderUpdate(0, this.localShippingDate(), this.selectedWarehouse(), null)
      .subscribe({
        next: (result) => {
          this.orders.set(result);
        },
        error: (err) => {
          this.dialog.open(ServerNotReachableDialogComponent, {disableClose: true});
          this.autoReloadBrowser(15000)
        }
    })

    this.apiService.getStatsUpdate(this.localShippingDate(), this.selectedWarehouse())
      .subscribe({
        next: (result) => {
          this.stats.set(result);
        },
        error: (err) => {
          this.dialog.open(ServerNotReachableDialogComponent, {disableClose: true});
          this.autoReloadBrowser(15000)
        }
      })


  }

  /**
   * Periodically checks for route updates
   * @private
   */
  private pollForOrderUpdate() {
    this.ngZone.runOutsideAngular(() => {
      this.apiService.pollOrderUpdate(
        this.pollTimestamp,
        this.localShippingDate,
        this.selectedWarehouse,
        this.globalFilterOrderId)
        .subscribe({
          next: (result) => {
            this.orders.set(result);
          },
          error: (err) => {
            this.dialog.closeAll();
            this.dialog.open(ServerNotReachableDialogComponent, {
              disableClose: true,
            });
            this.autoReloadBrowser(5000)
          }
        });
    })
  }

  private pollForStatsUpdate() {
    this.ngZone.runOutsideAngular(() => {
      this.apiService.pollStatsUpdate(
        this.localShippingDate,
        this.selectedWarehouse)
        .subscribe({
          next: (result) => {
            this.stats.set(result);
          },
          error: (err) => {
            this.dialog.closeAll();
            this.dialog.open(ServerNotReachableDialogComponent, {
              disableClose: true,
            });
            this.autoReloadBrowser(5000)
          }
        });
    })
  }


  private autoReloadBrowser(delay: number) {
    setTimeout(() => {
      window.location.reload();
    }, delay);
  }


  private scheduleNextReload(): void {
    const delay = this.msUntilNext2am();

    this.timeoutRef = setTimeout(() => {
      window.location.reload();
      this.scheduleNextReload();
    }, delay);
  }

  private msUntilNext2am(): number {
    const now = new Date();
    const TZ = 'America/New_York';


    // Build 2 AM today in ET, then convert to UTC
    const zonedNow = toZonedTime(now, TZ);
    let target = setMilliseconds(setSeconds(setMinutes(setHours(zonedNow, 2), 30), 0), 0);
    const targetUtc = fromZonedTime(target, TZ);

    // If already past 2 AM ET today, push to tomorrow
    const finalUtc = targetUtc <= now ? addDays(targetUtc, 1) : targetUtc;
    return finalUtc.getTime() - now.getTime();
  }

  ngOnDestroy(): void {
    if (this.timeoutRef !== null) {
      clearTimeout(this.timeoutRef);
    }
  }

  resetAfterGlobalFilter() {
    const orderFilter = JSON.parse(this.localStorage.getItem(ORDER_FILTER) ?? "");
    this.filter.set(orderFilter)
    this.loadDataOnFilterChanged()
  }


}
