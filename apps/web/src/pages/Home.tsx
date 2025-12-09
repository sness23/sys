import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { skills, needs } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/Button';
import { SkillCard } from '../components/SkillCard';
import { NeedCard } from '../components/NeedCard';

export function Home() {
  const { user } = useAuth();

  const { data: skillsData } = useQuery({
    queryKey: ['skills', 'recent'],
    queryFn: () => skills.list({ limit: '6' } as any),
  });

  const { data: needsData } = useQuery({
    queryKey: ['needs', 'recent'],
    queryFn: () => needs.list({ limit: '6' } as any),
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Sell Yourself</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Share your skills with friends. Find help from people you trust.
            The peer-to-peer marketplace for your community.
          </p>
          {user ? (
            <div className="flex gap-4 justify-center">
              <Link to="/skills/new">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  Post a Skill
                </Button>
              </Link>
              <Link to="/needs/new">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  Post a Need
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recent Skills */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Skills</h2>
            <Link to="/skills" className="text-primary-600 hover:text-primary-700 font-medium">
              View all &rarr;
            </Link>
          </div>

          {skillsData?.skills?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsData.skills.map((skill: any) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No skills posted yet. Be the first!
            </div>
          )}
        </div>
      </section>

      {/* Recent Needs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Needs</h2>
            <Link to="/needs" className="text-primary-600 hover:text-primary-700 font-medium">
              View all &rarr;
            </Link>
          </div>

          {needsData?.needs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needsData.needs.map((need: any) => (
                <NeedCard key={need.id} need={need} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No needs posted yet.
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Post Your Skills</h3>
              <p className="text-gray-600">
                Share what you're good at and set your price. Foot massages, cooking lessons, tech help - anything goes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Connect with Friends</h3>
              <p className="text-gray-600">
                Invite your friends and followers. Browse skills from people you already know and trust.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Paid</h3>
              <p className="text-gray-600">
                Accept requests, provide your service, and get paid directly via Venmo, Cash App, or PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
