import { Component, Input } from '@angular/core';
import { GridStatus } from '../../shared/interface';

@Component({
  selector: 'app-aggrid',
  imports: [],
  templateUrl: './aggrid.html',
  styleUrl: './aggrid.scss',
})
export class Aggrid {
  @Input() status!: GridStatus; 
}
