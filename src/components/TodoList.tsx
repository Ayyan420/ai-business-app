import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  Calendar,
  Flag,
  Clock,
  CheckCircle,
  Circle,
  Filter,
  Search
} from 'lucide-react';
import { database } from '../lib/database';
import { TierManager } from '../lib/tiers';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    due_date: '',
    category: 'personal'
  });

  const categories = [
    { id: 'personal', name: 'Personal', color: 'bg-blue-100 text-blue-800' },
    { id: 'work', name: 'Work', color: 'bg-green-100 text-green-800' },
    { id: 'shopping', name: 'Shopping', color: 'bg-purple-100 text-purple-800' },
    { id: 'health', name: 'Health', color: 'bg-red-100 text-red-800' },
    { id: 'finance', name: 'Finance', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const { data, error } = await database.getTasks();
      if (!error && data) {
        // Convert tasks to todos format
        const todosData = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.status === 'completed',
          priority: task.priority,
          due_date: task.due_date,
          category: task.category,
          created_at: task.created_at,
          updated_at: task.updated_at
        }));
        setTodos(todosData);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) {
      alert('Please enter a todo title');
      return;
    }

    // Check tier limits
    if (!TierManager.canUseFeature('tasks')) {
      alert('You\'ve reached your task limit. Please upgrade to add more tasks.');
      return;
    }

    const taskData = {
      title: newTodo.title,
      description: newTodo.description,
      status: 'pending',
      priority: newTodo.priority,
      due_date: newTodo.due_date || undefined,
      category: newTodo.category,
    };

    database.createTask(taskData).then(({ data, error }) => {
      if (!error && data) {
        const newTodo: Todo = {
          id: data.id,
          title: data.title,
          description: data.description,
          completed: data.status === 'completed',
          priority: data.priority,
          due_date: data.due_date,
          category: data.category,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setTodos(prev => [newTodo, ...prev]);
        TierManager.updateUsage('tasks');
        setShowAddModal(false);
        resetForm();
      } else {
        alert('Error adding todo. Please try again.');
      }
    });
  };

  const handleUpdateTodo = () => {
    if (!editingTodo || !editingTodo.title.trim()) {
      alert('Please enter a todo title');
      return;
    }

    const taskData = {
      title: editingTodo.title,
      description: editingTodo.description,
      status: editingTodo.completed ? 'completed' : 'pending',
      priority: editingTodo.priority,
      due_date: editingTodo.due_date,
      category: editingTodo.category
    };

    database.updateTask(editingTodo.id, taskData).then(({ data, error }) => {
      if (!error && data) {
        const updatedTodo: Todo = {
          id: data.id,
          title: data.title,
          description: data.description,
          completed: data.status === 'completed',
          priority: data.priority,
          due_date: data.due_date,
          category: data.category,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setTodos(prev => prev.map(todo => todo.id === editingTodo.id ? updatedTodo : todo));
        setEditingTodo(null);
      } else {
        alert('Error updating todo. Please try again.');
      }
    });
  };

  const toggleTodoComplete = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newStatus = todo.completed ? 'pending' : 'completed';
    database.updateTask(id, { status: newStatus }).then(({ data, error }) => {
      if (!error && data) {
        setTodos(prev => prev.map(t => 
          t.id === id 
            ? { ...t, completed: !t.completed, updated_at: new Date().toISOString() }
            : t
        ));
      } else {
        alert('Error updating todo status. Please try again.');
      }
    });
  };

  const deleteTodo = (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      // In a real implementation, you'd call database.deleteTask(id)
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  const resetForm = () => {
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      category: 'personal'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1];
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && todo.completed) ||
      (filter === 'pending' && !todo.completed);
    
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;
    
    return matchesFilter && matchesSearch && matchesCategory;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Todo List</h1>
        <p className="text-slate-600 dark:text-gray-400 mt-1">Organize and track your tasks efficiently</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">My Tasks</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Todo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</div>
          <div className="text-sm text-slate-600 dark:text-gray-400">Total</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-700 dark:text-green-400">Completed</div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          <div className="text-sm text-blue-700 dark:text-blue-400">Pending</div>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-red-700 dark:text-red-400">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Todos</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => {
          const categoryInfo = getCategoryInfo(todo.category);
          const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;
          
          return (
            <div
              key={todo.id}
              className={`p-4 border rounded-lg transition-all ${
                todo.completed 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : isOverdue
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleTodoComplete(todo.id)}
                  className={`mt-1 transition-colors ${
                    todo.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                  }`}
                >
                  {todo.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        todo.completed 
                          ? 'text-green-700 dark:text-green-300 line-through' 
                          : 'text-slate-800 dark:text-white'
                      }`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm mt-1 ${
                          todo.completed 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-slate-600 dark:text-gray-400'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${categoryInfo.color}`}>
                          {categoryInfo.name}
                        </span>
                        
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(todo.priority)}`}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          {todo.priority}
                        </span>
                        
                        {todo.due_date && (
                          <span className={`text-xs flex items-center ${
                            isOverdue ? 'text-red-600' : 'text-slate-500 dark:text-gray-400'
                          }`}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(todo.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingTodo(todo)}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || categoryFilter !== 'all' || filter !== 'all' 
                ? 'No todos match your filters' 
                : 'No todos yet'
              }
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || categoryFilter !== 'all' || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first todo to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Add New Todo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter todo title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newTodo.category}
                    onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTodo.due_date}
                  onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddTodo}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Todo
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Todo Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Edit Todo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingTodo.description || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTodo.priority}
                    onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingTodo.category}
                    onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editingTodo.due_date || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateTodo}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Todo
              </button>
              <button
                onClick={() => setEditingTodo(null)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default TodoList;