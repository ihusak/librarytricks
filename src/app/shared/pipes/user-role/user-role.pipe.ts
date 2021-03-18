import { Pipe, PipeTransform } from '@angular/core';
import { StudentInfoInterface, ParentInfoInterface, CoachInfoInterface, AdminInfoInterface } from '../../interface/user-info.interface';
@Pipe({
    name: 'userRolePipe'
})
export class UserRolePipe implements PipeTransform {
  transform(user: StudentInfoInterface | ParentInfoInterface | CoachInfoInterface | AdminInfoInterface, checkRoleId: number[]): boolean {
    return checkRoleId.some(id => user.role.id === id);
  }
}