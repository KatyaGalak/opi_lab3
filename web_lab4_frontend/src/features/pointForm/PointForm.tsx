import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setX, setY, setR, validateAll, sendPoint, selectPointForm } from "./PointFormSlice";
import { Button, TextInput } from "belle";
import styles from "./PointForm.module.css";

const X_VALUES = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
const R_VALUES = [-3, -2, -1, 0, 1, 2, 3, 4, 5];

function NumericSpinner({
  value,
  onChange,
  min = -5,
  max = 3,
  step = 0.5,
}: {
  value: number | null;
  onChange: (newValue: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const roundValue = (val: number): number => {
    const precision = step.toString().split(".")[1]?.length || 0;
    return parseFloat(val.toFixed(precision));
  };

  const handleIncrement = () => {
    if (value === null) {
      onChange(min);
    } else if (value + step <= max) {
      onChange(roundValue(value + step));
    }
  };

  const handleDecrement = () => {
    if (value === null) {
      onChange(max);
    } else if (value - step >= min) {
      onChange(roundValue(value - step));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || val === "-") {
      onChange(null);
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onChange(roundValue(num));
      }
    }
  };

  return (
    <div className={styles.spinnerContainer}>
      <Button 
        onClick={handleDecrement} 
        className={styles.spinnerButtonMinus}
      >
        −
      </Button>
      
      <TextInput
        value={value !== null ? value.toString() : ""}
        disabled
        placeholder="Y"
        allowCustomSizing
        className={styles.belleSpinnerInput}
      />

      <Button 
        onClick={handleIncrement} 
        className={styles.spinnerButtonPlus}
      >
        +
      </Button>
    </div>
  );
}

export function PointForm() {
  const dispatch = useAppDispatch();
  const { x, y, r, xError, yError, rError, formError, loading } = useAppSelector(selectPointForm);

  const handleYChange = (newValue: number | null) => {
    dispatch(setY(newValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(validateAll());

    const hasErrors = xError || yError || rError;
    if (hasErrors || x === null || y === null || r === null) {
      return;
    }

    if (x === null || r === null || y === null || xError || yError || rError|| r <= 0) {
      return;
    }

    dispatch(sendPoint({ x, y, r }));
  };

  return (
    <div className={styles.card}>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>X:</label>
          <div className={styles.buttonGroup}>
            {X_VALUES.map((val) => (
              <Button
                key={val}
                primary={x === val}
                onClick={() => dispatch(setX(val))}
                className={styles.selectButton}
              >
                {val}
              </Button>
            ))}
          </div>
          {xError && <div className={styles.error}>{xError}</div>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Y:</label>
          <NumericSpinner value={y} onChange={handleYChange} min={-5} max={3} step={0.5} />
          {yError && <div className={styles.error}>{yError}</div>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>R:</label>
          <div className={styles.buttonGroup}>
            {R_VALUES.map((val) => (
              <Button
                key={val}
                primary={r === val && val > 0}
                onClick={() => dispatch(setR(val))}
                className={`${styles.selectButton} ${val < 0 && r === val ? styles.buttonError : ""}`}
              >
                {val}
              </Button>
            ))}
          </div>
          {rError && <div className={styles.error}>{rError}</div>}
        </div>

        <div className={styles.actions}>
          <Button type="submit" primary disabled={loading} className={styles.submitButton}>
            {loading ? "Проверка" : "Проверить"}
          </Button>
        </div>

        {formError && <div className={styles.formError}>{formError}</div>}
      </form>
    </div>
  );
}