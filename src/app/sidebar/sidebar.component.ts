import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MongoService } from '../services/mongo.service';
import { MapService } from '../services/map.service';
import { TennisPark } from '../model/tennispark.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  tennisParks : TennisPark [] = [];
  private tennisParksSub: Subscription = new Subscription();
  @Input() selectedPark:any = null;
  @Output() sidebarLocationChanged:EventEmitter<TennisPark> =new EventEmitter<TennisPark>();

  constructor(public mongoService: MongoService, public mapService: MapService) { }

  ngOnInit(): void {
    this.mongoService.getAllTennisParks();
    this.tennisParksSub = this.mongoService.getTennisParksUpdateListener()
      .subscribe((tennisParks:TennisPark[]) =>{
        this.tennisParks = tennisParks;
      });
    console.log("parks initialized:");
    console.log(this.tennisParks);
  }

  ngOnChanges():void{
    //get all sidebar and reset them
    let collection = document.getElementsByClassName('item');
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove('active');
    }
    if(this.selectedPark){
      //show the selected element on the sidebar
      const el = document.getElementById(this.selectedPark._id);
      if(el){
        el.classList.add('active');
      }
     
    }
  }

  displayPopup(park:TennisPark):void {
    console.log('Fly to called.');
    this.selectedPark = park;
    this.sidebarLocationChanged.emit(park);
  }

  

}
