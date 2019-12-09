import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'execution/test/test', pathMatch: 'full' },
  { path: 'execution', redirectTo: 'execution/test/test'},
  {
    path: 'execution/:username/:checklist',
    loadChildren: () => import('./execution/execution.module').then( m => m.ExecutionPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
