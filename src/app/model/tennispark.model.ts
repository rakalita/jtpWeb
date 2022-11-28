export interface TennisPark{
    _id:string;
    name:string;
    address:string;
    phone:string;
    league:string [];
    lon:number;
    lat:number;
    gridNumber:string;
    description:string;
    courts:number;
    surface:string;
    updateDate:Date;
    coordinates:number[];
}
