# TODO: Nested Parent Nodes + Link Nodes

## Goal

Allow parent nodes inside other parent nodes (nested), and link/reference
other parent nodes from within any parent. Both render as clickable links
that navigate to the target parent's page.

## Data Flow

```
Dashboard (/dashboard)
+-- Parent A (parent_id=NULL)  <-- dashboard card
+-- Parent B (parent_id=NULL)  <-- dashboard card

Inside Parent A (/dashboard/1):
+-- "Buy groceries"            (type=string,      parent_id=1)  <-- content
+-- [ ] Clean house            (type=todo,        parent_id=1)  <-- content
+-- > Parent C                 (type=parent_node, parent_id=1)  <-- nested, renders as link
|   +-- Click --> /dashboard/3
+-- > Link to Parent B         (type=parent_link, parent_id=1, ref_id=2)  <-- link
|   +-- Click --> /dashboard/2
+-- code block                 (type=code,        parent_id=1)  <-- content

Inside Parent C (/dashboard/3):
+-- "Sub task"                 (type=string, parent_id=3)
+-- "Another item"             (type=todo,   parent_id=3)
```

Key insight: Nested parent and link node render identically -- both show as
a link-styled block with an icon + name, clicking navigates away. The only
difference is data: nested parent has type="parent_node" + parent_id=current,
link node has type="parent_link" + ref_id=target.

---

## Phase 1: Database Schema

- [ ] Add ref_id INTEGER column to CREATE TABLE statement
- [ ] Add ON DELETE SET NULL to ref_id FK constraint:
      FOREIGN KEY(ref_id) REFERENCES nodes(id) ON DELETE SET NULL
      When a target parent is deleted, link nodes keep existing but
      ref_id becomes NULL (broken link state in UI)
- [ ] Add startup migration: ALTER TABLE nodes ADD COLUMN ref_id INTEGER
      (handles existing DB; fails silently if column already exists)
- [ ] Fix DEFAULD typo to DEFAULT in CREATE TABLE

**Files:** back-go/internal/models/todoModels.go

---

## Phase 2: Backend Models

- [ ] Add Ref_id sql.NullInt16 field to Nodes struct
- [ ] Update GetNodes SELECT to include ref_id and Scan it
- [ ] Update GetNodes WHERE to exclude nested parents:
      AND (type != 'parent_node' OR type IS NULL)
- [ ] Fix SQL injection in GetNodes -- use ? param instead of fmt.Sprintf
- [ ] Fix SQL injection in GetNodeName -- use ? param instead of fmt.Sprintf
- [ ] Add GetNestedParents(parentId string) -- fetches nested parents for a parent
- [ ] Add GetLinkTargets() -- fetches ALL parent nodes (dashboard + nested) for link picker
- [ ] Update AddNode to accept optional ref_id in INSERT
- [ ] Update PartialNodeUpdate to support updating ref_id

**Files:** back-go/internal/models/todoModels.go

---

## Phase 3: Backend Controllers + Routes

- [ ] Add GetNestedParents controller -- reads :parent_id, calls model
- [ ] Add GetLinkTargets controller -- no params, calls model
- [ ] Add route: nodes.GET("/linkTargets", ...) -- BEFORE :parent_id routes
- [ ] Add route: nodes.GET("/:parent_id/nested", ...)

Delete warning (before deleting a parent, check for incoming links):
- [ ] Add GetIncomingLinks(targetId string) model function:
      SELECT id, data FROM nodes WHERE ref_id = ? AND type = 'parent_link'
- [ ] Add GetIncomingLinks controller -- reads :id, returns count + list
- [ ] Add route: nodes.GET("/incomingLinks/:id", controllers.GetIncomingLinks)
- [ ] Frontend calls this before showing delete confirmation:
      "X link(s) reference this page -- they will become broken. Delete anyway?"

**Files:**
- back-go/internal/controllers/todoControllers.go
- back-go/internal/routes/todoRoutes.go

---

## Phase 4: Frontend Types

- [ ] Add NestedParentNode type (type: "parent_node", has ref_id optional)
- [ ] Add ParentLinkNode type (type: "parent_link", has ref_id)
- [ ] Update ProjectNode union to include both new types
- [ ] Add ref_id?: number to DBNode
- [ ] Add Ref_id?: { Int16: number, Valid: boolean } to DataFetchedType

