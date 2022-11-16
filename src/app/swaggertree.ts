import {load} from "js-yaml";

export interface SwaggerNode {
  pathSegment: string,
  methods: string[],
  children: SwaggerNode[]
}

function ensureNodes(root: SwaggerNode, pathSegments: string[], methods: string[]) {
  var node = root;
  for (var i = 1; i < pathSegments.length; i++) {
    node = ensureChild(node, pathSegments[i]);
  }
  node.methods = methods;
}

function ensureChild(node: SwaggerNode, pathSegment: string) {
  var child = node.children.find(node => node.pathSegment == pathSegment);
  if (child) {
    return child;
  } else {
    child = {
      pathSegment,
      methods: [],
      children: []
    };
  }
  node.children.push(child);
  return child;
}

export const swaggertree = (yaml: string): SwaggerNode => {
  var spec: any = load(yaml);

  var result = {pathSegment: '/', methods: [], children: []};

  for (const [path, pathInfo] of Object.entries(spec.paths)) {
    var pathSegments = path.split('/')
    ensureNodes(result, pathSegments, Object.keys(pathInfo as any));
  }

  return result;

}
