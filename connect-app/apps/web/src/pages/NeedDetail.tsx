import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { needs } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { formatPrice, getInitials } from '../lib/utils';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';

export function NeedDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: need, isLoading } = useQuery({
    queryKey: ['need', id],
    queryFn: () => needs.get(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => needs.delete(id!),
    onSuccess: () => {
      toast.success('Need deleted');
      navigate('/needs');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete');
    },
  });

  const fulfillMutation = useMutation({
    mutationFn: () => needs.update(id!, { isFulfilled: true }),
    onSuccess: () => {
      toast.success('Marked as fulfilled!');
      queryClient.invalidateQueries({ queryKey: ['need', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update');
    },
  });

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!need) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Need not found</div>;
  }

  const isOwner = user?.id === need.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-medium">
                {need.user.avatarUrl ? (
                  <img
                    src={need.user.avatarUrl}
                    alt={need.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(need.user.name)
                )}
              </div>
              <div>
                <Link
                  to={`/users/${need.user.id}`}
                  className="font-semibold text-lg text-gray-900 hover:text-primary-600"
                >
                  {need.user.name}
                </Link>
                <p className="text-gray-500">{need.category}</p>
              </div>
            </div>

            {need.isFulfilled && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4">
                This need has been fulfilled
              </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{need.title}</h1>

            {need.budget && (
              <div className="text-2xl font-bold text-orange-600 mb-6">
                Budget: {formatPrice(need.budget, 'FLAT')}
              </div>
            )}

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{need.description}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {isOwner && (
            <Card>
              <h3 className="font-semibold mb-4">Manage Need</h3>
              <div className="space-y-2">
                {!need.isFulfilled && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => fulfillMutation.mutate()}
                  >
                    Mark as Fulfilled
                  </Button>
                )}
                <Link to={`/needs/${id}/edit`} className="block">
                  <Button variant="outline" className="w-full">
                    Edit Need
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this need?')) {
                      deleteMutation.mutate();
                    }
                  }}
                >
                  Delete Need
                </Button>
              </div>
            </Card>
          )}

          {!isOwner && user && (
            <Card>
              <p className="text-gray-600 mb-4">
                Can you help with this? Check out {need.user.name}'s profile to get in touch.
              </p>
              <Link to={`/users/${need.user.id}`}>
                <Button className="w-full">View Profile</Button>
              </Link>
            </Card>
          )}

          {!user && (
            <Card>
              <p className="text-gray-600 mb-4">Sign in to help with this need</p>
              <Link to="/login">
                <Button className="w-full">Sign In</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
