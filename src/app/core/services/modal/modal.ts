import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    @if (modalService.isOpen()) {
      <div class="modal-backdrop fade show" style="z-index: 1050; background-color: rgba(0,0,0,0.5);"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog" style="z-index: 1055;" (click)="onBackdropClick($event)">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h5 class="modal-title">{{ modalService.title() }}</h5>
              <button type="button" class="btn-close" (click)="modalService.close()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ng-container *ngTemplateOutlet="modalService.contentTemplate()"></ng-container>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  constructor(public modalService: ModalService) {}

  onBackdropClick(event: MouseEvent) {
    this.modalService.close();
  }
}
