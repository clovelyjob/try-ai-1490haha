import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ResultsStepProps {
  onComplete: () => void;
  diagnosticData?: {
    interests: string[];
    values: string[];
    skills: any;
    experience: string;
    detectedRole: string;
  };
}

const LOADING_MESSAGES = [
  'Analizando tus respuestas...',
  'Identificando tus fortalezas...',
  'Calculando compatibilidad con carreras...',
  'Diseñando tu ruta personalizada...',
];

export const ResultsStep = ({ onComplete, diagnosticData }: ResultsStepProps) => {
  const [loading, setLoading] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Calculate dynamic radar data based on user responses
  const calculateRadarData = () => {
    if (!diagnosticData) {
      return [
        { skill: 'Creatividad', value: 85 },
        { skill: 'Análisis', value: 72 },
        { skill: 'Liderazgo', value: 68 },
        { skill: 'Comunicación', value: 90 },
        { skill: 'Técnica', value: 65 },
        { skill: 'Estrategia', value: 78 },
      ];
    }

    const { interests, values, skills } = diagnosticData;
    
    // Calculate creativity based on interests
    const creativeInterests = ['diseño', 'arte', 'creatividad', 'innovación'];
    const creativityScore = 60 + (interests.filter(i => 
      creativeInterests.some(ci => i.toLowerCase().includes(ci))
    ).length * 10);
    
    // Calculate analysis based on interests and skills
    const analyticalInterests = ['datos', 'análisis', 'investigación', 'ciencia'];
    const analysisScore = 60 + (interests.filter(i => 
      analyticalInterests.some(ai => i.toLowerCase().includes(ai))
    ).length * 10);
    
    // Calculate communication based on values
    const communicationValues = ['colaboración', 'comunicación', 'trabajo en equipo'];
    const communicationScore = 70 + (values.filter(v => 
      communicationValues.some(cv => v.toLowerCase().includes(cv))
    ).length * 8);
    
    // Calculate technical based on skills
    const technicalScore = 65 + (skills.technical?.length || 0) * 5;
    
    return [
      { skill: 'Creatividad', value: Math.min(creativityScore, 95) },
      { skill: 'Análisis', value: Math.min(analysisScore, 95) },
      { skill: 'Liderazgo', value: 65 + (values.includes('Liderazgo') ? 20 : 0) },
      { skill: 'Comunicación', value: Math.min(communicationScore, 95) },
      { skill: 'Técnica', value: Math.min(technicalScore, 95) },
      { skill: 'Estrategia', value: 70 + (interests.includes('Estrategia') ? 15 : 0) },
    ];
  };

  const radarData = calculateRadarData();

  const topCareers = diagnosticData ? [
    { title: diagnosticData.detectedRole || 'Product Designer', match: 92, icon: '🎯' },
    { title: 'Roles relacionados', match: 85, icon: '📊' },
    { title: 'Alternativas', match: 78, icon: '💡' },
  ] : [
    { title: 'Product Designer', match: 92, icon: '🎨' },
    { title: 'Product Manager', match: 87, icon: '📊' },
    { title: 'Marketing Manager', match: 83, icon: '📱' },
  ];

  const insights = diagnosticData ? [
    `Tienes ${diagnosticData.interests.length} áreas de interés bien definidas`,
    `Tus valores de ${diagnosticData.values.slice(0, 2).join(' y ')} guían tu carrera`,
    `Nivel de experiencia: ${diagnosticData.experience}`,
  ] : [
    'Tienes un perfil equilibrado entre creatividad y análisis',
    'Tu capacidad de comunicación es una fortaleza clave',
    'Valoras el impacto y la autonomía en tu trabajo',
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 750);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center space-y-8">
        <div className="w-20 h-20 mx-auto rounded-full gradient-orange flex items-center justify-center animate-pulse">
          <Sparkles className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <h2 className="text-2xl font-heading font-bold">
            {LOADING_MESSAGES[messageIndex]}
          </h2>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{progress}% completado</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <Badge className="gradient-premium text-white text-lg px-4 py-2">
          Innovador Creativo
        </Badge>
        <h1 className="text-4xl font-heading font-bold">
          ¡Descubrimos tu perfil único!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Basado en tus respuestas, hemos identificado tus fortalezas y las
          carreras más compatibles con tu perfil
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="p-6">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tu perfil de fortalezas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <Radar
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Careers */}
        <Card className="p-6">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Carreras más compatibles
          </h3>
          <div className="space-y-3">
            {topCareers.map((career, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{career.icon}</span>
                    <span className="font-semibold">{career.title}</span>
                  </div>
                  <Badge variant="secondary">{career.match}% match</Badge>
                </div>
                <Progress value={career.match} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-6">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Insights personalizados
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted">
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <h3 className="font-heading font-bold text-lg mb-3">
          🎯 Tus próximos pasos
        </h3>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2 text-sm">
            <span className="text-primary font-bold">1.</span>
            <span>Completa tu perfil profesional y CV</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-primary font-bold">2.</span>
            <span>Practica entrevistas con nuestro simulador IA</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-primary font-bold">3.</span>
            <span>Únete a círculos de profesionales en tu área</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span className="text-primary font-bold">4.</span>
            <span>Completa microacciones diarias para avanzar</span>
          </li>
        </ul>

        <Button
          size="lg"
          className="w-full gradient-orange text-white"
          onClick={onComplete}
        >
          Ir a mi dashboard <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </Card>
    </motion.div>
  );
};
