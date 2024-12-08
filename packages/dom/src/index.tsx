import {
  Alert,
  FormControl,
  Stack,
  Typography,
  Box,
  AlertTitle,
  Divider,
  Switch,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  ChangeEventHandler,
  createContext,
  FormEventHandler,
  Fragment,
  FunctionComponent,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import {
  Input,
  ObjectInput,
  TextInput,
  NumberInput,
  Uuid,
  isTextContent,
  isNumberContent,
  ArrayInput,
  isArrayContent,
  isPrimitiveContent,
  PrimitiveInput,
  Content,
  textInput,
  numberInput,
  primitiveInput,
  objectInput,
  arrayInput,
  subStore,
  cloneContent,
  FlatContent,
  InputMap,
  FlatStore,
  toFlat,
  isOneOfContent,
  OneOfInput,
  isObjectContent,
  BooleanInput,
  isBooleanContent,
  ContentReference,
} from '@editor/model'
import {
  Label,
  StyledInput,
  CustomNumberInput,
  AnimatedListbox,
  MenuButton,
  MenuItem,
  Button,
  Scale,
} from './components'
import { v4 as randomUuid } from 'uuid'
import * as React from 'react'
import { createSelector } from 'reselect'
import { Dropdown } from '@mui/base/Dropdown'
import { Menu } from '@mui/base/Menu'
import { Braces } from './Braces.tsx'
import { BracketContainer } from './BracketContainer.tsx'
import { Bracket } from './Bracket.tsx'
import { ExpandMore, RemoveCircleOutlineOutlined } from '@mui/icons-material'

type UpdateFn<T> = (draft: T) => void

export type Store<T> = {
  subscribe: (fn: (data: unknown) => void) => () => void
  get: () => T
  update: (fn: UpdateFn<T>) => void
}

export type ContentStore = Store<FlatContent>
export type InputStore = Store<InputMap>

const readOnlyStore = <T,>(data: T): Store<T> => ({
  subscribe: () => () => {},
  get: () => data,
  update: () => {},
})

const ContentYjsStoreContext = createContext<ContentStore | undefined>(
  undefined,
)

const ContentInputYjsStoreContext = createContext<InputStore | undefined>(
  undefined,
)

export const ContentYjsStoreContextProvider: FunctionComponent<{
  store: ContentStore
  children: ReactNode
}> = (props) => {
  const { store, children } = props
  return (
    <ContentYjsStoreContext.Provider value={store}>
      {children}
    </ContentYjsStoreContext.Provider>
  )
}

export const ContentInputYjsStoreContextProvider: FunctionComponent<{
  store: InputStore
  children: ReactNode
}> = (props) => {
  const { store, children } = props
  return (
    <ContentInputYjsStoreContext.Provider value={store}>
      {children}
    </ContentInputYjsStoreContext.Provider>
  )
}

const useUpdater = () => {
  const store = useContext(ContentYjsStoreContext)!
  return store.update
}

export const useContentSelector = <Selection,>(
  selector: (store: FlatContent) => Selection,
): Selection => {
  const store = useContext(ContentYjsStoreContext)!

  const getSnapshot = useCallback(
    () => selector(store.get()),
    [store, selector],
  )

  return useSyncExternalStore(store.subscribe, getSnapshot)
}

export const useInputSelector = <Selection,>(
  selector: (store: InputMap) => Selection,
): Selection => {
  const store = useContext(ContentInputYjsStoreContext)!

  const getSnapshot = useCallback(
    () => selector(store.get()),
    [store, selector],
  )

  return useSyncExternalStore(store.subscribe, getSnapshot)
}

const useSelectByUuid = <T,>(uuid: Uuid) => {
  return useCallback(
    (store: FlatStore<T>) => {
      return store.data[uuid]
    },
    [uuid],
  )
}

const useContentByUuid = (uuid: Uuid) => {
  const selectByUuid = useSelectByUuid<Content>(uuid)
  return useContentSelector(selectByUuid)
}

const useContentInputByUuid = (uuid: Uuid) => {
  const selectByUuid = useSelectByUuid<Input>(uuid)
  return useInputSelector(selectByUuid)
}

const JsonView: FunctionComponent<{ data: unknown }> = (props) => {
  const { data } = props
  return (
    <Box
      component="pre"
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        px: 2,
        py: 1,
      }}
    >
      <Box component="code">{JSON.stringify(data, null, 2)}</Box>
    </Box>
  )
}

