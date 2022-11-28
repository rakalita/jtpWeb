import { Component } from '@angular/core';
import { TennisPark }  from './model/tennispark.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jax Tennis Parks';
  tennisParks = [];
  selectedPark:any = null;

  updateLocation(tennisPark:TennisPark) {
    console.log(`location updated:${tennisPark.name}`);
    this.selectedPark = tennisPark;
  }

  updateMapLocation(tennisPark:TennisPark) {
    console.log(`location updated:${tennisPark.name}`);
    this.selectedPark = tennisPark;
  }
}
