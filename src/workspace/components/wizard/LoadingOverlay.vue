<!-- Converted from workspace-app.jsx: LoadingOverlay — "Creating your store…", shown over the page while a
     new store is created after SAVE AND CONTINUE. Its bounce keyframes are a <style> element that exists
     while it is shown, as in the prototype. -->
<template>
  <div v-if="visible" class="wx-loading">
    <div class="wx-loading__inner">
      <div class="wx-loading__bars">
        <span v-for="i in [0, 1, 2]" :key="i" class="wx-loading__bar" :style="{ animation: `bounce 1.1s ease-in-out ${i * 0.15}s infinite` }" />
      </div>
      <div class="wx-loading__label">Creating your store…</div>
      <component :is="'style'">{{ css }}</component>
    </div>
  </div>
</template>

<script>
const CSS = `
          @keyframes bounce {
            0%, 100% { transform: scaleY(.4); opacity: .5 }
            50% { transform: scaleY(1); opacity: 1 }
          }
        `;

export default {
  name: 'LoadingOverlay',
  props: {
    visible: { type: Boolean, default: undefined },
  },
  data() {
    return { css: CSS };
  },
};
</script>
