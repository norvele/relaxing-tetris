import { MutableSchema, Schema } from "@/common";

interface Overlay {
  x: number;
  y: number;
  matrix: Schema;
}

export function sumMatrix(base: Schema, overlay: Overlay) {
  const baseHeight = base.length;
  const baseWidth = base[0].length;
  const baseClone = JSON.parse(JSON.stringify(base)) as MutableSchema;
  overlay.matrix.forEach((schemaRow, schemaY) => {
    schemaRow.forEach((schemaCell, schemaX) => {
      const x = overlay.x + schemaX;
      const y = overlay.y + schemaY;
      if (
        x >= 0 &&
        x < baseWidth &&
        y >= 0 &&
        y < baseHeight &&
        schemaCell !== 0
      ) {
        baseClone[y][x] = schemaCell;
      }
    });
  });
  return baseClone;
}
