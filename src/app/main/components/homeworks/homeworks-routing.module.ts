import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeworkListComponent } from './homework-list/homework-list.component';
import { HomeworksComponent } from './homeworks.component';
import {CreateHomeworkComponent} from './create-homework/create-homework.component';
import { UpdateHomeworkComponent } from './update-homework/update-homework.component';

const routes: Routes = [
    {
        path: '',
        component: HomeworksComponent,
        children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: HomeworkListComponent, data: {title: 'COMMON.HOMEWORKS', description: 'TEMPLATE.META_TAGS.HOMEWORKS_DESC'}},
            {path: 'create', component: CreateHomeworkComponent, data: {title: 'TEMPLATE.HOMEWORKS.CREATE_HOMEWORK', description: 'TEMPLATE.META_TAGS.CREATE_HM_DESC'}},
            {path: 'edit/:id', component: UpdateHomeworkComponent, data: {title: 'TEMPLATE.HOMEWORKS.UPDATE_HOMEWORK', description: 'TEMPLATE.META_TAGS.UPDATE_HM_DESC'}}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeworksRoutingModule {}
