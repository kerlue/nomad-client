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
import { InitialState, Orders, Stats } from '../shared/interface';

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
    return this.http.get<InitialState>(`${this.nomadApi}/dock-info`);
  }


  public pollForStats(divisionId: WritableSignal<string>) {
    return timer(0, 3000).pipe(
      switchMap(() => {
        let url: string = `${this.nomadApi}/warehouse-stats/${divisionId()}`;
        return this.http.get<Stats>(url);
      }),
    );
  }

  public pollForOrders(divisionId: WritableSignal<string>, timestamp: WritableSignal<number>) {
    return timer(1000, 3000).pipe(
      switchMap(() => {
        let url: string = `${this.nomadApi}/get-pallet-routes/${divisionId()}/${timestamp()}`;
        return this.http.get<Orders[]>(url);
      }),
    );
  }


}




