import { marked } from 'marked';
import { useEffect, useState } from 'react';
import './CoachingBox.css';

interface CoachingBoxProps {
  coaching: string;
  loading?: boolean;
}

const CoachingBox = ({ coaching, loading }: CoachingBoxProps) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    // Configure marked for safe rendering
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Convert markdown to HTML
    const rendered = marked(coaching) as string;
    setHtml(rendered);
  }, [coaching]);

  if (loading) {
    return (
      <div className="coaching-box">
        <h3>💡 AI Coach</h3>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="coaching-box">
      <h3>💡 AI Coach</h3>
      <div
        className="coaching-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default CoachingBox;
