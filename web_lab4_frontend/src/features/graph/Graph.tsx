import React, { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPointForm, sendPointFromGraph } from "../pointForm/PointFormSlice";
import { selectResultTable } from "../resultTable/ResultTableSlice";
import { PointRow } from "../resultTable/ResultTableAPI";
import styles from "./Graph.module.css";
import { Button } from "belle";

const CANVAS_SIZE = 300;
const CENTER_X = CANVAS_SIZE / 2;
const CENTER_Y = CANVAS_SIZE / 2;
const SCALE = 30;
const DECIMAL_PRECISION = 5;

const POINT_RADIUS = 3;
const AREA_FILL_COLOR = "rgba(117, 171, 181, 0.5)";
const AREA_STROKE_COLOR = "#58a3b1";
const AXES_STROKE_COLOR = "#2b2a2aff";
const HIT_COLOR = "#69e369ff";
const MISS_COLOR = "#e95454ff";

export function Graph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const { r } = useAppSelector(selectPointForm);
  const { points } = useAppSelector(selectResultTable);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const drawGraph = (currentR: number, pointsList: PointRow[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (currentR > 0) {
      const rPix = currentR * SCALE;
      ctx.fillStyle = AREA_FILL_COLOR;
      ctx.strokeStyle = AREA_STROKE_COLOR;
      ctx.lineWidth = 1;

      // чертверть круга (2 чертверть)
      ctx.beginPath();
      ctx.moveTo(CENTER_X, CENTER_Y);
      ctx.arc(CENTER_X, CENTER_Y, rPix, Math.PI, 1.5 * Math.PI, false);
      ctx.fill();
      ctx.stroke();

      // прямоуг (3 четверть)
      ctx.beginPath();
      ctx.rect(CENTER_X - rPix, CENTER_Y, rPix, rPix / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // треугольник (4 четверть)
      ctx.beginPath();
      ctx.moveTo(CENTER_X, CENTER_Y);        
      ctx.lineTo(CENTER_X + rPix / 2, CENTER_Y);
      ctx.lineTo(CENTER_X, CENTER_Y + rPix);    
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.strokeStyle = AXES_STROKE_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(CANVAS_SIZE, CENTER_Y);

    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, CANVAS_SIZE);
    ctx.stroke();


    const arrowSize = 5;
    ctx.beginPath();

    ctx.moveTo(CANVAS_SIZE - arrowSize, CENTER_Y - arrowSize);
    ctx.lineTo(CANVAS_SIZE, CENTER_Y);
    ctx.lineTo(CANVAS_SIZE - arrowSize, CENTER_Y + arrowSize);

    ctx.moveTo(CENTER_X - arrowSize, arrowSize);
    ctx.lineTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X + arrowSize, arrowSize);
    ctx.stroke();

    ctx.fillStyle = AXES_STROKE_COLOR;
    ctx.font = "12px Arial";
    ctx.fillText("X", CANVAS_SIZE - 15, CENTER_Y - 10);
    ctx.fillText("Y", CENTER_X + 10, 15);

    const ticks = [-4, -3, -2, -1, 1, 2, 3, 4];
    ticks.forEach(t => {
      const pos = t * SCALE;
      ctx.beginPath();
      ctx.moveTo(CENTER_X + pos, CENTER_Y - 3);
      ctx.lineTo(CENTER_X + pos, CENTER_Y + 3);
      ctx.stroke();
      ctx.fillText(t.toString(), CENTER_X + pos - 5, CENTER_Y + 15);

      ctx.beginPath();
      ctx.moveTo(CENTER_X - 3, CENTER_Y - pos);
      ctx.lineTo(CENTER_X + 3, CENTER_Y - pos);
      ctx.stroke();
      ctx.fillText(t.toString(), CENTER_X + 10, CENTER_Y - pos + 5);
    });

    ctx.fillText("0", CENTER_X + 5, CENTER_Y + 15);

    pointsList.forEach(p => {
      const pX = CENTER_X + p.x * SCALE;
      const pY = CENTER_Y - p.y * SCALE;

      if (pX >= 0 && pX <= CANVAS_SIZE && pY >= 0 && pY <= CANVAS_SIZE) {
        ctx.beginPath();
        ctx.arc(pX, pY, POINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = p.hit ? HIT_COLOR : MISS_COLOR;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    drawGraph(r && r > 0 ? r : 0, points);
  }, [r, points]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!r || r <= 0) {
      setIsModalOpen(true);
      return;
    }

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const graphX = Number(((clickX - CENTER_X) / SCALE).toFixed(DECIMAL_PRECISION));
    const graphY = Number(((CENTER_Y - clickY) / SCALE).toFixed(DECIMAL_PRECISION));

    dispatch(sendPointFromGraph({ x: graphX, y: graphY, r }));
  };

  return (
    <div className={styles.card}>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onClick={handleCanvasClick}
          className={styles.canvas}
        />
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Ошибка</h3>
            <p>Пожалуйста, выберите положительное значение R перед кликом по графику</p>
            <Button primary onClick={() => setIsModalOpen(false)}>Ок</Button>
          </div>
        </div>
      )}
    </div>
  );
}