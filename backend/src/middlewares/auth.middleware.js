import { clerkClient } from '@clerk/express';

export const protectRoute = async (req, res, next) => {
  // Get the `userId` from the `Auth` object
  const userId = req.auth.userId;

  // If user isn't authenticated, return a 401 error
  if (!userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized - you must be logged in' });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);

    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res
        .status(401)
        .json({ message: 'authenticated - you must be an admin' });
    }
    next();
  } catch (error) {
    console.error('Error in requireAdmin middleware:', error);
    next(error);
  }
};
