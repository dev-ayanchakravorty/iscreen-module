import { Component, NgZone, OnInit, OnDestroy, DoCheck } from "@angular/core";
import { Router, NavigationEnd, Event } from '@angular/router';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DataService } from '../data.service';


am4core.useTheme(am4themes_animated);

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnDestroy, DoCheck {
  private chart;
  showChartFilter: boolean = false;
  activeButton: String = '';
  currentUrl = '';
  charttype: any[];
  chartdatajson: any[];
  details = {
    chartdetails: [],
    filterData: []
  };
  columnflag: boolean = false;
  radarflag: boolean = false;
  pieflag: boolean = false;

  constructor(private zone: NgZone, private router: Router, private dataService: DataService) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.url.toString();
      }
    });
    this.chartdatajson = dataService.data;
    this.dataService.subject.subscribe((data) => {
      this.details.chartdetails = data;
    });
    this.dataService.filterArray.subscribe((data) => {this.details.filterData = data;});

    if(this.currentUrl == "/chartvisual") {
      this.showChartFilter = true;
    }
    else {
      this.showChartFilter = false;
    }
  }

  ngDoCheck() {
    this.zone.runOutsideAngular(() => {
      if(this.charttype != undefined) {
        if(this.charttype.findIndex(obj => obj.id == 4) > -1) {
          this.createPieChart();
          this.pieflag = true;
        }
        else{
          this.pieflag = false;
        }

        if(this.charttype.findIndex(obj => obj.id == 1) > -1) {
          this.createColumnChart();
          this.columnflag = true;
        }
        else {
          this.columnflag = false;
        }

        if(this.charttype.findIndex(obj => obj.id == 2) > -1) {
          this.createRadarChart();
          this.radarflag = true;
        }
        else {
          this.radarflag = false;
        }
      }
    });
  }

  ngAfterViewInit() {
  
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  toChartsec() {
    this.showChartFilter = true;
    this.router.navigate(['chartvisual']);
  }

  toFiltersec() {
    this.showChartFilter = false;
    this.router.navigate(['../']);
  }

  ApplyFilter() {
    this.charttype = this.details.chartdetails;
  }

  assignActive(str: String) {
    this.activeButton = str;
  }

  createPieChart() {
    this.chart = am4core.create("piechartdiv", am4charts.PieChart3D);
    this.chart.responsive.enabled = true;
    // Add data
    this.chart.data = this.chartdatajson;

    // Add and configure Series
    let pieSeries = this.chart.series.push(new am4charts.PieSeries3D());
    pieSeries.dataFields.value = "ExecutionCount";
    pieSeries.dataFields.category = "SKU";

    this.chart.innerRadius = am4core.percent(40);
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.fillOpacity = 1;
    pieSeries.legendSettings.labelText = "[bold #ffffff]{name}[/]";
    pieSeries.legendSettings.valueText = "[bold #ffffff]{value}[/]";
    let hs = pieSeries.slices.template.states.getKey("hover");
    hs.properties.scale = 1;
    hs.properties.fillOpacity = 0.5;

    this.chart.legend = new am4charts.Legend();
    this.chart.exporting.menu = new am4core.ExportMenu();
    this.chart.exporting.menu.verticalAlign = "top";
  }

  createColumnChart() {
    this.chart = am4core.create("xychartdiv", am4charts.XYChart3D);

    this.chart.responsive.enabled = true;
    // Add data
    this.chart.data = this.chartdatajson;

    // Create axes
    let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "SKU";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = "right";
    categoryAxis.tooltip.label.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.fill = am4core.color("#ffffff");

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "SKU";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.grid.template.stroke = am4core.color("#ffffff");
    valueAxis.renderer.labels.template.fill = am4core.color("#ffffff");

    // Create series
    let series = this.chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "ExecutionCount";
    series.dataFields.categoryX = "SKU";
    series.name = "ExecutionCount";
    series.tooltipText = "{categoryX}: [bold #ffffff]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    series.legendSettings.labelText = "[bold #ffffff]{name}[/]";

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", (fill, target) => {
      return this.chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", (stroke, target) => {
      return this.chart.colors.getIndex(target.dataItem.index);
    })

    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.lineX.strokeOpacity = 0;
    this.chart.cursor.lineY.strokeOpacity = 0;

    this.chart.legend = new am4charts.Legend();
    this.chart.exporting.menu = new am4core.ExportMenu();
    this.chart.exporting.menu.verticalAlign = "top";
  }

  createRadarChart() {
    this.chart = am4core.create("radarchartdiv", am4charts.RadarChart);
    this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    this.chart.innerRadius = am4core.percent(50);
    this.chart.startAngle = -80;
    this.chart.endAngle = 260;

    this.chart.data = this.chartdatajson;

    let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "SKU";
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeOpacity = 0.08;
    categoryAxis.renderer.tooltipLocation = 0.5;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.labels.template.bent = true;
    categoryAxis.renderer.labels.template.padding(0,0,0,0);
    categoryAxis.renderer.labels.template.radius = 7;
    categoryAxis.renderer.labels.template.fill = am4core.color("#ffffff");

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 24000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.grid.template.strokeOpacity = 0.08;
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#ffffff");

    // axis break
    let axisBreak = valueAxis.axisBreaks.create();
    axisBreak.startValue = 2100;
    axisBreak.endValue = 22900;
    axisBreak.breakSize = 0.02;

    // make break expand on hover
    let hoverState = axisBreak.states.create("hover");
    hoverState.properties.breakSize = 1;
    hoverState.properties.opacity = 0.1;
    hoverState.transitionDuration = 1500;

    axisBreak.defaultState.transitionDuration = 1000;

    let series = this.chart.series.push(new am4charts.RadarColumnSeries());
    series.dataFields.categoryX = "SKU";
    series.dataFields.valueY = "ExecutionCount";
    series.columns.template.tooltipText = "{valueY.value}";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;

    this.chart.seriesContainer.zIndex = -1;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", (fill, target) => {
      return this.chart.colors.getIndex(target.dataItem.index);
    });

    let cursor = new am4charts.RadarCursor();
    cursor.innerRadius = am4core.percent(50);
    cursor.lineY.disabled = true;

    cursor.xAxis = categoryAxis;
    this.chart.cursor = cursor;
    
    this.chart.exporting.menu = new am4core.ExportMenu();
    this.chart.exporting.menu.verticalAlign = "top";
  }
}