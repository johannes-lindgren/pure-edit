import {
  equalsGuard,
  isArray,
  isBoolean,
  isNumber,
  isString,
  isUnknown,
  objectGuard,
  optional,
  optionalGuard,
} from 'pure-parse'
import { v4 as randomUuid } from 'uuid'

/*
 * Uuid
 */

export type Uuid = string
export const isUuid = isString

/*
 * Reference
 */

export type ContentReference = {
  tag: 'reference'
  uuid: Uuid
  valueUuid: Uuid
}

export const isContentReference = objectGuard<ContentReference>({
  tag: equalsGuard('reference'),
  uuid: isUuid,
  valueUuid: isUuid,
})

export type InputReference = {
  tag: 'reference-input'
  uuid: Uuid
  inputUuid: Uuid
}

export const inputRef = (contentInput: Input): InputReference => ({
  tag: 'reference-input',
  uuid: randomUuid(),
  inputUuid: contentInput.uuid,
})

export const isContentInputReference = objectGuard<InputReference>({
  tag: equalsGuard('reference-input'),
  uuid: isUuid,
  inputUuid: isUuid,
})

/*
 * Boolean
 */

export type BooleanContent = {
  tag: 'boolean'
  uuid: Uuid
  input?: InputReference
  value: boolean
}

export const isBooleanContent = objectGuard<BooleanContent>({
  tag: equalsGuard('boolean'),
  uuid: isUuid,
  input: optionalGuard(isContentInputReference),
  value: isBoolean,
})

export type BooleanInput = {
  tag: 'boolean-input'
  uuid: Uuid
  label?: string
}

export const booleanInput = (
  params?: Omit<BooleanInput, 'tag' | 'uuid'>,
): BooleanInput => ({
  tag: 'boolean-input',
  uuid: randomUuid(),
  ...params,
})

/*
 * Text
 */

export type TextContent = {
  tag: 'text'
  uuid: Uuid
  input?: InputReference
  value: string
}

export const isTextContent = objectGuard<TextContent>({
  tag: equalsGuard('text'),
  uuid: isUuid,
  input: optionalGuard(isContentInputReference),
  value: isString,
})

export type TextInput = {
  tag: 'text-input'
  uuid: Uuid
  label?: string
}

export const textInput = (
  params?: Omit<TextInput, 'tag' | 'uuid'>,
): TextInput => ({
  tag: 'text-input',
  uuid: randomUuid(),
  ...params,
})

/*
 * Number
 */

export type NumberContent = {
  tag: 'number'
  uuid: Uuid
  input?: InputReference
  value: number
}

export const isNumberContent = objectGuard<NumberContent>({
  tag: equalsGuard('number'),
  uuid: isUuid,
  input: optionalGuard(isContentInputReference),
  value: isNumber,
})

export type NumberInput = {
  tag: 'number-input'
  uuid: Uuid
  label?: string
}

export const numberInput = (
  params?: Omit<NumberInput, 'tag' | 'uuid'>,
): NumberInput => ({
  tag: 'number-input',
  uuid: randomUuid(),
  ...params,
})

/*
 * Object
 */

export type ObjectContent = {
  tag: 'object'
  uuid: Uuid
  input?: InputReference
  value: Record<string, ContentReference>
}

export const isObjectContent = objectGuard<
  Omit<ObjectContent, 'value'> & { value?: unknown }
>({
  tag: equalsGuard('object'),
  uuid: isUuid,
  input: optionalGuard(isContentInputReference),
  value: optionalGuard(isUnknown),
})

export type ObjectInput = {
  tag: 'object-input'
  uuid: Uuid
  label?: string
  fields: Record<string, Input>
}

export const objectInput = (
  params: Omit<ObjectInput, 'tag' | 'uuid'>,
): ObjectInput => ({
  tag: 'object-input',
  uuid: randomUuid(),
  ...params,
})

/*
 * Array
 */

export type ArrayContent = {
  tag: 'array'
  uuid: Uuid
  input?: InputReference
  value: ContentReference[]
}

export const isArrayContent = objectGuard({
  tag: equalsGuard('array'),
  uuid: isUuid,
  input: optionalGuard(isContentInputReference),
  value: isArray,
})

export type ArrayInput = {
  tag: 'array-input'
  uuid: Uuid
  items: FlatContent[]
}
export const arrayInput = (
  params: Omit<ArrayInput, 'tag' | 'uuid'>,
): ArrayInput => ({
  tag: 'array-input',
  uuid: randomUuid(),
  ...params,
})

/*
 * Primitive
 */

export type PrimitiveContent = {
  tag: 'primitive'
  uuid: Uuid
  input?: InputReference
  value: string
}

export const isPrimitiveContent = objectGuard<PrimitiveContent>({
  tag: equalsGuard('primitive'),
  uuid: isUuid,
  input: optionalGuard(isContentInputReference),
  value: isString,
})

