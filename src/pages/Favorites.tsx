import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Edit2, Trash2, ArrowUpDown, ChevronDown, Folder, Flame, Clock, SortAsc, SortDesc } from 'lucide-react';
import { SnackCard } from '../components/SnackCard';
import { useFavorites, type SortField } from '../utils/useFavorites';

const colorOptions = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6', '#F43F5E'
];

export function Favorites() {
  const navigate = useNavigate();
  const {
    favorites,
    categories,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    addCategory,
    removeCategory,
    updateCategory,
    getFavoritesByCategory
  } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(colorOptions[0]);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredFavorites = getFavoritesByCategory(selectedCategory);

  const sortOptions: { field: SortField; label: string; icon: React.ReactNode }[] = [
    { field: 'favoritedAt', label: '收藏时间', icon: <Clock className="w-4 h-4" /> },
    { field: 'name', label: '名称', icon: <ArrowUpDown className="w-4 h-4" /> },
    { field: 'calories', label: '热量', icon: <Flame className="w-4 h-4" /> }
  ];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor(colorOptions[0]);
      setShowAddCategory(false);
    }
  };

  const handleUpdateCategory = (categoryId: string) => {
    if (newCategoryName.trim()) {
      updateCategory(categoryId, newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor(colorOptions[0]);
      setEditingCategory(null);
    }
  };

  const startEditCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setNewCategoryName(category.name);
      setNewCategoryColor(category.color);
      setEditingCategory(categoryId);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryColor(colorOptions[0]);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
            </div>
            <div>
              <h1 className="font-poppins text-2xl md:text-3xl font-bold text-gray-800">
                我的收藏
              </h1>
              <p className="text-gray-500">
                共收藏 {favorites.length} 款零食
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 card-shadow sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">分类管理</h3>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddCategory && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="分类名称"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 mb-3"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-2 mb-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          newCategoryColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCategory}
                      className="flex-1 px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    {editingCategory === category.id ? (
                      <div className="p-3 bg-gray-50 rounded-xl mb-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="分类名称"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 mb-3"
                          autoFocus
                        />
                        <div className="flex flex-wrap gap-2 mb-3">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => setNewCategoryColor(color)}
                              className={`w-6 h-6 rounded-full transition-transform ${
                                newCategoryColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateCategory(category.id)}
                            className="flex-1 px-3 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary-50 text-primary-600'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-sm">{category.name}</span>
                          <span className="text-xs text-gray-400">
                            ({category.id === 'all' ? favorites.length : getFavoritesByCategory(category.id).length})
                          </span>
                        </div>
                        {category.id !== 'all' && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditCategory(category.id);
                              }}
                              className="p-1 rounded hover:bg-gray-200"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('确定要删除这个分类吗？')) {
                                  removeCategory(category.id);
                                  if (selectedCategory === category.id) {
                                    setSelectedCategory('all');
                                  }
                                }
                              }}
                              className="p-1 rounded hover:bg-red-100 text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-800">
                {categories.find(c => c.id === selectedCategory)?.name || '全部收藏'}
                <span className="text-gray-400 font-normal ml-2">
                  ({filteredFavorites.length})
                </span>
              </h2>

              <div className="relative">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSortOrder}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title={sortOrder === 'asc' ? '升序' : '降序'}
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {sortOptions.find(o => o.field === sortField)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {showSortMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSortMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {sortOptions.map((option) => (
                        <button
                          key={option.field}
                          onClick={() => {
                            setSortField(option.field);
                            setShowSortMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                            sortField === option.field
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-600'
                          }`}
                        >
                          {option.icon}
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center card-shadow">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Folder className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {selectedCategory === 'all' ? '还没有收藏任何零食' : '该分类下暂无零食'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {selectedCategory === 'all'
                    ? '去首页发现你喜欢的零食吧'
                    : '可以在零食详情页将零食添加到这个分类'}
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                >
                  去逛逛
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFavorites.map((item) => (
                  <SnackCard key={item.snackId} snack={item.snack} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
