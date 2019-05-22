import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilterTreeComponent } from './home/filter-tree/filter-tree.component';
import { ChartVisualComponent } from './home/chart-visual/chart-visual.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', component: FilterTreeComponent },
      { path: 'chartvisual', component: ChartVisualComponent }
    ]
  },
  {
    path: 'notifications', component: NotificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
