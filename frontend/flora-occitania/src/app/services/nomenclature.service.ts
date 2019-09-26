import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {AppSettings} from '../appSettings';

@Injectable({
  providedIn: 'root'
})
export class NomenclatureService {

  base_url:String = 'nomenclatures/nomenclature/';

  constructor(
    private _http: HttpClient
  ) { }

  getNomenclature(code: string): Observable<any> {
    const url = `${AppSettings.API_ENDPOINT}${this.base_url}${code}`;

    return this._http.get<any>(
      url
    )
  }
}
