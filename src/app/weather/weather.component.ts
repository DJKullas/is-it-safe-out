import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { SafetyLevel } from './safety.enum';
import { style, state, animate, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fadeIn', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(600)
      ])
    ])
  ]
})
export class WeatherComponent implements OnInit {
  temperature: number; 
  humidity: number;
  windSpeed: number;
  safetyLevel: SafetyLevel; 
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

    var redOrYellow = false;

    if (this.temperature >= 80 || this.temperature <= 40) {
      if (this.temperature >= 80) {
        const roundedHeatIndex = Math.round(this.calculateHeatIndex());
        if (roundedHeatIndex >= 90 && roundedHeatIndex < 100) {
          this.safetyLevel = SafetyLevel.Yellow;
          redOrYellow = true;
        } 
        else if (roundedHeatIndex >= 100) {
          this.safetyLevel = SafetyLevel.Red;
          redOrYellow = true;
        }
      }
  
      if (this.temperature <= 40) {
        const roundedWindChill = Math.round(this.calculateWindChill());
        if (roundedWindChill < 32 && roundedWindChill >= 13) {
          this.safetyLevel = SafetyLevel.Yellow;
          redOrYellow = true;
        }
        else if (roundedWindChill < 13) {
          this.safetyLevel = SafetyLevel.Red;
          redOrYellow = true;
        } 
      }
    }
    
    if (!redOrYellow) {
      this.safetyLevel = SafetyLevel.Green;
    }

    return this.safetyLevel;
  }

  isItSafe() {
    this.weatherService.getWeather(this.zipCode).subscribe(weather => {
      this.temperature = weather.main.temp;
      this.humidity = weather.main.humidity;
      this.windSpeed = weather.wind.speed;
      this.safetyCheck();
      },
    error => {
      console.log("DEF");
      this.safetyLevel = SafetyLevel.Error;
    });
  }

  ngOnInit() {
    
    return;
  }

}
