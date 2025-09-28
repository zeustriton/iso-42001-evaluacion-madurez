"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// Definición de las preguntas basadas en los componentes de la norma ISO 42001
// Reformuladas para empresas que ya usan IA pero no conocen la norma
const evaluationQuestions = [
  {
    id: "contexto",
    title: "Contexto de la Organización",
    description: "Evaluación de cómo su empresa entiende y gestiona el contexto de sus proyectos de IA",
    questions: [
      {
        id: "contexto_1",
        text: "¿Su empresa ha identificado claramente para qué usa o planea usar la inteligencia artificial en sus operaciones?",
        description: "Por ejemplo: automatización de tareas, análisis de datos, atención al cliente, predicciones, etc."
      },
      {
        id: "contexto_2",
        text: "¿Conoce quiénes se ven afectados por los sistemas de IA que utiliza (clientes, empleados, socios)?",
        description: "Ha considerado las necesidades y expectativas de estas personas respecto al uso de IA"
      },
      {
        id: "contexto_3",
        text: "¿Tiene definido el alcance de sus iniciativas de IA (qué áreas, procesos o productos incluyen)?",
        description: "Sabe exactamente dónde se aplica la IA en su organización y dónde no"
      },
      {
        id: "contexto_4",
        text: "¿Su empresa tiene documentados sus procesos relacionados con el desarrollo o uso de IA?",
        description: "Existen documentos, guías o procedimientos escritos sobre cómo se maneja la IA"
      }
    ]
  },
  {
    id: "liderazgo",
    title: "Liderazgo y Compromiso",
    description: "Evaluación del compromiso de la dirección con el uso responsable de la IA",
    questions: [
      {
        id: "liderazgo_1",
        text: "¿La alta dirección de su empresa muestra interés y apoyo activo en los proyectos de IA?",
        description: "Los líderes participan en decisiones, asignan recursos y hablan sobre la importancia de la IA"
      },
      {
        id: "liderazgo_2",
        text: "¿Existe alguna política o directriz formal sobre cómo se debe usar la IA en la empresa?",
        description: "Documentos que establecen reglas, principios o lineamientos para el uso ético de IA"
      },
      {
        id: "liderazgo_3",
        text: "¿Están claras las responsabilidades de quién toma decisiones, quién implementa y quién supervisa la IA?",
        description: "Sabe quién es responsable si algo sale mal con un sistema de IA"
      }
    ]
  },
  {
    id: "planificacion",
    title: "Planificación y Gestión de Riesgos",
    description: "Evaluación de cómo se planifica y gestionan los riesgos asociados a la IA",
    questions: [
      {
        id: "planificacion_1",
        text: "¿Su empresa ha identificado los posibles riesgos de usar IA (errores, sesgos, seguridad)?",
        description: "Ha pensado qué podría salir mal con sus sistemas de IA y cómo afectaría al negocio"
      },
      {
        id: "planificacion_2",
        text: "¿Tiene un método para evaluar qué tan graves serían estos riesgos si ocurrieran?",
        description: "Analiza el impacto potencial de fallos en los sistemas de IA en clientes, operaciones o reputación"
      },
      {
        id: "planificacion_3",
        text: "¿Implementa medidas para prevenir o mitigar estos riesgos identificados?",
        description: "Tiene controles, verificaciones o acciones para minimizar problemas con la IA"
      },
      {
        id: "planificacion_4",
        text: "¿Evalúa cómo sus sistemas de IA afectan a las personas y la sociedad antes de implementarlos?",
        description: "Considera el impacto social, ético y en los derechos de las personas"
      },
      {
        id: "planificacion_5",
        text: "¿Tiene metas claras y medibles sobre lo que quiere lograr con sus proyectos de IA?",
        description: "Objetivos específicos como mejorar eficiencia, reducir costos, aumentar satisfacción, etc."
      }
    ]
  },
  {
    id: "apoyo",
    title: "Recursos y Capacidades",
    description: "Evaluación de los recursos, conocimientos y comunicación para gestionar IA",
    questions: [
      {
        id: "apoyo_1",
        text: "¿Cuenta con el presupuesto, tecnología y personal necesario para sus proyectos de IA?",
        description: "Tiene los recursos económicos, técnicos y humanos adecuados"
      },
      {
        id: "apoyo_2",
        text: "¿Su personal tiene los conocimientos y habilidades necesarios para trabajar con IA?",
        description: "El equipo sabe cómo usar, desarrollar o supervisar sistemas de IA correctamente"
      },
      {
        id: "apoyo_3",
        text: "¿Los empleados comprenden la importancia de usar la IA de manera responsable?",
        description: "Conocen las buenas prácticas y consecuencias de un uso inadecuado de la IA"
      },
      {
        id: "apoyo_4",
        text: "¿Existen canales de comunicación adecuados para hablar sobre temas de IA en la empresa?",
        description: "Hay reuniones, reportes o espacios para discutir avances, problemas y mejoras"
      },
      {
        id: "apoyo_5",
        text: "¿Mantiene registros y documentación actualizada sobre sus sistemas de IA?",
        description: "Documenta versiones, cambios, decisiones y lecciones aprendidas"
      }
    ]
  },
  {
    id: "operacion",
    title: "Operación e Implementación",
    description: "Evaluación de cómo se ejecutan y controlan las operaciones con IA",
    questions: [
      {
        id: "operacion_1",
        text: "¿Sigue procesos establecidos para desarrollar o implementar sistemas de IA?",
        description: "Tiene metodologías, pasos o flujos de trabajo definidos para proyectos de IA"
      },
      {
        id: "operacion_2",
        text: "¿Monitorea regularmente el rendimiento y comportamiento de sus sistemas de IA en producción?",
        description: "Verifica que los sistemas funcionen correctamente y no tengan problemas"
      },
      {
        id: "operacion_3",
        text: "¿Implementa las medidas de seguridad y control planeadas para sus sistemas de IA?",
        description: "Pone en práctica lo planeado para proteger datos, evitar errores y garantizar calidad"
      },
      {
        id: "operacion_4",
        text: "¿Evalúa el impacto real de sus sistemas de IA después de implementarlos?",
        description: "Mide si realmente están cumpliendo sus objetivos y no causando problemas inesperados"
      }
    ]
  },
  {
    id: "evaluacion",
    title: "Monitoreo y Evaluación",
    description: "Evaluación de cómo se mide el desempeño y se aseguran los resultados",
    questions: [
      {
        id: "evaluacion_1",
        text: "¿Mide y analiza si sus sistemas de IA están cumpliendo con los objetivos esperados?",
        description: "Usa indicadores, métricas o KPIs para evaluar el éxito de sus iniciativas de IA"
      },
      {
        id: "evaluacion_2",
        text: "¿Realiza revisiones periódicas para verificar que todo está funcionando correctamente?",
        description: "Audita o inspecciona regularmente sus sistemas y procesos de IA"
      },
      {
        id: "evaluacion_3",
        text: "¿La dirección revisa los resultados y avances de los proyectos de IA regularmente?",
        description: "Los líderes reciben reportes y toman decisiones basadas en el desempeño de la IA"
      }
    ]
  },
  {
    id: "mejora",
    title: "Mejora Continua",
    description: "Evaluación de cómo se aprende y mejora continuamente en el uso de IA",
    questions: [
      {
        id: "mejora_1",
        text: "¿Su empresa aprende de los errores y éxitos para mejorar futuros proyectos de IA?",
        description: "Analiza lo que funcionó y lo que no para aplicar lecciones aprendidas"
      },
      {
        id: "mejora_2",
        text: "¿Tiene un proceso para corregir problemas cuando se detectan en los sistemas de IA?",
        description: "Actúa rápidamente para solucionar fallos, errores o desviaciones"
      }
    ]
  }
];

