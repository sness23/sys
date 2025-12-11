import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skills, requests } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { formatPrice, getInitials } from '../lib/utils';
import { Button } from '../components/Button';
import { Textarea } from '../components/Input';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';

export function SkillDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const { data: skill, isLoading } = useQuery({
    queryKey: ['skill', id],
    queryFn: () => skills.get(id!),
    enabled: !!id,
  });

  const requestMutation = useMutation({
    mutationFn: () => requests.create({ skillId: id!, message: message || undefined }),
    onSuccess: () => {
      toast.success('Request sent!');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate('/requests');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send request');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => skills.delete(id!),
    onSuccess: () => {
      toast.success('Skill deleted');
      navigate('/skills');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete');
    },
  });

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!skill) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Skill not found</div>;
  }

  const isOwner = user?.id === skill.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-medium">
                {skill.user.avatarUrl ? (
                  <img
                    src={skill.user.avatarUrl}
                    alt={skill.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(skill.user.name)
                )}
              </div>
              <div>
                <Link
                  to={`/users/${skill.user.id}`}
                  className="font-semibold text-lg text-gray-900 hover:text-primary-600"
                >
                  {skill.user.name}
                </Link>
                <p className="text-gray-500">{skill.category}</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{skill.title}</h1>

            <div className="text-3xl font-bold text-primary-600 mb-6">
              {formatPrice(skill.price, skill.priceType)}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{skill.description}</p>
            </div>

            {skill.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {skill.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {isOwner ? (
            <Card>
              <h3 className="font-semibold mb-4">Manage Skill</h3>
              <div className="space-y-2">
                <Link to={`/skills/${id}/edit`} className="block">
                  <Button variant="outline" className="w-full">
                    Edit Skill
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this skill?')) {
                      deleteMutation.mutate();
                    }
                  }}
                >
                  Delete Skill
                </Button>
              </div>
            </Card>
          ) : user ? (
            <Card>
              {showRequestForm ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Send Request</h3>
                  <Textarea
                    placeholder="Add a message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => requestMutation.mutate()}
                      disabled={requestMutation.isPending}
                      className="flex-1"
                    >
                      {requestMutation.isPending ? 'Sending...' : 'Send Request'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowRequestForm(true)} className="w-full">
                  Request This Skill
                </Button>
              )}
            </Card>
          ) : (
            <Card>
              <p className="text-gray-600 mb-4">Sign in to request this skill</p>
              <Link to="/login">
                <Button className="w-full">Sign In</Button>
              </Link>
            </Card>
          )}

          {/* Payment Info */}
          {(skill.user.venmoHandle || skill.user.cashAppHandle || skill.user.paypalHandle) && (
            <Card>
              <h3 className="font-semibold mb-3">Payment Methods</h3>
              <div className="space-y-2 text-sm">
                {skill.user.venmoHandle && (
                  <p>
                    <span className="text-gray-500">Venmo:</span> @{skill.user.venmoHandle}
                  </p>
                )}
                {skill.user.cashAppHandle && (
                  <p>
                    <span className="text-gray-500">Cash App:</span> ${skill.user.cashAppHandle}
                  </p>
                )}
                {skill.user.paypalHandle && (
                  <p>
                    <span className="text-gray-500">PayPal:</span> {skill.user.paypalHandle}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
