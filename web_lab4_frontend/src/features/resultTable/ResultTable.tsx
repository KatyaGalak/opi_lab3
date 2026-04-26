import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadPoints, selectResultTable, clearPointsAsync } from "./ResultTableSlice";
import { selectAuth } from "../auth/authSlice";
import styles from "./ResultTable.module.css";
import { PointRow } from "./ResultTableAPI";
import { Button } from "belle";

export function ResultTable() {
  const dispatch = useAppDispatch();
  const { points, loading, error } = useAppSelector(selectResultTable);
  const { isLogin } = useAppSelector(selectAuth);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isLogin) {
      dispatch(loadPoints());
    }
  }, [isLogin, dispatch]);

  const handleConfirmClear = () => {
    dispatch(clearPointsAsync());
    setIsConfirmOpen(false);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка результатов</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        {points.length > 0 && (
          <Button 
            onClick={() => setIsConfirmOpen(true)}
            className={styles.clearButton}
          >
            Очистить таблицу и график
          </Button>
        )}
      </div>

      <div className={styles.responsiveTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>X</th>
              <th>Y</th>
              <th>R</th>
              <th>Попадание</th>
              <th>Время (нс)</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point: PointRow, index: number) => (
              <tr key={index}>
                <td>{point.x}</td>
                <td>{point.y.toFixed(5)}</td>
                <td>{point.r}</td>
                <td>{point.hit ? "Да" : "Нет"}</td>
                <td>{point.execTime}</td>
                <td>{point.dateFormatted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className={styles.mobileView}>
        {points.length === 0 ? (
          <div className={styles.empty}>Нет результатов</div>
        ) : (
          points.map((point: PointRow, index: number) => (
            <div key={index} className={styles.mobileRow}>
              <div><strong>X:</strong> {point.x}</div>
              <div><strong>Y:</strong> {point.y.toFixed(5)}</div>
              <div><strong>R:</strong> {point.r}</div>
              <div><strong>Попадание:</strong> {point.hit ? "Да" : "Нет"}</div>
              <div><strong>Время (нс):</strong> {point.execTime}</div>
              <div><strong>Дата:</strong> {point.dateFormatted}</div>
            </div>
          ))
        )}
      </div> */}

      {isConfirmOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsConfirmOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Подтверждение</h3>
            <p>Вы уверены, что хотите удалить все свои точки?</p>
            <div className={styles.modalActions}>
                <Button primary onClick={handleConfirmClear}>Удалить</Button>
                <Button onClick={() => setIsConfirmOpen(false)}>Отмена</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}