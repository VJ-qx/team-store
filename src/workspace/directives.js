// Directives for behaviour React has and Vue's built-ins don't.
import { nextTick } from 'vue';

function setStyle(el, key, value) {
  const v = value == null ? '' : String(value);
  if (key.includes('-')) el.style.setProperty(key, v);
  else el.style[key] = v;
}

// React writes only the style properties whose value changed since the last render; Vue's :style
// writes every property again on each re-render. Where an event handler writes element.style itself
// (hover and focus effects), a re-render would undo the handler's change, so those elements use
// v-patch-style instead of :style.
export const patchStyle = {
  beforeMount(el, { value }) {
    const next = value || {};
    for (const key in next) if (next[key] != null) setStyle(el, key, next[key]);
    el._patchStyle = { ...next };
  },
  updated(el, { value }) {
    const prev = el._patchStyle || {};
    const next = value || {};
    for (const key in prev) if (next[key] == null && prev[key] != null) setStyle(el, key, '');
    for (const key in next) if (next[key] != null && next[key] !== prev[key]) setStyle(el, key, next[key]);
    el._patchStyle = { ...next };
  },
};

// React's autoFocus: focus the element when it mounts (v-autofocus, or v-autofocus="condition").
export const autofocus = {
  mounted(el, { value }) {
    if (value !== false) el.focus();
  },
};

// React's controlled inputs: after every input event the field shows its bound value, even when the
// handler left state unchanged.
export const controlled = {
  mounted(el, { value }) {
    el._boundValue = value;
    el.addEventListener('input', () => nextTick(() => {
      const bound = el._boundValue == null ? '' : String(el._boundValue);
      if (el.value !== bound) el.value = bound;
    }));
  },
  updated(el, { value }) {
    el._boundValue = value;
  },
};
