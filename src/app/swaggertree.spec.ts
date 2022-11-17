import {buildGraph, swaggertree} from "./swaggertree";
import {v4 as uuid} from "uuid";

const OPENAPI_SPEC_SAMPLE = `openapi: 3.0.0
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
                  type: string`;

describe('swaggertree', () => {
  describe('swaggertree', () => {
    it('should load yaml', () => {
      var actual = swaggertree(OPENAPI_SPEC_SAMPLE, (() => 'test') as typeof uuid);

      expect(actual).toEqual({id: 'test', 'pathSegment': '/', methods: [], children: [{id: 'test', pathSegment: 'users', methods: ['get'], children: []}]});
    });
  });

  describe('buildGraph', () => {
    it('converts tree to nodes and links', () => {
      var num = 0;
      let graph = buildGraph(swaggertree(OPENAPI_SPEC_SAMPLE, (() => `test-${num++}`) as typeof uuid));

      expect(graph.nodes).toEqual([
        {id: 'test-0', text: '/', type: 'path'},
        {id: 'test-1', text: 'users', type: 'path'},
        {id: 'get-test-1', text: 'get', type: 'method'}]);

      expect(graph.links).toEqual([
        {source: 'test-0', target: 'test-1', type: 'path'},
        {source: 'test-1', target: 'get-test-1', type: 'method'}]);
    });
  })
})
