import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-error" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-base-content/60">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Button */}
        <div className="pt-4">
          <Link to="/" className="btn btn-primary gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
