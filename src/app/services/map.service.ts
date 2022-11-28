import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl'; 
import { Forecast } from '../model/forecast.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
}) 
export class MapService {

  private forecasts: Forecast [] = [];
  private forecastsUpdated = new Subject<Forecast[]>();

  constructor(private http:HttpClient) {
    const MapBOX_accessToken = environment.mapbox.accessToken;
   // Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set("token");
   (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
  }

  getWeatherForecast(gridNumber:string){
    console.log(`getting forecast for :${gridNumber}`)
    const url = `http://localhost:3000/api/v1/forecast/${gridNumber}`;
    this.http.get<{status:string, updateTime:Date, periods:Forecast[]}>(url)
    .subscribe((data) => {
     // console.log(data);
      this.forecasts = data.periods;
      this.forecastsUpdated.next([...this.forecasts]);
      //console.log(this.forecasts);
    });  
  }

  getForecastUpdateListener(){
    return this.forecastsUpdated.asObservable();
  }
  
}
