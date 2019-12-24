import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { ChartModule } from 'angular-highcharts';
import { NgxMdModule } from 'ngx-md';
import { DataTableModule } from 'angular-bootstrap-data-table';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    GraphViewComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgxMdModule.forRoot(),
    ChartModule,
    DataTableModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: ':id', component: HomeComponent, pathMatch: 'full' },
      { path: 'graph-view/:id', component: GraphViewComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
