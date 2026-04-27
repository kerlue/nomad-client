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
import { InitialState, OrderResult, Orders, Stats } from '../shared/interface';

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

  getAuthentication() {
    return this.http.get(`${this.authUrl}`);
  }

  public pollForStats(divisionId: WritableSignal<string>) {
    return timer(0, 3000).pipe(
      switchMap(() => {
        let url: string = `${this.nomadApi}/warehouse-stats/${divisionId()}`;
        return this.http.get<Stats>(url);
      }),
    );
  }

  getOrderUpdate(
    timestamp: number,
    shippingDate: string,
    warehouse: string
  ) {
    const url = `${this.nomadApi}/poll-orders`;

    const input = {
      timestamp,
      shippingDate,
      warehouse
    };

    return this.http.post<Orders[]>(url, input);
  }

  pollOrderUpdate(
    pollTimestamp: WritableSignal<number>,
    date: Signal<string>,
    divisionId: WritableSignal<string>
  ) {
    return timer(5000, 10000).pipe(
      switchMap(() =>
        this.getOrderUpdate(
          pollTimestamp(),
          date(),
          divisionId()
        )
      )
    );
  }

}




