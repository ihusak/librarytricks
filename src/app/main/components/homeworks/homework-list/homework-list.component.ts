import { Component, OnInit } from '@angular/core';
import {HomeworkInterface, HomeworksService} from '../homeworks.service';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import { HomeworksModel } from '../homeworks.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.homeworksService.getAllHomeworks().subscribe((hm: HomeworkInterface[]) => {
      if (this.userInfo.role.id === this.userRoles.STUDENT) {
        this.homeworksList = hm.filter((h: HomeworkInterface) => h.students.find(s => s.id === this.userInfo.id));
      } else {
        this.homeworksList = hm;
      }
    });
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

  public deleteHomework(homeworkId: string) {
    this.homeworksService.deleteHomework(homeworkId).subscribe((response: any) => {
      if(response.result === 'ok') {
        this.homeworksList = this.homeworksList.filter((homework: HomeworksModel) => homework.id !== homeworkId);
        this.snackBar.open('Домашнее задание успешно удалено', '', {
          duration: 4000,
          panelClass: ['success']
        })
      }
    })
  }
}
