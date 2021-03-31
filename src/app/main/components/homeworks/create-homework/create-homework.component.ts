import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserRolesEnum} from '../../../../shared/enums/user-roles.enum';
import {MainService} from '../../../main.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import { ProfileService } from '../../profile/profile.service';
import { StudentInfoInterface } from 'src/app/shared/interface/user-info.interface';
import { HomeworksService } from '../homeworks.service';

@Component({
  selector: 'app-create-homework',
  templateUrl: './create-homework.component.html',
  styleUrls: ['./create-homework.component.scss']
})
export class CreateHomeworkComponent implements OnInit {
  public hmForm: FormGroup;
  public initForm: boolean = false;
  public userInfo: any;
  public studentList: StudentInfoInterface[];
  private userRoles = UserRolesEnum;

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private homeworksService: HomeworksService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userInfo = this.mainService.userInfo;
    this.hmForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      example: ['', [Validators.required, Validators.pattern('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$')]],
      students: [[], [Validators.required]],
    });
    this.initForm = true;
    this.profileService.getAllStudents().subscribe((allStudents: StudentInfoInterface[]) => {
      this.studentList = allStudents;
    });
  }
  public createHm() {
    const HOMEWORK = this.hmForm.value;
    HOMEWORK.students = HOMEWORK.students.map((st: StudentInfoInterface) => ({id: st.id, name: st.userName}));
    console.log(HOMEWORK);
    this.homeworksService.createHomework(HOMEWORK).subscribe(res => {
      if(res) {
        this.snackBar.open('Задание успешно созданно', '', {
          duration: 2000,
          panelClass: ['success']
        });
        this.location.back();
      }
    })
  }
}
