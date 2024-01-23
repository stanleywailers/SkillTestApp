import React, { createContext, useContext, useEffect, useState } from 'react';

import Resources from '../constanst/Resources';

interface WebSocketContextProps {
  ws: WebSocket | null;
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  openConnection: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  const openConnection = () => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${Resources.FinnhubApiKey}`);

    socket.onopen = () => {
     
      setWs(socket);
    };

    socket.onmessage = (event: any) => {
    
      console.log(event.data);
    };

    socket.onerror = (error: Event) => {
      
      console.log(error);
    };

    socket.onclose = (event: any) => {
      
      console.log(event.code, event.reason);
    };
  };

  useEffect(() => {
    openConnection();

    return () => {
      
      if (ws) {
       // ws.close();
      }
    };
  }, []); 

  return (
    <WebSocketContext.Provider value={{ ws, setWs, openConnection }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};