<!-- Converted from workspace-app.jsx: TeamCanvasView — the team editor: divisions and their teams on a
     canvas, a side panel for the selected node (or a summary when none is), and drag-to-connect: drag a
     team's handle onto a division (or a division's onto a team) to connect it; moving a team that already has
     a division asks first.
     Converted for its wizard mode, which the Add Store wizard's Divisions & Teams step uses (structure only;
     the prototype keeps branding, codes and rosters out of setup). Not converted yet — a store's My Team(s)
     tab, the rest of this editor: brand colors (CanvasSwatches), division and team codes (CanvasCopyCode),
     Order Fulfillment and Team Manager (managerGated), Open Roster, the Roster Bank (BankZone) and the
     products: chips on team nodes, the Products tab (CpPanelTabs, CpDivisionPanel, CpTeamPanel), the catalog
     drawer (CpCatalogDrawer) and the product detail pop-up (ProductDetailPage). Where the two modes differ
     only in text, both texts are kept. All props stay declared. -->
<template>
  <div class="wx-team-canvas">
    <div class="wx-team-canvas__head">
      <div class="wx-team-canvas__head-text">
        <div class="wx-team-canvas__eyebrow">{{ wizard ? "League Structure" : "My Teams" }}</div>
        <div class="wx-team-canvas__stats">{{ stats.totalGroups }} {{ stats.totalGroups === 1 ? "division" : "divisions" }} · {{ stats.totalRosters }} {{ stats.totalRosters === 1 ? "team" : "teams" }}<template v-if="!wizard"> · {{ stats.totalPlayers }} players</template></div>
      </div>
      <Button variant="secondary" :onClick="() => addTeam(null)"><IconPlus :size="14" :style="{ strokeWidth: 2.4 }" /> New Team</Button>
      <Button variant="primary" :onClick="addParent"><IconPlus :size="14" :style="{ strokeWidth: 2.4 }" /> New Division</Button>
    </div>
    <div class="wx-team-canvas__layout">
      <div class="wx-team-canvas__main">
        <div ref="board" @click="sel = null" class="wx-team-canvas__board">
          <div v-if="empty" class="wx-team-canvas__empty">
            <div class="wx-team-canvas__empty-title">Lay out your league</div>
            <div class="wx-team-canvas__empty-text">{{ wizard
              ? "Divisions group teams into age brackets, regions, or clubs; teams are what rosters and orders attach to. Setting them up now is optional — add divisions and teams anytime from the My Team(s) tab."
              : "Add a division, hang teams beneath it, and connect them by dragging. Rosters are optional — teams can fill in from orders after launch. Team Required and Team Supplied products stay locked until at least one team or division exists." }}</div>
            <Button variant="primary" :onClick="addParent"><IconPlus :size="14" :style="{ strokeWidth: 2.4 }" /> New Division</Button>
          </div>
          <div v-else class="wx-team-canvas__columns">
            <div v-for="g in groups" :key="g.id" class="wx-team-canvas__column">
              <CanvasParentNode :g="g" :sel="sel" :drag="drag" :nodeRefs="nodeRefs" :prodCount="null" :onSelect="() => selectNode({ kind: 'parent', id: g.id })" :onAddTeam="() => addTeam(g.id)" :onHandleDown="(e) => startDrag({ kind: 'parent', id: g.id }, e)" />
              <div class="wx-team-canvas__column-teams">
                <CanvasTeamNode v-for="t in g.rosters" :key="t.id" :t="t" :parent="g" rail :sel="sel" :drag="drag" :nodeRefs="nodeRefs" :bankCount="bankCount(t.id)" :prods="null" :store="store" :onSelect="() => selectNode({ kind: 'team', id: t.id })" :onHandleDown="(e) => startDrag({ kind: 'team', id: t.id }, e)" />
                <CanvasAddTeamTile :rail="true" :onAdd="() => addTeam(g.id)" />
              </div>
            </div>
            <div v-if="loose.length > 0" class="wx-team-canvas__column">
              <div class="wx-team-canvas__unassigned">
                <div class="wx-team-canvas__unassigned-title">Unassigned Teams</div>
                <CanvasTeamNode v-for="t in loose" :key="t.id" :t="t" :parent="null" :rail="false" :sel="sel" :drag="drag" :nodeRefs="nodeRefs" :bankCount="bankCount(t.id)" :prods="null" :store="store" :onSelect="() => selectNode({ kind: 'team', id: t.id })" :onHandleDown="(e) => startDrag({ kind: 'team', id: t.id }, e)" />
                <div class="wx-team-canvas__unassigned-hint">Drag a team's handle onto a division to connect it.</div>
              </div>
            </div>
          </div>
          <svg v-if="drag" class="wx-team-canvas__drag-line" :style="{ width: px(boardSize().w), height: px(boardSize().h) }">
            <line :x1="drag.x1" :y1="drag.y1" :x2="drag.x2" :y2="drag.y2" stroke="#0e0e10" stroke-width="2" stroke-dasharray="7 5" stroke-linecap="round" />
            <circle :cx="drag.x2" :cy="drag.y2" r="5" :fill="drag.over ? '#1f9d55' : '#0e0e10'" />
          </svg>
        </div>
      </div>
      <div class="wx-team-canvas__panel">
        <template v-if="selParent">
          <div class="wx-team-canvas__panel-head">
            <span class="wx-team-canvas__panel-avatar" :style="{ background: selParent.color }">{{ rInitials(selParent.name) }}</span>
            <div class="wx-team-canvas__panel-title">
              <div class="wx-team-canvas__panel-kind">Division</div>
              <div class="wx-team-canvas__panel-name">{{ selParent.name }}</div>
            </div>
          </div>
          <CanvasPanelField label="Division / Region Name">
            <input :value="selParent.name" v-controlled="selParent.name" @input="(e) => patchParent(selParent.id, { name: e.target.value })" class="wx-team-canvas__input" />
          </CanvasPanelField>
          <CanvasPanelField label="Sport">
            <SelectField :value="selParent.sport || ''" placeholder="Select a sport" :onChange="(v) => patchParent(selParent.id, { sport: v })" :options="WIZARD_SPORTS.map((s) => ({ value: s, label: s }))" />
          </CanvasPanelField>
          <CanvasPanelField :label="`Teams · ${selParent.rosters.length}`">
            <Button variant="secondary" :onClick="() => addTeam(selParent.id)"><IconPlus :size="13" :style="{ strokeWidth: 2.4 }" /> Add Team</Button>
          </CanvasPanelField>
          <div class="wx-team-canvas__danger-zone">
            <button type="button" class="wx-team-canvas__danger-btn" @click="deleteDivisionClick(selParent)"><IconTrash :size="13" :style="{ strokeWidth: 2 }" /> Delete Division</button>
            <div v-if="selParent.rosters.length > 0 && !wizard" class="wx-team-canvas__note">Blocked while teams are connected — delete or move them first.</div>
            <div v-if="selParent.rosters.length > 0 && wizard" class="wx-team-canvas__note">Its teams aren't deleted — they're kept as standalone teams.</div>
          </div>
        </template>
        <template v-else-if="selTeam">
          <div class="wx-team-canvas__panel-head">
            <span class="wx-team-canvas__panel-badge" :style="{ background: rTint(selTeamColor, 0.14), color: selTeamColor }">{{ selTeam.team.division || rInitials(selTeam.team.name) }}</span>
            <div class="wx-team-canvas__panel-title">
              <div class="wx-team-canvas__panel-kind">Team</div>
              <div class="wx-team-canvas__panel-name">{{ selTeam.team.name }}</div>
            </div>
          </div>
          <CanvasPanelField label="Team Name">
            <input :value="selTeam.team.name" v-controlled="selTeam.team.name" @input="(e) => patchTeam(selTeam.team.id, { name: e.target.value })" class="wx-team-canvas__input" />
          </CanvasPanelField>
          <CanvasPanelField label="Division">
            <div :class="`wx-team-canvas__division${selTeam.parent ? ' wx-team-canvas__division--assigned' : ''}`">{{ selTeam.parent ? selTeam.parent.name : "Unassigned" }}</div>
            <div class="wx-team-canvas__division-note">{{ selTeam.parent ? "Drag this team's handle to another division to move it." : "Drag this team's handle to a division node to connect it." }}</div>
          </CanvasPanelField>
          <CanvasPanelField v-if="wizard" label="Roster">
            <div class="wx-team-canvas__roster-note">Rosters aren't entered during setup — they're optional and fill in later from the My Team(s) tab or from orders.</div>
          </CanvasPanelField>
          <div class="wx-team-canvas__danger-zone">
            <button type="button" class="wx-team-canvas__danger-btn" @click="confirm = { type: 'delete-team', tid: selTeam.team.id, name: selTeam.team.name }"><IconTrash :size="13" :style="{ strokeWidth: 2 }" /> Delete Team</button>
          </div>
        </template>
        <template v-else>
          <div class="wx-team-canvas__summary-title">League Structure</div>
          <div v-for="[l, v] in [['Divisions', stats.totalGroups], ['Teams', stats.totalRosters], ['Players', stats.totalPlayers]]" :key="l" class="wx-team-canvas__summary-row">
            <span class="wx-team-canvas__summary-label">{{ l }}</span>
            <span class="wx-team-canvas__summary-value">{{ v }}</span>
          </div>
          <div class="wx-team-canvas__summary-help">Select a node to edit its settings. Drag a connection handle — the dot on a node's edge — to connect a team to a division.</div>
          <div class="wx-team-canvas__summary-tip">{{ wizard
            ? "This step is optional — Next is never blocked. Rosters aren't entered here; they fill in later from the My Team(s) tab or from orders."
            : "Rosters are optional. Launch with empty teams and let them fill in from team-gear orders — the Roster Bank collects checkout captures for review." }}</div>
        </template>
      </div>
    </div>
    <CanvasConfirmModal :confirm="confirm" :onClose="() => confirm = null" :onConfirm="doConfirm" />
  </div>
