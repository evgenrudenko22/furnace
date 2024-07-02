export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
    key: props?.key || null,
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

function updateDom(dom, prevProps, nextProps) {
  const isEvent = name => name.startsWith("on");
  const isAttribute = name => !isEvent(name) && name !== "children" && name !== "style" && name !== "className";

  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  // Remove old attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = null;
    });

  // Set new or changed attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Set styles
  if (prevProps.style) {
    Object.keys(prevProps.style).forEach(key => {
      dom.style[key] = "";
    });
  }

  if (nextProps.style) {
    Object.keys(nextProps.style).forEach(key => {
      dom.style[key] = nextProps.style[key];
    });
  }

  // Set class names
  if (prevProps.className) {
    dom.className = '';
  }

  if (nextProps.className) {
    dom.className = nextProps.className;
  }
}

function isClassComponent(component) {
  return component.prototype && component.prototype.isReactComponent;
}

function renderElement(element, parentDom) {
  if (typeof element.type === "function") {
    if (isClassComponent(element.type)) {
      const component = new element.type(element.props);
      component._internalInstance = { update: () => renderComponent(component, parentDom) };
      renderComponent(component, parentDom);
    } else {
      const childElement = element.type(element.props);
      renderElement(childElement, parentDom);
    }
  } else {
    const dom = createDom(element);
    element.props.children.forEach(child => renderElement(child, dom));
    parentDom.appendChild(dom);
  }
}

function renderComponent(component, parentDom) {
  component._setParentDom(parentDom);
  const renderedElement = component.render();
  parentDom.innerHTML = '';
  renderElement(renderedElement, parentDom);
}

export function render(element, container) {
  container.innerHTML = '';
  renderElement(element, container);
}
