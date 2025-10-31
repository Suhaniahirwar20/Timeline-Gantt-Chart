// src/hooks/useDragAndDrop.ts
import { useCallback, useRef } from "react";
import type { PointerSensorProps } from "@dnd-kit/core";


type MoveEnd = { deltaX: number; deltaY: number; taskId: string };
type ResizeEnd = { deltaX: number; taskId: string; edge: "left" | "right" };

export const useDragAndDrop = () => {
  const dragState = useRef<{
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    taskId?: string;
    edge?: "left" | "right" | "body";
  } | null>(null);

  const onPointerDownMove = useCallback(
    (e: React.PointerEvent, taskId: string, startLeftPx: number, startTopPx: number, onMoveUpdate?: (dx:number, dy:number) => void) => {
      (e.target as Element).setPointerCapture(e.pointerId);
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: startLeftPx,
        startTop: startTopPx,
        taskId,
        edge: "body",
      };

      const onPointerMove = (ev: PointerEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;
        onMoveUpdate?.(dx, dy);
      };

      const onPointerUp = (ev: PointerEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;
        const id = dragState.current.taskId!;
        dragState.current = null;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        // bubble event to consumer via DOM? instead we call provided callback on up (see caller)
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    []
  );

  const onPointerDownResize = useCallback(
    (
      e: React.PointerEvent,
      taskId: string,
      edge: "left" | "right",
      onResizeUpdate?: (dx:number) => void
    ) => {
      (e.target as Element).setPointerCapture(e.pointerId);
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: 0,
        startTop: 0,
        taskId,
        edge,
      };

      const onPointerMove = (ev: PointerEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        onResizeUpdate?.(dx);
      };

      const onPointerUp = (ev: PointerEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        const id = dragState.current.taskId!;
        const edgeLocal = dragState.current.edge!;
        dragState.current = null;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        // consumer should handle finalization in onPointerUp handler passed in props
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    []
  );

  return {
    onPointerDownMove,
    onPointerDownResize,
  };
};
