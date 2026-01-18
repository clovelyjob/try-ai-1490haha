import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Users } from 'lucide-react';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock student data for development
const mockStudents = [
  { id: '1', name: 'María González', career: 'Ingeniería de Software', cvScore: 85, interviewScore: 78, mainInterest: 'Software Engineering', lastActivity: '2024-01-15' },
  { id: '2', name: 'Carlos Rodríguez', career: 'Data Science', cvScore: 92, interviewScore: 88, mainInterest: 'Data Science', lastActivity: '2024-01-14' },
  { id: '3', name: 'Ana Martínez', career: 'Diseño UX', cvScore: 78, interviewScore: 82, mainInterest: 'UX/Design', lastActivity: '2024-01-13' },
  { id: '4', name: 'Luis Hernández', career: 'Administración', cvScore: 70, interviewScore: 75, mainInterest: 'Business/Finance', lastActivity: '2024-01-12' },
  { id: '5', name: 'Sofia López', career: 'Marketing', cvScore: 88, interviewScore: 72, mainInterest: 'Marketing', lastActivity: '2024-01-11' },
  { id: '6', name: 'Diego Ramírez', career: 'Psicología', cvScore: 65, interviewScore: 80, mainInterest: 'Consulting', lastActivity: '2024-01-10' },
  { id: '7', name: 'Valentina Torres', career: 'Ingeniería de Software', cvScore: 90, interviewScore: 85, mainInterest: 'Software Engineering', lastActivity: '2024-01-09' },
  { id: '8', name: 'Andrés Castro', career: 'Data Science', cvScore: 82, interviewScore: 78, mainInterest: 'Data Science', lastActivity: '2024-01-08' },
  { id: '9', name: 'Camila Vega', career: 'Diseño UX', cvScore: 75, interviewScore: 70, mainInterest: 'UX/Design', lastActivity: '2024-01-07' },
  { id: '10', name: 'Sebastián Morales', career: 'Administración', cvScore: 68, interviewScore: 65, mainInterest: 'Project Management', lastActivity: '2024-01-06' },
];

export default function EstudiantesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { students } = useUniversidadStore();

  // Use mock data if no real students
  const displayStudents = students.length > 0 ? students : mockStudents;

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return displayStudents;
    const term = searchTerm.toLowerCase();
    return displayStudents.filter(
      (s: any) =>
        s.name?.toLowerCase().includes(term) ||
        s.career?.toLowerCase().includes(term) ||
        s.mainInterest?.toLowerCase().includes(term)
    );
  }, [displayStudents, searchTerm]);

  const getScoreBadge = (score: number) => {
    if (score >= 85) return <Badge className="bg-green-500/10 text-green-600 border-green-200">{score}%</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">{score}%</Badge>;
    return <Badge className="bg-red-500/10 text-red-600 border-red-200">{score}%</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Estudiantes</h1>
          <p className="text-muted-foreground">
            Visualiza el rendimiento de todos tus estudiantes
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-5 w-5" />
          <span className="font-medium">{filteredStudents.length} estudiantes</span>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, carrera o interés..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Lista de Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead className="text-center">CV Score</TableHead>
                    <TableHead className="text-center">Entrevista Score</TableHead>
                    <TableHead>Interés Principal</TableHead>
                    <TableHead className="text-right">Última Actividad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.career}</TableCell>
                      <TableCell className="text-center">
                        {getScoreBadge(student.cvScore || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getScoreBadge(student.interviewScore || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.mainInterest || 'Sin definir'}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {student.lastActivity 
                          ? format(new Date(student.lastActivity), 'dd MMM yyyy', { locale: es })
                          : 'Sin actividad'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron estudiantes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
