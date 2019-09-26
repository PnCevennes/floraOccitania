import { Injectable } from '@angular/core';


import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {AppSettings} from '../appSettings';

@Injectable({
  providedIn: 'root'
})
export class TaxhubService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };


  constructor(
    private _http: HttpClient
  ) { }


  searchTaxonByName(search: string): Observable<any> {
    const url = `${AppSettings.TAXHUB_ENDPOINT}taxref/allnamebylist/${AppSettings.ID_LIST}`;

    let data = {search_name: search, limit: "20"};

    return this._http.get<any>(
      url,
      {params: data}
    )
  }

  getTaxonDetail(id_nom: number): Observable<any> {
    const url = `${AppSettings.TAXHUB_ENDPOINT}bibnoms/${id_nom}`;
    return this._http.get<any>(url);
  }
}
