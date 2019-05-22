import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-chart-visual',
  templateUrl: './chart-visual.component.html',
  styleUrls: ['./chart-visual.component.css']
})
export class ChartVisualComponent implements OnInit {
  selectedBtnId = [];
  chartData = [
    {
      id: 1,
      name: 'Column Chart',
      mat_icon_name: 'bar_chart',
      isSelected: false
    },
    {
      id: 2,
      name: 'Radar Chart',
      mat_icon_name: 'bubble_chart',
      isSelected: false
    },
    {
      id: 3,
      name: 'MultiLine Chart',
      mat_icon_name: 'multiline_chart',
      isSelected: false
    },
    {
      id: 4,
      name: 'Pie Chart',
      mat_icon_name: 'pie_chart',
      isSelected: false
    },
    {
      id: 5,
      name: 'Table Chart',
      mat_icon_name: 'table_chart',
      isSelected: false
    }
  ];
  selectedChartArray = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  bindChart(chart: String,id: number) {
    var index = this.selectedBtnId.indexOf(id);
    if(index > -1) {
      this.selectedBtnId.splice(index,1);
      this.chartData[id - 1].isSelected = false;
      this.selectedChartArray.splice(this.selectedChartArray.findIndex(obj => obj.id == id), 1);
    }
    else {
      this.selectedBtnId.push(id);
      this.chartData[id-1].isSelected = true;
      this.selectedChartArray.push({ id: id, name: chart});
    }
    this.dataService.getChart(this.selectedChartArray);
  }
}
