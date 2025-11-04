# Admin User Setup Guide

This guide explains how to set up admin users for the Fashion Store dashboard.

## Prerequisites

- Supabase project configured with the database migrations applied
- Access to Supabase Dashboard

## Step 1: Apply Database Migrations

Ensure that the following migrations have been applied to your Supabase database:

1. `20251031084903_create_fashion_store_schema.sql` - Base schema
2. `20251104_add_user_profiles.sql` - User profiles with role support

You can apply these migrations via the Supabase CLI or manually through the SQL Editor in the Supabase Dashboard.

## Step 2: Create an Admin User in Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add user** (or **Invite user**)
4. Enter the email and password for the admin user
5. Click **Create user** / **Send invitation**

The user profile will be automatically created by the database trigger with the default role of 'user'.

## Step 3: Upgrade User to Admin Role

After creating the user in Supabase Auth, you need to update their role to 'admin':

1. Go to **Database** > **SQL Editor** in your Supabase Dashboard
2. Run the following SQL query, replacing `<user-email>` with the actual email:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = '<user-email>';
```

For example:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

## Step 4: Verify Admin Access

1. Open your application
2. Click the **Connexion** (Login) button in the header
3. Enter the admin user credentials
4. After successful login, you should see:
   - An "Admin" badge next to your email in the header
   - A "Dashboard" button in the header
5. Click the Dashboard button to access the admin dashboard

## Features

### For Admin Users:
- Full access to the Dashboard
- View and manage products
- View and manage orders
- View statistics and analytics

### For Regular Users:
- Can browse and shop in the store
- Cannot access the Dashboard
- Dashboard button is hidden from the header
- If they try to access the dashboard directly, they will see an "Access Denied" message

## Troubleshooting

### User can't see the Dashboard button
- Verify the user's role in the `user_profiles` table
- Make sure the user is logged in (check the header for their email)
- Log out and log back in to refresh the session

### Error when logging in
- Verify the user exists in Supabase Auth
- Check that the password is correct
- Ensure the user_profiles table has a corresponding entry

### Access Denied message when accessing Dashboard
- The user's role is not set to 'admin'
- Run the SQL query in Step 3 to upgrade the user to admin
- Log out and log back in

## Security Notes

- Only authenticated admin users can access the Dashboard
- The role check happens on both the frontend and should be enforced on the backend via Supabase RLS policies
- The default role for new users is 'user'
- Users cannot change their own role (enforced by RLS policy)
