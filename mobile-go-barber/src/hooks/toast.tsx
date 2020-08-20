import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
    // precisa do id pq vai poder ter vários toasts ao mesmo tempo na tela
    // e vai fazer um map, por isso vai precisar da key
    id: string;
    type?: 'sucess' | 'error' | 'info';
    title: string;
    description?: string;
}

interface ToastContextData {
    addToast(message: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
    // é um array de estados porque tem várias mensagens
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const addToast = useCallback(
        ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
            const id = uuid();

            const toast = {
                id,
                type,
                title,
                description,
            };

            // faz isso aqui pra não ter que declarar no colchetes ali embaixo
            setMessages((oldMessages) => [...oldMessages, toast]);
        },
        [],
    );
    const removeToast = useCallback((id: string) => {
        setMessages((state) => state.filter((message) => message.id !== id));
    }, []);
    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer messages={messages} />
        </ToastContext.Provider>
    );
};

// hook
function useToast(): ToastContextData {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}

export { ToastProvider, useToast };
