import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { FileText, Briefcase, Mic, ArrowRight, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  const mainActions = [
    {
      title: 'CV Builder',
      description: 'Crea o mejora tu CV profesional',
      icon: FileText,
      path: '/dashboard/cvs',
      color: 'from-primary/10 to-primary/5',
      iconColor: 'text-primary',
    },
    {
      title: 'Oportunidades',
      description: 'Encuentra trabajos perfectos para ti',
      icon: Briefcase,
      path: '/dashboard/opportunities',
      color: 'from-blue-500/10 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Entrevistas',
      description: 'Practica con simulaciones realistas',
      icon: Mic,
      path: '/dashboard/interviews',
      color: 'from-green-500/10 to-green-500/5',
      iconColor: 'text-green-500',
    },
  ];

  const jobOfTheDay = {
    title: 'Product Designer',
    company: 'Rappi',
    match: 89,
    location: 'Buenos Aires, Argentina',
    type: 'Remoto',
  };

  const practiceOfTheDay = {
    question: 'Describe en 3 líneas cuál es tu mayor fortaleza profesional',
    xp: 25,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-foreground">
            Bienvenido/a, {firstName}
          </h1>
          <p className="text-muted-foreground text-lg">
            ¿Qué quieres hacer hoy?
          </p>
        </motion.div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainActions.map((action, index) => (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={action.path}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-7 h-7 ${action.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {action.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Comenzar <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Job of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Trabajo del día
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {jobOfTheDay.title}
                </h3>
                <p className="text-muted-foreground">
                  {jobOfTheDay.company} • {jobOfTheDay.location}
                </p>
              </div>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {jobOfTheDay.match}% match
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">
                {jobOfTheDay.type}
              </span>
            </div>
            <Link to="/dashboard/opportunities">
              <Button className="w-full">
                Ver detalles
              </Button>
            </Link>
          </Card>
        </motion.div>

        {/* Practice of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Práctica del día
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                +{practiceOfTheDay.xp} XP
              </span>
            </div>
            <p className="text-foreground mb-4">
              {practiceOfTheDay.question}
            </p>
            <textarea
              className="w-full p-3 border border-input rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Escribe tu respuesta aquí..."
            />
            <Button className="mt-4 w-full" variant="outline">
              Guardar respuesta
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

