import { Component, Input, OnChanges, ViewEncapsulation, SimpleChange, SimpleChanges, OnInit } from '@angular/core';
import {WeatherService } from './weather.service';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WeatherComponent implements OnChanges, OnInit {
  @Input('location') location:string;
  @Input('unit') unit:string;
  public errText: string = '';
  public weathersubscription;
  public temp:number;
  public desc: string;
  public weatherico: string;
  public country: string;
  public city: string;
  public dt: Date;

  readonly VAPID_KEY = "BHQ9VtddLfH4PYY7rZ7NwXysfNe-SCO14WoXS0PIPaFkMIjJZFQiKgT0wzV3LWo3e0rj_C4CHuJDQ-j1UrCeN58";

  constructor(
    public _ws: WeatherService,
    private swUpdate : SwUpdate,
    private swPush : SwPush
  ) { }

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

  renderWeather() {
    this.weathersubscription = this._ws.getWeather(this.location, this.unit).subscribe((data) => {
      this.errText = '';
      this.temp = Math.round(data.main.temp);
      this.desc = data.weather[0].description;
      this.weatherico = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
      this.city = data.name;
      this.country = data.sys.country;
      this.getLocalTime(data.coord.lat, data.coord.lon);

    }, error => {
      this.errText = error;
    })
  }

  getLocalTime(lat, long) {
    this._ws.getLocalTime(lat, long).subscribe((data) => {
      this.dt = data.time;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['location'] || changes['unit']){
      if(this.weathersubscription) {
        this.weathersubscription.unsubscribe();
      }
      this.renderWeather();
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

}
