import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BoardLoader = () => {
  return (
    <div className="p-4 space-y-4">

      <Skeleton height={24} width={200} />

      <div className="flex gap-4 overflow-x-auto m-4">
        
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="w-64 bg-gray-100 p-3 rounded-md"
          >
            <Skeleton height={20} width={120} />

            <div className="mt-3 h-80" />
          </div>
        ))}

      </div>
    </div>
  );
};

export default BoardLoader;