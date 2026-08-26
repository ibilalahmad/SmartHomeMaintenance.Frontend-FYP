import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-avatar-initials',
  standalone: true,
  templateUrl: './avatar-initials.html',
})
export class AvatarInitialsComponent {
  readonly name = input.required<string>();

  readonly initials = computed<string>(() =>
    this.name()
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  );
}
