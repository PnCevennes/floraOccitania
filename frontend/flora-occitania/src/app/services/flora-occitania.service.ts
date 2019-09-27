import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {AppSettings} from '../appSettings';

export class TaxonList {
  id_nom: BigInteger;
  nb_nom_occ: BigInteger;
  cd_nom: BigInteger;
  cd_ref: BigInteger;
  nom_vern: string;
  nom_complet: string;
  famille: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class FloraOccitaniaService {
  sources:any;
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private _http: HttpClient
  ) { }

  getConcernedTaxon(): Observable<any> {
    return this._http.get<any>(AppSettings.API_ENDPOINT);
  }

  getSources(): Observable<any> {
    return this._http.get<any>(AppSettings.API_ENDPOINT + "sources");
  }

  getTaxonDetail(id): Observable<any> {
    const url =  `${AppSettings.API_ENDPOINT}${id}` ;
    return this._http.get<any>(url);
  }

  postNomVern(cd_ref, data): Observable<any> {
    const url =  `${AppSettings.API_ENDPOINT}${cd_ref}`;
    console.log(url);
    return this._http.post<any>(
      url,
      {params: data}
    )
  }

  initSources(): Observable<any> {
    return this.getSources().pipe(
      map(
        data => {
          this.sources = data.items;
        }
      )
    );
  }
}
