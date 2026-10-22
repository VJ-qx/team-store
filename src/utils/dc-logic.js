// Stand-in for the Claude Design runtime's DCLogic base class (support.js), so prototype logic
// classes run unchanged in Vue. Same behaviour as the runtime:
// - setState merges into this.state immediately, so later reads in the same handler see the change.
// - setState takes an object or an updater function (previous state → changes).
// - The optional callback runs after the next render.
import { nextTick } from 'vue';

export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  setState(update, cb) {
    const prev = this.state;
    const patch = typeof update === 'function' ? update(prev) : update;
    this.state = { ...prev, ...patch };
    if (cb) nextTick(cb);
  }

  forceUpdate() {}

  componentDidMount() {}

  componentDidUpdate(_prevProps) {}

  componentWillUnmount() {}

  // The values the template renders against (merged over the settings).
  renderVals() {
    return {};
  }
}
