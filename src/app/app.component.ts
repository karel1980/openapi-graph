import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Simulation} from "d3";
import {ForceGraph} from "./forcegraph";
import {MISERABLES} from "./miserables";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'openapi-graph';

  private svg: any;
  private width = 800;
  private height = 600;
  private margin = 10;

  ngOnInit(): void {
    var graph = ForceGraph("#figure", MISERABLES,
      {
        nodeId: (d: any) => d.id,
        nodeGroup: (d: any) => d.group,
        nodeTitle: (d: any) => `${d.id}`,
        linkStrokeWidth: (l: any) => Math.sqrt(l.value),
        width: this.width,
        height: this.height,
        //invalidation // a promise to stop the simulation when the cell is re-run
      });
  }

}
