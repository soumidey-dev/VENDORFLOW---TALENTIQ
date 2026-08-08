import React, { useState } from 'react';
import { MarksheetData, MarksheetSubject } from '../../types/career';
import { GraduationCap, Award, BookOpen, Upload, CheckCircle2, AlertCircle, TrendingUp, Plus, Trash2 } from 'lucide-react';

interface MarksheetAnalyzerSectionProps {
  marksheet: MarksheetData;
  onUpdateMarksheet: (marksheet: MarksheetData) => void;
  isDark?: boolean;
}

export const MarksheetAnalyzerSection: React.FC<MarksheetAnalyzerSectionProps> = ({
  marksheet,
  onUpdateMarksheet,
  isDark = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjMarks, setNewSubjMarks] = useState<number>(85);

  const handleSimulatedMarksheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
    }, 1000);
  };

  const handleAddSubject = () => {
    if (!newSubjName.trim()) return;

    const newSubj: MarksheetSubject = {
      name: newSubjName.trim(),
      marks: newSubjMarks,
      maxMarks: 100,
      grade: newSubjMarks >= 90 ? 'O' : newSubjMarks >= 80 ? 'A+' : 'A'
    };

    const updatedSubjects = [...marksheet.subjects, newSubj];
    const totalMarks = updatedSubjects.reduce((acc, curr) => acc + curr.marks, 0);
    const avg = totalMarks / updatedSubjects.length;
    const computedCGPA = parseFloat((avg / 10).toFixed(2));

    const strong = updatedSubjects.filter(s => s.marks >= 85).map(s => s.name);
    const moderate = updatedSubjects.filter(s => s.marks >= 70 && s.marks < 85).map(s => s.name);

    onUpdateMarksheet({
      ...marksheet,
      subjects: updatedSubjects,
      cgpa: computedCGPA,
      percentage: parseFloat(avg.toFixed(1)),
      strongSubjects: strong,
      moderateSubjects: moderate
    });

    setNewSubjName('');
    setNewSubjMarks(85);
  };

  const handleDeleteSubject = (idx: number) => {
    const updated = marksheet.subjects.filter((_, i) => i !== idx);
    onUpdateMarksheet({
      ...marksheet,
      subjects: updated
    });
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Academic Marksheet & Transcript Analyzer
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full">
                ACADEMIC SIGNAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Extract semester subjects, strong technical domains, and performance trend.
            </p>
          </div>
        </div>

        {/* CGPA Badge */}
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center space-x-3 font-mono">
          <div className="text-right">
            <span className="text-[10px] text-teal-400 font-bold uppercase block">OVERALL ACADEMIC CGPA</span>
            <span className="text-xl font-extrabold text-teal-300">{marksheet.cgpa} / 10.0</span>
          </div>
          <Award className="w-6 h-6 text-teal-400" />
        </div>
      </div>

      {/* Upload or Add Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        
        {/* Upload Marksheet Box */}
        <div className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-2 relative ${
          isDark ? 'bg-[#080B12] border-slate-800 hover:border-teal-500/50' : 'bg-slate-50 border-slate-300 hover:border-teal-500'
        }`}>
          <input
            type="file"
            accept=".pdf,.png,.jpg"
            onChange={handleSimulatedMarksheetUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            disabled={isUploading}
          />
          <Upload className="w-5 h-5 text-teal-400" />
          <span className="font-bold text-slate-200">
            {isUploading ? 'Extracting Marksheet Transcript...' : 'Upload Marksheet PDF / Image'}
          </span>
        </div>

        {/* Add Subject manually */}
        <div className={`md:col-span-2 p-4 rounded-xl border space-y-3 ${
          isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="font-bold text-slate-200 block">Add Academic Subject & Score</span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={newSubjName}
              onChange={(e) => setNewSubjName(e.target.value)}
              placeholder="e.g. Distributed Operating Systems"
              className={`flex-1 min-w-[180px] px-3 py-1.5 rounded-lg border text-xs ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={newSubjMarks}
              onChange={(e) => setNewSubjMarks(parseInt(e.target.value) || 0)}
              placeholder="Marks (100)"
              className={`w-24 px-3 py-1.5 rounded-lg border text-xs ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <button
              onClick={handleAddSubject}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

      </div>

      {/* Subject Breakdown Table */}
      <div className="space-y-3 font-mono text-xs">
        <span className="font-bold text-slate-300 block flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-teal-400" /> Semester Subject Breakdown
        </span>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left">
            <thead className={`text-[11px] uppercase tracking-wider ${
              isDark ? 'bg-slate-900/80 text-slate-400 border-b border-slate-800' : 'bg-slate-100 text-slate-600 border-b border-slate-200'
            }`}>
              <tr>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Marks (100)</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {marksheet.subjects.map((subj, idx) => (
                <tr key={idx} className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'}>
                  <td className={`p-3 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{subj.name}</td>
                  <td className="p-3 text-teal-400 font-bold">{subj.marks} / 100</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                      {subj.grade || (subj.marks >= 90 ? 'O' : 'A+')}
                    </span>
                  </td>
                  <td className="p-3">
                    {subj.marks >= 85 ? (
                      <span className="text-emerald-400 font-bold">Strong Subject</span>
                    ) : (
                      <span className="text-slate-400">Moderate Subject</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteSubject(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                      title="Remove subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center space-x-2 text-xs font-mono text-amber-300">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>AI Safety Notice:</strong> Academic grades serve as one technical signal alongside practical projects, GitHub code, and certifications. Marks are not the sole determinant of career capability.
        </span>
      </div>

    </div>
  );
};
