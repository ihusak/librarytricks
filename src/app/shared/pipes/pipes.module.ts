import { NgModule } from '@angular/core';
import { UserRolePipe } from './user-role/user-role.pipe';

@NgModule({
  declarations: [UserRolePipe],
  exports: [UserRolePipe]
})
export class PipesModule {}