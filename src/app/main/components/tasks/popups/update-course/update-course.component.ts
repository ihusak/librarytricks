import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/main/main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { CourseInterface } from 'src/app/shared/interface/course.interface';
import { ProfileService } from '../../../profile/profile.service';
import { TaskService } from '../../tasks.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss']
})
export class UpdateCourseComponent implements OnDestroy {
  public userRoles = UserRolesEnum;
  public userInfo;
  public coachList;
  private subscription: Subscription = new Subscription();
  public updateCourseFrom: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<UpdateCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public course: CourseInterface,
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
        this.updateCourseFrom = this.formBuilder.group({
          name: new FormControl(course.name, [Validators.required]),
          coachId: new FormControl(course.coachId, [Validators.required]),
          price: new FormControl({value: course.price, disabled: !course.price}, [Validators.required]),
          text: new FormControl(course.description.text, [Validators.required]),
          video: new FormControl(course.description.video),
          forAll: new FormControl(false),
        });
      }
      if(this.userInfo.role.id === this.userRoles.COACH) {
        this.updateCourseFrom = this.formBuilder.group({
          name: new FormControl(course.name, [Validators.required]),
          price: new FormControl({value: course.price, disabled: !course.price}, [Validators.required]),
          text: new FormControl(course.description.text, [Validators.required]),
          video: new FormControl(course.description.video),
          coachId: new FormControl(this.userInfo.id),
        });
      }
    }

    public updateCourse() {
      const updateCourse = this.taskService.updateCourse(this.course.id, this.updateCourseFrom.value).subscribe((course: object) => {
        this.dialogRef.close(course);
        this.snackBar.open(this.translateService.instant('COMMON.SNACK_BAR.COURSE_UPDATED'), '', {
          duration: 4000,
          panelClass: ['success']
        });
      });
      this.subscription.add(updateCourse);
    }
  
    public forAllCoaches() {
      if(this.updateCourseFrom.value.forAll) {
        this.updateCourseFrom.removeControl('coachId');
      } else {
        this.updateCourseFrom.addControl('coachId', new FormControl('', [Validators.required]));
      }
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}