// Opciones de respuesta para cada pregunta
const responseOptions = [
  { value: 1, label: "No implementado", description: "El requisito no está implementado" },
  { value: 2, label: "Inicialmente implementado", description: "Existen elementos básicos pero no sistemáticos" },
  { value: 3, label: "Parcialmente implementado", description: "Implementado en algunas áreas pero no completamente" },
  { value: 4, label: "Largamente implementado", description: "Implementado en la mayoría de las áreas" },
  { value: 5, label: "Completamente implementado", description: "Totalmente implementado y documentado" }
];

export default function EvaluacionPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentSection < evaluationQuestions.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const calculateProgress = () => {
    const totalQuestions = evaluationQuestions.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.keys(responses).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const isCurrentSectionComplete = () => {
    const currentQuestions = evaluationQuestions[currentSection].questions;
    return currentQuestions.every(q => responses[q.id] !== undefined);
  };

  if (isCompleted) {
    // Redirigir a la página de resultados con las respuestas
    const queryString = new URLSearchParams(
      Object.entries(responses).map(([key, value]) => [key, value.toString()])
    ).toString();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">¡Evaluación Completada!</CardTitle>
            <CardDescription>
              Gracias por completar la evaluación de madurez ISO 42001.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href={`/resultados?${queryString}`}>
              <Button size="lg" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3">
                Ver Resultados
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSectionData = evaluationQuestions[currentSection];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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
                <h1 className="text-3xl font-bold text-gray-900">Evaluación del Nivel de Madurez</h1>
                <h2 className="text-xl font-semibold text-gray-700">ISO 42001 - Sistema de Gestión de IA</h2>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso General</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-3" />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Sección {currentSection + 1} de {evaluationQuestions.length}
            </div>
            <div className="text-lg font-semibold text-blue-800">
              {currentSectionData.title}
            </div>
          </div>
        </header>

        {/* Section Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">{currentSectionData.title}</CardTitle>
            <CardDescription className="text-gray-700">
              {currentSectionData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {currentSectionData.questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {index + 1}. {question.text}
                    </h3>
                    <p className="text-sm text-gray-600">{question.description}</p>
                  </div>
                  
                  <RadioGroup
                    value={responses[question.id]?.toString() || ""}
                    onValueChange={(value) => handleResponseChange(question.id, parseInt(value))}
                    className="space-y-3"
                  >
                    {responseOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option.value.toString()} id={`${question.id}_${option.value}`} />
                        <div className="flex-1">
                          <Label htmlFor={`${question.id}_${option.value}`} className="font-medium text-gray-800">
                            {option.label}
                          </Label>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isCurrentSectionComplete()}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            {currentSection === evaluationQuestions.length - 1 ? "Finalizar Evaluación" : "Siguiente"}
          </Button>
        </div>
      </div>
    </div>
  );
}