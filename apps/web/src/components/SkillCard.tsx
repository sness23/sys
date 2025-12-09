import { Link } from 'react-router-dom';
import { formatPrice, getInitials } from '../lib/utils';
import { Card } from './Card';

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    description: string;
    price: number;
    priceType: string;
    category: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
  };
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link to={`/skills/${skill.id}`}>
      <Card className="h-full hover:border-primary-300">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
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
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{skill.user.name}</p>
            <p className="text-sm text-gray-500">{skill.category}</p>
          </div>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2">{skill.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{skill.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(skill.price, skill.priceType)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
