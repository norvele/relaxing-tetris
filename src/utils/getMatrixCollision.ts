import { sliceMatrix } from "@/utils/sliceMatrix";
import { Schema } from "@/common";

interface Overlay {
  x: number;
  y: number;
  matrix: Schema;
}

export function getMatrixCollision(base: Schema, overlay: Overlay) {
  const overlayYSize = overlay.matrix.length;
  const overlayXSize = overlay.matrix[0].length;
  const checkedAreaCoords = {
    x1: overlay.x,
    y1: overlay.y,
    x2: overlay.x + overlayXSize - 1,
    y2: overlay.y + overlayYSize - 1,
  };
  const checkedArea = sliceMatrix(base, checkedAreaCoords, 1);
  const horizontalCollisionMap = Array(overlayXSize).fill(0);
  let isCollision = false;
  for (let y = 0; y < overlayYSize; y++) {
    for (let x = 0; x < overlayXSize; x++) {
      if (checkedArea[y][x] && overlay.matrix[y][x]) {
        horizontalCollisionMap[x] = 1;
        isCollision = true;
      }
    }
  }
  const collisionWeight = horizontalCollisionMap.filter((item) => item).length;
  return {
    isCollision,
    leftWeight: horizontalCollisionMap[0] ? collisionWeight : 0,
    rightWeight: horizontalCollisionMap[overlayXSize - 1] ? collisionWeight : 0,
  };
}
