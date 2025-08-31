import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownMessageProps {
  content: string;
  isUser?: boolean;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, isUser = false }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !className || !match;
          
          return !isInline && match ? (
            <SyntaxHighlighter
              style={oneDark as any}
              language={match[1]}
              PreTag="div"
              customStyle={{
                margin: '0.5rem 0',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={`inline-code ${className || ''}`} {...props}>
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="markdown-paragraph">{children}</p>;
        },
        h1({ children }) {
          return <h1 className="markdown-h1">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="markdown-h2">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="markdown-h3">{children}</h3>;
        },
        ul({ children }) {
          return <ul className="markdown-ul">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="markdown-ol">{children}</ol>;
        },
        li({ children }) {
          return <li className="markdown-li">{children}</li>;
        },
        blockquote({ children }) {
          return <blockquote className="markdown-blockquote">{children}</blockquote>;
        },
        a({ href, children }) {
          return (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="markdown-link"
            >
              {children}
            </a>
          );
        },
        table({ children }) {
          return <table className="markdown-table">{children}</table>;
        },
        thead({ children }) {
          return <thead className="markdown-thead">{children}</thead>;
        },
        tbody({ children }) {
          return <tbody className="markdown-tbody">{children}</tbody>;
        },
        tr({ children }) {
          return <tr className="markdown-tr">{children}</tr>;
        },
        td({ children }) {
          return <td className="markdown-td">{children}</td>;
        },
        th({ children }) {
          return <th className="markdown-th">{children}</th>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownMessage;
