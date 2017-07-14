/**
 * Main application routes
 */
import {userRoutes} from './mongo-db/api/user/user.router';

import {authRoutes} from './mongo-db/auth/auth.router';

export default function routes(app) {
  // Insert routes below
  app.use('/api/users', userRoutes);
  
  app.use('/auth', authRoutes);
};
