import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { EditorView } from "@tiptap/pm/view";
import type { Node } from "@tiptap/pm/model";
import {
  estimateNodeHeight,
  FIRST_PAGE_BUDGET,
  SUBSEQUENT_PAGE_BUDGET,
} from "@/lib/page-count";

const pageBreaksKey = new PluginKey("pageBreaks");

const REBUILD_DEBOUNCE = 300;
const SCROLL_DEBOUNCE = 150;
const VIEWPORT_BUFFER = 1500;

interface PageBoundary {
  pos: number;
  pageNum: number;
}

function createBreakElement(pageNum: number): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "page-break-widget";
  wrapper.contentEditable = "false";

  const line = document.createElement("div");
  line.className = "page-break-line";
  wrapper.appendChild(line);

  const badge = document.createElement("span");
  badge.className = "page-break-badge";
  badge.textContent = `Page ${pageNum}`;
  wrapper.appendChild(badge);

  return wrapper;
}

function computeBoundaries(doc: Node): {
  boundaries: PageBoundary[];
  pageCount: number;
} {
  const boundaries: PageBoundary[] = [];
  let usedHeight = 0;
  let pageNum = 1;
  let budget = FIRST_PAGE_BUDGET;

  doc.forEach((node, offset) => {
    const h = estimateNodeHeight(
      node.type.name,
      node.textContent,
      node.attrs as Record<string, unknown>
    );

    usedHeight += h;

    if (usedHeight > budget) {
      pageNum++;
      boundaries.push({ pos: offset, pageNum });
      usedHeight = h;
      budget = SUBSEQUENT_PAGE_BUDGET;
    }
  });

  return { boundaries, pageCount: pageNum };
}

function visibleDecos(
  doc: Node,
  boundaries: PageBoundary[],
  view: EditorView
): DecorationSet {
  if (boundaries.length === 0) return DecorationSet.empty;

  const top = -VIEWPORT_BUFFER;
  const bottom = window.innerHeight + VIEWPORT_BUFFER;

  const widgets: Decoration[] = [];
  for (const b of boundaries) {
    try {
      const coords = view.coordsAtPos(b.pos);
      if (coords.top >= top && coords.top <= bottom) {
        const num = b.pageNum;
        widgets.push(
          Decoration.widget(b.pos, () => createBreakElement(num), {
            side: -1,
          })
        );
      }
    } catch (_) {
      // position not mappable to viewport coords
    }
  }

  return DecorationSet.create(doc, widgets);
}

export const PageBreaks = Extension.create({
  name: "pageBreaks",

  addStorage() {
    return { pageCount: 1 };
  },

  addProseMirrorPlugins() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ext = this;
    let boundaries: PageBoundary[] = [];
    let rebuildTimer: ReturnType<typeof setTimeout> | null = null;

    return [
      new Plugin({
        key: pageBreaksKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, old) {
            const forced = tr.getMeta(pageBreaksKey);
            if (forced) return forced as DecorationSet;
            if (tr.docChanged) return old.map(tr.mapping, tr.doc);
            return old;
          },
        },
        props: {
          decorations(state) {
            return pageBreaksKey.getState(state);
          },
        },
        view(view) {
          function rebuild() {
            const { doc } = view.state;
            const result = computeBoundaries(doc);
            boundaries = result.boundaries;
            ext.storage.pageCount = result.pageCount;
            const decos = visibleDecos(doc, boundaries, view);
            view.dispatch(view.state.tr.setMeta(pageBreaksKey, decos));
          }

          function scheduleRebuild() {
            if (rebuildTimer) clearTimeout(rebuildTimer);
            rebuildTimer = setTimeout(rebuild, REBUILD_DEBOUNCE);
          }

          const initFrame = requestAnimationFrame(rebuild);

          let scrollTimer: ReturnType<typeof setTimeout> | null = null;
          const onScroll = () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
              const decos = visibleDecos(view.state.doc, boundaries, view);
              view.dispatch(view.state.tr.setMeta(pageBreaksKey, decos));
            }, SCROLL_DEBOUNCE);
          };

          window.addEventListener("scroll", onScroll, true);

          return {
            update(_view, prevState) {
              if (!view.state.doc.eq(prevState.doc)) {
                scheduleRebuild();
              }
            },
            destroy() {
              cancelAnimationFrame(initFrame);
              if (rebuildTimer) clearTimeout(rebuildTimer);
              if (scrollTimer) clearTimeout(scrollTimer);
              window.removeEventListener("scroll", onScroll, true);
            },
          };
        },
      }),
    ];
  },
});
