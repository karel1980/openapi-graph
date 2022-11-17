import {swaggertree} from "./swaggertree";
import {v4 as uuid} from "uuid";

describe('swaggertree', () => {
  describe('swaggertree', () => {
    it('should load yaml', () => {
      var spec = `openapi: 3.0.0
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

      var actual = swaggertree(spec, (() => 'test') as typeof uuid);

      expect(actual).toEqual({id: 'test', 'pathSegment': '/', methods: [], children: [{id: 'test', pathSegment: 'users', methods: ['get'], children: []}]});
    });
  });
})
