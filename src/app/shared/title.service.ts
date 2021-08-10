import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class TitleService {
  constructor(private titleService: Title) {}
  public setTitle(title?: string) {
    this.titleService.setTitle(`${title} - ${environment.appName}`)
  }
}