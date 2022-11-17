import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Simulation} from "d3";
import {ForceGraph} from "./forcegraph";
import {MISERABLES} from "./miserables";
import {buildGraph, swaggertree} from "./swaggertree";

const TYPES = {
  'path': 1,
  'method-get': 2,
  'method-post': 3,
  'method-put': 4,
  'method-delete': 5,
  'method-options': 6,
  'method-head': 7,
  'method-patch': 8,
}

const OPENAPI_SPEC = `openapi: 3.0.0
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing
paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        '200':    # status code
          description: A JSON array of user names
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string`

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'openapi-graph';

  openapiSpec = OPENAPI_SPEC;

  private svg: any;
  private width = 800;
  private height = 600;
  private margin = 10;

  private data = MISERABLES;
  private graph: any;

  ngOnInit(): void {
    this.data = buildGraph(swaggertree(this.openapiSpec));
    this.graph = ForceGraph("#figure", this.data,
      {
        nodeId: (d: any) => d.id,
        nodeGroup: (d: any) => d.type == 'path' ? 0 : 1,
        nodeTitle: (d: any) => `${d.text}`,
        linkStrokeWidth: (l: any) => Math.sqrt(l.value),
        nodeRadius: (d: any) => d.id == this.data.nodes[0].id ? 10 : 5,
        width: this.width,
        height: this.height,
        //invalidation // a promise to stop the simulation when the cell is re-run
      });
  }

  updateGraph(): void {
    this.data = buildGraph(swaggertree(this.openapiSpec));

    this.graph = ForceGraph("#figure", this.data,
      {
        nodeId: (d: any) => d.id,
        nodeGroup: (d: any) => d.type == 'path' ? 0 : 1,
        nodeTitle: (d: any) => `${d.text}`,
        linkStrokeWidth: (l: any) => Math.sqrt(l.value),
        nodeRadius: (d: any) => d.id == this.data.nodes[0].id ? 10 : 5,
        width: this.width,
        height: this.height,
        //invalidation // a promise to stop the simulation when the cell is re-run
      });
  }

}
