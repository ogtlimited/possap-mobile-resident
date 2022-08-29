import { HomePage } from './../home/home.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
          },
        ]
      },
      {
        path: 'requests',
        children: [
          {
            path: '',
            loadChildren: () => import('../requests/requests.module').then(m => m.RequestsPageModule)
          },
        ]
      },
      {
        path: 'services',
        children: [
          {
            path: '',
            loadChildren: () => import('../services/services.module').then(m => m.ServicesPageModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

