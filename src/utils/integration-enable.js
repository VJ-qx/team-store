// First import of the integrated entry (src/workspace-integrated-main.js): turns the integration flag
// on before the data modules evaluate, so their module-level values are the integrated ones.
import { INTEGRATION } from './integration.js';

INTEGRATION.on = true;
