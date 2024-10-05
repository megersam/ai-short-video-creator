"use client";
import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { db } from '../configs/db';
import { Users } from '../configs/schema';
import { eq } from 'drizzle-orm';

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      isNewUser();
    }
  }, [user]);

  const isNewUser = async () => {
    try {
      // Query to check if the user already exists
      const result = await db.select().from(Users)
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
      
      console.log("results are", result);

      // If the user does not exist, insert them into the database
      if (!result[0]) {
        await db.insert(Users).values({
          name: user.fullName,
          email: user?.primaryEmailAddress?.emailAddress, // Fixing the typo
          imageUrl: user?.imageUrl
        });
      }
    } catch (error) {
      console.error('Error checking or inserting user:', error);
    }
  };

  return (
    <div>
      {children}
    </div>
  );
}

export default Provider;
