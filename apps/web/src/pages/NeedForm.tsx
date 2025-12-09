import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { needs, categories } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';

export function NeedForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categories.list,
  });

  const { data: existingNeed } = useQuery({
    queryKey: ['need', id],
    queryFn: () => needs.get(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingNeed) {
      setTitle(existingNeed.title);
      setDescription(existingNeed.description);
      setBudget(existingNeed.budget ? (existingNeed.budget / 100).toString() : '');
      setCategory(existingNeed.category);
    }
  }, [existingNeed]);

  const mutation = useMutation({
    mutationFn: (data: any) => (isEditing ? needs.update(id!, data) : needs.create(data)),
    onSuccess: (result) => {
      toast.success(isEditing ? 'Need updated!' : 'Need posted!');
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      navigate(`/needs/${result.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save need');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      description,
      budget: budget ? Math.round(parseFloat(budget) * 100) : null,
      category,
    };

    mutation.mutate(data);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEditing ? 'Edit Need' : 'Post a Need'}
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="title"
            label="What do you need?"
            placeholder="e.g., Help moving furniture, Spanish tutor, Ride to the airport"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            id="description"
            label="Tell people more"
            placeholder="Describe what you need, when you need it, and any other details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />

          <Input
            id="budget"
            type="number"
            label="Budget (optional)"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {categoriesData?.map((cat: any) => (
                <option key={cat.id} value={cat.name}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending} className="flex-1">
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update Need' : 'Post Need'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
