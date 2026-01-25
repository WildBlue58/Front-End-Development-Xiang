import { create } from 'zustand';
import type { Todo } from '../types';
import { persist } from 'zustand/middleware';

export interface TodoState{
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: number) => void;
    removeTodo: (id: number) => void;
}

export const useTodoStore = create<TodoState>()(
    persist((set) => ({
    todos: [],
    addTodo: (text) => set((state) => ({
        todos: [...state.todos, {
            id: Date.now(),
            title: text,
            completed: false,
        }],
    })),
    toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
    })),
    removeTodo: (id) => set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
    })),
}), {
    name: 'todos',
}));