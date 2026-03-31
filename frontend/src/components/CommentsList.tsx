"use client";

interface CommentProps {
  id: string;
  author: {
    displayName: string;
    username: string | null;
  } | null;
  body: string;
  postedAt: {
    datetime: string;
    label: string;
  } | null;
}

function Comment({ author, body, postedAt }: CommentProps) {
  return (
    <div className="card card-border bg-base-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-5 gap-3">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={`https://github.com/${author?.username}.png`}
                alt={author?.displayName ?? "User"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.displayName ?? "U")}&size=32`;
                }}
              />
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <a
              href={`https://github.com/${author?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-base-content hover:text-primary transition-colors leading-tight"
            >
              {author?.displayName || "Unknown User"}
            </a>
            {author?.username && (
              <span className="text-base-content/50 text-xs">
                @{author.username}
              </span>
            )}
          </div>

          {postedAt && (
            <time
              dateTime={postedAt.datetime}
              title={postedAt.label}
              className="ml-auto text-xs text-base-content/40 shrink-0"
            >
              {postedAt.label}
            </time>
          )}
        </div>

        {/* Divider */}
        <div className="divider my-0" />

        {/* Body */}
        <p className="text-base-content/70 whitespace-pre-wrap break-words leading-relaxed text-sm">
          {body || "_(empty comment)_"}
        </p>
      </div>
    </div>
  );
}

interface CommentsListProps {
  comments: CommentProps[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-base-content/40 gap-3">
        <svg
          className="w-12 h-12 opacity-40"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
        </svg>
        <span className="text-sm">No comments on this issue</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}
