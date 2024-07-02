export class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this._internalInstance = null;
    this._parentDom = null;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this._internalInstance.update();
  }

  _setParentDom(dom) {
    this._parentDom = dom;
  }
}
Component.prototype.isReactComponent = {};
