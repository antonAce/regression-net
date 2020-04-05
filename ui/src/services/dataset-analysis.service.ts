import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LinearEquation } from '@models/analytics';
import { API_SETTINGS } from '@environment/api';

@Injectable({
  providedIn: 'root'
})
export class DatasetAnalysisService {
  constructor(private http: HttpClient) {}

  calculateEquation(id: string): Observable<LinearEquation> {
    return this.http.get<LinearEquation>(API_SETTINGS.BASE_URL + `/api/analysis/${id}/equation?digits=3`);
  }
}