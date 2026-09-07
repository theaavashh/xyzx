'use client';

import { useEffect, useRef } from 'react';

export interface NewOrderEvent {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  status: string;
  shippingName: string;
  createdAt: string;
}

interface NewOrderMessage {
  type: 'new-order';
  data: NewOrderEvent;
}

const wsUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';
  return base.replace(/^http/, 'ws') + '/ws';
};

export function useNewOrderSocket(onNewOrder: (order: NewOrderEvent) => void): void {
  const handlerRef = useRef(onNewOrder);
  handlerRef.current = onNewOrder;

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    const connect = () => {
      if (closed) return;

      socket = new WebSocket(wsUrl());

      socket.onopen = () => {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as NewOrderMessage;
          if (message?.type === 'new-order' && message.data) {
            handlerRef.current(message.data);
          }
        } catch {
          // ignore malformed frames
        }
      };

      socket.onclose = () => {
        if (closed) return;
        reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      socket?.close();
    };
  }, []);
}