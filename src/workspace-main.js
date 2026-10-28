// Entry point for the Vue workspace (workspace.html), converted from "Workspace.dc.html".
import { createApp } from 'vue';
import '../styles/workspace.scss';
import WorkspacePage from './pages/WorkspacePage.vue';
import { autofocus, controlled, patchStyle } from './utils/directives.js';

createApp(WorkspacePage)
  .directive('patch-style', patchStyle)
  .directive('autofocus', autofocus)
  .directive('controlled', controlled)
  .mount('#app');
