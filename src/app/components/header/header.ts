import { Component } from '@angular/core';
import { Filter } from './filter/filter';

@Component({
  selector: 'app-header',
  imports: [Filter],
  styleUrl: './header.scss',
  template: `
    <div class="header">
      <div class="header__brand">
        <img class="header__logo" src="/favicon.ico" alt="logo" />
        <span class="header__app-name">NOMAD</span>
      </div>
      <app-filter></app-filter>
    </div>
  `
})
export class Header {}
