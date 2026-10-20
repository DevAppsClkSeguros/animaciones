import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { HomeComponent } from './components/home/home.component';
import { BreedListComponent } from './components/breed-list/breed-list.component';
import { BreedDetailComponent } from './components/breed-detail/breed-detail.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, BreedListComponent, BreedDetailComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {}
