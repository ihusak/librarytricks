import { Component, OnInit } from '@angular/core';
import { SettingService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public model;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
  }
  addInfo(data) {
    this.settingService.addInfo(data);
  }

}
