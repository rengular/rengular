import { Component, OnInit } from '@angular/core';
import { HttpService } from '@rengular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  title = 'playground';

  constructor( private http: HttpService ) {
  }

  ngOnInit() {
    console.log('Call...');
    this.http.Post('api/auth/login', null).subscribe(() => {
      console.log('Call ended!');
    }, () => {
      console.log('Call ended on failer!');
    });
  }

}
