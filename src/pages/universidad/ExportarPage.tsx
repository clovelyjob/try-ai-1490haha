import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Download, FileSpreadsheet, Check } from 'lucide-react';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

// Mock student data for development
const mockStudents = [
  { id: '1', name: 'María González', career: 'Ingeniería de Software', cvScore: 85, interviewScore: 78, skills: 'JavaScript, React, Node.js', mainInterest: 'Software Engineering', improvementAreas: 'Comunicación, Confianza' },
  { id: '2', name: 'Carlos Rodríguez', career: 'Data Science', cvScore: 92, interviewScore: 88, skills: 'Python, SQL, Machine Learning', mainInterest: 'Data Science', improvementAreas: 'Estructura de respuestas' },
  { id: '3', name: 'Ana Martínez', career: 'Diseño UX', cvScore: 78, interviewScore: 82, skills: 'Figma, User Research, Prototyping', mainInterest: 'UX/Design', improvementAreas: 'Ejemplos específicos' },
  { id: '4', name: 'Luis Hernández', career: 'Administración', cvScore: 70, interviewScore: 75, skills: 'Excel, Análisis Financiero', mainInterest: 'Business/Finance', improvementAreas: 'Profundidad técnica' },
  { id: '5', name: 'Sofia López', career: 'Marketing', cvScore: 88, interviewScore: 72, skills: 'SEO, Content Marketing, Analytics', mainInterest: 'Marketing', improvementAreas: 'Manejo de nervios' },
];

const exportFields = [
  { id: 'name', label: 'Nombre', defaultChecked: true },
  { id: 'career', label: 'Carrera', defaultChecked: true },
  { id: 'cvScore', label: 'CV Score', defaultChecked: true },
  { id: 'interviewScore', label: 'Interview Score', defaultChecked: true },
  { id: 'skills', label: 'Habilidades', defaultChecked: false },
  { id: 'mainInterest', label: 'Interés Principal', defaultChecked: true },
  { id: 'improvementAreas', label: 'Áreas de Mejora', defaultChecked: false },
];

export default function ExportarPage() {
  const { students } = useUniversidadStore();
  const { toast } = useToast();
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(exportFields.filter(f => f.defaultChecked).map(f => f.id))
  );

  // Use mock data if no real students
  const displayStudents = students.length > 0 ? students : mockStudents;

  const toggleStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const toggleAllStudents = () => {
    if (selectedStudents.size === displayStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(displayStudents.map((s: any) => s.id)));
    }
  };

  const toggleField = (id: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFields(newSelected);
  };

  const handleExport = () => {
    if (selectedStudents.size === 0) {
      toast({
        title: 'Selecciona estudiantes',
        description: 'Debes seleccionar al menos un estudiante para exportar.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedFields.size === 0) {
      toast({
        title: 'Selecciona campos',
        description: 'Debes seleccionar al menos un campo para exportar.',
        variant: 'destructive',
      });
      return;
    }

    // Filter and prepare data
    const studentsToExport = displayStudents.filter((s: any) => selectedStudents.has(s.id));
    const fieldsToExport = Array.from(selectedFields);

    const exportData = studentsToExport.map((student: any) => {
      const row: any = {};
      fieldsToExport.forEach(field => {
        const fieldInfo = exportFields.find(f => f.id === field);
        if (fieldInfo) {
          row[fieldInfo.label] = student[field] || '';
        }
      });
      return row;
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = fieldsToExport.map(field => {
      const fieldInfo = exportFields.find(f => f.id === field);
      return { wch: Math.max(fieldInfo?.label.length || 10, 15) };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const filename = `clovely-estudiantes-${date}.xlsx`;

    // Download
    XLSX.writeFile(wb, filename);

    toast({
      title: 'Exportación exitosa',
      description: `Se exportaron ${studentsToExport.length} estudiantes.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Exportar Datos</h1>
        <p className="text-muted-foreground">
          Selecciona estudiantes y campos para generar un reporte Excel
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Seleccionar Estudiantes</CardTitle>
              <CardDescription>
                {selectedStudents.size} de {displayStudents.length} seleccionados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedStudents.size === displayStudents.length}
                          onCheckedChange={toggleAllStudents}
                        />
                      </TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Carrera</TableHead>
                      <TableHead className="text-center">CV</TableHead>
                      <TableHead className="text-center">Entrevista</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayStudents.map((student: any) => (
                      <TableRow 
                        key={student.id}
                        className={selectedStudents.has(student.id) ? 'bg-primary/5' : ''}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedStudents.has(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.career}</TableCell>
                        <TableCell className="text-center">{student.cvScore}%</TableCell>
                        <TableCell className="text-center">{student.interviewScore}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Selection & Export */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Campos a Exportar</CardTitle>
              <CardDescription>
                Selecciona los datos que deseas incluir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {exportFields.map(field => (
                <div
                  key={field.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.has(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {field.label}
                  </label>
                  {selectedFields.has(field.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="gradient-orange text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Listo para exportar</p>
                    <p className="text-sm opacity-90">
                      {selectedStudents.size} estudiantes, {selectedFields.size} campos
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleExport}
                  className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold"
                  size="lg"
                  disabled={selectedStudents.size === 0 || selectedFields.size === 0}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Exportar Excel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
