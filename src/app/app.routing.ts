/**
 * app.routing
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'books', pathMatch: 'full'},
    {path: 'books', loadChildren: 'app/book/book.module#BookModule'},
    {path: 'movies', loadChildren: 'app/movie/movie.module#MovieModule'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
