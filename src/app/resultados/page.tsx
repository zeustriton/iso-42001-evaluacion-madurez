"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";

// Registrar componentes de Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

// Definición de las secciones de evaluación
const evaluationSections = [
  { id: "contexto", title: "Contexto de la Organización", color: "rgba(54, 162, 235, 0.6)" },
  { id: "liderazgo", title: "Liderazgo", color: "rgba(255, 99, 132, 0.6)" },
  { id: "planificacion", title: "Planificación", color: "rgba(255, 206, 86, 0.6)" },
  { id: "apoyo", title: "Apoyo", color: "rgba(75, 192, 192, 0.6)" },
  { id: "operacion", title: "Operación", color: "rgba(153, 102, 255, 0.6)" },
  { id: "evaluacion", title: "Evaluación del Desempeño", color: "rgba(255, 159, 64, 0.6)" },
  { id: "mejora", title: "Mejora", color: "rgba(199, 199, 199, 0.6)" }
];

// Mapeo de preguntas a secciones
const questionToSection = {
  contexto_1: "contexto", contexto_2: "contexto", contexto_3: "contexto", contexto_4: "contexto",
  liderazgo_1: "liderazgo", liderazgo_2: "liderazgo", liderazgo_3: "liderazgo",
  planificacion_1: "planificacion", planificacion_2: "planificacion", planificacion_3: "planificacion", 
  planificacion_4: "planificacion", planificacion_5: "planificacion",
  apoyo_1: "apoyo", apoyo_2: "apoyo", apoyo_3: "apoyo", apoyo_4: "apoyo", apoyo_5: "apoyo",
  operacion_1: "operacion", operacion_2: "operacion", operacion_3: "operacion", operacion_4: "operacion",
  evaluacion_1: "evaluacion", evaluacion_2: "evaluacion", evaluacion_3: "evaluacion",
  mejora_1: "mejora", mejora_2: "mejora"
};

// Niveles de madurez
const maturityLevels = [
  { min: 0, max: 1.5, level: "Inicial", description: "Requisitos no implementados o muy básicos", color: "text-red-600" },
  { min: 1.6, max: 2.5, level: "Básico", description: "Implementación inicial y no sistemática", color: "text-orange-600" },
  { min: 2.6, max: 3.5, level: "Intermedio", description: "Implementación parcial en algunas áreas", color: "text-yellow-600" },
  { min: 3.6, max: 4.5, level: "Avanzado", description: "Implementación en la mayoría de las áreas", color: "text-blue-600" },
  { min: 4.6, max: 5, level: "Óptimo", description: "Implementación completa y documentada", color: "text-green-600" }
];

