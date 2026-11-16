<!-- Converted from workspace-app.jsx: AnnouncementEditor — the Announcement Message rich-text box (bold,
     italic, lists; Link is shown disabled), with a character count. The prototype's tbtn() helper is
     expanded in place for each toolbar button. While it isn't focused, the box shows the value it's given. -->
<template>
  <div>
    <div :class="`wx-announce-editor__box${focus ? ' wx-announce-editor__box--focus' : ''}`">
      <div class="wx-announce-editor__toolbar">
        <button type="button" title="Bold" @mousedown="(e) => { e.preventDefault(); exec('bold'); }" class="wx-announce-editor__tool" @mouseenter="(e) => e.currentTarget.style.background = '#ececf0'" @mouseleave="(e) => e.currentTarget.style.background = 'transparent'"><span class="wx-announce-editor__bold">B</span></button>
        <button type="button" title="Italic" @mousedown="(e) => { e.preventDefault(); exec('italic'); }" class="wx-announce-editor__tool" @mouseenter="(e) => e.currentTarget.style.background = '#ececf0'" @mouseleave="(e) => e.currentTarget.style.background = 'transparent'"><span class="wx-announce-editor__italic">I</span></button>
        <span class="wx-announce-editor__divider" />
        <button type="button" title="Bulleted list" @mousedown="(e) => { e.preventDefault(); exec('insertUnorderedList'); }" class="wx-announce-editor__tool" @mouseenter="(e) => e.currentTarget.style.background = '#ececf0'" @mouseleave="(e) => e.currentTarget.style.background = 'transparent'">• List</button>
        <button type="button" title="Numbered list" @mousedown="(e) => { e.preventDefault(); exec('insertOrderedList'); }" class="wx-announce-editor__tool" @mouseenter="(e) => e.currentTarget.style.background = '#ececf0'" @mouseleave="(e) => e.currentTarget.style.background = 'transparent'">1. List</button>
        <span class="wx-announce-editor__toolbar-end">
          <button type="button" title="Links are an open spec decision — not enabled yet" class="wx-announce-editor__link"><CzIconLink /> Link</button>
        </span>
      </div>
      <div class="wx-announce-editor__area">
        <div v-if="empty && !focus" class="wx-announce-editor__placeholder">{{ ANN_PLACEHOLDER }}</div>
        <component :is="'style'">{{ css }}</component>
        <div ref="editor" contenteditable="true" @input="input" @focus="() => setFocus(true)" @blur="() => { setFocus(false); input(); }" class="cz-edit wx-announce-editor__input" :style="{ minHeight: px(minHeight) }" />
      </div>
    </div>
    <div class="wx-announce-editor__meta">
      <span class="wx-announce-editor__count">{{ chars }} characters</span>
    </div>
  </div>
</template>

<script>
import { ANN_PLACEHOLDER } from '../../data/wizard.js';
import { annIsEmpty, annPlain } from '../../lib/wizard.js';
import { px } from '../../lib/style.js';
import CzIconLink from './CzIconLink.vue';

const CSS = ".cz-edit p{margin:0 0 8px}.cz-edit ul,.cz-edit ol{margin:6px 0 8px;padding-left:22px}.cz-edit li{margin:3px 0}.cz-edit:focus{outline:none}";

export default {
  name: 'AnnouncementEditor',
  components: { CzIconLink },
  props: {
    value: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
    accent: { type: String, default: "#e1251b" },
    minHeight: { type: Number, default: 128 },
  },
  data() {
    return { focus: false, css: CSS, ANN_PLACEHOLDER };
  },
  computed: {
    empty() { return annIsEmpty(this.value); },
    chars() { return annPlain(this.value).length; },
  },
  watch: {
    // React: useEffect on [value, focus] (it also runs once after mount: see mounted).
    value() { this.sync(); },
    focus() { this.sync(); },
  },
  mounted() {
    this.sync();
  },
  methods: {
    px,
    sync() {
      const el = this.$refs.editor;
      if (el && !this.focus && el.innerHTML !== (this.value || "")) el.innerHTML = this.value || "";
    },
    setFocus(v) { this.focus = v; },
    input() { if (this.$refs.editor) this.onChange(this.$refs.editor.innerHTML); },
    exec(cmd) { if (this.$refs.editor) this.$refs.editor.focus(); document.execCommand(cmd); this.input(); },
  },
};
</script>
