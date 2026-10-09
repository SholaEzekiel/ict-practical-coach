import type { createUniver, Univer } from "@univerjs/presets";
import { getCoordByOffset, IRenderManagerService, SheetSkeletonManagerService, Vector2 } from "@univerjs/preset-sheets-core";

type SpreadsheetApi = ReturnType<typeof createUniver>["univerAPI"];
type Sheet = NonNullable<ReturnType<SpreadsheetApi["getActiveWorkbook"]>>["getActiveSheet"];
type ResizeTarget = { sheet: ReturnType<Sheet>; axis: "column" | "row"; index: number; size: number; scale: number };

export function attachSpreadsheetGridResizing(univer: Univer, api: SpreadsheetApi, container: HTMLElement) {
  const renders = univer.__getInjector().get(IRenderManagerService);
  let editing = false;
  let drag: (ResizeTarget & { x: number; y: number; pointerId: number }) | null = null;
  let cursorTarget: HTMLCanvasElement | null = null;
  const guide = document.createElement("div");
  guide.style.cssText = "position:fixed;pointer-events:none;background:#0f6f8c;z-index:10000;display:none";
  document.body.appendChild(guide);
  const subscriptions = [
    api.addEvent(api.Event.SheetEditStarted, () => { editing = true; }),
    api.addEvent(api.Event.SheetEditEnded, () => { editing = false; })
  ];

  function clearCursor() {
    if (cursorTarget) cursorTarget.style.removeProperty("cursor");
    cursorTarget = null;
  }

  function hit(event: PointerEvent): ResizeTarget | null {
    if (editing || !(event.target instanceof HTMLCanvasElement)) return null;
    const workbook = api.getActiveWorkbook();
    if (!workbook) return null;
    const render = renders.getRenderById(workbook.getId());
    const skeleton = render?.with(SheetSkeletonManagerService).getCurrentParam()?.skeleton;
    if (!render || !skeleton) return null;
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const cell = getCoordByOffset(x, y, render.scene, skeleton);
    const relative = render.scene.getCoordRelativeToViewport(Vector2.FromArray([x, y]));
    const scroll = render.scene.getScrollXYInfoByViewport(relative);
    const ancestorScale = render.scene.getAncestorScale();
    const point = { x: x / ancestorScale.scaleX + scroll.x, y: y / ancestorScale.scaleY + scroll.y };
    if (point.x < cell.startX || point.y < cell.startY || point.x > cell.endX || point.y > cell.endY) return null;
    const sheet = workbook.getActiveSheet();
    const scale = sheet.getZoom();
    const visible = skeleton.getCellWithCoordByIndex(cell.row, cell.column);
    const edges = [
      { axis: "column" as const, index: cell.column, distance: Math.abs(point.x - visible.endX) },
      { axis: "column" as const, index: cell.column - 1, distance: Math.abs(point.x - visible.startX) },
      { axis: "row" as const, index: cell.row, distance: Math.abs(point.y - visible.endY) },
      { axis: "row" as const, index: cell.row - 1, distance: Math.abs(point.y - visible.startY) }
    ].filter(edge => edge.index >= 0).sort((a, b) => a.distance - b.distance);
    const edge = edges[0];
    if (!edge || edge.distance * scale > 4) return null;
    return { sheet, axis: edge.axis, index: edge.index, scale, size: edge.axis === "column" ? sheet.getColumnWidth(edge.index) : sheet.getRowHeight(edge.index) };
  }

  function move(event: PointerEvent) {
    if (drag) {
      if (event.pointerId !== drag.pointerId) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const bounds = container.getBoundingClientRect();
      Object.assign(guide.style, drag.axis === "column"
        ? { left: event.clientX + "px", top: bounds.top + "px", width: "2px", height: bounds.height + "px" }
        : { left: bounds.left + "px", top: event.clientY + "px", width: bounds.width + "px", height: "2px" });
      guide.style.display = "block";
      return;
    }
    clearCursor();
    if (!container.contains(event.target as Node)) return;
    const target = hit(event);
    if (target) {
      cursorTarget = event.target as HTMLCanvasElement;
      cursorTarget.style.cursor = target.axis === "column" ? "col-resize" : "row-resize";
    }
  }

  function down(event: PointerEvent) {
    if (event.button !== 0) return;
    const target = hit(event);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    drag = { ...target, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    (event.target as HTMLCanvasElement).setPointerCapture(event.pointerId);
  }

  function finish(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const current = drag;
    drag = null;
    guide.style.display = "none";
    clearCursor();
    if (event.type === "pointercancel") return;
    const delta = (current.axis === "column" ? event.clientX - current.x : event.clientY - current.y) / current.scale;
    if (Math.abs(delta) < 1) return;
    const size = Math.round(Math.max(current.axis === "column" ? 24 : 18, current.size + delta));
    if (current.axis === "column") current.sheet.setColumnWidth(current.index, size);
    else current.sheet.setRowHeightsForced(current.index, 1, size);
  }

  container.addEventListener("pointerdown", down, true);
  document.addEventListener("pointermove", move, true);
  document.addEventListener("pointerup", finish, true);
  document.addEventListener("pointercancel", finish, true);
  return () => {
    container.removeEventListener("pointerdown", down, true);
    document.removeEventListener("pointermove", move, true);
    document.removeEventListener("pointerup", finish, true);
    document.removeEventListener("pointercancel", finish, true);
    subscriptions.forEach(subscription => subscription.dispose());
    clearCursor();
    guide.remove();
    drag = null;
  };
}