export const UnknownContentView: FunctionComponent<{
  schema: Input
  content: unknown
}> = memo((props) => {
  const { schema, content } = props
  return (
    <Alert severity="error">
      <AlertTitle>
        The content does not adhere to the expected structure.
      </AlertTitle>
      <Typography>
        The schema expects the content to be of the following structure:
      </Typography>
      <Stack>
        <Typography variant="subtitle1">Schema:</Typography>
        <JsonView data={schema} />
        <Typography variant="subtitle1">Content:</Typography>
        <JsonView data={content} />
      </Stack>
    </Alert>
  )
})

export const UnknownInputView: FunctionComponent<{
  schema: Input
}> = memo((props) => {
  const { schema } = props
  return (
    <Alert severity="error">
      <AlertTitle>Unknown input type</AlertTitle>
      <Typography>
        Cannot render the input because the input type is unknown.
      </Typography>
      <Stack>
        <Typography variant="subtitle1">Schema:</Typography>
        <JsonView data={schema} />
      </Stack>
    </Alert>
  )
})

export const ContentNotFoundView: FunctionComponent<{
  uuid: Uuid
}> = memo((props) => {
  const { uuid } = props
  return (
    <Alert severity="error">
      <AlertTitle>Content not found</AlertTitle>
      <Typography>
        Could not find content by uuid {JSON.stringify(uuid)}
      </Typography>
    </Alert>
  )
})

export const InputNotFoundView: FunctionComponent<{
  uuid: Uuid
}> = memo((props) => {
  const { uuid } = props
  return (
    <Alert severity="error">
      <AlertTitle>Input not found</AlertTitle>
      <Typography>
        Could not find input by uuid {JSON.stringify(uuid)}
      </Typography>
    </Alert>
  )
})

export const MissingPropertyView: FunctionComponent<{
  propertyName: string
}> = memo((props) => {
  const { propertyName } = props
  return (
    <Alert severity="error">
      <AlertTitle>Missing property</AlertTitle>
      <Typography>
        The property {propertyName} is missing from the object.
      </Typography>
    </Alert>
  )
})

const PrimitiveContentInputView: FunctionComponent<{
  schema: PrimitiveInput
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props
  const content = useContentByUuid(uuid)
  const inputId = useId()
  const helperTextId = useId()

  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }

  if (!isPrimitiveContent(content)) {
    return (
      <UnknownContentView
        content={content}
        schema={schema}
      />
    )
  }

  return (
    <FormControl>
      <StyledInput
        disabled
        id={inputId}
        aria-describedby={helperTextId}
        value={schema.label}
      />
    </FormControl>
  )
})

const BooleanContentInputView: FunctionComponent<{
  schema: BooleanInput
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props
  const content = useContentByUuid(uuid)
  const inputId = useId()
  const helperTextId = useId()
  const update = useUpdater()
  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    // Must save in a variable because e will become destroyed after the event handler finishes,
    //  and the producer callback function might be called later
    const value = e.target.checked
    update((draft) => {
      const currentContent = draft.data[uuid]
      if (!isBooleanContent(currentContent)) {
        return
      }
      draft.data[uuid] = {
        ...currentContent,
        value,
      }
    })
  }

  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }

  if (!isBooleanContent(content)) {
    return (
      <UnknownContentView
        content={content}
        schema={schema}
      />
    )
  }

  return (
    <FormControl>
      {schema.label && <Label>{schema.label}</Label>}
      <Switch
        value={content.value}
        onChange={handleInput}
      />
    </FormControl>
  )
})

const TextContentInputView: FunctionComponent<{
  schema: TextInput
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props
  const content = useContentByUuid(uuid)
  const inputId = useId()
  const helperTextId = useId()
  const update = useUpdater()
  const handleInput: FormEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    // Must save in a variable because e will become destroyed after the event handler finishes,
    //  and the producer callback function might be called later
    const value = e.currentTarget.value
    update((draft) => {
      const currentContent = draft.data[uuid]
      if (!isTextContent(currentContent)) {
        return
      }
      draft.data[uuid] = {
        ...currentContent,
        value,
      }
    })
  }

  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }

  if (!isTextContent(content)) {
    return (
      <UnknownContentView
        content={content}
        schema={schema}
      />
    )
  }

  return (
    <FormControl>
      {schema.label && <Label>{schema.label}</Label>}
      <StyledInput
        sx={{
          flex: 1,
        }}
        label={schema.label}
        id={inputId}
        aria-describedby={helperTextId}
        value={content.value}
        onChange={handleInput}
      />
    </FormControl>
  )
})

