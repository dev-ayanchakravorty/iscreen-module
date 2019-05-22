import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  subject = new Subject<any>();
  filterArray = new Subject<any[]>();
  data = [{
    "SKU": "KBL-R",
    "ExecutionCount": 4025,
    "color": "#ffffff"
  }, {
    "SKU": "KBL-G",
    "ExecutionCount": 1882,
    "color": "#ffffff"
  }, {
    "SKU": "KBL-S",
    "ExecutionCount": 1809,
    "color": "#ffffff"
  }, {
    "SKU": "KBL-H",
    "ExecutionCount": 1322,
    "color": "#ffffff"
  }, {
    "SKU": "KBL-Y",
    "ExecutionCount": 1622,
    "color": "#ffffff"
  }, {
    "SKU": "KBL-U",
    "ExecutionCount": 2822,
    "color": "#ffffff"
  }, {
    "SKU": "KBL-DT",
    "ExecutionCount": 2322,
    "color": "#ffffff"
  }, {
    "SKU": "KBL-U42",
    "ExecutionCount": 2022,
    "color": "#ffffff"
  }];
  constructor(private http: HttpClient) { }

  getData() {
    return this.data;
  }

  getChart(charttype: any[]) {
    this.subject.next(charttype);
  }

  getFilterSelection(data: any[]) {
    this.filterArray.next(data);
  }

}
