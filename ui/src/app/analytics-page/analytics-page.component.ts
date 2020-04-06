import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { KatexOptions } from 'ng-katex';

import { LinearEquation, EquationEstimations, OutputPairs } from '@models/analytics';
import { DatasetAnalysisService } from '@services/dataset-analysis.service';

@Component({
  selector: 'analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  equation: string;
  estimations: EquationEstimations;
  pairs: OutputPairs[];

  options: KatexOptions = {
    displayMode: true,
  };

  private routeChange$ = new Subscription();

  constructor(private datasetAnalysisService: DatasetAnalysisService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.routeChange$.add(this.activateRoute.params.pipe(
      switchMap(params => this.datasetAnalysisService.calculateEquation(params['id']))
    ).subscribe((equation: LinearEquation) => this.equation = this.polynomialToKatex(equation)));

    this.routeChange$.add(this.activateRoute.params.pipe(
      switchMap(params => this.datasetAnalysisService.calculateEstimations(params['id']))
    ).subscribe(
      (estimations: EquationEstimations) => {
        this.estimations = estimations;
        this.pairs = estimations.discreteOutput.map((y, i) => {
          return {
            discrete: y,
            approximate: estimations.approximationOutputs[i]
          } as OutputPairs
        });
    }));
  }

  ngOnDestroy() {
    this.routeChange$.unsubscribe();
  }

  private polynomialToKatex(polymonial: LinearEquation): string {
    let transformedPolynomial = "y =";

    for (let index = 0; index < polymonial.koeficients.length; index++) {
      if (index == 0)
        transformedPolynomial += (polymonial.koeficients[index] < 0) ? "-" : " ";
      else
        transformedPolynomial += (polymonial.koeficients[index] < 0) ? "-" : "+";

      if (index == 0)
        transformedPolynomial += `${Math.abs(polymonial.koeficients[index])}`;
      else
        transformedPolynomial += `${Math.abs(polymonial.koeficients[index])}x_{${index - 1}}`;
    }

    return transformedPolynomial;
  }
}
