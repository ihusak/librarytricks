import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from 'src/app/main/components/profile/profile.service';
import { MainService } from 'src/app/main/main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TaskService } from '../../tasks.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent {
  public userRoles = UserRolesEnum;
  public userInfo;
  public coachList;

  public createCourseFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateCourseComponent>,
    private profileService: ProfileService,
    private taskService: TaskService,
    private mainService: MainService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {
      this.userInfo = this.mainService.userInfo;
      if(this.userInfo.role.id === this.userRoles.ADMIN) {
        this.profileService.getAllCoaches(this.userRoles.COACH).subscribe((coaches) => {
          this.coachList = coaches;
        })
      }
      if(this.userInfo.role.id === this.userRoles.ADMIN) {
        this.createCourseFrom = this.formBuilder.group({
          name: new FormControl('', [Validators.required]),
          coachId: new FormControl('', [Validators.required]),
          price: new FormControl('', [Validators.required]),
          text: new FormControl('', [Validators.required]),
          video: new FormControl(''),
          forAll: new FormControl(false),
        });
      }
      if(this.userInfo.role.id === this.userRoles.COACH) {
        this.createCourseFrom = this.formBuilder.group({
          name: new FormControl('', [Validators.required]),
          price: new FormControl('', [Validators.required]),
          text: new FormControl('', [Validators.required]),
          video: new FormControl(''),
          coachId: new FormControl(this.userInfo.id),
        });
      }
    }

  public create() {
    console.log(this.createCourseFrom);
    this.taskService.createCourse(this.createCourseFrom.value).subscribe((course: object) => {
      this.dialogRef.close(course);
      this.snackBar.open('Курс создан', '', {
        duration: 2000,
        panelClass: ['success']
      });
    })
  }

  public forAllCoaches() {
    if(this.createCourseFrom.value.forAll) {
      this.createCourseFrom.removeControl('coachId');
    } else {
      this.createCourseFrom.addControl('coachId', new FormControl('', [Validators.required]));
    }
  }
}