export default function ResultadosPage() {
  const searchParams = useSearchParams();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [overallScore, setOverallScore] = useState(0);
  const [maturityLevel, setMaturityLevel] = useState(maturityLevels[0]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parsear los parámetros de búsqueda para obtener las respuestas
    const responses: Record<string, number> = {};
    searchParams.forEach((value, key) => {
      responses[key] = parseInt(value);
    });

    // Calcular puntuaciones por sección
    const sectionScores: Record<string, { total: number; count: number }> = {};
    
    Object.entries(responses).forEach(([questionId, score]) => {
      const sectionId = questionToSection[questionId as keyof typeof questionToSection];
      if (sectionId) {
        if (!sectionScores[sectionId]) {
          sectionScores[sectionId] = { total: 0, count: 0 };
        }
        sectionScores[sectionId].total += score;
        sectionScores[sectionId].count += 1;
      }
    });

    // Calcular promedios por sección
    const calculatedScores: Record<string, number> = {};
    Object.entries(sectionScores).forEach(([sectionId, data]) => {
      calculatedScores[sectionId] = data.total / data.count;
    });

    setScores(calculatedScores);

    // Calcular puntuación general
    const totalScore = Object.values(calculatedScores).reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / Object.keys(calculatedScores).length;
    setOverallScore(averageScore);

    // Determinar nivel de madurez
    const level = maturityLevels.find(level => averageScore >= level.min && averageScore <= level.max) || maturityLevels[0];
    setMaturityLevel(level);
  }, [searchParams]);

  const generatePDF = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (reportRef.current) {
      try {
        // Mostrar indicador de carga
        const button = event?.currentTarget;
        const originalText = button?.textContent;
        if (button) {
          button.textContent = "Generando PDF...";
          button.disabled = true;
        }

        // Configurar opciones para html2canvas
        const canvas = await html2canvas(reportRef.current, {
          scale: 1.2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: reportRef.current.scrollWidth,
          height: reportRef.current.scrollHeight,
          scrollX: 0,
          scrollY: -window.scrollY,
          removeContainer: true,
          foreignObjectRendering: true
        });
        
        const imgData = canvas.toDataURL('image/png', 0.8);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // 10mm margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 15; // Top margin

        // Add first page with title
        pdf.setFontSize(18);
        pdf.text('Evaluación del Nivel de Madurez', pdfWidth / 2, 15, { align: 'center' });
        pdf.setFontSize(14);
        pdf.text('ISO 42001 - Sistema de Gestión de Inteligencia Artificial', pdfWidth / 2, 25, { align: 'center' });
        position = 35;
        
        // Add image
        if (imgHeight <= pdfHeight - 40) {
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        } else {
          // Add first part of image
          const firstPageHeight = pdfHeight - 40;
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, firstPageHeight);
          heightLeft -= firstPageHeight;
          
          // Add remaining pages
          while (heightLeft > 0) {
            pdf.addPage();
            position = 15;
            const nextPageHeight = Math.min(heightLeft, pdfHeight - 30);
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, nextPageHeight, undefined, 'FAST');
            heightLeft -= nextPageHeight;
          }
        }

        // Save the PDF
        pdf.save('evaluacion_iso_42001.pdf');
        
        // Restaurar el botón
        if (button) {
          button.textContent = originalText;
          button.disabled = false;
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        
        // Método alternativo simple
        try {
          const pdf = new jsPDF();
          pdf.setFontSize(20);
          pdf.text('Evaluación del Nivel de Madurez', 105, 20, { align: 'center' });
          pdf.setFontSize(16);
          pdf.text('ISO 42001 - Sistema de Gestión de IA', 105, 30, { align: 'center' });
          pdf.setFontSize(12);
          pdf.text(`Puntuación General: ${overallScore.toFixed(1)}/5`, 20, 50);
          pdf.text(`Nivel de Madurez: ${maturityLevel.level}`, 20, 60);
          
          // Añadir tabla de puntuaciones
          let yPos = 80;
          pdf.text('Puntuaciones por Componente:', 20, yPos);
          yPos += 10;
          
          evaluationSections.forEach(section => {
            const score = scores[section.id] || 0;
            pdf.text(`${section.title}: ${score.toFixed(1)}/5`, 25, yPos);
            yPos += 8;
          });
          
          // Añadir recomendaciones
          yPos += 10;
          pdf.text('Recomendaciones:', 20, yPos);
          yPos += 10;
          
          const recommendations = getRecommendations();
          if (recommendations.length > 0) {
            recommendations.forEach((rec, index) => {
              const lines = pdf.splitTextToSize(`${index + 1}. ${rec}`, 170);
              lines.forEach((line: string) => {
                if (yPos > 280) {
                  pdf.addPage();
                  yPos = 20;
                }
                pdf.text(line, 25, yPos);
                yPos += 6;
              });
            });
          } else {
            pdf.text('¡Excelente nivel de madurez!', 25, yPos);
          }
          
          pdf.save('evaluacion_iso_42001_simplificada.pdf');
          
          alert('Se generó un PDF simplificado debido a problemas con los gráficos.');
        } catch (fallbackError) {
          console.error('Fallback PDF generation also failed:', fallbackError);
          alert('No se pudo generar el PDF. Por favor, intente nuevamente o contacte al soporte.');
        }
        
        // Restaurar el botón en caso de error
        if (button) {
          button.textContent = originalText;
          button.disabled = false;
        }
      }
    }
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];
    
    Object.entries(scores).forEach(([sectionId, score]) => {
      const section = evaluationSections.find(s => s.id === sectionId);
      if (section && score < 3) {
        switch (sectionId) {
          case "contexto":
            recommendations.push("Desarrollar un análisis más profundo del contexto organizacional y las partes interesadas");
            break;
          case "liderazgo":
            recommendations.push("Fortalecer el compromiso de la alta dirección y establecer políticas claras de IA");
            break;
          case "planificacion":
            recommendations.push("Implementar un sistema formal de gestión de riesgos de IA y objetivos claros");
            break;
          case "apoyo":
            recommendations.push("Asegurar recursos adecuados, competencias del personal y procesos de comunicación");
            break;
          case "operacion":
            recommendations.push("Estandarizar los procesos operativos y controles para sistemas de IA");
            break;
          case "evaluacion":
            recommendations.push("Establecer sistemas de monitoreo, auditoría interna y revisión por dirección");
            break;
          case "mejora":
            recommendations.push("Implementar procesos sistemáticos de mejora continua y acciones correctivas");
            break;
        }
      }
    });

    return recommendations;
  };

  const chartData = {
    labels: evaluationSections.map(section => section.title),
    datasets: [
      {
        label: 'Nivel de Madurez',
        data: evaluationSections.map(section => scores[section.id] || 0),
        backgroundColor: evaluationSections.map(section => section.color),
        borderColor: evaluationSections.map(section => section.color.replace('0.6', '1')),
        borderWidth: 2,
        pointBackgroundColor: evaluationSections.map(section => section.color.replace('0.6', '1')),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: evaluationSections.map(section => section.color.replace('0.6', '1')),
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Nivel: ${context.parsed.r.toFixed(1)}/5`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="py-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <img
                  src="/logo.png"
                  alt="ISO 42001 Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Resultados de la Evaluación</h1>
                <h2 className="text-xl font-semibold text-gray-700">ISO 42001 - Sistema de Gestión de IA</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/evaluacion">Volver a Evaluación</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Inicio</Link>
              </Button>
            </div>
          </div>
          <p className="text-gray-700">
            Análisis del nivel de madurez de su organización según la norma ISO 42001
          </p>
        </header>

        {/* Report Content */}
        <div ref={reportRef} className="space-y-6">
          {/* Overall Score Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">Resumen General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {overallScore.toFixed(1)}/5
                  </div>
                  <div className="text-sm text-gray-600">Puntuación General</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${maturityLevel.color}`}>
                    {maturityLevel.level}
                  </div>
                  <div className="text-sm text-gray-600">Nivel de Madurez</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {Object.keys(scores).length}/7
                  </div>
                  <div className="text-sm text-gray-600">Secciones Evaluadas</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Descripción del Nivel:</h3>
                <p className="text-gray-700">{maturityLevel.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Análisis por Componentes</CardTitle>
              <CardDescription>
                Visualización del nivel de madurez en cada componente de la norma ISO 42001
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Radar data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Additional Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-800">Comparación de Puntuaciones</CardTitle>
                <CardDescription>
                  Análisis detallado del desempeño por componente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar 
                    data={{
                      labels: evaluationSections.map(section => section.title.length > 15 ? section.title.substring(0, 15) + '...' : section.title),
                      datasets: [{
                        label: 'Puntuación',
                        data: evaluationSections.map(section => scores[section.id] || 0),
                        backgroundColor: evaluationSections.map(section => section.color),
                        borderColor: evaluationSections.map(section => section.color.replace('0.6', '1')),
                        borderWidth: 1,
                        borderRadius: 4,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              return `Puntuación: ${context.parsed.y.toFixed(1)}/5`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Doughnut Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-800">Distribución de Madurez</CardTitle>
                <CardDescription>
                  Clasificación de componentes por nivel de madurez alcanzado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Doughnut 
                    data={{
                      labels: ['Óptimo (4.6-5)', 'Avanzado (3.6-4.5)', 'Intermedio (2.6-3.5)', 'Básico (1.6-2.5)', 'Inicial (0-1.5)'],
                      datasets: [{
                        data: [
                          Object.values(scores).filter(score => score >= 4.6).length,
                          Object.values(scores).filter(score => score >= 3.6 && score < 4.6).length,
                          Object.values(scores).filter(score => score >= 2.6 && score < 3.6).length,
                          Object.values(scores).filter(score => score >= 1.6 && score < 2.6).length,
                          Object.values(scores).filter(score => score < 1.6).length
                        ],
                        backgroundColor: [
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(251, 191, 36, 0.8)',
                          'rgba(251, 146, 60, 0.8)',
                          'rgba(239, 68, 68, 0.8)'
                        ],
                        borderColor: [
                          'rgba(34, 197, 94, 1)',
                          'rgba(59, 130, 246, 1)',
                          'rgba(251, 191, 36, 1)',
                          'rgba(251, 146, 60, 1)',
                          'rgba(239, 68, 68, 1)'
                        ],
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 15,
                            font: {
                              size: 11
                            }
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${value} componentes (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Scores */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Puntuaciones Detalladas</CardTitle>
              <CardDescription>
                Desglose de puntuaciones por cada componente de la norma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {evaluationSections.map((section) => {
                  const score = scores[section.id] || 0;
                  const level = maturityLevels.find(l => score >= l.min && score <= l.max) || maturityLevels[0];
                  
                  return (
                    <div key={section.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">{section.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{score.toFixed(1)}/5</span>
                          <span className={`text-sm font-semibold ${level.color}`}>{level.level}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Recomendaciones de Mejora</CardTitle>
              <CardDescription>
                Acciones sugeridas para mejorar el nivel de madurez en áreas críticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getRecommendations().length > 0 ? (
                <ul className="space-y-3">
                  {getRecommendations().map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="text-green-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Excelente Trabajo!</h3>
                  <p className="text-gray-700">
                    Su organización muestra un alto nivel de madurez en todos los componentes de la norma ISO 42001.
                    Continúe con los procesos de mejora continua para mantener este nivel.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Educational Section */}
          <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">¿Por qué es importante implementar ISO 42001?</CardTitle>
              <CardDescription className="text-gray-700">
                Conozca los beneficios estratégicos de adoptar esta norma en su organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">Ventajas Competitivas</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Diferenciación en el mercado con gestión responsable de IA</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Mejor acceso a mercados y clientes exigentes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Atracción de talento y profesionales especializados</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">Beneficios Operativos</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Reducción de riesgos y costos asociados a fallos de IA</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Mayor eficiencia y calidad en proyectos de IA</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Mejora continua y aprendizaje organizacional</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={(e) => generatePDF(e)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Exportar a PDF
          </Button>
          <Link href="/evaluacion">
            <Button variant="outline">
              Realizar Nueva Evaluación
            </Button>
          </Link>
        </div>

        {/* Professional Contact Section */}
        <Card className="mt-8 shadow-lg border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-xl text-blue-800">¿Necesita Ayuda Profesional?</CardTitle>
            <CardDescription className="text-gray-700">
              Expertos en implementación de sistemas de gestión de IA según ISO 42001
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Servicios Profesionales</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Implementación de ISO 42001
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Diagnóstico y evaluación de madurez
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Capacitación en gestión de IA
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Consultoría en ética y gobernanza de IA
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src="https://media.licdn.com/dms/image/D4D03AQFv6X6X6X6X6X/profile-displayphoto-shrink_200_200/0/1666666666666?e=2147483647&v=beta&t=abc123"
                    alt="Roberto Puyo"
                    className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-blue-200"
                  />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Roberto Puyo</h3>
                <p className="text-gray-600 mb-4">Experto en Sistemas de Gestión de IA</p>
                <Button
                  onClick={() => window.open('https://www.linkedin.com/in/robertopuyo/', '_blank')}
                  className="bg-blue-700 hover:bg-blue-800 text-white w-full"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Contactar en LinkedIn
                </Button>
                <p className="text-sm text-gray-600 mt-3">
                  Para consultas sobre la norma ISO 42001 o implementación en su organización
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}