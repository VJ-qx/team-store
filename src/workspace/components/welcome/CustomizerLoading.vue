<!-- Approved change, not in the prototype yet: Customizer loading screen (docs/README.md#approved-changes).
     Design: docs/approved-changes/customizer-loading-screen.png ("G-2 · Option 1: Full-page loading screen").
     What shows under the Team Stores top bar when the workspace opens from a Customizer, before the Overview:
     the spinner and the words of the landing page's "You're signed in" card. WorkspacePage renders the top bar
     and decides how long this shows (lib/customizer-entry.js). -->
<template>
  <div class="wx-customizer-loading__body" role="status" aria-live="polite">
    <div class="wx-customizer-loading__spinner">
      <span class="wx-customizer-loading__track"></span>
      <span class="wx-customizer-loading__arc"></span>
    </div>
    <h1 class="wx-customizer-loading__title">You're signed in</h1>
    <p class="wx-customizer-loading__text">Opening your Team Stores dashboard…</p>
  </div>
</template>

<script>
export default {
  name: 'CustomizerLoading',
};
</script>
