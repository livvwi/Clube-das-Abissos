import { supabase } from "../lib/supabaseClient";


export async function insertReview(params: { currentUser: any, bookTitle: string, rating: number, content: string, spoilerFree?: boolean }) {
    if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } as any };
    const { currentUser, bookTitle, rating, content, spoilerFree } = params;
    const { data, error } = await supabase.from('reviews').insert([
        {
            user_id: currentUser.id,
            user_name: currentUser.name,
            user_username: currentUser.username,
            user_avatar: currentUser.avatarUrl,
            book_title: bookTitle,
            rating,
            content,
            spoiler_free: spoilerFree ?? false
        }
    ]).select();

    if (error) {
        console.error("Supabase error (insertReview):", error);
    }
    return { data, error };
}

export async function fetchReviewsByBook(bookTitle: string) {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase.from('reviews').select('*').eq('book_title', bookTitle).order('created_at', { ascending: false });
    if (error) {
        console.error("Supabase error (fetchReviewsByBook):", error);
    }
    return { data, error };
}

export async function fetchAllReviews() {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Supabase error (fetchAllReviews):", error);
    }
    return { data, error };
}

export async function insertNotificationForReview(params: { currentUser: any, bookTitle: string }) {
    if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } as any };
    const { currentUser, bookTitle } = params;
    const { data, error } = await supabase.from('notifications').insert([
        {
            actor_id: currentUser.id,
            actor_name: currentUser.name,
            actor_avatar: currentUser.avatarUrl,
            book_title: bookTitle,
            read: false
        }
    ]).select();

    if (error) {
        console.error("Supabase error (insertNotificationForReview):", error);
    }
    return { data, error };
}

export async function fetchNotifications() {
    if (!supabase) return { data: [], error: null };
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Supabase error (fetchNotifications):", error);
    }
    return { data, error };
}

export async function markAllNotificationsRead() {
    if (!supabase) return { data: null, error: { message: "Supabase client not initialized" } as any };
    const { data, error } = await supabase.from('notifications').update({ read: true }).eq('read', false).select();
    if (error) {
        console.error("Supabase error (markAllNotificationsRead):", error);
    }
    return { data, error };
}

export async function countUnreadNotifications() {
    if (!supabase) return { count: 0, error: null };
    const { count, error } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false);
    if (error) {
        console.error("Supabase error (countUnreadNotifications):", error);
    }
    return { count, error };
}
