import { useState, useEffect } from "react";
import { adminLogin, getAdminToken, adminLogout } from "@/lib/admin-api";
import {
  useSiteContent,
  useProjects,
  useSkills,
  useThemeSettings,
  useGallery,
  useMessages,
} from "@/hooks/use-portfolio-data";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateSiteContent,
  addProject,
  updateProject,
  deleteProject,
  addSkill,
  updateSkill,
  deleteSkill,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  deleteMessage,
  updateThemeSettings,
} from "@/lib/admin-api";
import {
  LogOut,
  FileText,
  FolderOpen,
  BarChart3,
  Mail,
  Settings,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Menu,
} from "lucide-react";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAdminToken());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    const token = await adminLogin(username, password);
    setLoggingIn(false);
    if (token) {
      setIsLoggedIn(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onSubmit={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} loading={loggingIn} />;
  }

  const tabs = [
    { id: "content", label: "Content", icon: FileText },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "skills", label: "Skills", icon: BarChart3 },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "messages", label: "Inbox", icon: Mail },
    { id: "theme", label: "Theme", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass-card text-primary"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 glass-card border-r border-border/50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-border/50">
          <h1 className="font-heading text-lg font-bold neon-text">Admin Panel</h1>
          <p className="text-muted-foreground text-xs mt-1">Manage your portfolio</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-auto">
        {activeTab === "content" && <ContentManager queryClient={queryClient} />}
        {activeTab === "projects" && <ProjectManager queryClient={queryClient} />}
        {activeTab === "skills" && <SkillManager queryClient={queryClient} />}
        {activeTab === "gallery" && <GalleryManager queryClient={queryClient} />}
        {activeTab === "messages" && <MessageInbox queryClient={queryClient} />}
        {activeTab === "theme" && <ThemeManager queryClient={queryClient} />}
      </main>
    </div>
  );
};

// Login Screen
function LoginScreen({
  onSubmit,
  username,
  setUsername,
  password,
  setPassword,
  loading,
}: any) {
  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="font-heading text-2xl font-bold neon-text text-center mb-2">
          Admin Login
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          Enter your credentials
        </p>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="admin123"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="neon-button w-full py-3 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-muted-foreground text-xs text-center mt-6">
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}