export type PrimitiveInput = {
  tag: 'primitive-input'
  uuid: Uuid
  label?: string
  value: string
}

export const primitiveInput = (
  params: Omit<PrimitiveInput, 'tag' | 'uuid'>,
): PrimitiveInput => ({
  tag: 'primitive-input',
  uuid: randomUuid(),
  ...params,
})

/*
 * oneOf
 */

export type OneOfContent = {
  tag: 'one-of'
  uuid: Uuid
  input?: InputReference
  value: ContentReference
}

export const isOneOfContent = objectGuard<OneOfContent>({
  tag: equalsGuard('one-of'),
  uuid: isUuid,
  input: optionalGuard(isContentInputReference),
  value: objectGuard({
    tag: equalsGuard('reference'),
    uuid: isUuid,
    valueUuid: isUuid,
  }),
})

export type OneOfInput = {
  tag: 'one-of-input'
  uuid: Uuid
  label?: string
  options: FlatContent[]
}

export const oneOfInput = (
  params: Omit<OneOfInput, 'tag' | 'uuid'>,
): OneOfInput => ({
  tag: 'one-of-input',
  uuid: randomUuid(),
  ...params,
})

/*
 * All
 */

/*
 * TODO
 *  - optional input
 *  - reference (need to be able to handle loops)
 *  - translation
 */

export type Content =
  | BooleanContent
  | TextContent
  | NumberContent
  | ObjectContent
  | ArrayContent
  | PrimitiveContent
  | OneOfContent

export type Input =
  | PrimitiveInput
  | BooleanInput
  | TextInput
  | NumberInput
  | ObjectInput
  | ArrayInput
  | OneOfInput
  | InputReference

export type FlatStore<T> = {
  data: Record<Uuid, T>
}

export type FlatContent = {
  tag: 'content-store'
  rootUuid: Uuid
  data: Record<Uuid, Content>
}

export type InputMap = {
  tag: 'content-input-store'
  data: Record<Uuid, Input>
}

// export type ContentTree = {
//   tag: 'content-tree'
//   data: unknown
// }

export type ContentStoreTmp = Record<Uuid, Content>

/*
 *  Flatten/Unflatten
 */

// TODO
export type ContentTree = unknown
export type ValueOnlyTree = unknown

export const subStore = (
  store: ContentStoreTmp,
  uuid: Uuid,
): ContentStoreTmp => {
  throw new Error('Not implemented')
  const content = store[uuid]
  if (content === undefined) {
    return {}
  }
  // switch (content.tag) {
  //   case 'text':
  //     return { [uuid]: content }
  //   case 'number':
  //     return { [uuid]: content }
  //   case 'primitive':
  //     return { [uuid]: content }
  //   case 'one-of':
  //     return subStore(store, content.value.valueUuid)
  //   case 'object':
  //     return Object.entries(content.value).reduce((acc, [_key, ref]) => {
  //       Object.assign(acc, subStore(store, ref.valueUuid))
  //       return acc
  //     }, {} as ContentStoreTmp)
  //   case 'array':
  //     return content.value.reduce((acc, ref) => {
  //       return { ...acc, ...subStore(store, ref.valueUuid) }
  //     }, {} as ContentStoreTmp)
  //   default:
  //     // TODO of course, we're not going to keep any exceptions in the final version
  //     throw new Error('Unknown tag')
  // }
}

/**
 * Not meant to be used normally, but useful in tests
 * @param content
 */
export const toFlat = (content: ContentTree): FlatContent => {
  const result: Record<Uuid, Content> = {}

  switch (content.tag) {
    case 'boolean':
      result[content.uuid] = content
      break
    case 'text':
      result[content.uuid] = content
      break
    case 'number':
      result[content.uuid] = content
      break
    case 'primitive':
      result[content.uuid] = content
      break
    case 'one-of':
      const child = content.value
      const store = toFlat(child)
      Object.assign(result, store.data)
      result[content.uuid] = {
        ...content,
        value: {
          tag: 'reference',
          uuid: randomUuid(),
          valueUuid: child.uuid,
        },
      }
      break
    case 'object':
      result[content.uuid] = {
        ...content,
        value: Object.entries(content.value).reduce(
          (acc, [key, child]) => {
            const store = toFlat(child)
            Object.assign(result, store.data)
            acc[key] = {
              tag: 'reference',
              uuid: randomUuid(),
              valueUuid: child.uuid,
            }
            return acc
          },
          {} as Record<Uuid, ContentReference>,
        ),
      }
      break
    case 'array':
      result[content.uuid] = {
        ...content,
        value: content.value.map((child) => {
          const store = toFlat(child)
          Object.assign(result, store.data)
          return {
            tag: 'reference',
            uuid: randomUuid(),
            valueUuid: child.uuid,
          }
        }),
      }
      break
    default:
      // TODO of course, we're not going to keep any exceptions in the final version
      throw new Error(`Unknown tag ${JSON.stringify(content.tag)}`)
  }
  return {
    tag: 'content-store',
    rootUuid: content.uuid,
    data: result,
  }
}

