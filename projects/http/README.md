# Angular HTTP library
An Angular HTTP library that extends the `HttpClient`.

## What the library provides

* Requests that are executed against provided default server location
* Default server location injector token

** Because the library is built on top of `HttpClient` - all `HttpClient` functionality can be used as well.

## Future features

* DELETE request with a confirmation to execute the request

## How to install

```npm i @rengular/http --save```

## How to use

  https://stackblitz.com/edit/rengular-http-usage

  OR

  1. Import the Rengular http module into the root module file of your application.

          import { RengHttpModule } from '@rengular/http';

 2. Provide the module into the `NgModule` imports array.

        RengHttpModule.forRoot('http://example.com/'),
        
      * Make sure to change the string URL in the `forRoot`

 3. Import Rengular Http service where you want to do a call 

        import { HttpService } from '@rengular/http';

   Example:

        import { Component } from '@angular/core';
        import { HttpService } from '@rengular/http';
        
        export class AppComponent {
        
          constructor( private http: HttpService ) {
          }
        
          ngOnInit() {
            this.http.Post('api/auth/login', null).subscribe((token) => {
              console.log('The authentication is OK!', token);
            }, () => {
              console.log('The authentication failed!');
            });
          }
        
        }

  *  If you want to get the server location provided in the beginning
  
   Import:
   
   ``` import { SERVER_LOCATION } from '@rengular/http';```
  
   and define in your component/service/directive constructor:
  
    @Inject(SERVER_LOCATION) SERVER_LOCATION: string;

### Documentation

TBD

If you use WebStorm or VS Code I am pretty sure the editor will show you documentation about what methods the `HttpService` has and what each of the parameters on the used method represents on the fly.
