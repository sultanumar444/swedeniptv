"use client";

import { useState } from "react";
import type { WpPostMeta } from "@/lib/wp/types";

type Card = Pick<WpPostMeta, "slug" | "title" | "featured">;

/** Elementor Pro "Posts" widget, cards skin, with the "Load More" button. */
export default function PostsGrid({ posts, perPage, loadMore }: { posts: Card[]; perPage: number; loadMore: boolean }) {
  const [shown, setShown] = useState(perPage);
  const visible = posts.slice(0, shown);

  return (
    <>
      <div className="elementor-posts-container elementor-posts elementor-posts--skin-cards elementor-grid elementor-has-item-ratio" role="list">
        {visible.map((post) => {
          const img = post.featured.large ?? post.featured.medium ?? { src: post.featured.src, w: post.featured.w, h: post.featured.h };
          const href = `/${post.slug}/`;
          return (
            <article key={post.slug} className="elementor-post elementor-grid-item post type-post has-post-thumbnail" role="listitem">
              <div className="elementor-post__card">
                <a className="elementor-post__thumbnail__link" href={href} tabIndex={-1}>
                  <div className="elementor-post__thumbnail">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={post.featured.alt} width={img.w ?? undefined} height={img.h ?? undefined} loading="lazy" decoding="async" />
                  </div>
                </a>
                <div className="elementor-post__text">
                  <h3 className="elementor-post__title">
                    <a href={href}>{post.title}</a>
                  </h3>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {loadMore && shown < posts.length && (
        <div className="elementor-button-wrapper">
          <a className="elementor-button elementor-size-sm" role="button" tabIndex={0} onClick={() => setShown((n) => n + perPage)}>
            <span className="elementor-button-content-wrapper">
              <span className="elementor-button-text">Visa fler</span>
            </span>
          </a>
        </div>
      )}
    </>
  );
}
