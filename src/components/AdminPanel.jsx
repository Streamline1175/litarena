import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Lock,
  Unlock,
  Download,
  Upload,
  GripVertical,
  Eye,
  EyeOff,
  ArrowLeft,
  ImagePlus,
  Video,
  FolderDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminPanel({ bots, updateBots }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [editingBot, setEditingBot] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Simple password check - stored in localStorage
  const ADMIN_PASSWORD = localStorage.getItem('adminPassword') || 'litarena2025';

  useEffect(() => {
    // Check if already authenticated in session
    const isAuth = sessionStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
      setPassword('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(bots);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateBots(items);
  };

  const handleDeleteBot = (botId) => {
    if (window.confirm('Are you sure you want to delete this bot?')) {
      updateBots(bots.filter(b => b.id !== botId));
    }
  };

  const handleSaveBot = (botData) => {
    if (isAddingNew) {
      // Generate ID from name
      const id = botData.name.toLowerCase().replace(/\s+/g, '-');
      updateBots([...bots, { ...botData, id }]);
    } else {
      updateBots(bots.map(b => b.id === botData.id ? botData : b));
    }
    setEditingBot(null);
    setIsAddingNew(false);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(bots, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bots-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (window.confirm('This will replace all current bots. Continue?')) {
            updateBots(imported);
          }
        } catch (err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect p-8 rounded-2xl max-w-md w-full card-shadow"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="inline-block p-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4"
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
            <p className="text-gray-400 mt-2">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all"
            >
              Login
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Default password: litarena2025
            </p>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 glass-effect glass-hover rounded-xl"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
              <p className="text-gray-400">Manage your bot showcase</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-file"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('import-file').click()}
              className="p-3 glass-effect glass-hover rounded-xl"
              title="Import JSON"
            >
              <Upload size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="p-3 glass-effect glass-hover rounded-xl"
              title="Export JSON"
            >
              <Download size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsAddingNew(true);
                setEditingBot({
                  id: '',
                  name: '',
                  icon: '',
                  description: '',
                  status: 'active',
                  installUrl: '',
                  features: [],
                  screenshots: [],
                  videos: [],
                  pricing: {
                    model: 'freemium',
                    tiers: [
                      {
                        name: 'Free',
                        price: '$0',
                        period: 'forever',
                        features: ['Basic bot functionality', 'Standard commands', 'Community support']
                      },
                      {
                        name: 'Premium',
                        price: '$4.99',
                        period: 'month',
                        features: ['Everything in Free', 'Advanced features', 'Priority support', 'Custom configurations'],
                        popular: true
                      }
                    ]
                  },
                  changelog: [],
                  tos: null,
                  privacy: null
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add Bot
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-3 glass-effect glass-hover rounded-xl"
              title="Logout"
            >
              <Unlock size={20} />
            </motion.button>
          </div>
        </div>

        {/* Bot List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="bots">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {bots.map((bot, index) => (
                  <Draggable key={bot.id} draggableId={bot.id} index={index}>
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`glass-effect p-6 rounded-2xl ${
                          snapshot.isDragging ? 'glow-effect' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="text-gray-400" />
                          </div>

                          <img
                            src={bot.icon}
                            alt={bot.name}
                            className="w-16 h-16 rounded-xl object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64';
                            }}
                          />

                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{bot.name}</h3>
                            <p className="text-gray-400 text-sm line-clamp-1">
                              {bot.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                bot.status === 'active'
                                  ? 'bg-green-500/20 text-green-400'
                                  : bot.status === 'beta'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {bot.status}
                            </span>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditingBot(bot)}
                              className="p-2 glass-effect glass-hover rounded-lg"
                            >
                              <Edit2 size={18} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteBot(bot.id)}
                              className="p-2 glass-effect glass-hover rounded-lg text-red-400"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingBot && (
            <BotEditor
              bot={editingBot}
              onSave={handleSaveBot}
              onClose={() => {
                setEditingBot(null);
                setIsAddingNew(false);
              }}
              isNew={isAddingNew}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Bot Editor Modal Component
function BotEditor({ bot, onSave, onClose, isNew }) {
  const [formData, setFormData] = useState(bot);
  const [uploadedFiles, setUploadedFiles] = useState({ screenshots: [], videos: [] });
  const [showUploadInstructions, setShowUploadInstructions] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, value) => {
    const items = value.split('\n').filter(item => item.trim());
    updateField(field, items);
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const botId = formData.id || formData.name.toLowerCase().replace(/\s+/g, '-');

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const extension = file.name.split('.').pop();
        const fileName = `screenshot-${uploadedFiles[type].length + index + 1}.${extension}`;
        const filePath = `/litarena/screenshots/${botId}/${fileName}`;

        setUploadedFiles(prev => ({
          ...prev,
          [type]: [...prev[type], {
            name: fileName,
            path: filePath,
            data: reader.result,
            originalName: file.name
          }]
        }));

        // Add the path to the form data
        const currentPaths = formData[type] || [];
        updateField(type, [...currentPaths, filePath]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedFile = (type, index) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));

    const newPaths = formData[type].filter((_, i) => i !== index);
    updateField(type, newPaths);
  };

  const downloadUploadedFiles = () => {
    const botId = formData.id || formData.name.toLowerCase().replace(/\s+/g, '-');
    let instructions = `# File Upload Instructions for ${formData.name}\n\n`;
    instructions += `## Steps to add your uploaded files to the repository:\n\n`;
    instructions += `1. Create the screenshots directory:\n`;
    instructions += `   mkdir -p public/screenshots/${botId}\n\n`;
    instructions += `2. Save the downloaded files to:\n`;
    instructions += `   public/screenshots/${botId}/\n\n`;
    instructions += `3. Commit the changes:\n`;
    instructions += `   git add public/screenshots/${botId}/\n`;
    instructions += `   git add src/data/bots.json\n`;
    instructions += `   git commit -m "Add screenshots for ${formData.name}"\n`;
    instructions += `   git push\n\n`;
    instructions += `## Files to download:\n\n`;

    [...uploadedFiles.screenshots, ...uploadedFiles.videos].forEach(file => {
      instructions += `- ${file.name} (save as: public/screenshots/${botId}/${file.name})\n`;

      // Create download link for each file
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      link.click();
    });

    // Download instructions file
    const instructionsBlob = new Blob([instructions], { type: 'text/plain' });
    const instructionsLink = document.createElement('a');
    instructionsLink.href = URL.createObjectURL(instructionsBlob);
    instructionsLink.download = `upload-instructions-${botId}.txt`;
    instructionsLink.click();

    setShowUploadInstructions(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-effect p-8 rounded-2xl max-w-4xl w-full my-8"
        >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            {isNew ? 'Add New Bot' : 'Edit Bot'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 glass-effect glass-hover rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Bot Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Icon URL *</label>
              <input
                type="url"
                value={formData.icon}
                onChange={(e) => updateField('icon', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="beta">Beta</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 outline-none h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Features (one per line)
            </label>
            <textarea
              value={formData.features.join('\n')}
              onChange={(e) => updateArrayField('features', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 outline-none h-32 font-mono text-sm"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>

          {/* Media Upload Section */}
          <div className="glass-effect p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4 gradient-text flex items-center gap-2">
              <ImagePlus size={20} />
              Media Files (Screenshots & Videos)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Screenshots</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'screenshots')}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-600/20 border-2 border-dashed border-primary-500/50 rounded-xl hover:border-primary-500 hover:bg-primary-600/30 transition-all cursor-pointer"
                  >
                    <ImagePlus size={20} />
                    <span className="text-sm font-medium">Choose Images</span>
                  </label>

                  {uploadedFiles.screenshots.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.screenshots.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-sm text-gray-300 truncate flex-1">{file.originalName}</span>
                          <button
                            type="button"
                            onClick={() => removeUploadedFile('screenshots', index)}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold mb-2 text-gray-400">
                    Or enter URLs (one per line)
                  </label>
                  <textarea
                    value={formData.screenshots.join('\n')}
                    onChange={(e) => updateArrayField('screenshots', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-primary-500 outline-none h-20 font-mono text-xs"
                    placeholder="https://example.com/screenshot1.jpg"
                  />
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Videos</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'videos')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent-600/20 border-2 border-dashed border-accent-500/50 rounded-xl hover:border-accent-500 hover:bg-accent-600/30 transition-all cursor-pointer"
                  >
                    <Video size={20} />
                    <span className="text-sm font-medium">Choose Videos</span>
                  </label>

                  {uploadedFiles.videos.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.videos.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-sm text-gray-300 truncate flex-1">{file.originalName}</span>
                          <button
                            type="button"
                            onClick={() => removeUploadedFile('videos', index)}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold mb-2 text-gray-400">
                    Or enter URLs (one per line)
                  </label>
                  <textarea
                    value={formData.videos.join('\n')}
                    onChange={(e) => updateArrayField('videos', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-primary-500 outline-none h-20 font-mono text-xs"
                    placeholder="https://example.com/demo.mp4"
                  />
                </div>
              </div>
            </div>

            {/* Download Files Button */}
            {(uploadedFiles.screenshots.length > 0 || uploadedFiles.videos.length > 0) && (
              <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <FolderDown className="text-primary-400 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary-300 mb-1">Files Ready for Download</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Click below to download your uploaded files and get instructions on how to add them to your repository.
                    </p>
                    <button
                      type="button"
                      onClick={downloadUploadedFiles}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download Files & Instructions
                    </button>
                  </div>
                </div>

                {showUploadInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-primary-500/30"
                  >
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      Files and instructions downloaded! Follow the instructions file to add them to your repo.
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Install URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Discord Install/Invite URL
            </label>
            <input
              type="url"
              value={formData.installUrl || ''}
              onChange={(e) => updateField('installUrl', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 outline-none font-mono text-sm"
              placeholder="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID"
            />
            <p className="text-xs text-gray-400 mt-1">
              The OAuth2 URL users will use to add this bot to their server
            </p>
          </div>

          {/* Pricing Section */}
          <div className="glass-effect p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Pricing Configuration</h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Pricing Model</label>
              <select
                value={formData.pricing?.model || 'freemium'}
                onChange={(e) => updateField('pricing', { ...formData.pricing, model: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary-500 outline-none"
              >
                <option value="freemium">Freemium</option>
                <option value="subscription">Subscription</option>
                <option value="one-time">One-time Purchase</option>
                <option value="free">Free</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold">Pricing Tiers</label>
                <button
                  type="button"
                  onClick={() => {
                    const tiers = formData.pricing?.tiers || [];
                    updateField('pricing', {
                      ...formData.pricing,
                      tiers: [...tiers, { name: '', price: '', period: 'month', features: [], popular: false }]
                    });
                  }}
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Tier
                </button>
              </div>

              <div className="space-y-4">
                {(formData.pricing?.tiers || []).map((tier, index) => (
                  <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => {
                            const tiers = [...(formData.pricing?.tiers || [])];
                            tiers[index].name = e.target.value;
                            updateField('pricing', { ...formData.pricing, tiers });
                          }}
                          placeholder="Tier Name"
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-primary-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          value={tier.price}
                          onChange={(e) => {
                            const tiers = [...(formData.pricing?.tiers || [])];
                            tiers[index].price = e.target.value;
                            updateField('pricing', { ...formData.pricing, tiers });
                          }}
                          placeholder="$0"
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-primary-500 outline-none text-sm"
                        />
                        <select
                          value={tier.period}
                          onChange={(e) => {
                            const tiers = [...(formData.pricing?.tiers || [])];
                            tiers[index].period = e.target.value;
                            updateField('pricing', { ...formData.pricing, tiers });
                          }}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-primary-500 outline-none text-sm"
                        >
                          <option value="forever">Forever</option>
                          <option value="month">Per Month</option>
                          <option value="year">Per Year</option>
                          <option value="one-time">One-time</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const tiers = (formData.pricing?.tiers || []).filter((_, i) => i !== index);
                          updateField('pricing', { ...formData.pricing, tiers });
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <textarea
                      value={(tier.features || []).join('\n')}
                      onChange={(e) => {
                        const tiers = [...(formData.pricing?.tiers || [])];
                        tiers[index].features = e.target.value.split('\n').filter(f => f.trim());
                        updateField('pricing', { ...formData.pricing, tiers });
                      }}
                      placeholder="Features (one per line)"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-primary-500 outline-none text-sm h-20"
                    />

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tier.popular || false}
                        onChange={(e) => {
                          const tiers = [...(formData.pricing?.tiers || [])];
                          tiers[index].popular = e.target.checked;
                          updateField('pricing', { ...formData.pricing, tiers });
                        }}
                        className="w-4 h-4 rounded accent-primary-500"
                      />
                      <span className="text-sm text-gray-300">Mark as Popular</span>
                    </label>
                  </div>
                ))}

                {(!formData.pricing?.tiers || formData.pricing.tiers.length === 0) && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No pricing tiers yet. Click "Add Tier" to create one.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Bot
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-8 py-3 glass-effect glass-hover rounded-xl font-semibold"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
      </div>
    </motion.div>
  );
}

export default AdminPanel;
