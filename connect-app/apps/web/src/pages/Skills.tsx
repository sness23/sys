import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { skills, categories } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SkillCard } from '../components/SkillCard';

export function Skills() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categories.list,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['skills', { search, category }],
    queryFn: () => skills.list({ search: search || undefined, category: category || undefined }),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
        {user && (
          <Link to="/skills/new">
            <Button>Post a Skill</Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categoriesData?.map((cat: any) => (
            <option key={cat.id} value={cat.name}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : data?.skills?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.skills.map((skill: any) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No skills found</p>
          {user && (
            <Link to="/skills/new">
              <Button>Post the first skill</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
