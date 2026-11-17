<!-- Converted from workspace-app.jsx: CanvasHandle — the dot on a canvas node's edge that is dragged to
     connect a team to a division (bottom of a division, left of a team). Its position and fill stay
     inline, as in the SCSS step (the side comes first, as a spread). -->
<template>
  <span :title="title" @pointerdown="onPointerDown" class="wx-canvas-handle" :style="{ ...(side === 'bottom' ? { bottom: '-7px', left: '50%', transform: 'translateX(-50%)' } : { left: '-7px', top: '50%', transform: 'translateY(-50%)' }), width: '14px', height: '14px', borderRadius: '50%', boxSizing: 'border-box', background: active ? '#0e0e10' : '#fff', border: '2px solid #0e0e10', cursor: 'crosshair', zIndex: 5, touchAction: 'none' }" />
</template>

<script>
export default {
  name: 'CanvasHandle',
  props: {
    side: { type: String, default: undefined },
    active: { type: Boolean, default: undefined },
    title: { type: String, default: undefined },
    onPointerDown: { type: Function, default: undefined },
  },
};
</script>
