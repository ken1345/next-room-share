"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function StoryOwnerActions({ storyId, authorId }: { storyId: string | number, authorId?: string }) {
    const [isOwner, setIsOwner] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            if (!authorId) return; // Mock stories or no author

            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user.id === authorId) {
                setIsOwner(true);
            }
        };
        checkUser();
    }, [authorId]);

    const handleDelete = async () => {
        if (!confirm('本当にこの体験談を削除しますか？\nこの操作は取り消せません。')) {
            return;
        }

        setIsDeleting(true);

        try {
            const { data, error } = await supabase
                .from('stories')
                .delete()
                .eq('id', storyId)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('削除対象が見つかりませんでした（権限がない可能性があります）');
            }

            alert('体験談を削除しました');
            router.push('/stories');
            router.refresh();
        } catch (error: any) {
            console.error('Error deleting story:', error);
            alert(`削除に失敗しました: ${error.message || error}`);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOwner) return null;

    return (
        <div className="flex gap-4 mt-6 justify-center">
            <Link
                href={`/stories/${storyId}/edit`}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition"
            >
                <MdEdit /> 編集
            </Link>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold hover:bg-red-100 transition disabled:opacity-50"
            >
                <MdDelete /> {isDeleting ? '削除中...' : '削除'}
            </button>
        </div>
    );
}
