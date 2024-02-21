import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/main/components/profile/profile.service';
import { MainService } from 'src/app/main/main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TaskService } from '../../tasks.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnDestroy {
  public userRoles = UserRolesEnum;
  public userInfo;
  public coachList;
  private subscription: Subscription = new Subscription();
  public createCourseFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateCourseComponent>,
    private profileService: ProfileService,
    private taskService: TaskService,
    private mainService: MainService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private formBuilder: FormBuilder) {
      this.userInfo = this.mainService.userInfo;
      if(this.userInfo.role.id === this.userRoles.ADMIN) {
        const getAllCoaches = this.profileService.getAllCoaches(this.userRoles.COACH).subscribe((coaches) => {
          this.coachList = coaches;
        });
        this.subscription.add(getAllCoaches);
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
    const createCourse = this.taskService.createCourse(this.createCourseFrom.value).subscribe((course: object) => {
      this.dialogRef.close(course);
      this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.COURSE_CREATED'), '', {
        duration: 2000,
        panelClass: ['success'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    });
    this.subscription.add(createCourse);
  }

  public forAllCoaches() {
    if(this.createCourseFrom.value.forAll) {
      this.createCourseFrom.removeControl('coachId');
    } else {
      this.createCourseFrom.addControl('coachId', new FormControl('', [Validators.required]));
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
