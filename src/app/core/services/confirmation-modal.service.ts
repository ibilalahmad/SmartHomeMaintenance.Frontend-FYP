import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'danger' | 'warning' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ConfirmationModalService {
  config = signal<ModalConfig | null>(null);
  isOpen = signal<boolean>(false);
  
  private confirmResolver?: (value: boolean) => void;

  async confirm(config: ModalConfig): Promise<boolean> {
    this.config.set({
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmColor: 'primary',
      ...config
    });
    this.isOpen.set(true);

    return new Promise(resolve => {
      this.confirmResolver = resolve;
    });
  }

  resolve(value: boolean) {
    if (this.confirmResolver) {
      this.confirmResolver(value);
      this.confirmResolver = undefined;
    }
    this.isOpen.set(false);
  }
}
