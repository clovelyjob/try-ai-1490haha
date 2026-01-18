import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Crown
} from 'lucide-react';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { useUniversidadStats } from '@/hooks/useUniversidadStats';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

const COLORS = ['#FF7A00', '#FFB88A', '#FF6F61', '#0A3D62', '#3498db', '#2ecc71'];

export default function UniversidadDashboard() {
  const { students, university } = useUniversidadStore();
  const stats = useUniversidadStats(students);

  const kpiCards = [
    { 
      title: 'Total Estudiantes', 
      value: stats.totalStudents, 
      icon: Users,
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      title: 'Score CV Promedio', 
      value: `${stats.averageCVScore}%`, 
      icon: FileText,
      color: 'from-orange-500 to-orange-600' 
    },
    { 
      title: 'Score Entrevista Promedio', 
      value: `${stats.averageInterviewScore}%`, 
      icon: MessageSquare,
      color: 'from-green-500 to-green-600' 
    },
    { 
      title: 'Tendencia de Mejora', 
      value: `+${stats.improvementTrend}%`, 
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600' 
    },
  ];

  const radarData = [
    { subject: 'Comunicación', value: stats.softSkillsAverage.communication, fullMark: 100 },
    { subject: 'Estructura', value: stats.softSkillsAverage.structure, fullMark: 100 },
    { subject: 'Confianza', value: stats.softSkillsAverage.confidence, fullMark: 100 },
    { subject: 'Claridad', value: stats.softSkillsAverage.clarity, fullMark: 100 },
    { subject: 'Profundidad Técnica', value: stats.softSkillsAverage.technicalDepth, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Dashboard de {university?.name || 'Universidad'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Centro de comando para empleabilidad estudiantil
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-heading font-bold mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section 2: Student Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score by Career */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Score por Carrera</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.scoreByCareer} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="career" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cvScore" name="CV Score" fill="#FF7A00" radius={[0, 4, 4, 0]} />
                <Bar dataKey="interviewScore" name="Entrevista" fill="#0A3D62" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Tendencia de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cvScore" 
                  name="CV Score"
                  stroke="#FF7A00" 
                  strokeWidth={3}
                  dot={{ fill: '#FF7A00', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="interviewScore" 
                  name="Entrevista"
                  stroke="#0A3D62" 
                  strokeWidth={3}
                  dot={{ fill: '#0A3D62', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Top Estudiantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topStudents.map((student, i) => (
              <div 
                key={student.name}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.career}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{student.score}%</p>
                  <p className="text-xs text-muted-foreground">Score combinado</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Interview Areas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Soft Skills Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Habilidades Blandas (Promedio)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Promedio"
                  dataKey="value"
                  stroke="#FF7A00"
                  fill="#FF7A00"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Common Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Áreas de Mejora Comunes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.commonWeaknesses} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="area" type="category" width={150} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Estudiantes" fill="#FF6F61" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Interview Failures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Patrones de Fallas en Entrevistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.interviewFailures.map((failure, i) => (
              <div 
                key={failure.pattern}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
              >
                <p className="text-2xl font-bold text-destructive">{failure.count}</p>
                <p className="text-sm text-muted-foreground mt-1">{failure.pattern}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Professional Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Intereses Profesionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.professionalInterests}
                  dataKey="count"
                  nameKey="interest"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ interest, percentage }) => `${interest}: ${percentage}%`}
                  labelLine={false}
                >
                  {stats.professionalInterests.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {stats.professionalInterests.map((interest, i) => (
                <div key={interest.interest} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="flex-1">{interest.interest}</span>
                  <span className="font-semibold">{interest.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
