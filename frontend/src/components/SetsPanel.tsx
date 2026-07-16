import React, { useState, useEffect } from 'react';
import { Table, Column } from './Table';
import { Layers } from 'lucide-react';

export const SetsPanel: React.FC<{ token: string }> = ({ token }) => {
  const [sets, setSets] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    setId: '',
    assessmentName: '',
    schoolId: '',
    classGroup: '',
    status: ''
  });

  const fetchSets = () => {
    const queryParams = new URLSearchParams();
    if (filters.setId) queryParams.append('setId', filters.setId);
    if (filters.assessmentName) queryParams.append('assessmentName', filters.assessmentName);
    if (filters.schoolId) queryParams.append('schoolId', filters.schoolId);
    if (filters.classGroup) queryParams.append('classGroup', filters.classGroup);
    if (filters.status) queryParams.append('status', filters.status);

    const url = `/api/sets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setSets(d);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchSets();
  }, [token]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns: Column<any>[] = [
    { header: 'Set ID', accessor: 'id', className: 'font-mono text-xs text-slate-500' },
    { header: 'Name', accessor: 'name', className: 'font-semibold text-slate-800 dark:text-slate-100' },
    { header: 'Assessment', accessor: 'assessmentName', className: 'text-sm' },
    { header: 'School', accessor: 'schoolId', className: 'text-sm text-slate-500' },
    { header: 'Grade', accessor: 'classGroup', className: 'text-sm' },
    { header: 'Students', accessor: (row) => row.studentIds?.length || 0, className: 'text-sm font-mono' },
    { header: 'Status', accessor: 'status', className: 'text-sm' },
    { header: 'Created', accessor: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-sm text-slate-500' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div className="text-slate-500 dark:text-slate-400">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">District Sets</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage and track bulk paper generation batches.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <input 
          type="text" 
          name="setId"
          placeholder="Filter by Set ID..." 
          value={filters.setId}
          onChange={handleFilterChange}
          className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
        />
        <input 
          type="text" 
          name="assessmentName"
          placeholder="Filter by Assessment..." 
          value={filters.assessmentName}
          onChange={handleFilterChange}
          className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
        />
        <input 
          type="text" 
          name="schoolId"
          placeholder="Filter by School ID..." 
          value={filters.schoolId}
          onChange={handleFilterChange}
          className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
        />
        <input 
          type="text" 
          name="classGroup"
          placeholder="Filter by Grade..." 
          value={filters.classGroup}
          onChange={handleFilterChange}
          className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          <select 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="flex-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Created">Created</option>
            <option value="Question Papers Generated">Question Papers Generated</option>
            <option value="Printed">Printed</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered to School">Delivered to School</option>
            <option value="Assessment Conducted">Assessment Conducted</option>
            <option value="Answer Sheets Returned">Answer Sheets Returned</option>
            <option value="Scanning Completed">Scanning Completed</option>
            <option value="Evaluation Completed">Evaluation Completed</option>
          </select>
          <button 
            onClick={fetchSets}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <Table data={sets} columns={columns} />
    </div>
  );
};