const NumberContentInputView: FunctionComponent<{
  schema: NumberInput
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props
  const content = useContentByUuid(uuid)
  const inputId = useId()
  const helperTextId = useId()
  const update = useUpdater()
  const handleInput = (_e: unknown, value: number | null) => {
    // Must save in a variable because e will become destroyed after the event handler finishes,
    //  and the producer callback function might be called later
    if (value === null) {
      return
    }
    update((draft) => {
      const currentContent = draft.data[uuid]
      if (!isNumberContent(currentContent)) {
        return
      }
      draft.data[uuid] = {
        ...currentContent,
        value,
      }
    })
  }

  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }

  if (!isNumberContent(content)) {
    return (
      <UnknownContentView
        content={content}
        schema={schema}
      />
    )
  }

  return (
    <FormControl>
      {schema.label && <Label>{schema.label}</Label>}
      <CustomNumberInput
        id={inputId}
        aria-describedby={helperTextId}
        value={content.value}
        onChange={handleInput}
      />
    </FormControl>
  )
})

const OneOfInputView: FunctionComponent<{
  schema: OneOfInput
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props
  const selectByUuid = useSelectByUuid(uuid)
  const content = useContentSelector(selectByUuid)
  const inputId = useId()
  const helperTextId = useId()
  const update = useUpdater()

  const handleAdd = (content: FlatContent) => {
    update((draft) => {
      const currentContent = draft.data[uuid]
      if (!isOneOfContent(currentContent)) {
        return
      }

      Object.assign(draft.data, content.data)
      currentContent.value = {
        tag: 'reference',
        uuid: randomUuid(),
        valueUuid: content.rootUuid,
      }
    })
  }

  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }

  if (!isOneOfContent(content)) {
    return (
      <UnknownContentView
        content={content}
        schema={schema}
      />
    )
  }

  return (
    <FormControl>
      <Stack gap={1}>
        {schema.label && <Label>{schema.label}</Label>}
        <ContentInputViewReferencedSchema uuid={content.value.valueUuid} />
        <SelectContentFromTemplateView
          templates={schema.options}
          onChange={handleAdd}
        >
          Change
        </SelectContentFromTemplateView>
      </Stack>
    </FormControl>
  )
})

const ObjectContentInputView: FunctionComponent<{
  schema: ObjectInput
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props

  const content = useContentByUuid(uuid)

  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }

  if (!isObjectContent(content)) {
    // TODO: Show error message
    return 'content is not an object'
  }

  return (
    <BracketContainer BracketComponent={Braces}>
      <Accordion
        defaultExpanded
        elevation={0}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">
            {props.schema.label ?? 'Object'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={2}>
            {Object.entries(schema.fields).map(([key, field]) => {
              const childContent = content.value[key]
              if (!childContent) {
                return <MissingPropertyView propertyName={key} />
              }
              return (
                <ContentInputView
                  schema={field}
                  key={key}
                  uuid={childContent.valueUuid}
                />
              )
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </BracketContainer>
  )
})

const selectStore = (store: FlatContent) => store
const selectUuid = (_: FlatContent, uuid: Uuid) => uuid

const selectContentStoreByUuid = createSelector(
  [selectStore, selectUuid],
  (store: FlatContent, uuid: Uuid) => subStore(store, uuid),
)

const ArrayContentInputView: FunctionComponent<{
  schema: ArrayInput
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props

  const update = useUpdater()
  const content = useContentByUuid(uuid)

  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }

  if (!isArrayContent(content)) {
    return (
      <UnknownContentView
        schema={schema}
        content={content}
      />
    )
  }

  const handleAdd = (contentToAdd: FlatContent) => {
    update((draft) => {
      const currentContent = draft.data[uuid]
      if (!isArrayContent(currentContent)) {
        return
      }

      Object.assign(draft.data, contentToAdd.data)
      currentContent.value.push({
        tag: 'reference',
        uuid: randomUuid(),
        valueUuid: contentToAdd.rootUuid,
      })
    })
  }

  const handleRemove = (contentToRemove: ContentReference) => {
    update((draft) => {
      const currentContent = draft.data[uuid]
      if (!isArrayContent(currentContent)) {
        return
      }
      currentContent.value = currentContent.value.filter(
        (it) => it.valueUuid !== contentToRemove.valueUuid,
      )
    })
  }

  return (
    <BracketContainer BracketComponent={Bracket}>
      <Stack gap={1}>
        {content.value.map((childContent) => (
          <Box
            key={childContent.uuid}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleRemove(childContent)}
            >
              <RemoveCircleOutlineOutlined fontSize="inherit" />
            </IconButton>
            <Stack flex={1}>
              <ContentInputViewReferencedSchema uuid={childContent.valueUuid} />
            </Stack>
          </Box>
        ))}
        <SelectContentFromTemplateView
          templates={schema.items}
          onChange={handleAdd}
        >
          Add
        </SelectContentFromTemplateView>
      </Stack>
    </BracketContainer>
  )
})

