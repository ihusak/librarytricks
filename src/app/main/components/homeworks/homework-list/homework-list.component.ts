import { Component, OnInit } from '@angular/core';
import {HomeworkInterface, HomeworksService} from '../homeworks.service';

@Component({
  selector: 'app-homework-list',
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.scss']
})
export class HomeworkListComponent implements OnInit {
  public homeworksList: HomeworkInterface[];

  constructor(
    private homeworksService: HomeworksService
  ) { }

  ngOnInit() {
    this.homeworksService.getAllHomeworks().subscribe((hm: HomeworkInterface[]) => {
      this.homeworksList = hm;
    });
    console.log(this);
  }
}
