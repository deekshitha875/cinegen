"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  { id: 1, name: "AI Filmmaking", desc: "Cinematic stories made with AI", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80", count: 4 },
  { id: 2, name: "AI Photography", desc: "Editorial frames made to stand out", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80", count: 3 },
  { id: 3, name: "Social Media Content", desc: "Ideas made for the feed", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80", count: 5 },
  { id: 4, name: "AI Animation", desc: "Characters and ideas in motion", image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&q=80", count: 3 },
  { id: 5, name: "3D & CGI", desc: "Worlds built from imagination", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80", count: 2 },
  { id: 6, name: "Motion Design", desc: "Movement with a purpose", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", count: 2 },
  { id: 7, name: "Brand Film", desc: "Stories that define brands", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80", count: 4 },
  { id: 8, name: "Music Video", desc: "Visual rhythm and energy", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80", count: 2 },
  { id: 9, name: "Product Visualization", desc: "Products in their best light", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", count: 3 },
  { id: 10, name: "AR & VFX", desc: "Reality with a new dimension", image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=600&q=80", count: 2 },
  { id: 11, name: "Virtual Influencers", desc: "New personalities and worlds", image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&q=80", count: 1 },
  { id: 12, name: "Lifestyle", desc: "Everyday stories with feeling", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", count: 3 },
  { id: 13, name: "Fashion", desc: "Style made impossible to ignore", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", count: 2 },
  { id: 14, name: "Food & Beverage", desc: "Taste you can see", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", count: 2 },
  { id: 15, name: "Architecture", desc: "Spaces reimagined", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", count: 1 },
  { id: 16, name: "Automotive", desc: "Machines in motion", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", count: 2 },
  { id: 17, name: "Gaming", desc: "Worlds within worlds", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80", count: 2 },
  { id: 18, name: "Documentary", desc: "Truth told beautifully", image: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=600&q=80", count: 1 },
  { id: 19, name: "Generative Art", desc: "Art from code and imagination", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80", count: 2 },
  { id: 20, name: "AI Voice & Audio", desc: "Sound designed with AI", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80", count: 1 },
  { id: 21, name: "FinTech", desc: "Finance made visual", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", count: 1 },
  { id: 22, name: "Healthcare", desc: "Clarity in complexity", image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80", count: 1 },
  { id: 23, name: "EdTech", desc: "Learning reimagined", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80", count: 1 },
  { id: 24, name: "Sustainability", desc: "Purpose-driven storytelling", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80", count: 1 },
  { id: 25, name: "Sports & Fitness", desc: "Energy and motion captured", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80", count: 2 },
  { id: 26, name: "Real Estate", desc: "Properties that sell themselves", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80", count: 1 },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="section-label mb-3">26 CREATIVE CATEGORIES</div>
          <h1 className="heading-editorial text-5xl sm:text-6xl mb-4" style={{ color: "var(--text-primary)" }}>
            Find your next<br />
            <span style={{ color: "var(--lime)", fontStyle: "italic" }}>creative challenge.</span>
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Explore projects looking for a fresh point of view.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}>
              <Link href={`/creators?category=${encodeURIComponent(cat.name)}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer">
                  <img src={cat.image} alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="section-label text-white/60">{cat.id} / CREATIVE CRAFT</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-lg text-white mb-0.5">{cat.name}</h3>
                    <p className="text-sm text-white/70">{cat.desc}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
