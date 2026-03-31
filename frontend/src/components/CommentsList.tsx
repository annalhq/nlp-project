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
    <div className="border border-[var(--border)] rounded-lg p-5 hover:border-[var(--text-tertiary)] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <a
            href={`https://github.com/${author?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            {author?.displayName || "Unknown User"}
          </a>
          {author?.username && (
            <span className="text-[var(--text-tertiary)] ml-2 text-sm">
              @{author.username}
            </span>
          )}
        </div>
      </div>
      {postedAt && (
        <div className="text-xs text-[var(--text-tertiary)] mb-3">
          <time dateTime={postedAt.datetime} title={postedAt.label}>
            {postedAt.label}
          </time>
        </div>
      )}
      <div className="text-[var(--text-secondary)] whitespace-pre-wrap break-words leading-relaxed">
        {body || "_(empty comment)_"}
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
      <div className="text-center py-12 text-[var(--text-tertiary)]">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-40"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
        </svg>
        <span>No comments on this issue</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}
