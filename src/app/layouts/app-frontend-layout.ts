import { Component } from '@angular/core';
import { Aggrid } from '../components/aggrid/aggrid';
import { GridStatus } from '../shared/interface';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-app-frontend-layout',
  imports: [Aggrid, Header],
  templateUrl: './app-frontend-layout.html',
  styleUrl: './app-frontend-layout.scss',
})
export class AppFrontendLayout {
  protected readonly GridStatus = GridStatus;
}
