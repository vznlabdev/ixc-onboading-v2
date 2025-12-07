import { useEffect, useState } from 'react';

type EventType = 
  | 'application:new'
  | 'application:updated'
  | 'application:approved'
  | 'application:rejected'
  | 'comment:added'
  | 'user:online'
  | 'user:offline'
  | 'notification'
  | 'stats:updated';

interface WebSocketMessage {
  type: EventType;
  payload: any;
  timestamp: Date;
  userId?: string;
}

type EventHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<EventType, Set<EventHandler>> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private isConnected = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  // Mock mode for demo
  private mockMode = true;
  private mockInterval: NodeJS.Timeout | null = null;

  connect(url?: string): void {
    if (this.mockMode) {
      // Simulate WebSocket connection
      this.isConnected = true;
      this.startMockEvents();
      this.notifyHandlers('user:online', { message: 'Connected to real-time updates' });
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) {
            this.send(message);
          }
        }

        // Start heartbeat
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.stopHeartbeat();
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    if (this.mockMode) {
      this.stopMockEvents();
      this.isConnected = false;
      this.notifyHandlers('user:offline', { message: 'Disconnected from real-time updates' });
      return;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.stopHeartbeat();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startMockEvents(): void {
    // Simulate real-time events
    this.mockInterval = setInterval(() => {
      const events = [
        {
          type: 'application:new' as EventType,
          payload: {
            id: `APP-${Date.now()}`,
            businessName: 'Mock Business ' + Math.floor(Math.random() * 100),
            status: 'pending',
            submittedAt: new Date(),
          },
        },
        {
          type: 'stats:updated' as EventType,
          payload: {
            total: Math.floor(Math.random() * 100),
            pending: Math.floor(Math.random() * 20),
            approved: Math.floor(Math.random() * 50),
            rejected: Math.floor(Math.random() * 10),
          },
        },
        {
          type: 'comment:added' as EventType,
          payload: {
            applicationId: 'APP-001',
            comment: 'New comment added',
            user: 'System',
            timestamp: new Date(),
          },
        },
        {
          type: 'notification' as EventType,
          payload: {
            title: 'System Notification',
            message: 'This is a mock notification',
            type: 'info',
          },
        },
      ];

      // Randomly send an event
      if (Math.random() > 0.7) {
        const event = events[Math.floor(Math.random() * events.length)];
        this.notifyHandlers(event.type, event.payload);
      }
    }, 5000);
  }

  private stopMockEvents(): void {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    this.notifyHandlers(message.type, message.payload);
  }

  private notifyHandlers(type: EventType, data: any): void {
    const handlers = this.eventHandlers.get(type);
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${type}:`, error);
        }
      });
    }

    // Also notify wildcard handlers
    const wildcardHandlers = this.eventHandlers.get('*' as EventType);
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => {
        try {
          handler({ type, data });
        } catch (error) {
          console.error('Error in wildcard event handler:', error);
        }
      });
    }
  }

  on(event: EventType | '*', handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event as EventType)) {
      this.eventHandlers.set(event as EventType, new Set());
    }

    this.eventHandlers.get(event as EventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.off(event as EventType, handler);
    };
  }

  off(event: EventType, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    
    if (handlers) {
      handlers.delete(handler);
      
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  send(message: Omit<WebSocketMessage, 'timestamp'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: new Date(),
    };

    if (this.mockMode) {
      // In mock mode, just log the message
      console.log('Mock WebSocket send:', fullMessage);
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      // Queue message for later
      this.messageQueue.push(fullMessage);
    }
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (this.isConnected) {
      return 'connected';
    }

    if (this.ws?.readyState === WebSocket.CONNECTING) {
      return 'connecting';
    }

    return 'disconnected';
  }

  // Presence tracking
  private presenceMap = new Map<string, { userId: string; userName: string; lastSeen: Date }>();

  updatePresence(userId: string, userName: string): void {
    this.presenceMap.set(userId, {
      userId,
      userName,
      lastSeen: new Date(),
    });

    this.send({
      type: 'user:online',
      payload: { userId, userName },
    });
  }

  getOnlineUsers(): Array<{ userId: string; userName: string; lastSeen: Date }> {
    const now = Date.now();
    const timeout = 5 * 60 * 1000; // 5 minutes

    // Filter out users that haven't been seen recently
    const onlineUsers = Array.from(this.presenceMap.values()).filter(user => {
      return now - user.lastSeen.getTime() < timeout;
    });

    return onlineUsers;
  }
}

// Create singleton instance
export const wsService = new WebSocketService();

// React Hook for WebSocket
export function useWebSocket(event: EventType, handler: EventHandler) {
  useEffect(() => {
    const unsubscribe = wsService.on(event, handler);
    return unsubscribe;
  }, [event, handler]);
}

// React Hook for connection status
export function useWebSocketStatus() {
  const [status, setStatus] = useState(wsService.getConnectionStatus());

  useEffect(() => {
    const checkStatus = setInterval(() => {
      setStatus(wsService.getConnectionStatus());
    }, 1000);

    return () => clearInterval(checkStatus);
  }, []);

  return status;
}
