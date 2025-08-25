"use client";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase";
import toast from 'react-hot-toast';

const supabase = createClient();

export const useNotifications = () => {
  const [notifs, setNotifs] = useState([]);
  const [nonluCount, setNonluCount] = useState(0);

  // Récupération initiale des notifications
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("Notification")
      .select()
      .eq("targetRole", "ADMIN")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Erreur Supabase:", error);
      return;
    }

    setNotifs(data);
    setNonluCount(data.filter(n => !n.isRead).length);
  };

  // Marquer une notification comme lue
  const markAsRead = async (id) => {
    const { data, error } = await supabase
      .from("Notification")
      .update({ isRead: true })
      .eq("id", id);

    if (error) {
      console.error("Erreur Supabase:", error);
      return;
    }

    setNotifs(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    setNonluCount(prev => prev - 1);
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    const { data, error } = await supabase
      .from("Notification")
      .update({ isRead: true })
      .eq("isRead", false);

    if (error) {
      console.error("Erreur Supabase:", error);
      return;
    }

    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setNonluCount(0);
  };

  useEffect(() => {
    fetchNotifications();

    // Abonnement Realtime
    const channel = supabase
      .channel("realtime_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Notification", filter: 'targetRole=eq.ADMIN' },
        payload => {
          const newNotif = payload.new;
          setNotifs(prev => [payload.new, ...prev]);
          setNonluCount(prev => prev + 1);
          toast(newNotif.message, {icon: "✦"});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { notifs, nonluCount, markAsRead, markAllAsRead };
};
