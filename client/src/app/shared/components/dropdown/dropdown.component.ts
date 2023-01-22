import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() options: any;
  @Input() title: string;
  @Output() currentValueChange = new EventEmitter();

  public currentValue: any = {
    name: 'Nothing is selected',
  };
  public dropdownOpen = false;
  public get dropdownElement(): Element {
    return this.elem.nativeElement.querySelector('.dropdown-list');
  }

  private currentIndex = -1;

  constructor(private elem: ElementRef) {}

  handleKeyboardEvents($event: KeyboardEvent): void {
    if (this.dropdownOpen) {
      $event.preventDefault();
    } else {
      return;
    }
    if ($event.code === 'ArrowUp') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      } else if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      this.elem.nativeElement
        .querySelectorAll('li')
        .item(this.currentIndex)
        .focus();
    } else if ($event.code === 'ArrowDown') {
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      } else if (this.currentIndex < this.options.length - 1) {
        this.currentIndex++;
      }
      this.elem.nativeElement
        .querySelectorAll('li')
        .item(this.currentIndex)
        .focus();
    } else if (
      ($event.code === 'Enter' || $event.code === 'NumpadEnter') &&
      this.currentIndex >= 0
    ) {
      this.selectByIndex(this.currentIndex);
    } else if ($event.code === 'Escape') {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.currentIndex = -1;
    this.dropdownOpen = false;
  }

  selectByIndex(i: number): void {
    const value = this.options[i];
    this.select(value);
  }

  select(value: any): void {
    this.currentValue = value;
    this.closeDropdown();
    this.currentValueChange.emit(this.currentValue);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
