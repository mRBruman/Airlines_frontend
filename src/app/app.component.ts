import {Component, OnInit} from '@angular/core';
import { Country } from './country.model';
import {DataService} from './data.service';
import {Region} from './region.model';
import {Airport} from './airport.model';
import {Price} from './price.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  csvRecords: Country[] = [];
  private text: string | ArrayBuffer;
  private JSONData: string;

  constructor(private dataService: DataService) {
  }
  title = 'Airlines';
  countries$: Country[];
  regions$: Region[];
  airports$: Airport[];
  price$: Price;
  prices$: Price[];
  ryanairprice$: Price;
  wizzairprice$: Price;
  airbalticprice$: Price;
  lufthansaprice$: Price;
  turkishairlinesprice$: Price;
  selectedCountry?: Country;
  selectedRegion?: Region;
  selectedAirport?: Airport;
  provider: string;
  identity: number;
  header = false;

  ngOnInit() {
    return this.dataService.getCountries().subscribe(data => this.countries$ = data);
  }
  async onSelect(country: Country): Promise<void>{
    this.selectedCountry = country;
    this.dataService.getRegions(country.code).subscribe(data => this.regions$ = data);
    this.dataService.getRegions(country.code).subscribe(data => this.regions$ = data).unsubscribe();
    await this.dataService.getAirportsByCountry(country.code).toPromise().then(data => this.airports$ = data);
  }
  async onSelectRegion(country: Country, region: Region): Promise<void>{
    this.selectedRegion = region;
    await this.dataService.getAirportsBySearch(country.code, region.code).toPromise().then(data => this.airports$ = data);
  }
  onSelectAirport(airport: Airport){
    this.selectedAirport = airport;
    this.getPrice(airport);
    this.airports$.forEach(air => { this.getPriceArray(air); });
  }
  async getPriceArray(airport: Airport) {
    this.provider = 'ryanair';
    this.identity = airport.id;
    if (airport.ryanair !== '0') {
      this.dataService.getPrice(this.provider, this.identity.toString()).then(data => this.price$ = data);
      this.airports$.forEach((el, index) => {
        if (el.id === this.identity) {
          el.price = this.price$.value;
        }
      });
    }
  }
  async getPrice(airport: Airport) {
    this.identity = airport.id;
    if (airport.ryanair !== '0'){
      this.provider = 'ryanair';
      // tslint:disable-next-line:max-line-length
      await this.dataService.getPrice(this.provider, this.identity.toString()).then(data => { if (data.value){this.ryanairprice$ = data; }});
    }
    if (airport.airbaltic !== '0'){
      this.provider = 'airbaltic';
      // tslint:disable-next-line:max-line-length
      await this.dataService.getPrice(this.provider, this.identity.toString()).then(data => { if (data.value){this.airbalticprice$ = data; }});
    }
    if ( airport.wizzair !== '0'){
      this.provider = 'wizzair';
      // tslint:disable-next-line:max-line-length
      await this.dataService.getPrice(this.provider, this.identity.toString()).then(data => { if (data.value){this.wizzairprice$ = data; }});
    }
    if ( airport.lufthansa !== '0'){
      this.provider = 'lufthansa';
      // tslint:disable-next-line:max-line-length
      await this.dataService.getPrice(this.provider, this.identity.toString()).then(data => { if (data.value){this.lufthansaprice$ = data; }});
    }
    if ( airport.turkishairlines !== '0'){
      this.provider = 'turkishairlines';
      // tslint:disable-next-line:max-line-length
      await this.dataService.getPrice(this.provider, this.identity.toString()).then(data => { if (data.value){this.turkishairlinesprice$ = data; }});
    }
  }
  public changeListener(files: FileList, name: string){
    const reader = new FileReader();
    if (files && files.length > 0) {
      const file: File = files.item(0);
      reader.readAsText(file);
      reader.onload = () => {
        const text = reader.result;
        this.text = text;
        console.log(text);
        this.csvJSON(text, name);
      };
    }
  }
  csvJSON(csvText, name) {
    const lines = csvText.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    console.log(headers);
    for (let i = 1; i < lines.length - 1; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    console.log(JSON.stringify(result));
    this.JSONData = JSON.stringify(result);
    this.dataService.uploadCSVFile(this.JSONData, name);
  }
}
