import React from 'react';

interface State {
  [eddyId: string]: { [timestamp: string]: EddyElement[] };
}

interface EddyElement {
  child: React.ReactElement;
  enter?: React.CSSProperties;
  exit?: React.CSSProperties;
  from: { height: number; left: number; top: number; width: number };
  selector: string;
  to?: { height: number; left: number; top: number; width: number };
}

type Action =
  | { type: 'exit'; id: string; elements: EddyElement[] }
  | { type: 'enter'; id: string; timestamp: string; elements: EddyElement[] };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'enter':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          [action.timestamp]: [...action.elements],
        },
      };
    case 'exit':
      return {
        ...state,
        [action.id]: { [new Date().getTime()]: [...action.elements] },
      };
    default:
      return state;
  }
}

const defaultState: State = {};
const EddyContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: {}, dispatch: () => {} });

function makeSelector(child: any) {
  return `${child.type}${child.props.id ? `#${child.props.id}` : ''}${
    child.props.className
      ? `.${child.props.className.split(' ').join('.')}`
      : ''
  }`;
}

function convertCSS(properties: React.CSSProperties): string {
  return Object.entries(properties)
    .map(
      ([attr, val]) =>
        `${attr.replace(/([A-Z])/g, '-$1'.toLowerCase())}: ${val};`
    )
    .join('\n');
}

interface EddyProps {
  enter?: React.CSSProperties;
  exit?: React.CSSProperties;
  id: string;
}

export const Eddy: React.FunctionComponent<EddyProps> = ({
  children,
  enter,
  exit,
  id,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { state, dispatch } = React.useContext(EddyContext);

  React.useEffect(() => {
    if (!state[id]) {
      return;
    }

    Object.entries(state[id]).forEach(([timestamp, elements]) => {
      const { current } = ref;
      if (Array.isArray(elements) && current) {
        const newElements = elements
          .map(el => {
            const to = current
              .querySelector(el.selector)
              ?.getBoundingClientRect();
            if (to) {
              return {
                ...el,
                enter,
                to: {
                  height: to.height,
                  left: to.left + window.scrollX,
                  top: to.top + window.scrollY,
                  width: to.width,
                },
              };
            }
            return el;
          })
          .filter(({ to }) => to);
        if (newElements.length) {
          dispatch({ type: 'enter', timestamp, id, elements: newElements });
        }
      }
    });

    return () => {
      const { current } = ref;
      if (current) {
        const elements = React.Children.map(children, child => {
          const selector = makeSelector(child);
          const from = current
            .querySelector<HTMLElement>(selector)
            ?.getBoundingClientRect();
          return {
            child,
            enter,
            exit,
            from: {
              height: from ? from.height : 0,
              left: from ? from.left + window.scrollX : 0,
              top: from ? from.top + window.scrollY : 0,
              width: from ? from.width : 0,
            },
            selector,
          };
        }) as EddyElement[];
        dispatch({ type: 'exit', id, elements });
      }
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};

export const Provider: React.FunctionComponent = ({ children, ...rest }) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  return (
    <EddyContext.Provider value={{ state, dispatch }}>
      {children}
      {Object.entries(state).map(([id, queue]) =>
        Object.entries(queue).map(([timestamp, elements], i) => {
          const eddyId = `eddy-${id}-${timestamp}-${i}`;
          const animationName = `${eddyId}-keyframes`;
          return (
            <div key={eddyId} id={eddyId} {...rest}>
              {elements.map(({ child, enter, exit, from, selector, to }) =>
                to
                  ? [
                      <style
                        type="text/css"
                        dangerouslySetInnerHTML={{
                          __html: `
@keyframes ${animationName} {
  from {
    height: ${from.height}px;
    left: ${from.left + window.scrollX}px;
    opacity: 1;
    top: ${from.top + window.scrollY}px;
    width: ${from.width}px;${exit ? convertCSS(exit) : ''}
  }
}

#${eddyId} ${selector} {
  animation-duration: 1000ms;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  animation-name: ${animationName};
  height: ${to.width}px;
  left: ${to.left + window.scrollX}px;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: opacity 500ms linear 1000ms, visibility 0ms 1500ms;
  top: ${to.top + window.scrollY}px;
  width: ${to.width}px;${enter ? convertCSS(enter) : ''}
  z-index: 20;
}
`,
                        }}
                      />,
                      React.cloneElement(child),
                    ]
                  : null
              )}
            </div>
          );
        })
      )}
    </EddyContext.Provider>
  );
};
