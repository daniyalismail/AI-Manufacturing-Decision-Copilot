"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { projectService } from '../../services/projectService';
import { useProjects } from '../../hooks/useProjects';
import { Search, Plus, ArrowRight, FileText, Calendar, DollarSign } from 'lucide-react';
import { Project } from '../../types';

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projectsList = [], isLoading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Analyzed' | 'Processing' | 'Draft'>('All');

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      (p.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'All' || p.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in duration-500 pt-4">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-[40px] sm:text-[52px] font-bold tracking-tight text-ink-black leading-tight">
            Procurement Projects
          </h1>
          <p className="text-[16px] text-stone-gray font-medium mt-1">
            Browse and manage enterprise sourcing evaluations and RFP packages.
          </p>
        </div>

        <Button variant="action" onClick={() => router.push('/projects/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Project
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Filter Badges Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {(['All', 'Analyzed', 'Processing', 'Draft'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[14px] font-bold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-ink-black text-pure-white shadow-sm'
                  : 'bg-pure-white text-stone-gray hover:text-ink-black border border-hairline-mist'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-stone-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-hairline-mist bg-pure-white text-[14px] text-ink-black focus:outline-none focus:ring-2 focus:ring-ink-black/20"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <div className="text-[20px] font-bold text-ink-black animate-pulse">Loading projects...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="py-16 text-center space-y-4 bg-pure-white border border-hairline-mist">
          <div className="text-[20px] font-bold text-ink-black">No projects found</div>
          <p className="text-[14px] text-stone-gray">Try adjusting your search query or filter criteria.</p>
          <Button variant="default" onClick={() => { setSearchTerm(''); setActiveFilter('All'); }}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <Card
              key={proj.id}
              className="flex flex-col justify-between space-y-6 hover:border-ink-black/40 transition-colors cursor-pointer group"
              onClick={() => router.push(`/projects/${proj.id}`)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge status={proj.status || 'Draft'}>{proj.status || 'Draft'}</Badge>
                  <span className="text-[12px] text-stone-gray font-semibold uppercase tracking-wider">
                    {proj.category || 'Category'}
                  </span>
                </div>

                <div>
                  <h3 className="text-[22px] font-bold text-ink-black leading-tight group-hover:text-sky-pop transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-[14px] text-stone-gray mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-hairline-mist">
                <div className="grid grid-cols-2 gap-2 text-[13px] text-stone-gray font-medium">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-pop" />
                    <span>{proj.documents?.length || 0} RFP Files</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-gray" />
                    <span>{proj.date || new Date().toISOString().split('T')[0]}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[13px] font-bold text-ink-black">
                    Budget: ${proj.targetBudget ? proj.targetBudget.toLocaleString() : '50,000'}
                  </span>
                  <Button variant="ghost" size="sm" className="gap-1 text-[13px]">
                    <span>Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
