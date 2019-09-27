import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

import {AppSettings} from '../appSettings';

@Injectable({
  providedIn: 'root'
})
export class NomenclatureService {

  baseUrl: string = 'nomenclatures/nomenclature/';
  nomenclaturesValues = {
    'FO_LOCALISATION': [],
    'FO_USAGE': [],
    'FO_PARTIE_PLANTE': []
  };


  constructor(
    private _http: HttpClient
  ) { }

  getNomenclature(code: string): Observable<any> {
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}${code}`;
    return this._http.get<any>(
      url
    );
  }

  initNomenclature(): Observable<any> {
    let observableBatch = [];
    Object.keys(this.nomenclaturesValues).forEach(codeNomenclature => {
      observableBatch.push(
        this.getNomenclature(codeNomenclature).pipe(
          map(
            data => {
              this.nomenclaturesValues[codeNomenclature] = data.values;
            }
          )
        )
      )
    });

    return forkJoin(observableBatch);
  }
}
