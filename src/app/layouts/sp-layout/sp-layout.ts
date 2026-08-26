import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../sp/components/sidebar/sidebar';
import { Topbar } from '../../sp/components/topbar/topbar';
import { ToastComponent } from '../../core/services/toast/toast';
import { ModalComponent } from '../../core/services/modal/modal';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-sp-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Topbar, ToastComponent, ModalComponent, ConfirmationModalComponent],
  templateUrl: './sp-layout.html',
  styleUrl: '../admin-layout/admin-layout.css',
})
export class SpLayout {
  /** Controls mobile sidebar visibility */
  readonly sidebarOpen = signal(false);

  /** Controls desktop sidebar collapse */
  readonly sidebarCollapsed = signal(false);

  openSidebar():  void { 
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
