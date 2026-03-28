import { Component } from '@angular/core';
import { ThemeService } from './theme';

@Component({
  // ...
})
export class HeaderComponent {
  constructor(public themeService: ThemeService) { }
}