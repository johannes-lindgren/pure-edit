import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export const Scale: FunctionComponent<{
  scale: number
  children: ReactNode
}> = (props) => {
  const { scale, children = [] } = props
  const rootEl = useRef<HTMLDivElement>(null)
  const innerEl = useRef<HTMLDivElement>(null)
  const [rootDim, setRootDim] = useState<{ width?: number; height?: number }>(
    {},
  )
  const [innerDim, setInnerDim] = useState<{ width?: number; height?: number }>(
    {},
  )

  const callback = () => {
    setRootDim({
      width: rootEl.current?.offsetWidth || undefined,
      height: rootEl.current?.offsetHeight || undefined,
    })
    setInnerDim({
      width: innerEl.current?.offsetWidth || undefined,
      height: innerEl.current?.offsetHeight || undefined,
    })
  }

  useLayoutEffect(() => {
    callback()
  }, [])

  useLayoutEffect(() => {
    if (!innerEl.current || !rootEl.current) {
      return
    }

    const handleTransitionEnd = () => {
      callback()
    }

    const resizeObserver = new ResizeObserver(callback)
    callback()

    rootEl.current.addEventListener('transitionend', handleTransitionEnd)

    // Start observing
    resizeObserver.observe(rootEl.current)

    return () => {
      // Cleanup on unmount
      resizeObserver.disconnect()
      rootEl.current?.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [])
  return (
    <div ref={rootEl}>
      <div
        className="root"
        style={{
          height:
            innerDim?.height !== undefined
              ? innerDim.height * scale
              : undefined,
          overflow: 'hidden',
        }}
      >
        <div
          className="inner"
          ref={innerEl}
          style={{
            boxSizing: 'border-box',
            transform: `scale(${scale.toString(10)})`,
            transformOrigin: 'top left',
            width: (rootDim?.width ?? 0) / scale,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
