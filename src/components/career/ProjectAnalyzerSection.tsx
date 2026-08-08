import React, { useState } from 'react';
import { CandidateProject } from '../../types/career';
import { FolderGit2, Plus, Github, ExternalLink, Trash2, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProjectAnalyzerSectionProps {
  projects: CandidateProject[];
  onUpdateProjects: (projects: CandidateProject[]) => void;
  isDark?: boolean;
}

export const ProjectAnalyzerSection: React.FC<ProjectAnalyzerSectionProps> = ({
  projects,
  onUpdateProjects,
  isDark = true
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [techString, setTechString] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  const handleAddProject = () => {
    if (!name.trim()) return;

    const techArray = techString.split(',').map(t => t.trim()).filter(Boolean);

    const newProject: CandidateProject = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || 'Software application repository.',
      technologies: techArray.length > 0 ? techArray : ['Java', 'SQL'],
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      relevanceScore: Math.min(95, 70 + techArray.length * 5),
      targetRoleRelevance: 'High relevance for Software Engineering roles'
    };

    onUpdateProjects([...projects, newProject]);

    setName('');
    setDesc('');
    setTechString('');
    setGithubUrl('');
    setLiveUrl('');
    setShowAddModal(false);
  };

  const handleDeleteProject = (id: string) => {
    onUpdateProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Project Portfolio & Repository Analyzer
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">
                TECHNICAL EVIDENCE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluate complexity, stack relevance, and demonstrated engineering capability.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {projects.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No projects added yet. Click "Add Project" or load a demo profile.
          </div>
        ) : (
          projects.map(proj => (
            <div
              key={proj.id}
              className={`p-4 rounded-xl border space-y-3 relative transition-all ${
                isDark ? 'bg-[#080B12] border-slate-800 hover:border-purple-500/50' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{proj.name}</h4>
                  <span className="text-[10px] text-purple-400 font-bold block">{proj.targetRoleRelevance}</span>
                </div>
                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                  title="Remove Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">{proj.description}</p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {proj.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-800/80 text-[11px]">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Code</span>
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
                <span className="ml-auto font-bold text-purple-400">Relevance: {proj.relevanceScore}%</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal to add new project */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`p-6 rounded-2xl border max-w-lg w-full space-y-4 font-mono text-xs ${
            isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5" /> Add Engineering Project
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Order Management System"
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description & Architecture</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Explain high-level architecture, database model, caching, and key results..."
                  rows={3}
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Technologies (Comma Separated)</label>
                <input
                  type="text"
                  value={techString}
                  onChange={(e) => setTechString(e.target.value)}
                  placeholder="Java, Spring Boot, PostgreSQL, Redis, Docker"
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className={`w-full p-2 rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Live URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://app.demo.com"
                    className={`w-full p-2 rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
