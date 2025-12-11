import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { users } from '../lib/api';
import { getInitials } from '../lib/utils';
import { Card } from '../components/Card';
import { SkillCard } from '../components/SkillCard';

export function UserProfile() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => users.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-3xl font-medium mx-auto mb-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}

              <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
                <span>{user._count?.skills || 0} skills</span>
                <span>{user._count?.needs || 0} needs</span>
              </div>

              {(user.venmoHandle || user.cashAppHandle || user.paypalHandle) && (
                <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900 mb-2">Payment Methods</p>
                  {user.venmoHandle && <p>Venmo: @{user.venmoHandle}</p>}
                  {user.cashAppHandle && <p>Cash App: ${user.cashAppHandle}</p>}
                  {user.paypalHandle && <p>PayPal: {user.paypalHandle}</p>}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Skills */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>

          {user.skills?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skills.map((skill: any) => (
                <SkillCard key={skill.id} skill={{ ...skill, user }} />
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-4">No skills listed yet.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
