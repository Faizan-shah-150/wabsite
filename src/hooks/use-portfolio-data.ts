import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSiteContent() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data || {
        id: 1,
        hero_title: "My Portfolio",
        hero_subtitle: "",
        hero_description: "",
        profile_photo_url: "",
        location: "",
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("site_content_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: "id=eq.1" },
        (payload: any) => {
          queryClient.setQueryData(["site-content"], payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("projects_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload: any) => {
          const currentData = queryClient.getQueryData(["projects"]) as any[] || [];
          
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData(["projects"], [payload.new, ...currentData]);
          } else if (payload.eventType === "UPDATE") {
            queryClient.setQueryData(
              ["projects"],
              currentData.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData(
              ["projects"],
              currentData.filter((p) => p.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useSkills() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("skills_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills" },
        (payload: any) => {
          const currentData = queryClient.getQueryData(["skills"]) as any[] || [];
          
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData(["skills"], [payload.new, ...currentData]);
          } else if (payload.eventType === "UPDATE") {
            queryClient.setQueryData(
              ["skills"],
              currentData.map((s) => (s.id === payload.new.id ? payload.new : s))
            );
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData(
              ["skills"],
              currentData.filter((s) => s.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useThemeSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["theme-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data || {
        id: 1,
        accent_color: "#39FF14",
        glow_intensity: 1.0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("theme_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "theme_settings", filter: "id=eq.1" },
        (payload: any) => {
          queryClient.setQueryData(["theme-settings"], payload.new);
          // Update CSS variable
          document.documentElement.style.setProperty(
            "--accent-color",
            payload.new.accent_color
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useGallery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("gallery_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery" },
        (payload: any) => {
          const currentData = queryClient.getQueryData(["gallery"]) as any[] || [];
          
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData(["gallery"], [payload.new, ...currentData]);
          } else if (payload.eventType === "UPDATE") {
            queryClient.setQueryData(
              ["gallery"],
              currentData.map((g) => (g.id === payload.new.id ? payload.new : g))
            );
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData(
              ["gallery"],
              currentData.filter((g) => g.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return query;
}

export function useMessages() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("messages_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload: any) => {
          const currentData = queryClient.getQueryData(["messages"]) as any[] || [];
          
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData(["messages"], [payload.new, ...currentData]);
          } else if (payload.eventType === "UPDATE") {
            queryClient.setQueryData(
              ["messages"],
              currentData.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData(
              ["messages"],
              currentData.filter((m) => m.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return query;
}
