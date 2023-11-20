import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];

  constructor(
    private http: HttpClient,
  ) { }

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region) {
      return of([]);
    }
    const url = `${this.baseUrl}/region/${region}?fields=name,cca3,borders`;
    return this.http.get<Country[]>(url)
      .pipe(
        map( countries => countries.map( country => ({
          Name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? [],
        })))
      );
  }

  getCountryByAlphaCode(code: string): Observable<SmallCountry> {
    const url = `${this.baseUrl}/alpha/${code}?fields=name,cca3,borders`;
    return this.http.get<Country>(url)
    .pipe(
      map( country => ({
        Name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? [],
      }))
    );
  }

  getCountryByBordesByCodes(bordes: string[]): Observable<SmallCountry[]> {
    if (!bordes || bordes.length === 0) {
      return of([]);
    }
    const countriesRequests: Observable<SmallCountry>[] = [];
    bordes.forEach( border => {
      const request = this.getCountryByAlphaCode(border);
      countriesRequests.push(request);
    });

    return combineLatest(countriesRequests);
  }
}
