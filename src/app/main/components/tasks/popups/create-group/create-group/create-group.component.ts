import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from 'src/app/main/components/profile/profile.service';
import { MainService } from 'src/app/main/main.service';
import { UserRolesEnum } from 'src/app/shared/enums/user-roles.enum';
import { TaskService } from '../../../tasks.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent {
  public groupName: string = '';
  public userRoles = UserRolesEnum;
  public userInfo;
  // public forAll: boolean = false;
  // public selectedCoachId: any = null;
  public coachList;

  public createGroupFrom: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupComponent>,
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
        this.createGroupFrom = this.formBuilder.group({
          groupName: new FormControl('', [Validators.required]),
          coachId: new FormControl('', [Validators.required]),
          forAll: new FormControl(false),
        });
      }
      if(this.userInfo.role.id === this.userRoles.COACH) {
        this.createGroupFrom = this.formBuilder.group({
          groupName: new FormControl('', [Validators.required]),
          coachId: new FormControl(this.userInfo.id),
        });
      }
    }

  public createGroup() {
    console.log(this.createGroupFrom);
    this.taskService.createGroup(this.createGroupFrom.value).subscribe((group: object) => {
      this.dialogRef.close(group);
      this.snackBar.open('Группа создана', '', {
        duration: 2000,
        panelClass: ['success']
      });
    })
  }

  public forAllCoaches() {
    if(this.createGroupFrom.value.forAll) {
      this.createGroupFrom.removeControl('coachId');
    } else {
      this.createGroupFrom.addControl('coachId', new FormControl('', [Validators.required]));
    }
  }
}
