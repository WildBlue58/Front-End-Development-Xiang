import {
  useTodos,
} from './hooks/useTodos';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';

export default function App() {
  const {
    todos, 
    addTodo, 
    toggleTodo, 
    removeTodo
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">TodoList</h1>
        <TodoInput onAdd={addTodo}/>
        <TodoList 
          todos={todos}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />
      </div>
    </div>
  )
}