const SelectContentFromTemplateView: FunctionComponent<{
  templates: FlatContent[]
  onChange: (content: FlatContent) => void
  children?: ReactNode
}> = (props) => {
  const { templates, onChange, children } = props
  const [isOpen, setIsOpen] = useState(false)

  const createHandleMenuClick = (contentTemplate: FlatContent) => {
    return () => {
      onChange(cloneContent(contentTemplate))
    }
  }

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={(_, isOpen) => setIsOpen(isOpen)}
    >
      <MenuButton>{children}</MenuButton>
      <Menu
        slots={{
          listbox: AnimatedListbox,
        }}
      >
        {templates.map((template, index) => (
          <Fragment key={template.rootUuid}>
            {index !== 0 && <Divider sx={{ my: 1 }} />}
            <MenuItem
              onClick={createHandleMenuClick(template)}
              sx={{
                width: 200,
                p: 0,
              }}
            >
              <Scale scale={3 / 4}>
                <ContentPreview template={template} />
              </Scale>
            </MenuItem>
          </Fragment>
        ))}
      </Menu>
    </Dropdown>
  )
}

const ContentPreview: FunctionComponent<{
  template: FlatContent
}> = memo((props) => {
  const { template } = props

  const content = useMemo(() => cloneContent(template), [template])
  const store = useMemo(() => readOnlyStore(content), [content])

  return (
    <ContentYjsStoreContextProvider store={store}>
      <Box
        sx={{
          pointerEvents: 'none',
          p: 2,
        }}
      >
        <ContentInputViewReferencedSchema uuid={content.rootUuid} />
      </Box>
    </ContentYjsStoreContextProvider>
  )
})

export const ContentInputViewReferencedSchema: FunctionComponent<{
  uuid: Uuid
}> = memo((props) => {
  const { uuid } = props
  const content = useContentByUuid(uuid)
  const inputUuid = content?.input?.inputUuid
  const contentInput = useContentInputByUuid(inputUuid ?? '')
  if (content === undefined) {
    return <ContentNotFoundView uuid={uuid} />
  }
  if (inputUuid === undefined) {
    return `inputUuid on content ${JSON.stringify(uuid)} is undefined`
  }
  if (contentInput === undefined) {
    return <InputNotFoundView uuid={inputUuid} />
  }
  return (
    <ContentInputView
      schema={contentInput}
      uuid={content.uuid}
    />
  )
})

export const ContentInputView: FunctionComponent<{
  schema: Input
  uuid: Uuid
}> = memo((props) => {
  const { schema, uuid } = props
  switch (schema.tag) {
    case 'primitive-input':
      return (
        <PrimitiveContentInputView
          schema={schema}
          uuid={uuid}
        />
      )
    case 'boolean-input':
      return (
        <BooleanContentInputView
          schema={schema}
          uuid={uuid}
        />
      )
    case 'text-input':
      return (
        <TextContentInputView
          schema={schema}
          uuid={uuid}
        />
      )
    case 'one-of-input':
      return (
        <OneOfInputView
          schema={schema}
          uuid={uuid}
        />
      )
    case 'object-input':
      return (
        <ObjectContentInputView
          schema={schema}
          uuid={uuid}
        />
      )
    case 'number-input':
      return (
        <NumberContentInputView
          schema={schema}
          uuid={uuid}
        />
      )
    case 'array-input':
      return (
        // TODO
        <ArrayContentInputView
          schema={schema}
          uuid={uuid}
        />
      )
    case 'reference-input':
      return <ContentInputViewReferencedSchema uuid={uuid} />
    default:
      return <UnknownInputView schema={schema} />
  }
})

export type EditorProps = {
  store: ContentStore
  inputStore: InputStore
  schema: Input
  rootUuid: Uuid
}

export const Editor: FunctionComponent<EditorProps> = (props) => {
  const { store, schema, rootUuid, inputStore } = props
  return (
    <ContentYjsStoreContextProvider store={store}>
      <ContentInputYjsStoreContextProvider store={inputStore}>
        <ContentInputView
          schema={schema}
          uuid={rootUuid}
        />
      </ContentInputYjsStoreContextProvider>
    </ContentYjsStoreContextProvider>
  )
}
