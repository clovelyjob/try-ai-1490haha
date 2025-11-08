import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCircleStore } from '@/store/useCircleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Users,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Share2,
  BookmarkPlus,
  Send,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CircleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const user = useAuthStore((state) => state.user);
  const getCircleById = useCircleStore((state) => state.getCircleById);
  const userCircles = useCircleStore((state) => state.userCircles);
  const joinCircle = useCircleStore((state) => state.joinCircle);
  const leaveCircle = useCircleStore((state) => state.leaveCircle);
  const getPostsByCircle = useCircleStore((state) => state.getPostsByCircle);
  const createPost = useCircleStore((state) => state.createPost);
  const reactToPost = useCircleStore((state) => state.reactToPost);
  const savePost = useCircleStore((state) => state.savePost);
  const getCommentsByPost = useCircleStore((state) => state.getCommentsByPost);
  const addComment = useCircleStore((state) => state.addComment);
  const getEventsByCircle = useCircleStore((state) => state.getEventsByCircle);
  const addXP = useProgressStore((state) => state.addXP);

  const [newPost, setNewPost] = useState('');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const circle = id ? getCircleById(id) : undefined;
  const isMember = id ? userCircles.includes(id) : false;
  const posts = id ? getPostsByCircle(id) : [];
  const events = id ? getEventsByCircle(id) : [];

  useEffect(() => {
    if (!circle) {
      navigate('/dashboard/circles');
    }
  }, [circle, navigate]);

  if (!circle || !user) return null;

  const handleJoin = () => {
    joinCircle(user.id, circle.id);
    addXP(50);
    toast({
      title: 'Te has unido al círculo',
      description: `Ahora eres parte de ${circle.name}`,
    });
  };

  const handleLeave = () => {
    leaveCircle(user.id, circle.id);
    setShowLeaveDialog(false);
    toast({
      title: 'Has salido del círculo',
      description: `Ya no eres parte de ${circle.name}`,
    });
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    createPost({
      circleId: circle.id,
      authorId: user.id,
      authorName: user.name,
      content: newPost,
    });

    addXP(25);
    setNewPost('');
    
    toast({
      title: 'Publicación creada',
      description: 'Tu publicación ha sido compartida con el círculo',
    });
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    addComment({
      postId,
      authorId: user.id,
      authorName: user.name,
      content: newComment,
    });

    addXP(10);
    setNewComment('');
    setSelectedPost(null);

    toast({
      title: 'Comentario añadido',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Hace unos minutos';
    if (hours < 24) return `Hace ${hours}h`;
    if (hours < 48) return 'Ayer';
    return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/circles')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a círculos
        </Button>

        {/* Header */}
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {circle.name}
                </h1>
                <Badge variant="secondary">{circle.category}</Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                {circle.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {circle.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {isMember ? (
                <Button
                  variant="outline"
                  onClick={() => setShowLeaveDialog(true)}
                >
                  Salir del círculo
                </Button>
              ) : (
                <Button onClick={handleJoin}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Unirse
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{circle.memberCount} miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Creado {new Date(circle.createdAt).toLocaleDateString('es')}</span>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="members">Miembros</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {isMember && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Comparte algo con el círculo..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publicar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {!isMember && (
              <Card className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Únete para ver el contenido
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Conéctate con la comunidad y participa en las conversaciones
                </p>
                <Button onClick={handleJoin}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Unirse al círculo
                </Button>
              </Card>
            )}

            {isMember && posts.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aún no hay publicaciones
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sé el primero en compartir algo con la comunidad
                </p>
              </Card>
            )}

            {isMember && posts.map((post) => {
              const comments = getCommentsByPost(post.id);
              return (
                <Card key={post.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold">
                          {post.authorName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {post.authorName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reactToPost(post.id, 'like')}
                        className="gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.reactions.like}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPost(post.id)}
                        className="gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentCount}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => savePost(post.id, !post.saved)}
                        className="gap-2"
                      >
                        <BookmarkPlus className={`w-4 h-4 ${post.saved ? 'fill-primary' : ''}`} />
                      </Button>
                    </div>

                    {selectedPost === post.id && (
                      <div className="pt-4 border-t space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold">
                                {comment.authorName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg p-3">
                                <div className="font-semibold text-sm mb-1">
                                  {comment.authorName}
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                              <div className="flex gap-2 mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs"
                                  onClick={() => reactToPost(comment.id, 'like')}
                                >
                                  Me gusta ({comment.reactions.like})
                                </Button>
                                <span className="text-xs text-muted-foreground self-center">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-primary">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 flex gap-2">
                            <Textarea
                              placeholder="Escribe un comentario..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              rows={2}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment.trim()}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Próximamente: directorio de miembros
              </p>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            {events.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay eventos programados
                </h3>
                <p className="text-sm text-muted-foreground">
                  Los próximos eventos aparecerán aquí
                </p>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('es', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.attendees.length} asistentes
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        Organizado por <strong>{event.hostName}</strong>
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Leave Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Salir del círculo?</AlertDialogTitle>
            <AlertDialogDescription>
              Dejarás de ver las publicaciones y eventos de este círculo. Siempre puedes volver a unirte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>
              Salir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
