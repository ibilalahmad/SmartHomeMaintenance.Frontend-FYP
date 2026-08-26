import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar';
import { TopbarComponent } from '../../admin/components/topbar/topbar';
import { ToastComponent } from '../../core/services/toast/toast';
import { ModalComponent } from '../../core/services/modal/modal';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent, ModalComponent, ConfirmationModalComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent {
  /** Controls mobile sidebar visibility */
  readonly sidebarOpen = signal(false);

  /** Controls desktop sidebar collapse */
  readonly sidebarCollapsed = signal(false);

  openSidebar():  void { 
    // On mobile, this opens the offcanvas sidebar.
    // On desktop, we want the toggle button to collapse/expand.
    if (window.innerWidth > 900) {
      this.sidebarCollapsed.update(v => !v);
    } else {
      this.sidebarOpen.set(true);  
    }
  }

  closeSidebar(): void { 
    this.sidebarOpen.set(false); 
  }
}
