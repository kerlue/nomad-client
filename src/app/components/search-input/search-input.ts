import { Component, input, output, signal, effect, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-input',
  imports: [ReactiveFormsModule],
  styleUrl: './search-input.scss',
  template: `
    <div class="search-wrapper" [style.width]="width()">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <input
        type="text"
        class="search-input"
        [class.highlight]="highlight()"
        [value]="value()"
        [placeholder]="placeholder()"
        [formControl]="searchControl"
      />
      @if (searchControl.value) {
        <button type="button" class="clear-btn" (click)="clearSearch()" aria-label="Clear search">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      }
    </div>
  `
})
export class SearchInput {
  // Inputs
  placeholder = input<string>('Search...');
  width = input<string>('280px');
  debounce = input<number>(300);
  initialValue = input<string>('');
  value = input<string>('');
  highlight = input<boolean>(false);

  // Outputs
  valueChange = output<string>();
  cleared = output<void>();

  searchControl = new FormControl('');


  constructor() {
    // Set initial value when provided
    effect(() => {
      const initial = this.initialValue();
      if (initial) {
        this.searchControl.setValue(initial, { emitEvent: false });
      }
    });

    // Emit debounced value changes
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounce()),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((value) => {
        this.valueChange.emit(value ?? '');
      });
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.cleared.emit();
  }
}
