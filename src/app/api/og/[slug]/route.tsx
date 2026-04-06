import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getPostBySlug } from '@/data/blog-posts';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
      return new Response('Not Found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #e5e7eb 2px, transparent 0)',
            backgroundSize: '40px 40px',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                marginRight: '16px',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.05em',
              }}
            >
              CV Optimizer AI
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              borderRadius: '99px',
              backgroundColor: `${post.accentColor}15`,
              border: `1px solid ${post.accentColor}33`,
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: post.accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {post.tag}
            </span>
          </div>

          <h1
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#111827',
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.04em',
              maxWidth: '900px',
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: '32px',
              color: '#6b7280',
              lineHeight: 1.4,
              maxWidth: '800px',
              fontWeight: 500,
            }}
          >
            {post.description.length > 150
              ? post.description.substring(0, 150) + '...'
              : post.description}
          </p>

          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '80px',
              display: 'flex',
              alignItems: 'center',
              color: '#9ca3af',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            <span>{post.date}</span>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#d1d5db',
                margin: '0 16px',
              }}
            />
            <span>{post.readingTime}</span>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '400px',
              height: '400px',
              background: `radial-gradient(circle at bottom right, ${post.accentColor}15, transparent 70%)`,
              opacity: 0.5,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
