import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {

  showBuffering: WritableSignal<boolean> = signal<boolean>(false);

  constructor() { }
}
