import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skills, categories } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';

export function SkillForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'HOURLY' | 'SESSION' | 'FLAT'>('FLAT');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categories.list,
  });

  const { data: existingSkill } = useQuery({
    queryKey: ['skill', id],
    queryFn: () => skills.get(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingSkill) {
      setTitle(existingSkill.title);
      setDescription(existingSkill.description);
      setPrice((existingSkill.price / 100).toString());
      setPriceType(existingSkill.priceType);
      setCategory(existingSkill.category);
      setTags(existingSkill.tags?.join(', ') || '');
    }
  }, [existingSkill]);

  const mutation = useMutation({
    mutationFn: (data: any) => (isEditing ? skills.update(id!, data) : skills.create(data)),
    onSuccess: (result) => {
      toast.success(isEditing ? 'Skill updated!' : 'Skill created!');
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      navigate(`/skills/${result.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save skill');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      description,
      price: Math.round(parseFloat(price) * 100),
      priceType,
      category,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
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
        {isEditing ? 'Edit Skill' : 'Post a Skill'}
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="title"
            label="What can you do?"
            placeholder="e.g., Foot massage, Website design, Guitar lessons"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            id="description"
            label="Tell people about it"
            placeholder="Describe your skill, experience, and what you offer..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              type="number"
              label="Price ($)"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Price Type</label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as any)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="FLAT">Flat rate</option>
                <option value="HOURLY">Per hour</option>
                <option value="SESSION">Per session</option>
              </select>
            </div>
          </div>

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

          <Input
            id="tags"
            label="Tags (optional)"
            placeholder="relaxation, therapeutic, professional (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending} className="flex-1">
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update Skill' : 'Post Skill'}
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
