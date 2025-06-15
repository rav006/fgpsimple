import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userIdToUpdate = parseInt(params.userId, 10);
  if (isNaN(userIdToUpdate)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  // Prevent admin from changing their own role through this endpoint to avoid self-lockout (optional but good practice)
  // They could still change it directly in DB or if another admin changes it.
  if (session.user.id && parseInt(session.user.id, 10) === userIdToUpdate) {
    return NextResponse.json({ message: 'Admins cannot change their own role through this interface.' }, { status: 403 });
  }

  try {
    const { role } = await request.json();

    if (!role || (role !== 'admin' && role !== 'customer')) {
      return NextResponse.json({ message: 'Invalid role specified. Must be "admin" or "customer".' }, { status: 400 });
    }

    const targetUser = await db.select().from(users).where(eq(users.id, userIdToUpdate));

    if (!targetUser || targetUser.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = await db
      .update(users)
      .set({ role: role, updatedAt: new Date() })
      .where(eq(users.id, userIdToUpdate))
      .returning();

    if (!updatedUser || updatedUser.length === 0) {
      return NextResponse.json({ message: 'Failed to update user role' }, { status: 500 });
    }
    
    console.log(`Admin ${session.user.email} updated role of user ID ${userIdToUpdate} to ${role}`);
    return NextResponse.json({ message: 'User role updated successfully', user: updatedUser[0] }, { status: 200 });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
