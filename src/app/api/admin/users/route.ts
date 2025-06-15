import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { asc, ilike, or, and, sql, InferSelectModel } from 'drizzle-orm';

export interface UserForAdminList extends InferSelectModel<typeof users> {
  ticketCount?: number;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  console.log('[API /api/admin/users] Session data:', JSON.stringify(session, null, 2)); // Added for debugging

  if (!session || session.user?.role !== 'admin') {
    console.log('[API /api/admin/users] Unauthorized access attempt. Role:', session?.user?.role); // Added for debugging
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  try {
    const searchCondition = searchTerm 
      ? or(
          ilike(users.email, `%${searchTerm}%`),
          ilike(users.name, `%${searchTerm}%`),
          ilike(users.role, `%${searchTerm}%`)
        )
      : undefined;

    const userListQuery = db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        // Example of how to count related items, though tickets are not directly linked here for this query
        // ticketCount: sql<number>`(SELECT COUNT(*) FROM tickets WHERE tickets.user_id = users.id)`.as('ticket_count')
      })
      .from(users)
      .orderBy(asc(users.name), asc(users.email))
      .limit(limit)
      .offset(offset);

    if (searchCondition) {
      userListQuery.where(searchCondition);
    }

    const userList = await userListQuery;

    const totalUsersQuery = db.select({ count: sql<number>`count(*)` }).from(users);
    if (searchCondition) {
      totalUsersQuery.where(searchCondition);
    }
    const totalUsersResult = await totalUsersQuery;
    const totalUsers = totalUsersResult[0].count;

    return NextResponse.json({
      users: userList,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
