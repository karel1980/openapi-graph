import {load} from "js-yaml";
import {v4 as uuid} from "uuid"

export interface SwaggerNode {
  id: string,
  pathSegment: string,
  methods: string[],
  children: SwaggerNode[]
}

function ensureNodes(root: SwaggerNode, pathSegments: string[], methods: string[], idGenerator = uuid) {
  var node = root;
  for (var i = 1; i < pathSegments.length; i++) {
    node = ensureChild(node, pathSegments[i], idGenerator);
  }
  node.methods = methods;
}

function ensureChild(node: SwaggerNode, pathSegment: string, idGenerator = uuid) {
  var child = node.children.find(node => node.pathSegment == pathSegment);
  if (child) {
    return child;
  } else {
    child = newSwaggerNode(pathSegment, idGenerator)
  }
  node.children.push(child);
  return child;
}

function newSwaggerNode(pathSegment: string, idGenerator = uuid): SwaggerNode {
  return ({id: idGenerator(), pathSegment, methods: [], children: []});
}

export const swaggertree = (yaml: string, idGenerator = uuid): SwaggerNode => {
  var spec: any = load(yaml);

  var result = newSwaggerNode('/', idGenerator);

  for (const [path, pathInfo] of Object.entries(spec.paths)) {
    var pathSegments = path.split('/')
    ensureNodes(result, pathSegments, Object.keys(pathInfo as any), idGenerator);
  }

  return result;
}

export const buildGraph = (swaggertree: SwaggerNode): any => {
  // collect swaggertree nodes depth first
  var nodes: any[] = [];
  var links: any[] = [];
  buildGraphRecursive(swaggertree, nodes, links)
  return {nodes, links}
}

export const buildGraphRecursive = (node: SwaggerNode, nodes: any[], links: any[]): any => {
  // node + methods
  nodes.push(node);
  nodes.splice(nodes.length, 0, node.methods.map(method => ({id: method + '-' + node.id})));

  // links from node to methods
  links.splice(links.length, 0, node.methods.map(method => method + '-' + node.id));

  // links from node to children
  links.splice(links.length, 0, node.children.map(child => ({source: node.id, target: child.id, type: 'path'})));

  // recursively add children
  for (let child of node.children) {
    // link from parent to child
    buildGraphRecursive(child, nodes, links);
  }
}
