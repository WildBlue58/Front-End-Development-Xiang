import * as React from 'react';

interface Props {
  onAdd: (title: string) => void;
}

const TodoInput:React.FC<Props> = ({ onAdd }) =>  {
  const [value, setValue] = React.useState<string>('');
  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  }
  return (
    <div className="flex gap-2 mb-6">
      <input 
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Add a new todo..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
      />
      <button 
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  ) 
}

export default TodoInput