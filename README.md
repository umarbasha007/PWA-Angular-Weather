# Weather card

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Steps for PWA in Angular (General Approach)
Run the following commands in your app directory:
```
npm install

add ng @angular/pwa

npm i http-server

npm install web-push -g

npm install web-push --save
```

`add ng @angular/pwa` will add service worker, manifest.json file and configure service worker with angular automatically used for running application offline.

`npm i http-server` is for running the angular app as PWA restrict non secure url like http but for development http-server can cbe used.

`npm install web-push -g` for generating VAPID KEY - public and private keys used for push notification.

## Extra Points : 
- Here we are using local server created using Node.js from `pushserver.js`.For push notification to work, node-express server must be running. Use the below commond to start node-express server
```
node .\pushserver.js
```
- Add `"weatherprod" : "npm run weathercardbuild && cd dist/weathercard && http-server -c-l"` in `package.json` file to be able to run following command and check the required PWA app
```
npm run weatherprod
```

- Generate VAPID-KEY using command
``` 
web-push generate-vapid-keys --json 
```

- In weather.component.ts, `import { SwUpdate, SwPush } from '@angular/service-worker';` , `constructor( private swUpdate : SwUpdate, private swPush : SwPush) {}` are used for utilizing service-worker functionality
```
  import { SwUpdate, SwPush } from '@angular/service-worker';
  
  constructor(
    private swUpdate : SwUpdate,
    private swPush : SwPush
  ) { }
  
  readonly VAPID_KEY = "publicKey string from web-push";

  //For reload
  ngOnInit() {
    this.reloadCache();
  }

  //For Update
  reloadCache(){
    if(this.swUpdate.isEnabled){
      this.swUpdate.available.subscribe(()=> {
        if(confirm("New version available ! would you like to update?")){
          window.location.reload();
        }
      }
      );    
    
    }
  }
  
  //For Push Notification
  subscribeToNotification() {
    if(this.swUpdate.isEnabled){
      this.swPush.requestSubscription({
        serverPublicKey : this.VAPID_KEY
      })
      .then(sub => {
        this._ws.postSubscription(sub).subscribe();
      })
    }
  }
  
  ```
 
- #### SwUpdate strategy
Add `"dataGroups" : [...]` after `"assetGroups" : [...]` in ngsw-config.json file 
##### performance (cache first network last)
  ```
"dataGroups" : [
    {
      "name" : "weather-api",
      "urls" : [
        "https://api.openweathermap.org/data/2.5/weather?q=",
        "http://api.geonames.org/timezoneJSON?formatted=true&"
      ],
      "cacheConfig" : {
        "strategy" : "performance",

        "maxAge" : "1d",
        "maxSize" : 100
      }
    }
  ]
  ```
##### freshness (network first)
  ```
"dataGroups" : [
    {
      "name" : "weather-api",
      "urls" : [
        "https://api.openweathermap.org/data/2.5/weather?q=",
        "http://api.geonames.org/timezoneJSON?formatted=true&"
      ],
      "cacheConfig" : {
        "strategy" : "freshness",
        "timeout" : "10s" ,
        "maxAge" : "1d",
        "maxSize" : 100
      }
    }
  ]
  ```
  
