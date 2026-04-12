import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?category=${category.slug}`}>
      <div className="category-card group h-64 md:h-80">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
          <h3 className="font-display text-2xl font-bold text-white mb-1">
            {category.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-white/80 text-sm">
              {category.productCount} products
            </p>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
