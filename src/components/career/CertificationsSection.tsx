import React, { useState } from 'react';
import { CertificationItem } from '../../types/career';
import { Award, Plus, Trash2, Edit3, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CertificationsSectionProps {
  certifications: CertificationItem[];
  onUpdateCertifications: (certs: CertificationItem[]) => void;
  isDark?: boolean;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onUpdateCertifications,
  isDark = true
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CertificationItem>>({
    name: '',
    issuingOrganization: '',
    year: '2025',
    skillsCovered: []
  });
  const [skillsText, setSkillsText] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleStartAdd = () => {
    setEditingId('NEW');
    setFormData({
      name: '',
      issuingOrganization: '',
      year: '2025',
      skillsCovered: []
    });
    setSkillsText('');
  };

  const handleStartEdit = (cert: CertificationItem) => {
    setEditingId(cert.id);
    setFormData(cert);
    setSkillsText(cert.skillsCovered.join(', '));
  };

  const handleDelete = (id: string) => {
    onUpdateCertifications(certifications.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name?.trim()) return;

    const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    const updatedCert: CertificationItem = {
      id: editingId === 'NEW' ? `cert-${Date.now()}` : (editingId || `cert-${Date.now()}`),
      name: formData.name.trim(),
      issuingOrganization: formData.issuingOrganization?.trim() || 'Recognized Provider',
      year: formData.year || '2025',
      skillsCovered: skills.length > 0 ? skills : ['General IT / Cloud']
    };

    if (editingId === 'NEW') {
      onUpdateCertifications([...certifications, updatedCert]);
    } else {
      onUpdateCertifications(certifications.map(c => c.id === editingId ? updatedCert : c));
    }

    setEditingId(null);
    setSaveMessage('Certifications saved successfully.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-[#0B0F19] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-extrabold tracking-tight">Certifications & Credentials</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add verified certifications to boost skill confidence and candidate score for target technical roles.
            </p>
          </div>

          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>

        {saveMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      {/* Edit or Add Form */}
      {editingId && (
        <div className={`p-6 rounded-2xl border space-y-4 font-mono ${
          isDark ? 'bg-slate-900 border-amber-500/40' : 'bg-amber-50/50 border-amber-300'
        }`}>
          <h4 className="text-sm font-bold text-amber-400">
            {editingId === 'NEW' ? 'Add New Certification' : 'Edit Certification'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Certification Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. AWS Certified Developer Associate / Oracle Java SE"
                className={`w-full px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Issuing Organization</label>
              <input
                type="text"
                value={formData.issuingOrganization || ''}
                onChange={e => setFormData({ ...formData, issuingOrganization: e.target.value })}
                placeholder="e.g. Amazon Web Services / Oracle / Coursera"
                className={`w-full px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Year Issued</label>
              <input
                type="text"
                value={formData.year || ''}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2025"
                className={`w-full px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Skills Covered (comma separated)</label>
              <input
                type="text"
                value={skillsText}
                onChange={e => setSkillsText(e.target.value)}
                placeholder="e.g. AWS EC2, S3, Docker, Java"
                className={`w-full px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Certification</span>
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Certifications List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.length === 0 ? (
          <div className={`col-span-2 p-8 rounded-2xl border text-center font-mono ${
            isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            No certifications added yet. Click "Add Certification" above to register credentials.
          </div>
        ) : (
          certifications.map(cert => (
            <div
              key={cert.id}
              className={`p-5 rounded-2xl border space-y-3 font-mono relative transition-all ${
                isDark ? 'bg-[#0B0F19] border-slate-800 hover:border-amber-500/30' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{cert.name}</h4>
                    <p className="text-xs text-amber-400 font-semibold">{cert.issuingOrganization} • {cert.year}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleStartEdit(cert)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit Certification"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Skills Verified:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skillsCovered.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
