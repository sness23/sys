import { Link } from 'react-router-dom';
import { formatPrice, getInitials } from '../lib/utils';
import { Card } from './Card';

interface NeedCardProps {
  need: {
    id: string;
    title: string;
    description: string;
    budget?: number | null;
    category: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
  };
}

export function NeedCard({ need }: NeedCardProps) {
  return (
    <Link to={`/needs/${need.id}`}>
      <Card className="h-full hover:border-primary-300">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
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
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{need.user.name}</p>
            <p className="text-sm text-gray-500">{need.category}</p>
          </div>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2">{need.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{need.description}</p>

        {need.budget && (
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-orange-600">
              Budget: {formatPrice(need.budget, 'FLAT')}
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}
