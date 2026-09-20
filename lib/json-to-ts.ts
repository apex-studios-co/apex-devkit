// Converts a parsed JSON value into a set of TypeScript interfaces.
// Handles nested objects (extracted into named interfaces), arrays
// (unioned element types), primitives, null/optional detection, and
// merging of object shapes that appear across array elements.

type Json = unknown

interface ObjectShape {
  // property name -> set of type strings observed
  props: Map<string, { types: Set<string>; optional: boolean }>
}

const RESERVED = /^[A-Za-z_$][A-Za-z0-9_$]*$/

function pascalCase(input: string): string {
  const cleaned = input.replace(/[^A-Za-z0-9]+/g, " ").trim()
  const parts = cleaned.length ? cleaned.split(" ") : ["Root"]
  const pascal = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("")
  return /^[A-Za-z_$]/.test(pascal) ? pascal : `I${pascal}`
}

function singularize(name: string): string {
  if (/ies$/i.test(name)) return name.replace(/ies$/i, "y")
  if (/ses$/i.test(name)) return name.replace(/es$/i, "")
  if (/s$/i.test(name) && !/ss$/i.test(name)) return name.slice(0, -1)
  return name
}

export interface ConvertOptions {
  rootName?: string
  useTypeAlias?: boolean
}

export function jsonToTypeScript(json: Json, options: ConvertOptions = {}): string {
  const rootName = pascalCase(options.rootName?.trim() || "Root")
  const interfaces = new Map<string, ObjectShape>()
  const usedNames = new Set<string>()

  function uniqueName(base: string): string {
    let name = pascalCase(base)
    if (!usedNames.has(name)) {
      usedNames.add(name)
      return name
    }
    let i = 2
    while (usedNames.has(`${name}${i}`)) i++
    const finalName = `${name}${i}`
    usedNames.add(finalName)
    return finalName
  }

  // Returns the TS type string for a value; registers interfaces as needed.
  function resolveType(value: Json, nameHint: string): string {
    if (value === null) return "null"
    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]"
      const elementTypes = new Set<string>()
      // Merge object elements into a single shape for cleaner output.
      const objectElements = value.filter(
        (v) => v !== null && typeof v === "object" && !Array.isArray(v),
      ) as Record<string, Json>[]

      if (objectElements.length === value.length) {
        const merged = mergeObjects(objectElements)
        const typeName = registerShape(merged, singularize(nameHint))
        return `${typeName}[]`
      }

      for (const item of value) {
        elementTypes.add(resolveType(item, singularize(nameHint)))
      }
      const union = [...elementTypes].join(" | ")
      return elementTypes.size > 1 ? `(${union})[]` : `${union}[]`
    }
    if (typeof value === "object") {
      const shape = mergeObjects([value as Record<string, Json>])
      return registerShape(shape, nameHint)
    }
    if (typeof value === "string") return "string"
    if (typeof value === "number") return "number"
    if (typeof value === "boolean") return "boolean"
    return "unknown"
  }

  function mergeObjects(objects: Record<string, Json>[]): ObjectShape {
    const shape: ObjectShape = { props: new Map() }
    const total = objects.length
    const seenCount = new Map<string, number>()

    for (const obj of objects) {
      for (const key of Object.keys(obj)) {
        seenCount.set(key, (seenCount.get(key) ?? 0) + 1)
      }
    }

    for (const obj of objects) {
      for (const [key, val] of Object.entries(obj)) {
        const typeStr = resolveType(val, key)
        const existing = shape.props.get(key)
        if (existing) {
          existing.types.add(typeStr)
        } else {
          shape.props.set(key, { types: new Set([typeStr]), optional: false })
        }
      }
    }

    // A key missing from some objects in an array is optional.
    for (const [key, entry] of shape.props) {
      if ((seenCount.get(key) ?? 0) < total) entry.optional = true
    }

    return shape
  }

  // Registers an object shape as a named interface (deduped by structure).
  function registerShape(shape: ObjectShape, nameHint: string): string {
    const signature = shapeSignature(shape)
    for (const [name, existing] of interfaces) {
      if (shapeSignature(existing) === signature) return name
    }
    const name = uniqueName(nameHint || "Object")
    interfaces.set(name, shape)
    return name
  }

  function shapeSignature(shape: ObjectShape): string {
    return [...shape.props.entries()]
      .map(([k, v]) => `${k}${v.optional ? "?" : ""}:${[...v.types].sort().join("|")}`)
      .sort()
      .join(";")
  }

  // Kick off from the root.
  usedNames.add(rootName)
  let rootType: string

  if (json !== null && typeof json === "object" && !Array.isArray(json)) {
    const shape = mergeObjects([json as Record<string, Json>])
    interfaces.set(rootName, shape)
    rootType = rootName
  } else {
    rootType = resolveType(json, rootName)
  }

  const keyword = options.useTypeAlias ? "type" : "interface"
  const blocks: string[] = []

  for (const [name, shape] of interfaces) {
    const lines: string[] = []
    const opener = options.useTypeAlias ? `type ${name} = {` : `interface ${name} {`
    lines.push(opener)
    for (const [key, entry] of shape.props) {
      const propKey = RESERVED.test(key) ? key : JSON.stringify(key)
      const types = [...entry.types]
      const typeStr = types.length > 1 ? types.join(" | ") : types[0]
      lines.push(`  ${propKey}${entry.optional ? "?" : ""}: ${typeStr}`)
    }
    lines.push(options.useTypeAlias ? "}" : "}")
    blocks.push(lines.join("\n"))
  }

  // If the root wasn't an object (e.g. array/primitive), export an alias.
  if (!interfaces.has(rootName)) {
    blocks.unshift(`type ${rootName} = ${rootType}`)
  }

  return blocks.reverse().join("\n\n")
}
