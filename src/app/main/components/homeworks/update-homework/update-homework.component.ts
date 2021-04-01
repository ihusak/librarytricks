import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/main/main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { ProfileService } from '../../profile/profile.service';
import { HomeworksModel } from '../homeworks.model';
import { HomeworksService } from '../homeworks.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-update-homework',
  templateUrl: './update-homework.component.html',
  styleUrls: ['./update-homework.component.scss']
})
export class UpdateHomeworkComponent implements OnInit {
  public hmForm: FormGroup;
  public initForm: boolean = false;
  public userInfo: any;
  public studentList: StudentInfoInterface[];
  public selectedStudents: {id: string, name: string}[];
  private userRoles = UserRolesEnum;
  private hmId: string;

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private homeworksService: HomeworksService,
    private snackBar: MatSnackBar,
    private location: Location,
    private activateRoute: ActivatedRoute
  ) {
    activateRoute.params.subscribe(params => {
      this.hmId = params.id;
    });
   }

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.homeworksService.getHomeworkById(this.hmId).subscribe((homework: HomeworksModel) => {
    this.hmForm = this.formBuilder.group({
      title: [homework.title, [Validators.required]],
      description: [homework.description, [Validators.required, Validators.maxLength(250)]],
      example: [homework.example, [Validators.required, Validators.pattern('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$')]],
      students: [homework.students, [Validators.required]],
    });
    this.selectedStudents = homework.students;
    this.hmForm.controls.students.setValue(this.selectedStudents );
    this.initForm = true;
    this.profileService.getAllStudents().subscribe((allStudents: StudentInfoInterface[]) => {
      this.studentList = allStudents;
    });
    });
  }

  compareStudents(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.userName === o2.name : o2 === o2;
    // return o1.userName === o2.name && o1._id === o2.id;
  }
  public updateHomework() {
    this.homeworksService.updateHomework(this.hmId, this.hmForm.value).subscribe((res: any) => {
      if (res.result === 'ok') {
        this.snackBar.open('Задание успешно обновленно', '', {
          duration: 2000,
          panelClass: ['success']
        });
        this.location.back();
      }
    });
  }
}
