import {
  Cell,
  DxUniverse,
  get_memory,
  instantiate,
} from "../static/rs_lib.generated.js";
import { signal, useComputed } from "@preact/signals";
import { useMeasureWindow } from "../hooks/useMeasureWindow.ts";
import { useDevicePixelRatio } from "../hooks/useGetDevicePixelRatio.ts";
import { useCallback, useEffect, useRef } from "preact/hooks";
interface Props {
  colors: string[];
}

const pxPerCell = 16;
const halfPxPerCell = 6;
const fullCircle = 2 * Math.PI;
const msPerFrame = Math.floor((1 / 60) * 1000);

const mod = signal<null | Awaited<ReturnType<typeof instantiate>>>(null);
const universe = signal<DxUniverse | null>(null);

let timerId = 0;
let frameId = 0;

export default function GameOfLifeCanvas(props: Props) {
  const { width: fullWidth, height: fullHeight } = useMeasureWindow();
  const devicePixelRatio = useDevicePixelRatio();

  useEffect(() => {
    setupUniverse();
  }, [fullWidth.value, fullHeight.value]);

  const width = useComputed(() => Math.floor(fullWidth.value / pxPerCell));
  const height = useComputed(() => Math.floor(fullHeight.value / pxPerCell));

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mapTo = useCallback(
    (num: number) => {
      const cur = props.colors;
      return cur[Math.min(num, cur.length - 1)];
    },
    [props.colors]
  );

  const setupUniverse = useCallback(() => {
    const m = mod.value;
    clearInterval(timerId);
    cancelAnimationFrame(frameId);
    const ctx = canvasRef.current?.getContext("2d");
    if (!m || !ctx) return;

    universe.value = DxUniverse.new(width.peek(), height.peek());
    const ratio = devicePixelRatio.peek();
    ctx.scale(ratio, ratio);

    function draw(ctx: CanvasRenderingContext2D) {
      const cur = universe.value;
      if (!cur || !m) return;

      ctx.fillStyle = props.colors[0];
      ctx.fillRect(0, 0, fullWidth.peek(), fullHeight.peek());

      cur.tick();

      const cellsPtr = cur.cells();
      const cells = new Uint8Array(
        get_memory().buffer,
        cellsPtr,
        width.peek() * height.peek()
      );

      for (let row = 0; row < height.peek(); row += 1) {
        for (let col = 0; col < width.peek(); col += 1) {
          const idx = row * width.peek() + col;
          ctx.fillStyle = mapTo(cells[idx]);

          const x = col * pxPerCell + 1;
          const y = row * pxPerCell + 1;

          ctx.beginPath();
          ctx.arc(
            x + halfPxPerCell,
            y + halfPxPerCell,
            halfPxPerCell,
            0,
            fullCircle
          );
          ctx.fill();
        }
      }

    }

    function renderLoop() {
      if (!ctx) return;
      draw(ctx);
      timerId = setTimeout(() => {
        frameId = requestAnimationFrame(renderLoop);
      }, msPerFrame);
    }

    frameId = requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    instantiate({ url: new URL("rs_lib_bg.wasm", location.origin) }).then(
      (m) => {
        mod.value = m;
        setupUniverse();
      }
    );
    return () => {
      const cur = universe.peek();
      if (cur) {
        cur.free();
      }
      if (timerId) {
        clearTimeout(timerId);
      }

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const onPointerMove = useCallback((event: PointerEvent) => {
    const cur = universe.value;
    if (!cur) return;

    const { offsetX, offsetY } = event;
    const w = Math.floor(offsetY / pxPerCell);
    const h = Math.floor(offsetX / pxPerCell);
    cur.set_cell(w, h, Cell.Alive);
  }, []);

  return (
    <canvas
      class="w-full h-full"
      width={fullWidth.value * devicePixelRatio.value}
      height={fullHeight.value * devicePixelRatio.value}
      ref={canvasRef}
      onPointerMove={onPointerMove}
    />
  );
}
