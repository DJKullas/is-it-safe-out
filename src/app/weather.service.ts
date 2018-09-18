import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: Http) { }

  getWeather(zipCode: string) {
    return this.http.get('/api/weather', {params: {zipCode: zipCode}})
      .pipe(map(res => res.json()));
  }
  
}
