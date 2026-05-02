import {inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {
  catchError, EMPTY,
  interval,
  map,
  Observable, takeWhile, tap, timer,
} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {switchMap} from "rxjs/operators";
import { environment } from '../environments/environment';
import { InitialState, OrderResult, Orders, DashboardStat } from '../shared/interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private authUrl: string;
  private nomadApi: string;

  constructor(private http: HttpClient) {
    this.nomadApi = environment.nomadApi;
    this.authUrl = environment.authUrl;
  }

  public getInitialData() {
    return this.http.get<string[]>(`${this.nomadApi}/all-warehouses`);
  }

  public fetchOrderDetails(orderId: string, divisionId: string) {
    return this.http.get(`${this.nomadApi}/fetch-order-details/${divisionId}/${orderId}`);
  }

  getAuthentication() {
    return this.http.get(`${this.authUrl}`);
  }

  public pollForStats(divisionId: WritableSignal<string>) {
    return timer(0, 3000).pipe(
      switchMap(() => {
        let url: string = `${this.nomadApi}/warehouse-stats/${divisionId()}`;
        return this.http.get<DashboardStat>(url);
      }),
    );
  }

  getOrderUpdate(
    timestamp: number,
    shippingDate: string,
    warehouse: string,
    globalFilterOrderId: string | null,
  ) {
    const url = `${this.nomadApi}/poll-orders`;

    const input = {
      timestamp,
      shippingDate,
      warehouse,
      globalFilterOrderId
    };

    return this.http.post<Orders[]>(url, input);
  }

  pollOrderUpdate(
    pollTimestamp: WritableSignal<number>,
    date: Signal<string>,
    divisionId: WritableSignal<string>,
    globalFilterOrderId: WritableSignal<string | null>,
  ) {
    return timer(5000, 5000).pipe(
      switchMap(() =>
        this.getOrderUpdate(pollTimestamp(), date(), divisionId(), globalFilterOrderId()),
      ),
    );
  }

  globalOrderSearch(input: { query: any }) {
    return this.http.post<Orders[]>(`${this.nomadApi}/global-order-search`, input);
  }


  triggerIntegration(orders: Orders[]) {
    return this.http.post<Orders[]>(`${this.nomadApi}/re-trigger-orders`, orders);
  }
}




