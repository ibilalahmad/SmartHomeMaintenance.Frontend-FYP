import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar';
import { TopbarComponent } from '../../admin/components/topbar/topbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent {
  /** Controls mobile sidebar visibility — replaces classList.add/remove('is-open') */
  readonly sidebarOpen = signal(false);

  openSidebar():  void { this.sidebarOpen.set(true);  }
  closeSidebar(): void { this.sidebarOpen.set(false); }
}
