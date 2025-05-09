import React, { useState } from 'react';
import '../styles/CitationGenerator.css';
import { Book, FileText, Link, CheckCircle, AlertTriangle } from 'lucide-react';

const CitationGenerator = () => {
  const [citationType, setCitationType] = useState('book');
  const [formData, setFormData] = useState({
    book: {
      author: '',
      title: '',
      publisher: '',
      year: '',
      city: '',
    },
    article: {
      author: '',
      title: '',
      journal: '',
      year: '',
      volume: '',
      issue: '',
      pages: '',
    },
    website: {
      author: '',
      title: '',
      url: '',
      accessDate: '',
    },
  });
  const [citation, setCitation] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (type, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        [field]: value,
      },
    }));
  };

  // Function to generate the citation
  const generateCitation = () => {
    setError('');
    setCitation('');

    const today = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    if (citationType === 'book') {
      const { author, title, publisher, year, city } = formData.book;
      if (!author || !title || !publisher || !year || !city) {
        setError('Please fill in all fields for the book citation.');
        return;
      }
      // Basic APA book citation format.
      const generatedCitation = `${author}. (${year}). ${title}. ${city}: ${publisher}.`;
      setCitation(generatedCitation);
    } else if (citationType === 'article') {
      const { author, title, journal, year, volume, issue, pages } = formData.article;
      if (!author || !title || !journal || !year || !volume || !issue || !pages) {
        setError('Please fill in all fields for the article citation.');
        return;
      }
      // Basic APA article citation format
      const generatedCitation = `${author}. (${year}). ${title}. ${journal}, ${volume}(${issue}), ${pages}.`;
      setCitation(generatedCitation);
    } else if (citationType === 'website') {
      const { author, title, url, accessDate } = formData.website;
      if (!author || !title || !url || !accessDate) {
        setError('Please fill in all fields for the website citation.');
        return;
      }
      // Website citation format
      const generatedCitation = `${author}. ${title}. ${url}. Retrieved ${accessDate}.`;
      setCitation(generatedCitation);
    }
  };

  const getFormFields = () => {
    switch (citationType) {
      case 'book':
        return (
          <>
            <label>Author:</label>
            <input
              type="text"
              value={formData.book.author}
              onChange={(e) => handleInputChange('book', 'author', e.target.value)}
            />
            <label>Title:</label>
            <input
              type="text"
              value={formData.book.title}
              onChange={(e) => handleInputChange('book', 'title', e.target.value)}
            />
            <label>Publisher:</label>
            <input
              type="text"
              value={formData.book.publisher}
              onChange={(e) => handleInputChange('book', 'publisher', e.target.value)}
            />
            <label>Year:</label>
            <input
              type="text"
              value={formData.book.year}
              onChange={(e) => handleInputChange('book', 'year', e.target.value)}
            />
            <label>City:</label>
            <input
              type="text"
              value={formData.book.city}
              onChange={(e) => handleInputChange('book', 'city', e.target.value)}
            />
          </>
        );
      case 'article':
        return (
          <>
            <label>Author:</label>
            <input
              type="text"
              value={formData.article.author}
              onChange={(e) => handleInputChange('article', 'author', e.target.value)}
            />
            <label>Title:</label>
            <input
              type="text"
              value={formData.article.title}
              onChange={(e) => handleInputChange('article', 'title', e.target.value)}
            />
            <label>Journal:</label>
            <input
              type="text"
              value={formData.article.journal}
              onChange={(e) => handleInputChange('article', 'journal', e.target.value)}
            />
            <label>Year:</label>
            <input
              type="text"
              value={formData.article.year}
              onChange={(e) => handleInputChange('article', 'year', e.target.value)}
            />
            <label>Volume:</label>
            <input
              type="text"
              value={formData.article.volume}
              onChange={(e) => handleInputChange('article', 'volume', e.target.value)}
            />
            <label>Issue:</label>
            <input
              type="text"
              value={formData.article.issue}
              onChange={(e) => handleInputChange('article', 'issue', e.target.value)}
            />
            <label>Pages:</label>
            <input
              type="text"
              value={formData.article.pages}
              onChange={(e) => handleInputChange('article', 'pages', e.target.value)}
            />
          </>
        );
      case 'website':
        return (
          <>
            <label>Author:</label>
            <input
              type="text"
              value={formData.website.author}
              onChange={(e) => handleInputChange('website', 'author', e.target.value)}
            />
            <label>Title:</label>
            <input
              type="text"
              value={formData.website.title}
              onChange={(e) => handleInputChange('website', 'title', e.target.value)}
            />
            <label>URL:</label>
            <input
              type="text"
              value={formData.website.url}
              onChange={(e) => handleInputChange('website', 'url', e.target.value)}
            />
            <label>Access Date:</label>
            <input
              type="date"
              value={formData.website.accessDate}
              onChange={(e) => handleInputChange('website', 'accessDate', e.target.value)}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="citation-generator-container">
      <h1>Citation Generator</h1>
      <p className="generator-subtitle">Generate citations in various formats.</p>

      <div className="input-section">
        <label>
          Citation Type:
          <select value={citationType} onChange={(e) => setCitationType(e.target.value)}>
            <option value="book"><Book /> Book</option>
            <option value="article"><FileText /> Article</option>
            <option value="website"><Link /> Website</option>
          </select>
        </label>
        {getFormFields()}
        <button onClick={generateCitation} className="generate-button">
          Generate Citation
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {citation && (
        <div className="output-section">
          <h2 className="citation-title">
            <CheckCircle className="check-icon" />
            Citation:
          </h2>
          <p className="citation-text">{citation}</p>
        </div>
      )}
    </div>
  );
};

export default CitationGenerator;
