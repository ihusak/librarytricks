import { Component, OnInit } from '@angular/core';
import {HomeworkInterface, HomeworksService} from '../homeworks.service';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import { HomeworksModel } from '../homeworks.model';

@Component({
  selector: 'app-homework-list',
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.scss']
})
export class HomeworkListComponent implements OnInit {
  public homeworksList: HomeworkInterface[];
  public userInfo: any;
  public userRoles = UserRolesEnum;

  constructor(
    private homeworksService: HomeworksService,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.homeworksService.getAllHomeworks().subscribe((hm: HomeworkInterface[]) => {
      this.homeworksList = hm;
    });
    console.log(this);
  }
  public studentNames(homework: HomeworkInterface): string {
    return homework.students.map(s => s.name).join(', ');
  }

  public youTubeGetID(url: any): string {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  public likeHomework(homeworkId: string) {
    this.homeworksService.like(this.userInfo.id, homeworkId).subscribe((response: HomeworkInterface) => {
      this.homeworksList.filter((homework: HomeworksModel) => {
        if(homework.id === response.id) {
          homework.likes = response.likes;
        }
        return homework;
      })
    })
  }
}
