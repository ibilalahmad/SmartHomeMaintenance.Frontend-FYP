import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  isOpen = signal<boolean>(false);
  contentTemplate = signal<TemplateRef<any> | null>(null);
  title = signal<string>('');

  open(template: TemplateRef<any>, title: string = '') {
    this.contentTemplate.set(template);
    this.title.set(title);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.contentTemplate.set(null);
    this.title.set('');
  }
}
