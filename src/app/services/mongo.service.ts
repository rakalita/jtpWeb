import { Injectable } from '@angular/core';
import { TennisPark } from '../model/tennispark.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MongoService {
  private tennisParks:TennisPark [] = [];
  private tennisParksUpdated = new Subject<TennisPark[]>();

  constructor(private http:HttpClient) { }
//http://localhost:3000/api/v1/jtp
  getAllTennisParks(){
    this.http.get<{status:string,results:string,data:{tennisparks:TennisPark[]}}>('http://localhost:3000/api/v1/jtp')
      .subscribe((resultData) => {
        this.tennisParks = resultData.data.tennisparks;
        this.tennisParksUpdated.next([...this.tennisParks]);
       // console.log(this.tennisParks);
      });   
  }

  getTennisParksUpdateListener(){
    return this.tennisParksUpdated.asObservable();
  }
}
