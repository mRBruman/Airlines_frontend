import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Country } from './country.model';
import { Region } from './region.model';
import { Airport } from './airport.model';
import { Price } from './price.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }
  REST_API_COUNTRY = 'http://localhost:8080/countries';
  REST_API_REGION = 'http://localhost:8080/regions/city/';
  REST_API_AIRPORT_BY_COUNTRY = 'http://localhost:8080/airports/bycountry/';
  REST_API_AIRPORT_BY_SEARCH = 'http://localhost:8080/airports/bysearch/';
  REST_API_PRICE = 'http://localhost:8085/item/price/';

  REST_API_UPLOAD_COUNTRIES = 'http://localhost:8080/receive/countries';
  REST_API_UPLOAD_AIRPORTS = 'http://localhost:8080/airports';
  REST_API_UPLOAD_REGIONS = 'http://localhost:8080/regions';


  getCountries() {
    return this.http.get<Country[]>(this.REST_API_COUNTRY);
  }
  getRegions(cityCode) {
    return this.http.get<Region[]>(this.REST_API_REGION + cityCode.toString());
  }
  getAirportsByCountry(cityCode) {
    return this.http.get<Airport[]>(this.REST_API_AIRPORT_BY_COUNTRY + cityCode.toString());
  }
  getAirportsBySearch(cityCode, regionCode) {
    return this.http.get<Airport[]>(this.REST_API_AIRPORT_BY_SEARCH + cityCode.toString() + '/' + regionCode.toString());
  }
  async getPrice(provider, id){
    return await this.http.get<Price>(this.REST_API_PRICE + provider.toString() + '/' + id.toString()).toPromise();
  }
  uploadCSVFile(file, name) {
    if ( name === 'country'){
      return  this.http.post(this.REST_API_UPLOAD_COUNTRIES, file);
    }
    if ( name === 'region'){
      return  this.http.post(this.REST_API_UPLOAD_REGIONS, file);
    }
    if ( name === 'airport'){
      return  this.http.post(this.REST_API_UPLOAD_AIRPORTS, file);
    }
  }
}
