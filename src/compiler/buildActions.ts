import { Edge } from 'react-flow-renderer'
import { Field, TypeNode } from '../types'

class HydroActionBuilder {
  options: any
  constructor(options?: any) {
    this.options = options
  }

  getNodeById(id: string, nodes: TypeNode[]) {
    let tree = {}
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (node.id === id) {
        return node
      }
    }
  }

  buildConditions(edges: Edge[], nodes: TypeNode[]) {
    return {
      $equals: edges.map((edge: Edge) => {
        const tinySource = this.getNodeById(edge.target, nodes)
        if (tinySource) {
          switch ((tinySource?.$cinfo || {}).$action || null) {
            case 'if_statement': {
              return {
                $match: tinySource?.$cinfo?.$fields[0]?.$value,
                $with: tinySource.$cinfo.$fields[0].$with,
                caseSensitive: false,
              }
            }
          }
        }
      }),
    }
  }

  getEdgesByNodeId(id: string, edges: Edge[]) {
    const final: Edge[] = []
    for (let i = 0; i < edges.length; i++) {
      const edge: Edge = edges[i]
      if (edge.source == id || edge.target == id) {
        final.push(edge)
      }
    }
    return final
  }

  buildActions(target: TypeNode, nodes: TypeNode[], edges: Edge[]) {
    const children = this.getEdgesByNodeId(target.id, edges)

    return target.$cinfo?.$fields
      ? Array.isArray(target.$cinfo.$fields)
        ? ((target.$cinfo || {}).$fields || []).map((field: Field) => {
            return {
              $type: target.$cinfo.$action,
              $value: field.$value,
              $query: field?.$query,
              $callbacks: children.map((child: Edge) => {
                if (child.source == target.id) {
                  if (child.target) {
                    return this.getNodeById(child.target, nodes)
                  }
                }
              }),
            }
          })
        : []
      : []
  }

  buildCool(obj: any, nodes: TypeNode[], edges: Edge[]) {
    for (const key in obj) {
      const object = obj[key]
      if (object) {
        if (object.$callbacks) {
          const newCallbacks = object.$callbacks.map((callback: any) => {
            if (callback) {
              const node = this.getNodeById(callback.id, nodes)
              if (node) {
                return {
                  $type: node.$cinfo.$action,
                  $fields: node.$cinfo.$fields,
                  $actions: this.buildActions(node, nodes, edges),
                }
              }
            }
          })
          object.$callbacks = newCallbacks
        }
      }

      if (typeof object === 'object' || Array.isArray(object)) {
        this.buildCool(object, nodes, edges)
      }
    }
    return obj
  }

  build(obj: any, nodes: TypeNode[], edges: Edge[]) {
    console.log(
      `Building actions for ${nodes.length} nodes and ${edges.length} edges`,
    )
    return this.buildCool(obj, nodes, edges)
  }
}

export default HydroActionBuilder
