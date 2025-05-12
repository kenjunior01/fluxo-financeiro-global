
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  isSupport?: boolean;
}

export const LiveChat = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Simular carregamento inicial de mensagens
  useEffect(() => {
    // Mensagens iniciais simuladas
    const initialMessages: Message[] = [
      {
        id: "1",
        sender: "Suporte",
        content: "Bem-vindo ao chat ao vivo do Fluxo Financeiro Global! Como podemos ajudar?",
        timestamp: new Date(Date.now() - 3600000),
        isSupport: true,
      },
    ];

    setMessages(initialMessages);
    
    // Simular usuários online
    setOnlineUsers(Math.floor(Math.random() * 10) + 5);
    
    // Simular resposta automática quando o chat for aberto
    const timer = setTimeout(() => {
      if (isOpen) {
        addSupportMessage("Estamos aqui para responder suas dúvidas sobre mercados, investimentos e nossa plataforma. Como podemos ajudar hoje?");
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Rolar para a última mensagem quando novas mensagens chegarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simular resposta do suporte
  const addSupportMessage = (content: string) => {
    const supportMessage: Message = {
      id: `support-${Date.now()}`,
      sender: "Suporte",
      content,
      timestamp: new Date(),
      isSupport: true,
    };
    
    setMessages(prev => [...prev, supportMessage]);
  };

  // Enviar mensagem
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: currentUser?.email || "Você",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Focar no input após enviar mensagem
    inputRef.current?.focus();
    
    // Simular digitação do suporte
    setTimeout(() => {
      // Respostas simuladas baseadas em palavras-chave
      if (message.toLowerCase().includes("investir") || message.toLowerCase().includes("investimento")) {
        addSupportMessage("Temos diversas opções de investimento disponíveis. Você pode explorar nossa seção de mercados para ver oportunidades em tempo real. Algum tipo específico de investimento que você está interessado?");
      } else if (message.toLowerCase().includes("conta") || message.toLowerCase().includes("cadastro")) {
        addSupportMessage("Para criar sua conta, clique em 'Começar Agora' no menu superior. Se já possui uma conta mas está com problemas, podemos ajudar com o processo de recuperação.");
      } else if (message.toLowerCase().includes("taxa") || message.toLowerCase().includes("custo") || message.toLowerCase().includes("preço")) {
        addSupportMessage("Nossa plataforma oferece planos flexíveis para diferentes perfis de investidores. O plano básico é gratuito com funcionalidades limitadas, e temos planos premium a partir de R$29,90/mês com recursos avançados.");
      } else {
        addSupportMessage("Obrigado pela sua mensagem. Um de nossos especialistas irá analisá-la e retornará em breve com mais informações.");
      }
    }, 1500);
  };

  // Formatar hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Lidar com tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botão flutuante do chat */}
      <div className="fixed bottom-5 right-5 z-50">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className={`h-6 w-6 transition-all ${isOpen ? 'rotate-90' : ''}`} />
        </Button>
      </div>
      
      {/* Janela do chat */}
      {isOpen && (
        <Card className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 shadow-xl border-primary/10">
          <CardHeader className="bg-secondary/30 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Chat ao Vivo
              </CardTitle>
              <Badge variant="outline" className="bg-primary/10 flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{onlineUsers} online</span>
              </Badge>
            </div>
            <CardDescription>
              Tire suas dúvidas em tempo real
            </CardDescription>
          </CardHeader>
          
          <ScrollArea className="h-72">
            <CardContent className="pt-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-2 ${msg.isSupport ? 'justify-start' : 'justify-end'}`}
                  >
                    {msg.isSupport && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary/10 text-primary">FF</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div 
                      className={`rounded-lg px-3 py-2 max-w-[80%] shadow-sm ${
                        msg.isSupport 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        msg.isSupport ? 'text-muted-foreground' : 'text-primary-foreground/70'
                      }`}>
                        <Clock className="h-3 w-3" />
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                    
                    {!msg.isSupport && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatar || undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {currentUser?.email?.substring(0, 2).toUpperCase() || "VC"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </ScrollArea>
          
          <CardFooter className="border-t p-3">
            <div className="flex w-full gap-2">
              <Textarea
                ref={inputRef}
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-10 resize-none"
                rows={1}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
