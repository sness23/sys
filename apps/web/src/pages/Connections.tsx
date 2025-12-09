import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { connections } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { getInitials } from '../lib/utils';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';

export function Connections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const { data: friends, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: connections.list,
    enabled: !!user,
  });

  const createInviteMutation = useMutation({
    mutationFn: connections.createInvite,
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      toast.success('Invite link created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create invite');
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: (code: string) => connections.acceptInvite(code),
    onSuccess: (data) => {
      toast.success(`Connected with ${data.connectedWith.name}!`);
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      setInviteCode('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept invite');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => connections.remove(userId),
    onSuccess: () => {
      toast.success('Connection removed');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove connection');
    },
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const inviteUrl = generatedCode
    ? `${window.location.origin}/signup?invite=${generatedCode}`
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Friends</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invite Section */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invite Friends</h2>

          <div className="space-y-4">
            <Button onClick={() => createInviteMutation.mutate()} className="w-full">
              Generate Invite Link
            </Button>

            {inviteUrl && (
              <div className="space-y-2">
                <Input value={inviteUrl} readOnly />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteUrl);
                    toast.success('Copied to clipboard!');
                  }}
                >
                  Copy Link
                </Button>
              </div>
            )}
          </div>

          <hr className="my-6" />

          <h3 className="font-semibold text-gray-900 mb-4">Have an invite code?</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => acceptInviteMutation.mutate(inviteCode)}
              disabled={!inviteCode || acceptInviteMutation.isPending}
            >
              Join
            </Button>
          </div>
        </Card>

        {/* Friends List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Friends ({friends?.length || 0})
          </h2>

          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : friends?.length > 0 ? (
            <div className="space-y-3">
              {friends.map((friend: any) => (
                <Card key={friend.id}>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/users/${friend.id}`}
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                        {friend.avatarUrl ? (
                          <img
                            src={friend.avatarUrl}
                            alt={friend.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(friend.name)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{friend.name}</p>
                        {friend.bio && (
                          <p className="text-sm text-gray-500 line-clamp-1">{friend.bio}</p>
                        )}
                      </div>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Remove ${friend.name} from your friends?`)) {
                          removeMutation.mutate(friend.id);
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-4">
                No friends yet. Generate an invite link to connect with people!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
