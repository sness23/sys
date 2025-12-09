import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { requests } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { formatPrice, getInitials, formatDate } from '../lib/utils';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

export function Requests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'all' | 'sent' | 'received'>('all');

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['requests', tab],
    queryFn: () => requests.list(tab),
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => requests.update(id, status),
    onSuccess: () => {
      toast.success('Request updated');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update request');
    },
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Requests</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {(['all', 'sent', 'received'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === t
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : requestsData?.length > 0 ? (
        <div className="space-y-4">
          {requestsData.map((request: any) => {
            const isSent = request.requesterId === user.id;
            const otherUser = isSent ? request.provider : request.requester;

            return (
              <Card key={request.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium flex-shrink-0">
                      {otherUser.avatarUrl ? (
                        <img
                          src={otherUser.avatarUrl}
                          alt={otherUser.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(otherUser.name)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500">
                          {isSent ? 'You requested' : 'Request from'}
                        </span>
                        <Link
                          to={`/users/${otherUser.id}`}
                          className="font-medium text-gray-900 hover:text-primary-600"
                        >
                          {isSent ? '' : otherUser.name}
                        </Link>
                      </div>
                      <Link
                        to={`/skills/${request.skill.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {request.skill.title}
                      </Link>
                      <p className="text-primary-600 font-medium">
                        {formatPrice(request.skill.price, request.skill.priceType)}
                      </p>
                      {request.message && (
                        <p className="text-gray-600 mt-2 text-sm">"{request.message}"</p>
                      )}
                      <p className="text-gray-400 text-sm mt-2">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_COLORS[request.status]
                      }`}
                    >
                      {request.status}
                    </span>

                    {/* Actions */}
                    {request.status === 'PENDING' && !isSent && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateMutation.mutate({ id: request.id, status: 'APPROVED' })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateMutation.mutate({ id: request.id, status: 'DECLINED' })
                          }
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {request.status === 'PENDING' && isSent && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          updateMutation.mutate({ id: request.id, status: 'CANCELLED' })
                        }
                      >
                        Cancel
                      </Button>
                    )}

                    {request.status === 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          updateMutation.mutate({ id: request.id, status: 'COMPLETED' })
                        }
                      >
                        Mark Complete
                      </Button>
                    )}

                    {request.status === 'APPROVED' && !isSent && (
                      <div className="text-sm text-gray-500 mt-2">
                        {request.provider.venmoHandle && (
                          <p>Venmo: @{request.provider.venmoHandle}</p>
                        )}
                        {request.provider.cashAppHandle && (
                          <p>Cash App: ${request.provider.cashAppHandle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No requests yet</p>
          <Link to="/skills">
            <Button>Browse Skills</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
