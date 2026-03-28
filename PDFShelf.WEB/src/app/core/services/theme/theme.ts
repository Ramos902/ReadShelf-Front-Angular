import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkClass = 'dark';

  constructor() {
    // Verifica preferência salva ou do sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme(true);
    }
  }

  toggleTheme() {
    this.setTheme(document.documentElement.classList.contains(this.darkClass) ? false : true);
  }

  setTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add(this.darkClass);
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove(this.darkClass);
      localStorage.setItem('theme', 'light');
    }
  }

  isDark(): boolean {
    return document.documentElement.classList.contains(this.darkClass);
  }
}