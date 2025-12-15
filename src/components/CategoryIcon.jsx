import { Circle } from 'lucide-react';
import { ICON_MAP } from '../utils/icons';

export const CategoryIcon = ({ iconName, color, size = 16, className = "" }) => {
    const Icon = ICON_MAP[iconName] || Circle;
    return (
        <div className={`rounded-full flex items-center justify-center text-white ${className}`} style={{ backgroundColor: color }}>
            <Icon size={size} />
        </div>
    );
};
