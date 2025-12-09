import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { skills, needs } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { getInitials, formatPrice } from '../lib/utils';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [venmoHandle, setVenmoHandle] = useState(user?.venmoHandle || '');
  const [cashAppHandle, setCashAppHandle] = useState(user?.cashAppHandle || '');
  const [paypalHandle, setPaypalHandle] = useState(user?.paypalHandle || '');

  const { data: mySkills } = useQuery({
    queryKey: ['skills', 'mine'],
    queryFn: skills.mine,
    enabled: !!user,
  });

  const { data: myNeeds } = useQuery({
    queryKey: ['needs', 'mine'],
    queryFn: needs.mine,
    enabled: !!user,
  });

  const handleSave = async () => {
    try {
      await updateUser({
        name,
        bio: bio || undefined,
        venmoHandle: venmoHandle || undefined,
        cashAppHandle: cashAppHandle || undefined,
        paypalHandle: paypalHandle || undefined,
      });
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
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

              {isEditing ? (
                <div className="space-y-4 text-left">
                  <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    label="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell people about yourself..."
                  />
                  <Input
                    label="Venmo Handle"
                    value={venmoHandle}
                    onChange={(e) => setVenmoHandle(e.target.value)}
                    placeholder="username"
                  />
                  <Input
                    label="Cash App Handle"
                    value={cashAppHandle}
                    onChange={(e) => setCashAppHandle(e.target.value)}
                    placeholder="username"
                  />
                  <Input
                    label="PayPal Email"
                    value={paypalHandle}
                    onChange={(e) => setPaypalHandle(e.target.value)}
                    placeholder="email@example.com"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500 mb-4">{user.email}</p>
                  {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

                  {(user.venmoHandle || user.cashAppHandle || user.paypalHandle) && (
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      {user.venmoHandle && <p>Venmo: @{user.venmoHandle}</p>}
                      {user.cashAppHandle && <p>Cash App: ${user.cashAppHandle}</p>}
                      {user.paypalHandle && <p>PayPal: {user.paypalHandle}</p>}
                    </div>
                  )}

                  <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* My Skills */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Skills</h2>
              <Link to="/skills/new">
                <Button size="sm">Add Skill</Button>
              </Link>
            </div>

            {mySkills?.length > 0 ? (
              <div className="space-y-3">
                {mySkills.map((skill: any) => (
                  <Link key={skill.id} to={`/skills/${skill.id}`}>
                    <Card className="hover:border-primary-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{skill.title}</h3>
                          <p className="text-sm text-gray-500">{skill.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">
                            {formatPrice(skill.price, skill.priceType)}
                          </p>
                          {!skill.isActive && (
                            <span className="text-xs text-gray-500">Paused</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-gray-500 text-center py-4">
                  No skills yet.{' '}
                  <Link to="/skills/new" className="text-primary-600 hover:underline">
                    Add your first skill
                  </Link>
                </p>
              </Card>
            )}
          </div>

          {/* My Needs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Needs</h2>
              <Link to="/needs/new">
                <Button size="sm" variant="secondary">
                  Post Need
                </Button>
              </Link>
            </div>

            {myNeeds?.length > 0 ? (
              <div className="space-y-3">
                {myNeeds.map((need: any) => (
                  <Link key={need.id} to={`/needs/${need.id}`}>
                    <Card className="hover:border-orange-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{need.title}</h3>
                          <p className="text-sm text-gray-500">{need.category}</p>
                        </div>
                        <div className="text-right">
                          {need.budget && (
                            <p className="font-bold text-orange-600">
                              {formatPrice(need.budget, 'FLAT')}
                            </p>
                          )}
                          {need.isFulfilled && (
                            <span className="text-xs text-green-600">Fulfilled</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-gray-500 text-center py-4">
                  No needs posted.{' '}
                  <Link to="/needs/new" className="text-primary-600 hover:underline">
                    Post what you need
                  </Link>
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
