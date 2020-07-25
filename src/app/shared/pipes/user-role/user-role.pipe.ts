import { Pipe, PipeTransform } from '@angular/core';
import { UserRolesEnum } from '../../enums/user-roles.enum';
import { UserInfoInterface } from '../../interface/user-info.interface';
@Pipe({
    name: 'userRolePipe'
})
export class UserRolePipe implements PipeTransform {
  transform(user: UserInfoInterface, checkRoleId: number[]): boolean {
    return checkRoleId.some(id => user.role.id === id);
  }
}