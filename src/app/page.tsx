import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
          {/* Header */}
        <header className="py-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <img
                src="/logo.png"
                alt="ISO 42001 Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Evaluación del Nivel de Madurez
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            ISO 42001 - Sistema de Gestión de Inteligencia Artificial
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Evalúe la madurez de su organización en la implementación de sistemas de gestión de IA
          </p>
        </header>

        {/* Main Content */}
        <main className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Introduction Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">¿Qué es la ISO 42001?</CardTitle>
              <CardDescription className="text-gray-700">
                La norma ISO/IEC 42001 es el primer estándar internacional para sistemas de gestión de inteligencia artificial (IA). 
                Proporciona un marco para que las organizaciones desarrollen, implementen, mantengan y mejoren continuamente 
                sus sistemas de gestión de IA de manera responsable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Objetivo de la norma:</h3>
                  <p className="text-gray-700">
                    Ayudar a las organizaciones a desempeñar responsablemente su función con respecto a los sistemas de IA, 
                    asegurando un desarrollo y uso ético, transparente y confiable de la tecnología de IA.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Componentes clave:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Contexto de la organización</li>
                    <li>Liderazgo</li>
                    <li>Planificación</li>
                    <li>Apoyo</li>
                    <li>Operación</li>
                    <li>Evaluación del desempeño</li>
                    <li>Mejora continua</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">Evaluación de Madurez</CardTitle>
              <CardDescription className="text-gray-700">
                Esta herramienta interactiva le permitirá evaluar el nivel de madurez de su organización 
                en relación con los requisitos de la norma ISO 42001.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">¿Cómo funciona?</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Responda el cuestionario sobre cada componente de la norma</li>
                  <li>Obtendrá una puntuación para cada área evaluada</li>
                  <li>Visualice sus resultados en gráficos de radar</li>
                  <li>Genere un reporte PDF con sus resultados</li>
                  <li>Identifique áreas de mejora para su organización</li>
                </ol>
              </div>
              
              <div className="pt-4">
                <Link href="/evaluacion">
                  <Button size="lg" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3">
                    Comenzar Evaluación
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Beneficios de la Evaluación</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center shadow-md">
              <CardContent className="pt-6">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Identifique Brechas</h3>
                <p className="text-gray-700">Detecte áreas donde su organización necesita mejorar para cumplir con la norma</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-md">
              <CardContent className="pt-6">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Visualice Progreso</h3>
                <p className="text-gray-700">Gráficos de radar que muestran su nivel de madurez en cada componente</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-md">
              <CardContent className="pt-6">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Reporte Profesional</h3>
                <p className="text-gray-700">Genere un reporte PDF detallado para compartir con su equipo</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ISO 42001 Value Proposition */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">¿Por qué implementar ISO 42001?</h2>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Transforme su uso de IA en una ventaja competitiva</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Beneficios Clave:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Confianza y Credibilidad</h4>
                        <p className="text-sm text-gray-600">Demuestre a clientes y socios que utiliza IA de manera responsable y ética</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Reducción de Riesgos</h4>
                        <p className="text-sm text-gray-600">Minimice riesgos legales, éticos y operativos en sus proyectos de IA</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Mejora Continua</h4>
                        <p className="text-sm text-gray-600">Establezca procesos sistemáticos para mejorar sus capacidades de IA</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Ventaja Competitiva</h4>
                        <p className="text-sm text-gray-600">Adelántese a la competencia con una gestión profesional de IA</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">¿Para quién es esta norma?</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Empresas que ya usan IA</h4>
                      <p className="text-sm text-gray-700">Si su empresa ya implementa soluciones de IA, esta norma le ayudará a gestionarlas de manera estructurada y responsable.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Organizaciones que planean adoptar IA</h4>
                      <p className="text-sm text-gray-700">Establezca desde el principio las bases para un uso ético y eficiente de la inteligencia artificial.</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Proveedores de soluciones de IA</h4>
                      <p className="text-sm text-gray-700">Demuestre a sus clientes que sus productos cumplen con los más altos estándares de calidad y ética.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-600 border-t border-gray-200">
          <p>© 2025 Evaluación de Madurez ISO 42001. Desarrollado por <a href="https://www.linkedin.com/in/roberto-puyo/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">Roberto Puyo</a>. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}