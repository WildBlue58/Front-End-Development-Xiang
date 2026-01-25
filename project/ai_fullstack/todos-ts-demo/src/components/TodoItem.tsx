import type { Todo } from '../types/todo';
import * as React from 'react'; // esm 

interface Props {
  todo: Todo; 
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

const TodoItem: React.FC<Props> = (
  { todo, onToggle, onRemove }
) => {
  return (
    <li className="group flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <input 
          type="checkbox"
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span 
          className={`truncate transition-all ${
            todo.completed 
              ? 'text-gray-400 line-through decoration-gray-400' 
              : 'text-gray-700'
          }`}
        >
        {todo.title}
        </span>
      </div>
      <button 
        className="opacity-0 group-hover:opacity-100 ml-4 px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all focus:opacity-100"
        onClick={() => onRemove(todo.id)}
      >
        Delete
      </button>
    </li>
  )
}

export default TodoItem