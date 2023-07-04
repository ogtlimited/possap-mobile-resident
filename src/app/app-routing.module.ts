import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full',
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./pages/support/support.module').then((m) => m.SupportModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignUpModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/tabs-page/tabs-page.module').then((m) => m.TabsModule),
  },
  {
    path: 'tutorial',
    loadChildren: () =>
      import('./pages/tutorial/tutorial.module').then((m) => m.TutorialModule),
    canLoad: [CheckTutorial],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'requests',
    loadChildren: () =>
      import('./pages/requests/requests.module').then(
        (m) => m.RequestsPageModule
      ),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./pages/services/services.module').then(
        (m) => m.ServicesPageModule
      ),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./pages/faq/faq.module').then((m) => m.FaqPageModule),
  },
  {
    path: 'privacy',
    loadChildren: () =>
      import('./pages/privacy/privacy.module').then((m) => m.PrivacyPageModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'sos',
    loadChildren: () =>
      import('./pages/sos/sos.module').then((m) => m.SosPageModule),
  },
  {
    path: 'nearest-places',
    loadChildren: () =>
      import('./pages/nearest-places/nearest-places.module').then(
        (m) => m.NearestPlacesPageModule
      ),
  },
  {
    path: 'general-form',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./pages/general-form/general-form.module').then(
        (m) => m.GeneralFormPageModule
      ),
  },
  {
    path: 'invoice',
    loadChildren: () =>
      import('./pages/invoice/invoice.module').then((m) => m.InvoicePageModule),
  },
  {
    path: 'egs',
    canLoad: [AuthGuard],
    loadChildren: () => import('./pages/egs/egs.module').then( m => m.EgsPageModule)
  },
  // {
  //   path: 'search/:id',
  //   loadChildren: () =>
  //     import('./pages/search/search.module').then((m) => m.SearchPageModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