</template>

<script>
import { ROSTER_BRAND_COLORS } from '../../data/rosters.js';
import { WIZARD_SPORTS } from '../../data/wizard.js';
import { rInitials, rTint } from '../../lib/rosters.js';
import { px } from '../../lib/style.js';
import Button from '../common/Button.vue';
import SelectField from '../common/SelectField.vue';
import { IconPlus, IconTrash } from '../icons.js';
import CanvasAddTeamTile from './CanvasAddTeamTile.vue';
import CanvasConfirmModal from './CanvasConfirmModal.vue';
import CanvasPanelField from './CanvasPanelField.vue';
import CanvasParentNode from './CanvasParentNode.vue';
import CanvasTeamNode from './CanvasTeamNode.vue';

export default {
  name: 'TeamCanvasView',
  components: { Button, CanvasAddTeamTile, CanvasConfirmModal, CanvasPanelField, CanvasParentNode, CanvasTeamNode, IconPlus, IconTrash, SelectField },
  props: {
    groups: { type: Array, default: undefined },
    loose: { type: Array, default: undefined },
    org: { type: Object, default: undefined },
    setOrg: { type: Function, default: undefined },
    store: { type: Object, default: undefined },
    managerGated: { type: Boolean, default: undefined },
    onManageManagers: { type: Function, default: undefined },
    stats: { type: Object, default: undefined },
    onOpenRoster: { type: Function, default: undefined },
    setToast: { type: Function, default: undefined },
    wizard: { type: Boolean, default: undefined },
    onCustomize: { type: Function, default: undefined },
    onProductsChange: { type: Function, default: undefined },
  },
  data() {
    return {
      sel: null, // {kind:'parent'|'team', id}
      drag: null, // {from:{kind,id}, x1,y1,x2,y2, over}
      confirm: null,
      panelTab: "setup",
      WIZARD_SPORTS,
    };
  },
  computed: {
    selParent() { const { sel } = this; return sel && sel.kind === "parent" ? this.groups.find((g) => g.id === sel.id) : null; },
    selTeam() { const { sel } = this; return sel && sel.kind === "team" ? this.findTeam(sel.id) : null; },
    selTeamColor() { const { team: t, parent: p } = this.selTeam; return t.colorOverride || (p && p.color) || "#3f3f46"; },
    // Store-wide bank-zone rollup: badge team nodes.
    bank() { return (this.org && this.org.bank) || {}; },
    empty() { return this.groups.length === 0 && this.loose.length === 0; },
    dragging() { return !!this.drag; },
  },
  watch: {
    // React: useEffect on [!!drag] — while dragging, window pointer moves and the release drive the drag.
    dragging(on) {
      this.unlisten();
      if (on) this.listen();
    },
  },
  created() {
    // React: useRef({}) — the node elements by key ("p:<id>", "t:<id>"), set by the nodes' refs.
    this.nodeRefs = { current: {} };
  },
  beforeUnmount() {
    this.unlisten();
  },
  methods: {
    px,
    rInitials,
    rTint,
    // The canvas's scroll size, read on every render (0 before it exists), for the dragged line.
    boardSize() { const el = this.$refs.board; return { w: el ? el.scrollWidth : 0, h: el ? el.scrollHeight : 0 }; },
    setGroups(fn) { this.setOrg((o) => ({ ...o, groups: typeof fn === "function" ? fn(o.groups) : fn })); },
    setLoose(fn) { this.setOrg((o) => ({ ...o, loose: typeof fn === "function" ? fn(o.loose) : fn })); },
    findTeam(tid) {
      for (const g of this.groups) { const r = g.rosters.find((x) => x.id === tid); if (r) return { team: r, parent: g }; }
      const r = this.loose.find((x) => x.id === tid); return r ? { team: r, parent: null } : null;
    },
    selectNode(s) { this.sel = s; this.panelTab = "setup"; },
    bankCount(tid) { return (this.bank[tid] || []).filter((c) => !c.committed).length; },
    addParent() {
      const { groups } = this;
      const used = groups.map((g) => g.color);
      const color = ROSTER_BRAND_COLORS.find((c) => !used.includes(c)) || ROSTER_BRAND_COLORS[groups.length % ROSTER_BRAND_COLORS.length];
      const g = { id: "grp-" + Date.now(), name: "New Division", sport: "Boys Basketball", color, rosters: [] };
      this.setGroups((cur) => [...cur, g]);
      this.sel = { kind: "parent", id: g.id };
    },
    addTeam(gid) {
      const t = { id: "ros-" + Date.now(), name: "New Team", players: 0 };
      if (gid) this.setGroups((cur) => cur.map((g) => g.id === gid ? { ...g, rosters: [...g.rosters, t] } : g));
      else this.setLoose((cur) => [...cur, t]);
      this.sel = { kind: "team", id: t.id };
    },
    patchParent(gid, patch) { this.setGroups((cur) => cur.map((g) => g.id === gid ? { ...g, ...patch } : g)); },
    patchTeam(tid, patch) {
      this.setGroups((cur) => cur.map((g) => ({ ...g, rosters: g.rosters.map((r) => r.id === tid ? { ...r, ...patch } : r) })));
      this.setLoose((cur) => cur.map((r) => r.id === tid ? { ...r, ...patch } : r));
    },
    moveTeam(tid, toGid) {
      this.setOrg((o) => {
        let team = o.loose.find((r) => r.id === tid) || null;
        const gs = o.groups.map((g) => {
          const hit = g.rosters.find((r) => r.id === tid);
          if (hit) team = hit;
          return { ...g, rosters: g.rosters.filter((r) => r.id !== tid) };
        });
        const ls = o.loose.filter((r) => r.id !== tid);
        if (!team) return o;
        const clean = { ...team };
        if (toGid) return { ...o, groups: gs.map((g) => g.id === toGid ? { ...g, rosters: [...g.rosters, clean] } : g), loose: ls };
        return { ...o, groups: gs, loose: [...ls, clean] };
      });
    },
    deleteTeam(tid) {
      this.setOrg((o) => ({ ...o,
        groups: o.groups.map((g) => ({ ...g, rosters: g.rosters.filter((r) => r.id !== tid) })),
        loose: o.loose.filter((r) => r.id !== tid) }));
      const s = this.sel; this.sel = s && s.kind === "team" && s.id === tid ? null : s;
      this.setToast("Team deleted");
    },
    deleteParent(gid) {
      this.setGroups((cur) => cur.filter((g) => g.id !== gid));
      const s = this.sel; this.sel = s && s.kind === "parent" && s.id === gid ? null : s;
      this.setToast("Division deleted");
    },
    deleteDivisionClick(g) {
      if (g.rosters.length > 0) {
        this.confirm = this.wizard
          ? { type: "delete-parent-rehome", gid: g.id, name: g.name, count: g.rosters.length }
          : { type: "blocked-parent", name: g.name, count: g.rosters.length };
      } else this.confirm = { type: "delete-parent", gid: g.id, name: g.name };
    },
    doConfirm() {
      const c = this.confirm; this.confirm = null;
      if (!c) return;
      if (c.type === "reparent") { this.moveTeam(c.tid, c.toGid); this.setToast(`Moved to ${c.toName}`); }
      else if (c.type === "delete-team") this.deleteTeam(c.tid);
      else if (c.type === "delete-parent") this.deleteParent(c.gid);
      else if (c.type === "delete-parent-rehome") {
        // Wizard context: deleting a division re-homes its teams as standalone.
        this.setOrg((o) => {
          const g = o.groups.find((x) => x.id === c.gid);
          const freed = g ? g.rosters.map((r) => ({ ...r })) : [];
          return { ...o, groups: o.groups.filter((x) => x.id !== c.gid), loose: [...o.loose, ...freed] };
        });
        const s = this.sel; this.sel = s && s.kind === "parent" && s.id === c.gid ? null : s;
        this.setToast(c.count ? "Division deleted — " + c.count + (c.count === 1 ? " team" : " teams") + " kept as standalone" : "Division deleted");
      }
    },

    // ── drag-to-connect ──
    relPoint(e) {
      const el = this.$refs.board; if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left + el.scrollLeft, y: e.clientY - r.top + el.scrollTop };
    },
    startDrag(from, e) {
      e.preventDefault(); e.stopPropagation();
      const p = this.relPoint(e);
      this.drag = { from, x1: p.x, y1: p.y, x2: p.x, y2: p.y, over: null };
    },
    listen() {
      this.onMove = (e) => {
        const d = this.drag; if (!d) return;
        const p = this.relPoint(e);
        let over = null;
        const wrap = this.$refs.board;
        Object.entries(this.nodeRefs.current).forEach(([key, el]) => {
          if (!el || !wrap) return;
          const from = d.from;
          let valid;
          if (from.kind === "prod") {
            valid = key.startsWith("t:") || key.startsWith("p:");
          } else if (from.kind === "parent") {
            const g = this.groups.find((x) => x.id === from.id);
            valid = key.startsWith("t:") && !(g && g.rosters.some((r) => "t:" + r.id === key));
          } else {
            const cur = this.findTeam(from.id);
            valid = key.startsWith("p:") && key !== "p:" + ((cur && cur.parent && cur.parent.id) || "");
          }
          if (!valid) return;
          const a = el.getBoundingClientRect(), b = wrap.getBoundingClientRect();
          const x = a.left - b.left + wrap.scrollLeft, y = a.top - b.top + wrap.scrollTop;
          if (p.x >= x && p.x <= x + a.width && p.y >= y && p.y <= y + a.height) over = key;
        });
        const dd = this.drag; this.drag = dd ? { ...dd, x2: p.x, y2: p.y, over } : dd;
      };
      this.onUp = () => {
        const d = this.drag;
        if (d && d.over) {
          // Products are dragged only on a store's My Team(s) tab (not converted yet).
          let tid, toGid;
          if (d.from.kind === "parent") { tid = d.over.slice(2); toGid = d.from.id; }
          else { tid = d.from.id; toGid = d.over.slice(2); }
          const cur = this.findTeam(tid);
          const target = this.groups.find((g) => g.id === toGid) || {};
          if (cur && cur.parent && cur.parent.id !== toGid) {
            this.confirm = { type: "reparent", tid, teamName: cur.team.name, fromName: cur.parent.name, toGid, toName: target.name };
          } else if (cur && !cur.parent) {
            this.moveTeam(tid, toGid);
            this.setToast(`Connected to ${target.name}`);
          }
        }
        this.drag = null;
      };
      window.addEventListener("pointermove", this.onMove);
      window.addEventListener("pointerup", this.onUp);
    },
    unlisten() {
      if (this.onMove) window.removeEventListener("pointermove", this.onMove);
      if (this.onUp) window.removeEventListener("pointerup", this.onUp);
      this.onMove = null; this.onUp = null;
    },
  },
};
</script>
