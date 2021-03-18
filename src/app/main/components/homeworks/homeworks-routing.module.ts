import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeworkListComponent } from './homework-list/homework-list.component';
import { HomeworksComponent } from './homeworks.component';

const routes: Routes = [
    {
        path: '',
        component: HomeworksComponent,
        children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: HomeworkListComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeworksRoutingModule {}