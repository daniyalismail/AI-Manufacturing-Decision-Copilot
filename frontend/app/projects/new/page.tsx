"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { projectService } from '../../../services/projectService';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Automotive & Hardware');
  const [targetBudget, setTargetBudget] = useState('50000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Project name and description are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const created = await projectService.createProject({
        name: name.trim(),
        description: description.trim(),
        category,
        targetBudget: parseInt(targetBudget, 10) || 50000,
      });

      router.push(`/projects/${created.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create project. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in duration-500 pt-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/projects')}
          className="rounded-full"
          aria-label="Back to Projects"
        >
          <ArrowLeft className="w-5 h-5 text-ink-black" />
        </Button>

        <div>
          <h1 className="text-[36px] font-bold tracking-tight text-ink-black leading-none">
            Create Sourcing Project
          </h1>
          <p className="text-[14px] text-stone-gray font-medium mt-1">
            Initialize a new procurement evaluation workspace.
          </p>
        </div>
      </div>

      <Card className="p-8 md:p-10 space-y-6 bg-pure-white border border-hairline-mist card-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Name *"
            placeholder="e.g. Precision CNC Machined Housing Sourcing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Description & Key Objectives *"
            placeholder="Describe the procurement requirements, estimated volume, target delivery timeframe, and compliance standards..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-ink-black/90">
                Industry Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 rounded-[12px] border border-hairline-mist bg-pure-white text-[15px] text-ink-black focus:outline-none focus:ring-2 focus:ring-ink-black/20"
              >
                <option value="Automotive & Hardware">Automotive & Hardware</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Heavy Industry">Heavy Industry</option>
                <option value="Electronics & IT">Electronics & IT</option>
                <option value="Aerospace">Aerospace</option>
              </select>
            </div>

            <Input
              label="Target Budget ($ USD)"
              type="number"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
              placeholder="50000"
            />
          </div>

          {error && <p className="text-[13px] text-coral-pop font-medium">{error}</p>}

          <div className="pt-4 border-t border-hairline-mist flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.push('/projects')}>
              Cancel
            </Button>
            <Button type="submit" variant="action" disabled={loading} className="gap-2 shadow-md">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Workspace...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Project Workspace</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
