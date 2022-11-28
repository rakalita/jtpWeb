import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MongoService } from '../services/mongo.service';
import { MapService } from '../services/map.service';
import { TennisPark } from '../model/tennispark.model';
import { Forecast } from '../model/forecast.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.css']
})

export class MapboxComponent implements OnInit {

  @Output() locationChanged:EventEmitter<TennisPark> =new EventEmitter<TennisPark>();
  map!:mapboxgl.Map;
  popup!:mapboxgl.Popup;
  style:any= 'mapbox://styles/raka/cl92xyf8p001z15s1dd1wa34c'; // style URL
  lng:number =-81.7;
  lat:number = 30.3; // starting position [lng, lat]
  zoom!: 9.5; // starting zoom
    //projection: 'globe' // display the map as a 3D globe
  //data
  source:any;
  markers:any;
  tennisParks : TennisPark [] = [];
  forecasts : Forecast[] = [];
  @Input() selectedPark:any = null;

  private tennisParksSub: Subscription = new Subscription();
  private forecastSub: Subscription = new Subscription();

  constructor(private mapService:MapService, private mongoService:MongoService) { }

  ngOnInit(): void {    
    this.buildMap();
    this.mongoService.getAllTennisParks();
    this.tennisParksSub = this.mongoService.getTennisParksUpdateListener()
      .subscribe((tennisParks:TennisPark[]) =>{
        this.tennisParks = tennisParks;
      });
  }

  ngOnChanges():void {
    if(this.selectedPark){
    //flyto
      this.flyToFeature(this.selectedPark);
    //create popup
      this.createPopUp(this.selectedPark);
    }
  }

  private buildMap(){

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/raka/cl92xyf8p001z15s1dd1wa34c', // style URL
      center: [-81.7, 30.3], // starting position [lng, lat]
      zoom: 9.5, // starting zoom
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('style.load', () => {   
      // map.setFog({}); // Set the default atmosphere style
       //buildLocationList(tennis_parks);
      const el = document.createElement('div');
      el.className="marker";
      el.id = `marker-1`;
      
      this.addMarkers(); 
    });
  }

  private addMarkers(){
   // console.log('in add markers');
   // console.log(this.tennisParks);
    for (const tennis_loc of this.tennisParks) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.id = `marker-${tennis_loc._id}`;
  
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat([tennis_loc.lon , tennis_loc.lat])
        .addTo(this.map);
  
      //add event listeners
      el.addEventListener('click', (e) => {
        //emit clicked event
        this.locationChanged.emit(tennis_loc);
        this.flyToFeature(tennis_loc);
        /* Close all other popups and display popup for clicked store */
        this.createPopUp(tennis_loc);
        /* Highlight listing in sidebar */
        // const activeItem = document.getElementsByClassName('active');
        // e.stopPropagation();
        // if (activeItem[0]) {
        //   activeItem[0].classList.remove('active');
        // }
        // const listing = document.getElementById(`listing-${tennis_loc._id}`);
        // if(listing){
        //   listing.classList.add('active');
        // }
      });
    }
   // console.log('after add markers');
  }

  private addCoordinates(currentFeature:TennisPark) {
    const coordinateArray = [currentFeature.lon, currentFeature.lat];
    currentFeature.coordinates = coordinateArray;
    return coordinateArray;
  }

  flyToFeature(currentFeature:TennisPark) {
    console.log(currentFeature.lon + currentFeature.lat);
    this.map.flyTo({
      center: [currentFeature.lon, currentFeature.lat],
      zoom: 12,
    });
  }

  /**
 * Create a Mapbox GL JS `Popup`.
 **/
createPopUp(currentFeature:TennisPark) {
  console.log('---------  in create popup' + currentFeature.name);
  const popUps = document.getElementsByClassName('mapboxgl-popup');
  
  // 
  if (!popUps.length){
    console.log('we have popups');
    this.popup = new mapboxgl.Popup({ closeOnClick:true});
  }
  this.mapService.getWeatherForecast(currentFeature.gridNumber);
  this.forecastSub = this.mapService.getForecastUpdateListener()
    .subscribe((forecasts:Forecast[]) =>{
      this.forecasts = forecasts;
     // console.log('we got forecasts');
     // console.log(forecasts);
      if (!this.forecasts) {
        new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat([currentFeature.lon,currentFeature.lat])
          .setHTML(
            `
          <h3>${currentFeature.name}</h3><span>Current Weather is not available.</span>`
          );
      } else {
        this.popup.setLngLat([currentFeature.lon,currentFeature.lat])
          .setHTML(
            `
          <h3>${currentFeature.name}</h3><span>Current conditions:</span>
          <h4> <img src="${forecasts[0].icon}" height="66px" width="66px"></img>
          ${forecasts[0].detailedForecast} -
             ${forecasts[0].temperature} F</h4>
          
          <br>
          <span>${forecasts[1].name}</span>
          
          <h4> <img src="${forecasts[1].icon}" height="66px" width="66px"></img>
          ${forecasts[1].detailedForecast} 
          </h4>
          <br><br>
          <span>${forecasts[2].name}</span>
          
          <h4> <img src="${forecasts[2].icon}" height="66px" width="66px"></img>
          ${forecasts[2].detailedForecast} 
          </h4>
          `
          )
          .addTo(this.map);
          
      }
    });
}
}