export const toTree = (store: FlatContent): ContentTree => {
  const content = store.data[store.rootUuid]
  if (content === undefined) {
    // TODO of course, we're not going to keep any exceptions in the final version
    throw new Error('Undefined content')
  }
  switch (content.tag) {
    case 'boolean':
      return content
    case 'text':
      return content
    case 'number':
      return content
    case 'primitive':
      return content
    case 'one-of':
      return {
        ...content,
        value: toTree({ ...store, rootUuid: content.value.valueUuid }),
      }
    case 'object':
      return {
        ...content,
        value: Object.entries(content.value).reduce(
          (acc, [key, ref]) => {
            acc[key] = toTree({ ...store, rootUuid: ref.valueUuid })
            return acc
          },
          {} as Record<string, ContentTree>,
        ),
      }
    case 'array':
      return {
        ...content,
        value: content.value.map((ref) =>
          toTree({ ...store, rootUuid: ref.valueUuid }),
        ),
      }
    default:
      // TODO of course, we're not going to keep any exceptions in the final version
      throw new Error(`Unknown tag ${content.tag}`)
  }
}

export const toValueOnlyTree = (content: ContentTree): ValueOnlyTree => {
  switch (content.tag) {
    case 'boolean':
      return content.value
    case 'text':
      return content.value
    case 'number':
      return content.value
    case 'primitive':
      return content.value
    case 'object':
      return Object.entries(content.value).reduce(
        (acc, [key, child]) => {
          acc[key] = toValueOnlyTree(child)
          return acc
        },
        {} as Record<string, ValueOnlyTree>,
      )
    case 'array':
      return content.value.map(toValueOnlyTree)
    case 'one-of':
      return toValueOnlyTree(content.value)
    default:
      // TODO of course, we're not going to keep any exceptions in the final version
      throw new Error('Unknown tag')
  }
}

export const cloneContent = (content: FlatContent): FlatContent => {
  const newUuidFromOld = uuidMapping(content.data)
  const newRootUuid = newUuidFromOld.get(content.rootUuid)
  if (newRootUuid === undefined) {
    // Should never happen
    throw new Error('Undefined root uuid')
  }
  const result: Record<Uuid, Content> = {}
  for (const [oldUuid, newUuid] of newUuidFromOld) {
    const oldContent = content.data[oldUuid]
    if (oldContent === undefined) {
      throw new Error('Undefined content')
    }
    switch (oldContent.tag) {
      case 'text':
        result[newUuid] = {
          ...oldContent,
          uuid: newUuid,
        }
        break
      case 'number':
        result[newUuid] = {
          ...oldContent,
          uuid: newUuid,
        }
        break
      case 'primitive':
        result[newUuid] = {
          ...oldContent,
          uuid: newUuid,
        }
        break
      case 'object':
        result[newUuid] = {
          tag: 'object',
          // TODO extract function
          input: oldContent.input
            ? {
                ...oldContent.input,
                uuid: randomUuid(),
              }
            : undefined,
          uuid: newUuid,
          value: Object.entries(oldContent.value).reduce(
            (acc, [key, child]) => {
              const newValueUuid = newUuidFromOld.get(child.valueUuid)
              if (newValueUuid === undefined) {
                // Should never happen
                throw new Error('Undefined new uuid')
              }
              acc[key] = {
                tag: 'reference',
                uuid: randomUuid(),
                valueUuid: newValueUuid,
              }
              return acc
            },
            {} as Record<string, ContentReference>,
          ),
        }
        break
      case 'array':
        result[newUuid] = {
          tag: 'array',
          uuid: newUuid,
          value: oldContent.value.map((child) => {
            const newValueUuid = newUuidFromOld.get(child.valueUuid)
            if (newValueUuid === undefined) {
              // Should never happen
              throw new Error('Undefined new uuid')
            }
            return {
              tag: 'reference',
              uuid: randomUuid(),
              valueUuid: newValueUuid,
            }
          }),
        }
        break
      default:
        // TODO of course, we're not going to keep any exceptions in the final version
        throw new Error('Unknown tag')
    }
  }
  return {
    tag: 'content-store',
    rootUuid: newRootUuid,
    data: result,
  }
}

const uuidMapping = (content: ContentStoreTmp): Map<Uuid, Uuid> => {
  const result = new Map<Uuid, Uuid>()
  const oldUuids = Object.keys(content)
  for (const oldUuid of oldUuids) {
    result.set(oldUuid, randomUuid())
  }
  return result
}
