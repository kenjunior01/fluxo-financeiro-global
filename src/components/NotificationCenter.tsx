
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, X, AlertTriangle, TrendingUp, TrendingDown, Settings } from "lucide-react";

interface Notification {
  id: string;
  type: 'alert' | 'news' | 'trade' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Alerta de Preço',
      message: 'PETR4 atingiu o preço alvo de R$ 35,50',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'trade',
      title: 'Ordem Executada',
      message: 'Compra de 100 ações VALE3 executada com sucesso',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'news',
      title: 'Notícia de Mercado',
      message: 'Petrobras anuncia aumento de dividendos',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: 'Manutenção Programada',
      message: 'Sistema será atualizado às 02:00',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true,
      priority: 'medium'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'trade': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'news': return <Bell className="h-4 w-4 text-green-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const filterNotifications = (type?: string) => {
    if (!type) return notifications;
    return notifications.filter(n => n.type === type);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Central de Notificações
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Acompanhe todas as atualizações importantes
            </CardDescription>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="alert">Alertas</TabsTrigger>
            <TabsTrigger value="trade">Negociações</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma notificação encontrada
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className={getPriorityColor(notification.priority)}
                            >
                              {notification.priority === 'high' ? 'Alta' : 
                               notification.priority === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <p className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {['alert', 'trade', 'news', 'system'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="space-y-3">
                {filterNotifications(type).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className={getPriorityColor(notification.priority)}
                            >
                              {notification.priority === 'high' ? 'Alta' : 
                               notification.priority === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <p className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