// Content Manager
function ContentManager({ queryClient }: { queryClient: any }) {
  const { data: content = {} } = useSiteContent();
  const { uploadImage } = useFileUpload();
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const contentItems = [
    { id: "hero_title", label: "Hero Title" },
    { id: "hero_subtitle", label: "Hero Subtitle" },
    { id: "hero_description", label: "Hero Description" },
    { id: "location", label: "Location" },
  ];

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        await updateSiteContent(queryClient, { profile_photo_url: url });
        toast.success("Profile photo updated!");
      }
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    }
    setUploading(false);
  };

  const handleSave = async (id: string) => {
    setSaving(id);
    try {
      await updateSiteContent(queryClient, {
        [id]: editing[id] ?? content[id] ?? "",
      });
      toast.success("Content updated!");
      setEditing((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
    setSaving(null);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Site Content</h2>

      {/* Profile Photo Upload */}
      <div className="glass-card p-5 mb-6">
        <label className="text-sm font-medium text-primary mb-3 block">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
            <img
              src={content?.profile_photo_url || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <label className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer inline-flex">
              <Upload size={14} /> {uploading ? "Uploading..." : "Change Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-muted-foreground text-xs mt-2">
              JPG, PNG or GIF
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {contentItems.map((item) => (
          <div key={item.id} className="glass-card p-5">
            <label className="text-sm font-medium text-primary mb-2 block">
              {item.label}
            </label>
            {item.id.includes("description") ? (
              <textarea
                value={editing[item.id] ?? content[item.id] ?? ""}
                onChange={(e) => setEditing({ ...editing, [item.id]: e.target.value })}
                rows={3}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={editing[item.id] ?? content[item.id] ?? ""}
                onChange={(e) => setEditing({ ...editing, [item.id]: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              />
            )}
            {editing[item.id] !== undefined &&
              editing[item.id] !== content[item.id] && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleSave(item.id)}
                    disabled={saving === item.id}
                    className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <Save size={14} /> {saving === item.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() =>
                      setEditing((prev) => {
                        const n = { ...prev };
                        delete n[item.id];
                        return n;
                      })
                    }
                    className="px-4 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Project Manager
function ProjectManager({ queryClient }: { queryClient: any }) {
  const { data: projects = [] } = useProjects();
  const { uploadImage } = useFileUpload();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    link: "",
  });
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      image_url: p.image_url || "",
      link: p.link || "",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setForm({ ...form, image_url: url });
        toast.success("Image uploaded!");
      }
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateProject(queryClient, editingId, form);
        toast.success("Project updated!");
      } else {
        await addProject(queryClient, form);
        toast.success("Project added!");
      }
      setEditingId(null);
      setShowAdd(false);
      setForm({ title: "", description: "", image_url: "", link: "" });
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteProject(queryClient, id);
      toast.success("Project deleted");
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const isEditing = editingId || showAdd;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Projects</h2>
        {!isEditing && (
          <button
            onClick={() => setShowAdd(true)}
            className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1"
          >
            <Plus size={14} /> Add Project
          </button>
        )}
      </div>

      {isEditing && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <h3 className="font-heading text-sm font-semibold text-primary">
            {editingId ? "Edit Project" : "New Project"}
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary resize-none"
          />
          <input
            type="text"
            placeholder="Project Link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary"
          />
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-muted-foreground"
              disabled={uploading}
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="mt-2 h-20 rounded object-cover"
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="neon-button px-6 py-2 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setShowAdd(false);
              }}
              className="px-6 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(projects as any[]).map((p: any) => (
          <div key={p.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {p.image_url && (
                <img src={p.image_url} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-foreground font-medium text-sm truncate">{p.title}</p>
                <p className="text-muted-foreground text-xs truncate">{p.description}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 ml-3">
              <button
                onClick={() => startEdit(p)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skill Manager
function SkillManager({ queryClient }: { queryClient: any }) {
  const { data: skills = [] } = useSkills();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", percentage: 50 });
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, percentage: s.percentage || 50 });
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Skill name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateSkill(queryClient, editingId, form);
        toast.success("Skill updated!");
      } else {
        await addSkill(queryClient, form);
        toast.success("Skill added!");
      }
      setEditingId(null);
      setShowAdd(false);
      setForm({ name: "", percentage: 50 });
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteSkill(queryClient, id);
      toast.success("Skill deleted");
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const isEditing = editingId || showAdd;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Skills</h2>
        {!isEditing && (
          <button
            onClick={() => setShowAdd(true)}
            className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1"
          >
            <Plus size={14} /> Add Skill
          </button>
        )}
      </div>

      {isEditing && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <input
            type="text"
            placeholder="Skill name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary"
          />
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Proficiency: {form.percentage}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.percentage}
              onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="neon-button px-6 py-2 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setShowAdd(false);
              }}
              className="px-6 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(skills as any[]).map((s: any) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium text-sm">{s.name}</p>
              <div className="w-full bg-secondary rounded-lg h-2 mt-2">
                <div
                  className="bg-primary rounded-lg h-2"
                  style={{ width: `${s.percentage}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs mt-1">{s.percentage}%</p>
            </div>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => startEdit(s)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Gallery Manager
function GalleryManager({ queryClient }: { queryClient: any }) {
  const { data: gallery = [] } = useGallery();
  const { uploadImage } = useFileUpload();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    image_url: "",
    file_url: "",
    type: "product",
  });
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const startEdit = (g: any) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      image_url: g.image_url || "",
      file_url: g.file_url || "",
      type: g.type || "product",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setForm({ ...form, image_url: url });
        toast.success("Image uploaded!");
      }
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    }
    setUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filename, file);

      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(data.path);
      setForm({ ...form, file_url: urlData.publicUrl });
      toast.success("File uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.image_url) {
      toast.error("Title and image are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateGalleryItem(queryClient, editingId, form);
        toast.success("Item updated!");
      } else {
        await addGalleryItem(queryClient, form);
        toast.success("Item added!");
      }
      setEditingId(null);
      setShowAdd(false);
      setForm({ title: "", image_url: "", file_url: "", type: "product" });
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteGalleryItem(queryClient, id);
      toast.success("Item deleted");
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const isEditing = editingId || showAdd;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Gallery</h2>
        {!isEditing && (
          <button
            onClick={() => setShowAdd(true)}
            className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1"
          >
            <Plus size={14} /> Add Item
          </button>
        )}
      </div>

      {isEditing && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <h3 className="font-heading text-sm font-semibold text-primary">
            {editingId ? "Edit Gallery Item" : "New Gallery Item"}
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary"
          >
            <option value="product">Product</option>
            <option value="portfolio">Portfolio</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Gallery Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-muted-foreground"
              disabled={uploading}
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="mt-2 h-20 rounded object-cover"
              />
            )}
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              File (PDF or Link) - Optional
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="text-sm text-muted-foreground"
              disabled={uploading}
            />
            {form.file_url && (
              <p className="text-muted-foreground text-xs mt-1">File uploaded ✓</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="neon-button px-6 py-2 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setShowAdd(false);
              }}
              className="px-6 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(gallery as any[]).map((item: any) => (
          <div key={item.id} className="glass-card overflow-hidden group">
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-foreground font-medium text-sm truncate">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-xs">{item.type}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors flex-1"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Message Inbox
function MessageInbox({ queryClient }: { queryClient: any }) {
  const { data: messages = [] } = useMessages();

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMessage(queryClient, id);
      toast.success("Message deleted");
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const unreadCount = (messages as any[]).filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Inbox{" "}
          {unreadCount > 0 && (
            <span className="text-primary text-sm">({unreadCount} new)</span>
          )}
        </h2>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail className="mx-auto text-muted-foreground/30 mb-3" size={40} />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(messages as any[]).map((m: any) => (
            <div key={m.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-foreground font-medium text-sm">{m.name}</p>
                  </div>
                  <p className="text-primary text-xs mb-2">{m.email}</p>
                  <p className="text-muted-foreground text-sm">{m.message}</p>
                  {m.voice_url && (
                    <div className="mt-3">
                      <audio src={m.voice_url} controls className="h-6 w-full" />
                    </div>
                  )}
                  {m.image_url && (
                    <img
                      src={m.image_url}
                      alt="Attachment"
                      className="mt-3 h-32 rounded object-cover"
                    />
                  )}
                  <p className="text-muted-foreground/50 text-xs mt-2">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Theme Manager
function ThemeManager({ queryClient }: { queryClient: any }) {
  const { data: theme } = useThemeSettings();
  const [color, setColor] = useState("#39FF14");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (theme) {
      setColor((theme as any).accent_color || "#39FF14");
    }
  }, [theme]);

  const colors = {
    Red: "#FF0000",
    Yellow: "#FFFF00",
    Green: "#00FF00",
    Blue: "#0000FF",
    Purple: "#FF00FF",
    Black: "#000000",
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateThemeSettings(queryClient, { accent_color: color });
      toast.success("Theme updated!");
    } catch (error: any) {
      toast.error("Failed to save theme: " + error.message);
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">
        Theme Settings
      </h2>
      <div className="glass-card p-6 space-y-6 max-w-md">
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">
            Accent Color
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-4 py-2 text-foreground text-sm font-mono focus:outline-none focus:border-primary flex-1"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(colors).map(([name, hex]) => (
                <button
                  key={name}
                  onClick={() => setColor(hex)}
                  className="p-3 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor: hex,
                    borderColor: color === hex ? "#fff" : "transparent",
                    opacity: 0.8,
                  }}
                  title={name}
                />
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="neon-button px-6 py-2 rounded-lg text-xs flex items-center gap-1 w-full justify-center disabled:opacity-50"
        >
          <Save size={14} /> {saving ? "Saving..." : "Save Theme"}
        </button>
      </div>
    </div>
  );
}

export default Admin;
