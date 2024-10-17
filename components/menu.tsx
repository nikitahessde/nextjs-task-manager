import Link from "next/link";

export const Menu = () => {
  return (
    <div className='flex gap-2'>
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
    </div>
  );
};

export default Menu;