import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

// ==================== AUTH ====================
export async function adminLogin(username: string, password: string): Promise<string | null> {
  try {
    // In a real app, this would authenticate against your backend
    // For now, we'll use a simple hardcoded check or Supabase auth
    if (username === "admin" && password === "admin123") {
      const token = btoa(`${username}:${password}:${Date.now()}`);
      localStorage.setItem("admin_token", token);
      return token;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function getAdminToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function adminLogout() {
  localStorage.removeItem("admin_token");
}

// ==================== SITE CONTENT ====================
export async function updateSiteContent(
  queryClient: QueryClient,
  updates: Record<string, any>
) {
  // Optimistic update
  const previousData = queryClient.getQueryData(["site-content"]);
  queryClient.setQueryData(["site-content"], { ...previousData, ...updates });

  try {
    const { data, error } = await supabase
      .from("site_content")
      .update(updates)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    queryClient.setQueryData(["site-content"], data);
    return data;
  } catch (error: any) {
    // Revert optimistic update
    queryClient.setQueryData(["site-content"], previousData);
    throw error;
  }
}

// ==================== PROJECTS ====================
export async function addProject(
  queryClient: QueryClient,
  project: {
    title: string;
    description: string;
    image_url: string;
    link: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([project])
      .select()
      .single();

    if (error) throw error;

    // Optimistic update
    const previousData = queryClient.getQueryData(["projects"]) || [];
    queryClient.setQueryData(["projects"], [data, ...previousData]);

    return data;
  } catch (error: any) {
    throw error;
  }
}

export async function updateProject(
  queryClient: QueryClient,
  id: string | number,
  updates: Record<string, any>
) {
  const previousData = queryClient.getQueryData(["projects"]) || [];

  // Optimistic update
  queryClient.setQueryData(
    ["projects"],
    (previousData as any[]).map((p) => (p.id === id ? { ...p, ...updates } : p))
  );

  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    queryClient.setQueryData(
      ["projects"],
      (previousData as any[]).map((p) => (p.id === id ? data : p))
    );
    return data;
  } catch (error: any) {
    queryClient.setQueryData(["projects"], previousData);
    throw error;
  }
}

export async function deleteProject(queryClient: QueryClient, id: string | number) {
  const previousData = queryClient.getQueryData(["projects"]) || [];

  // Optimistic update
  queryClient.setQueryData(
    ["projects"],
    (previousData as any[]).filter((p) => p.id !== id)
  );

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  } catch (error: any) {
    queryClient.setQueryData(["projects"], previousData);
    throw error;
  }
}

// ==================== SKILLS ====================
export async function addSkill(
  queryClient: QueryClient,
  skill: {
    name: string;
    percentage: number;
  }
) {
  try {
    const { data, error } = await supabase
      .from("skills")
      .insert([skill])
      .select()
      .single();

    if (error) throw error;

    // Optimistic update
    const previousData = queryClient.getQueryData(["skills"]) || [];
    queryClient.setQueryData(["skills"], [data, ...previousData]);

    return data;
  } catch (error: any) {
    throw error;
  }
}

export async function updateSkill(
  queryClient: QueryClient,
  id: string | number,
  updates: Record<string, any>
) {
  const previousData = queryClient.getQueryData(["skills"]) || [];

  // Optimistic update
  queryClient.setQueryData(
    ["skills"],
    (previousData as any[]).map((s) => (s.id === id ? { ...s, ...updates } : s))
  );

  try {
    const { data, error } = await supabase
      .from("skills")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    queryClient.setQueryData(
      ["skills"],
      (previousData as any[]).map((s) => (s.id === id ? data : s))
    );
    return data;
  } catch (error: any) {
    queryClient.setQueryData(["skills"], previousData);
    throw error;
  }
}

export async function deleteSkill(queryClient: QueryClient, id: string | number) {
  const previousData = queryClient.getQueryData(["skills"]) || [];

  // Optimistic update
  queryClient.setQueryData(
    ["skills"],
    (previousData as any[]).filter((s) => s.id !== id)
  );

  try {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
  } catch (error: any) {
    queryClient.setQueryData(["skills"], previousData);
    throw error;
  }
}

// ==================== GALLERY ====================
export async function addGalleryItem(
  queryClient: QueryClient,
  item: {
    title: string;
    image_url: string;
    file_url?: string;
    type: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .insert([item])
      .select()
      .single();

    if (error) throw error;

    // Optimistic update
    const previousData = queryClient.getQueryData(["gallery"]) || [];
    queryClient.setQueryData(["gallery"], [data, ...previousData]);

    return data;
  } catch (error: any) {
    throw error;
  }
}

export async function updateGalleryItem(
  queryClient: QueryClient,
  id: string | number,
  updates: Record<string, any>
) {
  const previousData = queryClient.getQueryData(["gallery"]) || [];

  // Optimistic update
  queryClient.setQueryData(
    ["gallery"],
    (previousData as any[]).map((g) => (g.id === id ? { ...g, ...updates } : g))
  );

  try {
    const { data, error } = await supabase
      .from("gallery")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    queryClient.setQueryData(
      ["gallery"],
      (previousData as any[]).map((g) => (g.id === id ? data : g))
    );
    return data;
  } catch (error: any) {
    queryClient.setQueryData(["gallery"], previousData);
    throw error;
  }
}

export async function deleteGalleryItem(queryClient: QueryClient, id: string | number) {
  const previousData = queryClient.getQueryData(["gallery"]) || [];

  // Optimistic update
  queryClient.setQueryData(
    ["gallery"],
    (previousData as any[]).filter((g) => g.id !== id)
  );

  try {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;
  } catch (error: any) {
    queryClient.setQueryData(["gallery"], previousData);
    throw error;
  }
}

// ==================== MESSAGES ====================
export async function deleteMessage(queryClient: QueryClient, id: string | number) {
  const previousData = queryClient.getQueryData(["messages"]) || [];

  // Optimistic update
  queryClient.setQueryData(
    ["messages"],
    (previousData as any[]).filter((m) => m.id !== id)
  );

  try {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
  } catch (error: any) {
    queryClient.setQueryData(["messages"], previousData);
    throw error;
  }
}

// ==================== THEME SETTINGS ====================
export async function updateThemeSettings(
  queryClient: QueryClient,
  updates: Record<string, any>
) {
  const previousData = queryClient.getQueryData(["theme-settings"]);

  // Optimistic update
  queryClient.setQueryData(["theme-settings"], { ...previousData, ...updates });

  // Update CSS variable immediately
  if (updates.accent_color) {
    document.documentElement.style.setProperty("--accent-color", updates.accent_color);
  }

  try {
    const { data, error } = await supabase
      .from("theme_settings")
      .update(updates)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;
    queryClient.setQueryData(["theme-settings"], data);
    return data;
  } catch (error: any) {
    // Revert optimistic update on error
    queryClient.setQueryData(["theme-settings"], previousData);
    if (previousData?.accent_color) {
      document.documentElement.style.setProperty(
        "--accent-color",
        previousData.accent_color
      );
    }
    throw error;
  }
}

// Legacy support for old API structure
export const adminApi = {
  updateContent: (queryClient: QueryClient, id: string, updates: Record<string, any>) =>
    updateSiteContent(queryClient, updates),

  addProject: (queryClient: QueryClient, project: any) => addProject(queryClient, project),
  updateProject: (queryClient: QueryClient, id: string, updates: any) =>
    updateProject(queryClient, id, updates),
  deleteProject: (queryClient: QueryClient, id: string) => deleteProject(queryClient, id),

  addSkill: (queryClient: QueryClient, skill: any) => addSkill(queryClient, skill),
  updateSkill: (queryClient: QueryClient, id: string, updates: any) =>
    updateSkill(queryClient, id, updates),
  deleteSkill: (queryClient: QueryClient, id: string) => deleteSkill(queryClient, id),

  deleteMessage: (queryClient: QueryClient, id: string) => deleteMessage(queryClient, id),

  updateTheme: (queryClient: QueryClient, settings: any) =>
    updateThemeSettings(queryClient, settings),
};
