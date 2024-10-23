'use client'

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logout from "@mui/icons-material/Logout";

export const Menu = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status !== 'authenticated') return null;

  return (
    <div className='flex justify-between items-center'>
      <div className="flex gap-2">
        <Link href={'/'} className='bg-primary px-3 py-2 rounded-lg'>
          <p className='text-secondary text-xs font-semibold'>Home</p>
        </Link>
        <Link href={'/create-task'} className='bg-primary px-3 py-2 rounded-lg'>
          <p className='text-secondary text-xs font-semibold'>Create Task</p>
        </Link>
        <Link href={'/task-list'} className='bg-primary px-3 py-2 rounded-lg'>
          <p className='text-secondary text-xs font-semibold'>Task List</p>
        </Link>
        <Link href={'/task-details'} className='bg-primary px-3 py-2 rounded-lg'>
          <p className='text-secondary text-xs font-semibold'>Task Details</p>
        </Link>
        <Link href={'/user-list'} className='bg-primary px-3 py-2 rounded-lg'>
          <p className='text-secondary text-xs font-semibold'>User List</p>
        </Link>
        <Link href={'/user-details'} className='bg-primary px-3 py-2 rounded-lg'>
          <p className='text-secondary text-xs font-semibold'>User Details</p>
        </Link>
      </div>
      <Logout
          className="cursor-pointer"
          onClick={() => {
            signOut({redirect: false}).then(() => {
              router.push("/login");
            });
          }}
        >
          Sign Out
        </Logout>
    </div>
  );
};

export default Menu;