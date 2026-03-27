// Motor de Machine Learning para Gemelo Digital Ibérico
// Preparado para integración futura con librerías como @tensorflow/tfjs-node o ml-random-forest

interface LoteFeatures {
  daysInCria: number;
  daysInEngorde: number;
  avgTempSecadero: number;
  avgHumiditySecadero: number;
  initialAnimals: number;
}

interface HistoricalRecord extends LoteFeatures {
  finalYieldPercentage: number; // Porcentaje de carne aprovechable
  qualityScore: number; // Puntuación de calidad 1-100
}

export class MachineLearningEngine {
  private isTrained: boolean = false;
  // Pesos del modelo (Simulando una Regresión Lineal Múltiple)
  private weights = {
    criaWeight: 0,
    engordeWeight: 0,
    tempWeight: 0,
    humidityWeight: 0,
    bias: 0,
  };

  /**
   * ALGORITMO 1: PREDICCIÓN DE RENDIMIENTO Y CALIDAD
   * En el futuro, aquí inyectaremos un modelo Random Forest o Red Neuronal.
   */
  public async trainYieldModel(historicalData: HistoricalRecord[]) {
    if (historicalData.length < 10) {
      console.log(
        "ML Engine: Datos insuficientes para entrenar (Mínimo 10 históricos recomendados).",
      );
      return false;
    }

    console.log(
      `ML Engine: Entrenando modelo con ${historicalData.length} lotes históricos...`,
    );

    // Aquí iría el código real de entrenamiento de la IA.
    // Simulación: Ajustamos pesos basados en promedios simples para dar un resultado lógico.
    this.weights = {
      criaWeight: 0.15, // Días de cría suman un poco al rendimiento
      engordeWeight: 0.25, // Días de engorde son cruciales
      tempWeight: -0.5, // Temperaturas muy altas en secadero restan calidad/rendimiento
      humidityWeight: 0.1, // Humedad controlada suma
      bias: 60, // Rendimiento base (%)
    };

    this.isTrained = true;
    return true;
  }

  public async predictLoteYield(features: LoteFeatures) {
    if (!this.isTrained) {
      // Si no hay IA entrenada, devolvemos un cálculo heurístico estático
      return this.heuristicPrediction(features);
    }

    // Predicción basada en el modelo entrenado (Y = W1*X1 + W2*X2 ... + Bias)
    let predictedYield =
      features.daysInCria * this.weights.criaWeight +
      features.daysInEngorde * this.weights.engordeWeight +
      features.avgTempSecadero * this.weights.tempWeight +
      features.avgHumiditySecadero * this.weights.humidityWeight +
      this.weights.bias;

    // Asegurar que el resultado tenga sentido comercial (entre 40% y 95%)
    predictedYield = Math.max(40, Math.min(95, predictedYield));

    // Predicción de calidad correlacionada al rendimiento y variables ambientales
    let predictedQuality =
      predictedYield + (features.daysInEngorde > 90 ? 5 : -5);
    predictedQuality = Math.max(0, Math.min(100, predictedQuality));

    return {
      predictedYieldPercentage: Number(predictedYield.toFixed(2)),
      predictedQualityScore: Number(predictedQuality.toFixed(2)),
      confidenceLevel: "Medium (Linear Regression)",
      recommendation: this.generateRecommendation(features, predictedQuality),
    };
  }

  /**
   * ALGORITMO 2: DETECCIÓN DE ANOMALÍAS IoT (Isolation Forest / Z-Score)
   */
  public detectSensorAnomaly(
    currentValue: number,
    historicalValues: number[],
    sensorType: string,
  ) {
    if (historicalValues.length < 5) return { isAnomaly: false };

    // Cálculo matemático de Media y Desviación Estándar (Z-Score)
    const sum = historicalValues.reduce((a, b) => a + b, 0);
    const mean = sum / historicalValues.length;
    const variance =
      historicalValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
      historicalValues.length;
    const stdDev = Math.sqrt(variance);

    // Z-Score: a cuántas desviaciones estándar está el valor actual de la media
    const zScore = Math.abs((currentValue - mean) / stdDev);

    // Si Z-Score > 3, es una anomalía estadística (Regla empírica del 99.7%)
    const isAnomaly = zScore > 3;

    let alertMessage = null;
    if (isAnomaly) {
      if (currentValue > mean)
        alertMessage = `Pico inusual detectado en ${sensorType} (Valor: ${currentValue.toFixed(1)}). Podría afectar la merma.`;
      else
        alertMessage = `Caída brusca detectada en ${sensorType} (Valor: ${currentValue.toFixed(1)}). Riesgo de contaminación por condensación.`;
    }

    return {
      isAnomaly,
      zScore: Number(zScore.toFixed(2)),
      expectedRange: {
        min: Number((mean - stdDev * 2).toFixed(1)),
        max: Number((mean + stdDev * 2).toFixed(1)),
      },
      alertMessage,
    };
  }

  // Fallback si la IA no está entrenada aún
  private heuristicPrediction(features: LoteFeatures) {
    const baseYield = 70; // 70% rendimiento promedio
    const penalty = features.avgTempSecadero > 25 ? 5 : 0;
    return {
      predictedYieldPercentage: baseYield - penalty,
      predictedQualityScore: 85,
      confidenceLevel: "Low (Heuristic Base)",
      recommendation:
        "El modelo requiere más históricos para una predicción precisa.",
    };
  }

  private generateRecommendation(f: LoteFeatures, quality: number) {
    if (f.avgTempSecadero > 22)
      return "Bajar temperatura en secadero para evitar goteo excesivo de grasa.";
    if (f.daysInEngorde < 60)
      return "Aumentar días de engorde para asegurar infiltración de grasa óptima.";
    if (quality > 90)
      return "Parámetros excelentes. Mantener el régimen actual.";
    return "Condiciones estables. Vigilar humedad relativa.";
  }
}

export const mlEngine = new MachineLearningEngine();
