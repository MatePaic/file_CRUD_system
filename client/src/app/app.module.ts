import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

// Note: AppComponent, FileListComponent, FileUploadComponent are NOT declared here
// because they are standalone.

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule // Add HttpClientModule here
    // Add other modules if needed
  ],
  providers: [],
  // bootstrap: [AppComponent] // If AppComponent is standalone and you use bootstrapApplication in main.ts,
                             // you might not need this here.
})
export class AppModule { }