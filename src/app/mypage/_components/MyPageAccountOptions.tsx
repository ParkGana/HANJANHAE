'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';
import { deleteUser, logout } from '@/utils/auth/action';

const MyPageAccountOptions = () => {
  const router = useRouter();

  const queryClient = useQueryClient();
  const { removeUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    queryClient.removeQueries({ queryKey: ['userProfile'] });
    removeUser();
  };

  const handleDeleteUser = async () => {
    if (window.confirm('회원 탈퇴를 하시겠어요?')) {
      await deleteUser();
      removeUser();
    }
  };

  return (
    <div className="mt-6 w-full px-4">
      <div className="divide-y rounded-lg bg-white">
        <div className="flex items-center p-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
            <span className="text-sm">👤</span>
          </div>
          <span
            className="ml-4 cursor-pointer text-sm"
            onClick={() => router.push('/password/check')}
          >
            비밀번호 재설정
          </span>
        </div>
        <div className="flex items-center p-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
            <span className="text-sm">👤</span>
          </div>
          <span className="ml-4 cursor-pointer text-sm" onClick={handleLogout}>
            로그아웃
          </span>
        </div>
      </div>
      <button
        className="mt-4 w-full text-center text-sm text-gray-500 underline"
        onClick={handleDeleteUser}
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default MyPageAccountOptions;
