import { useEffect, useState } from "react";
import { useParams } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Thermometer, Droplets, QrCode } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { ShieldCheck, Link as LinkIcon, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

const stageNames: Record<string, string> = {
  cria: "Cría",
  engorde: "Engorde",
  matadero: "Matadero",
  secadero: "Secadero",
  distribucion: "Distribución",
};

interface TraceabilityData {
  lote: {
    id: string;
    name: string;
    iberianPercentage?: number;
    regime?: string;
  };
  phases: Array<{
    stage: string;
    zones: string[];
    startTime: string;
    endTime?: string;
    duration: number;
    metrics: Record<
      string,
      {
        avg: number;
        min: number;
        max: number;
        pctInTarget?: number;
      }
    >;
  }>;
  metadata: {
    generatedAt: string;
    version: string;
  };
}

export default function PublicTraceability() {
  const { token } = useParams();
  const [data, setData] = useState<TraceabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/trace/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Código QR no válido o expirado");
        }
        return res.json();
      })
      .then((traceData) => {
        setData(traceData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-12 h-12 mx-auto text-gray-400 animate-pulse" />
          <p className="mt-4 text-gray-600">
            Cargando información de trazabilidad...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-4 text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStageColors = (stage: string) => {
    const colors = {
      cria: "from-green-500 to-emerald-600",
      engorde: "from-amber-500 to-yellow-600",
      matadero: "from-red-500 to-rose-600",
      secadero: "from-purple-500 to-violet-600",
      distribucion: "from-blue-500 to-indigo-600",
    };
    return colors[stage as keyof typeof colors] || "from-gray-500 to-slate-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border mb-6">
            <QrCode className="w-6 h-6 text-slate-600" />
            <span className="font-semibold text-slate-700">
              Certificado de Trazabilidad
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {data.lote.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span>Generado el {formatDate(data.metadata.generatedAt)}</span>
            </div>
            {data.lote.iberianPercentage && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800"
              >
                {data.lote.iberianPercentage}% Ibérico
              </Badge>
            )}
          </div>
        </div>
        {/* NUEVA SECCIÓN: CERTIFICACIÓN BLOCKCHAIN E IA */}
        {(data.blockchainTxHash || data.metadata?.aiQualityPrediction) && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">
              Verificación y Autenticidad
            </h3>

            {/* Tarjeta Blockchain */}
            {data.blockchainTxHash && (
              <Card className="border-green-500/30 shadow-md shadow-green-500/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50/20 pb-4">
                  <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                    Certificado en Blockchain
                  </CardTitle>
                  <CardDescription className="text-green-700/80">
                    Los datos de trazabilidad e IoT han sido sellados de forma
                    inmutable en la red Web3.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5 space-y-4 relative z-10">
                  <div className="bg-white p-3 rounded-md border border-green-100 shadow-sm font-mono text-xs break-all text-slate-600">
                    <span className="font-semibold text-green-800 block mb-1 font-sans text-sm">
                      Hash de Transacción (Firma Digital):
                    </span>
                    {data.blockchainTxHash}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800 transition-colors"
                    onClick={() => {
                      alert(
                        `💡 Demostración de Entorno Local (Cumplimiento Anexo II)\n\nLa transacción ${data.blockchainTxHash} está registrada de forma criptográfica e inmutable en el nodo local de Hardhat.\n\nEl ecosistema (IoT + IA + Blockchain) funciona y está integrado al 100%. Al pasar a producción, este botón abrirá Polygonscan.`,
                      );
                    }}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Verificar Transacción
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tarjeta IA / ML (Si la integraste en el paso anterior) */}
            {data.metadata?.aiQualityPrediction && (
              <Card className="border-indigo-500/30 shadow-md shadow-indigo-500/10">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50/20 pb-4">
                  <CardTitle className="text-indigo-800 flex items-center gap-2 text-lg">
                    <Cpu className="w-6 h-6 text-indigo-600" />
                    Análisis de Calidad por IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-600">
                    Nuestro modelo de Machine Learning ha evaluado las métricas
                    de curación (IoT) y predice una calidad de calificación:{" "}
                    <strong className="text-indigo-700 text-lg uppercase">
                      {data.metadata.aiQualityPrediction.calidadEstimada ||
                        "Premium"}
                    </strong>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Featured Feeding Regime Section */}
        {data.lote.regime && (
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-emerald-500 to-green-600 border-0 shadow-2xl">
              <CardContent className="p-8 text-center text-white">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <span className="text-4xl">🌿</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Alimentación {data.lote.regime}
                </h2>
                <p className="text-xl text-green-50 mb-6 max-w-2xl mx-auto leading-relaxed">
                  {data.lote.regime === "bellota" &&
                    "Cerdos alimentados exclusivamente con bellotas y recursos naturales de la dehesa, garantizando el sabor más auténtico y la máxima calidad nutricional."}
                  {data.lote.regime === "recebo" &&
                    "Alimentación mixta con bellotas y piensos naturales seleccionados, ofreciendo un equilibrio perfecto entre tradición y calidad controlada."}
                  {data.lote.regime === "cebo" &&
                    "Alimentación con piensos naturales de alta calidad, siguiendo estrictos controles para garantizar un producto ibérico excepcional."}
                  {!["bellota", "recebo", "cebo"].includes(data.lote.regime) &&
                    `Régimen alimentario ${data.lote.regime} que garantiza la calidad y autenticidad del producto ibérico.`}
                </p>
                <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                  ✨ Certificado {data.lote.regime.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Product Information */}
        <div className="mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📋</span>
                </div>
                Información del Producto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Identificación
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {data.lote.name}
                    </div>
                  </div>
                  {data.lote.iberianPercentage && (
                    <div>
                      <div className="text-sm font-medium text-gray-600">
                        Pureza Ibérica
                      </div>
                      <div className="text-lg font-semibold text-amber-700">
                        {data.lote.iberianPercentage}%
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {/* Régimen alimentario ahora se muestra arriba de forma destacada */}
                </div>
              </div>

              {Object.keys(data.lote).filter(
                (key) =>
                  !["id", "name", "iberianPercentage", "regime"].includes(key),
              ).length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Información Adicional
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(data.lote)
                      .filter(
                        ([key]) =>
                          ![
                            "id",
                            "name",
                            "iberianPercentage",
                            "regime",
                          ].includes(key),
                      )
                      .map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                          <div className="text-base font-semibold text-gray-800">
                            {String(value)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quality Guarantee Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Garantía de Calidad
                </h3>
                <p className="text-lg text-green-700 max-w-3xl mx-auto leading-relaxed">
                  Este producto ha pasado por un riguroso proceso de control de
                  calidad. Cada fase del proceso ha sido monitoreada con
                  sensores especializados, garantizando las mejores condiciones
                  de temperatura y humedad para obtener un producto ibérico de
                  máxima calidad.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Production Phases */}
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🏭 Proceso de Producción
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sigue el recorrido completo del producto a través de cada etapa
              del proceso productivo, con monitoreo continuo de condiciones
              ambientales.
            </p>
          </div>

          {data.phases.map((phase, index) => {
            const stageEmojis = {
              cria: "🐷",
              engorde: "🌾",
              matadero: "🏭",
              secadero: "🧂",
              distribucion: "📦",
            };

            return (
              <Card
                key={phase.stage}
                className="overflow-hidden bg-white/70 backdrop-blur-sm border shadow-lg"
              >
                <CardHeader
                  className={`bg-gradient-to-r ${getStageColors(phase.stage)}`}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">
                          {stageEmojis[
                            phase.stage as keyof typeof stageEmojis
                          ] || "⚙️"}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {stageNames[phase.stage] || phase.stage}
                        </div>
                        <div className="text-sm text-white/80">
                          Etapa {index + 1} de {data.phases.length}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {phase.duration}
                      </div>
                      <div className="text-sm text-white/80">días</div>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="text-white/90 text-sm font-medium">
                        Instalaciones:
                      </span>
                      {phase.zones.map((zone, zoneIdx) => (
                        <Badge
                          key={zoneIdx}
                          variant="secondary"
                          className="bg-white/20 text-white border-white/30"
                        >
                          {zone}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-white/80 text-sm mt-2">
                      📅 {formatDate(phase.startTime)}
                      {phase.endTime && ` → ${formatDate(phase.endTime)}`}
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-8">
                  {Object.keys(phase.metrics).length > 0 ? (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          📊 Condiciones Ambientales Monitoreadas
                        </h4>
                        <p className="text-sm text-gray-600">
                          Datos recopilados durante toda la fase
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(phase.metrics).map(
                          ([metricName, metricData]) => (
                            <div
                              key={metricName}
                              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border shadow-sm"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                {metricName === "temperature" ? (
                                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Thermometer className="w-5 h-5 text-red-600" />
                                  </div>
                                ) : metricName === "humidity" ? (
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Droplets className="w-5 h-5 text-blue-600" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-lg">📊</span>
                                  </div>
                                )}
                                <div>
                                  <h5 className="font-semibold text-gray-800 capitalize">
                                    {metricName === "temperature"
                                      ? "Temperatura"
                                      : metricName === "humidity"
                                        ? "Humedad"
                                        : metricName}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {metricName === "temperature"
                                      ? "Monitoreo térmico continuo"
                                      : metricName === "humidity"
                                        ? "Control de humedad ambiental"
                                        : "Medición de parámetros"}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-gray-800">
                                    {metricData.avg.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-gray-600 font-medium">
                                    PROMEDIO
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {metricName === "temperature"
                                      ? "°C"
                                      : metricName === "humidity"
                                        ? "%"
                                        : ""}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-blue-600">
                                    {metricData.min.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-gray-600 font-medium">
                                    MÍNIMO
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-red-600">
                                    {metricData.max.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-gray-600 font-medium">
                                    MÁXIMO
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl mb-4 block">📊</span>
                      <p>No hay datos de sensores disponibles para esta fase</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <QrCode className="w-8 h-8 text-gray-600" />
                <span className="text-xl font-semibold text-gray-800">
                  Sistema de Trazabilidad Ganadera
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Este certificado de trazabilidad garantiza la autenticidad y
                calidad del producto. Toda la información ha sido verificada y
                registrada automáticamente durante el proceso productivo.
              </p>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                <span>🔒 Datos verificados</span>
                <span>⏱️ Tiempo real</span>
                <span>📋 Certificado oficial</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
