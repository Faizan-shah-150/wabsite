import { useGallery } from "@/hooks/use-portfolio-data";
import { Download, ExternalLink } from "lucide-react";

const GallerySection = () => {
  const { data: gallery = [] } = useGallery();

  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:py-20 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3 neon-text">
            Gallery
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore my collection of projects, designs, and creations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(gallery as any[]).map((item: any) => (
            <div
              key={item.id}
              className="glass-card overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-secondary">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  {item.file_url && (
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-background text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-foreground font-semibold text-sm md:text-base mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs mb-3 capitalize">
                  {item.type}
                </p>

                {/* Tags/Meta */}
                <div className="flex items-center gap-2 text-xs">
                  {item.file_url && (
                    <span className="px-2 py-1 bg-secondary rounded text-muted-foreground">
                      PDF Available
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Action */}
              <div className="px-5 pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={item.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors text-xs font-medium"
                >
                  <ExternalLink size={14} />
                  View Full
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
