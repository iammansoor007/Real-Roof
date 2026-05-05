"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import RichTextRenderer from "../ui/RichTextRenderer";

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    excerpt?: string;
    publishedAt: string;
    author?: string | { name: string };
}

interface BlogSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    posts: BlogPost[];
    viewAllLink?: string;
}

export default function BlogSection({ 
    title = "Latest from the Blog", 
    subtitle = "Insights & News", 
    description = "Stay updated with the latest trends, tips, and news from the roofing and construction industry.",
    posts = [],
    viewAllLink = "/blog"
}: BlogSectionProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                                {subtitle}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                                {title}
                            </h2>
                            <div className="text-muted-foreground text-lg leading-relaxed">
                                <RichTextRenderer content={description} stripParagraphs={true} />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link 
                            href={viewAllLink}
                            className="group flex items-center gap-3 text-foreground font-bold hover:text-primary transition-colors duration-300 no-underline"
                        >
                            <span className="text-sm uppercase tracking-widest no-underline">View All Posts</span>
                            <div className="w-10 h-10 rounded-full border border-border group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300">
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <motion.article
                            key={post._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
                        >
                            <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden no-underline hover:no-underline">
                                {post.featuredImage ? (
                                    <Image 
                                        src={post.featuredImage} 
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>

                            <div className="p-8">
                                <div className="flex items-center gap-4 text-[11px] text-muted-foreground uppercase tracking-wider mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3 text-primary" />
                                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-border" />
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-primary" />
                                        <span>5 min read</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300 no-underline">
                                    <Link href={`/blog/${post.slug}`} className="no-underline">
                                        {post.title}
                                    </Link>
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt || (post as any).content?.substring(0, 150).replace(/<[^>]*>?/gm, '') + "..."}
                                </p>

                                <Link 
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest group/link no-underline hover:no-underline"
                                >
                                    Read Article
                                    <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
