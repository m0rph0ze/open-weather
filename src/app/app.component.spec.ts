import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Cities, City, Weather } from './model';
import { OpenWeatherService } from './services/open-weather.service';
import { Observable, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const openWeatherServiceMock = {
  getCities: (_query: string): Observable<Cities> =>
    of([{ name: 'Berlin' } as City, { name: 'Kiev' } as City]),
  getWeather: (_city: City): Observable<Weather> =>
    of({ name: 'Warsaw' } as Weather),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatAutocompleteModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: OpenWeatherService,
          useValue: openWeatherServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('onInit', () => {
    it('should set up subscriptions', () => {
      expect(component.cities$).toBeDefined();
      expect(component.weather$).toBeDefined();
    });
  });

  describe('getCities$', () => {
    it('should set up subscriptions', (done) => {
      component.getCities$().subscribe((cities: Cities) => {
        expect(cities.length).toBe(2);
        done();
      });
      component.cityControl.setValue('Warszawa');
    });
  });

  describe('getWeather$', () => {
    it('should set up subscriptions', (done) => {
      component.getWeather$().subscribe((weather: Weather) => {
        expect(weather.name).toBe('Warsaw');
        done();
      });
      component.selectedCity$.next({ name: 'Warsaw' } as City);
    });
  });

  describe('displayFn', () => {
    it('should return string when passed city', () => {
      expect(component.displayFn({ name: 'Tokio' } as City)).toBe('Tokio');
    });
    it('should return string when passed string', () => {
      expect(component.displayFn('Osaka' as any)).toBe('');
    });
  });
});
