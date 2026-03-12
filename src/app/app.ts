import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPage } from "./features/auth/login-page/login-page";
import { Layout } from "./core/layout/layout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginPage, Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gradeci-erp-WebUI');
}
