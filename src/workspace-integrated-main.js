// Entry point for the integrated Vue workspace (workspace-integrated.html), converted from
// "Marucci Workspace.dc.html". The integration flag must be the first import, so the data modules
// evaluate in integrated mode.
import './utils/integration-enable.js';
import { createApp } from 'vue';
import '../styles/workspace.scss';
import WorkspacePage from './pages/WorkspacePage.vue';
import { autofocus, controlled, patchStyle } from './utils/directives.js';

createApp(WorkspacePage)
  .directive('patch-style', patchStyle)
  .directive('autofocus', autofocus)
  .directive('controlled', controlled)
  .mount('#app');
