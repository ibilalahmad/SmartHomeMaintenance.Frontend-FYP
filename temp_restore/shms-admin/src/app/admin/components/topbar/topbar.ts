import { Component, output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
})
export class TopbarComponent {
  /** Emitted when the hamburger menu button is clicked */
  readonly menuToggle = output<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }
}
