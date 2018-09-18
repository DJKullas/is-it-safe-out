import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  temperature: number; 
  humidity: number;
  windSpeed: number;
  safetyLevel: string;  // make enum later
  zipCode: string;

  constructor(private readonly weatherService: WeatherService) { }

  calculateWindChill() {

    if (this.windSpeed < 3) {
      return this.temperature;
    }

    const windChillTempMultiplier: number = 0.6215;
    const windChillBase: number = 35.74;
    const windSpeedFirstMultiplier: number = 35.75;
    const windSpeedSecondMultiplier: number = 0.4275;
    const windSpeedExponent: number = 0.16;
    
    return windChillBase + this.temperature * windChillTempMultiplier -
           windSpeedFirstMultiplier * Math.pow(this.windSpeed, windSpeedExponent) +
           windSpeedSecondMultiplier * this.temperature * Math.pow(this.windSpeed, windSpeedExponent);

  }

  calculateHeatIndex() {
    // need to eliminate magic numbers
    let T = this.temperature;
    let RH = this.humidity;
    return -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - .00683783*T*T - .05481717*RH*RH + .00122874*T*T*RH + .00085282*T*RH*RH - .00000199*T*T*RH*RH;
  }

  safetyCheck() {

    if (this.temperature >= 80) {
      const roundedHeatIndex = Math.round(this.calculateHeatIndex());
      if (roundedHeatIndex >= 90 && roundedHeatIndex < 100) {
        this.safetyLevel = "YELLOW";
      } 
      else if (roundedHeatIndex > 100) {
        this.safetyLevel = "RED";
      }
    }

    if (this.temperature <= 40) {
      const roundedWindChill = Math.round(this.calculateWindChill());
      if (roundedWindChill < 32 && roundedWindChill >= 13) {
        this.safetyLevel = "YELLOW";
      }
      else if (roundedWindChill < 13) {
        this.safetyLevel = "RED";
      } 
      else {
        this.safetyLevel = "GREEN";
      }
    }

    if (this.safetyLevel == null) {
      this.safetyLevel = "GREEN";
    }

    return this.safetyLevel;
  }

  isItSafe() {
    this.weatherService.getWeather(this.zipCode).subscribe(weather => {
      this.temperature = weather.main.temp;
      this.humidity = weather.main.humidity;
      this.windSpeed = weather.wind.speed;
      this.safetyCheck();
      });
  }

  ngOnInit() {
    
    return;
  }

}
