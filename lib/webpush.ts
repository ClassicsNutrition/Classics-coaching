import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/server';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:contact@classics-coaching.fr';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} else {
  console.warn("VAPID keys are missing from environment variables.");
}

export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  url?: string
) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn("VAPID keys not configured. Cannot send push.");
    return { success: false, reason: "VAPID keys not configured" };
  }

  try {
    const adminSupabase = await createAdminClient();
    
    // Fetch subscriptions for this user
    const { data: subs, error } = await adminSupabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      if (error.code === '42P01') {
        console.warn("Table 'push_subscriptions' does not exist in Supabase. Please execute the SQL migration.");
        return { success: false, reason: "Table push_subscriptions missing" };
      }
      console.error("Error fetching push subscriptions for user:", userId, error);
      return { success: false, error };
    }

    if (!subs || subs.length === 0) {
      return { success: true, sent: 0 };
    }

    let sentCount = 0;
    const payload = JSON.stringify({
      title,
      body,
      url: url || '/'
    });

    for (const sub of subs) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: sub.keys as { p256dh: string; auth: string }
        };

        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (err: any) {
        console.error("Failed to send web push notification:", err);
        // If subscription is invalid/expired (status 410 or 404), remove it from DB
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log("Removing expired push subscription:", sub.endpoint);
          await adminSupabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', sub.endpoint);
        }
      }
    }

    return { success: true, sent: sentCount };
  } catch (globalErr) {
    console.error("Global error in sendPushToUser:", globalErr);
    return { success: false, error: globalErr };
  }
}
