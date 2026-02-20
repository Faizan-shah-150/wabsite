import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Send, Mail, MapPin, Mic, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

interface ContactSectionProps {
  content: Record<string, string>;
}

const ContactSection = ({ content }: ContactSectionProps) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingVoice, setUploadingVoice] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { uploadImage, uploadVoice } = useFileUpload();

  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVoice(true);
    try {
      const url = await uploadVoice(file);
      if (url) {
        setVoiceUrl(url);
        toast.success("Voice message recorded!");
      }
    } catch (error: any) {
      toast.error("Voice upload failed: " + error.message);
    }
    setUploadingVoice(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setImageUrl(url);
        toast.success("Image attached!");
      }
    } catch (error: any) {
      toast.error("Image upload failed: " + error.message);
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in name, email, and message");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        voice_url: voiceUrl,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      } as any);

      if (error) {
        toast.error("Failed to send message");
      } else {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        setVoiceUrl(null);
        setImageUrl(null);
      }
    } catch (err: any) {
      toast.error("Error sending message: " + err.message);
    }
    setSending(false);
  };

  return (
    <section id="contact" className="relative">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 neon-text">
          Get In Touch
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-4 rounded-full" />
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Let's collaborate and create something amazing together.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-8">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">
                    {content.email || "contact@example.com"}
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium">
                    {content.location || "Available Worldwide"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="Your name"
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="your@email.com"
                maxLength={255}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Your message..."
                maxLength={1000}
              />
            </div>

            {/* Media Attachments */}
            <div className="space-y-3 pt-2 border-t border-border/50">
              <label className="text-xs text-muted-foreground font-medium">
                Attachments (Optional)
              </label>

              {/* Voice */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <Mic size={14} />
                  Voice Message
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleVoiceUpload}
                    disabled={uploadingVoice}
                    className="hidden"
                  />
                </label>
                {voiceUrl && (
                  <button
                    type="button"
                    onClick={() => setVoiceUrl(null)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                )}
                {uploadingVoice && (
                  <span className="text-xs text-primary">Uploading...</span>
                )}
                {voiceUrl && (
                  <span className="text-xs text-primary">✓ Added</span>
                )}
              </div>

              {/* Image */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <ImageIcon size={14} />
                  Attach Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                )}
                {uploadingImage && (
                  <span className="text-xs text-primary">Uploading...</span>
                )}
                {imageUrl && (
                  <span className="text-xs text-primary">✓ Added</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="neon-button w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={16} />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