**Files:** front-web/src/pages/Dashboard/nodes/types.ts

---

## Phase 5: Frontend Icons

- [ ] Add LinkIcon -- chain-link SVG (for link nodes)
- [ ] Add NestedParentIcon -- sub-page/folder SVG (for nested parent cards)

**Files:** front-web/src/assets/icons.tsx

---

## Phase 6: Frontend API Functions

- [ ] Add fetchNestedParents(parentId) -- GET /api/v1/nodes/:parentId/nested
- [ ] Add fetchLinkTargets() -- GET /api/v1/nodes/linkTargets
- [ ] Add fetchIncomingLinks(nodeId) -- GET /api/v1/nodes/incomingLinks/:nodeId
      Returns { count: number, links: [{ id, data }] }
- [ ] Update fetchAddNode signature to accept optional Ref_id

**Files:** front-web/src/components/fetchData.tsx

---

## Phase 7: Frontend Node Component

- [ ] Create NodeParentLink component (new file)
- [ ] Renders as link-styled block: icon + target parent name
- [ ] Fetches target name via fetchGetNodeName(ref_id) on mount
- [ ] Click navigates to /dashboard/:ref_id
- [ ] Different background color (blue/indigo tint) to distinguish from content

Broken link handling (ref_id is NULL after target was deleted):
- [ ] Detect broken link: ref_id is null/undefined/0
- [ ] Show broken link visual state: gray/dimmed background, broken chain icon
- [ ] Display text: "deleted page" or "target not found"
- [ ] Allow user to delete the broken link node (no navigation on click)
- [ ] Option to re-point: clicking the link node opens a link picker
      to choose a new target (sets ref_id)

**Files:** front-web/src/pages/Dashboard/nodes/nodeComp_parentLink.tsx (new)

---

## Phase 8: Frontend Dropdown

- [ ] Add "nested parent" option: icon, text "sub-page", creates type "parent_node"
- [ ] Add "link" option: icon, text "reference another page", creates type "parent_link"
- [ ] Link option opens a link picker (list of all parent targets from fetchLinkTargets)
- [ ] User selects target, sets ref_id on the node

**Files:** front-web/src/pages/Dashboard/nodes/dropdown.tsx

---

## Phase 9: Frontend DashboardElement Integration

- [ ] Fetch nested parents on mount via fetchNestedParents(project_id)
- [ ] Store nested parents in separate state array
- [ ] Render nested parents as clickable link cards above content nodes
- [ ] Update mapFetchedDataToNode to handle ref_id mapping
- [ ] Add NodeParentLink to the ProjectNode type switch in DashboardElement

Delete warning in DashboardMain (parent cards on dashboard):
- [ ] Before showing delete confirmation, call fetchIncomingLinks(parentId)
- [ ] If count > 0, show warning: "X link(s) reference this page -- they will become broken"
- [ ] User confirms delete anyway -- proceeds with deletion, links become broken

**Files:** front-web/src/pages/Dashboard/DashboardElement.tsx
         front-web/src/pages/Dashboard/DashboardMain.tsx

---

## Phase 10: Cleanup + Verification

- [ ] Test: create nested parent inside a parent, verify it shows as link
- [ ] Test: click nested parent link, verify navigation to correct page
- [ ] Test: create link node referencing a dashboard parent, verify navigation
- [ ] Test: create link node referencing a nested parent, verify navigation
- [ ] Test: delete a parent that has nested parents (cascade works)
- [ ] Test: delete a parent that is referenced by link nodes:
      - Verify warning shows "X link(s) reference this page"
      - Confirm delete: link nodes become broken (ref_id = NULL)
      - Verify broken link UI: gray, "deleted page" text, no navigation
      - Verify user can delete the broken link node
- [ ] Test: drag-and-drop still works for content nodes
- [ ] Test: normalize orden still works for content nodes
- [ ] Verify nested parent cards are NOT mixed into content node drag/sort
- [ ] Verify link picker shows all parent nodes (dashboard + nested)
- [ ] Test: re-point a broken link to a new target via link picker

---

## Bug Fixes (while we are here)

- [ ] Fix SQL injection in GetNodes and GetNodeName (Phase 2)
- [ ] Fix DEFAULD typo (Phase 1)
- [ ] Fix pointer dereference bug in PartialNodeUpdate for Lang and Orden fields
      (lines 175, 179 append pointer instead of dereferenced value)
