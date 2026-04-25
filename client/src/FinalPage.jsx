import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildApiUrl } from './api';
import './FinalPage.css';

const SECTION_CONFIG = [
  { key: 'insights', title: 'Possible Insights' },
  { key: 'remedies', title: 'Home Remedies' },
  { key: 'medicines', title: 'OTC Medicines' },
  { key: 'lifestyle', title: 'Lifestyle Tips' },
  { key: 'seeDoctor', title: 'See a Doctor' },
  { key: 'disclaimer', title: 'Safety Disclaimer' },
];

const EMPTY_SECTIONS = {
  insights: '',
  remedies: '',
  medicines: '',
  lifestyle: '',
  seeDoctor: '',
  disclaimer: '',
};

function readStoredPayload() {
  try {
    const storedPayload = sessionStorage.getItem('healthify:last-form');
    return storedPayload ? JSON.parse(storedPayload) : null;
  } catch (error) {
    return null;
  }
}

function readStoredAdvice() {
  return sessionStorage.getItem('healthify:last-advice') || '';
}

function resolveSectionKey(heading) {
  const lowerHeading = heading.toLowerCase();

  if (lowerHeading.includes('possible insight')) {
    return 'insights';
  }

  if (lowerHeading.includes('home remed')) {
    return 'remedies';
  }

  if (lowerHeading.includes('otc') || lowerHeading.includes('medicine')) {
    return 'medicines';
  }

  if (lowerHeading.includes('lifestyle')) {
    return 'lifestyle';
  }

  if (lowerHeading.includes('see a doctor') || lowerHeading.includes('red flag')) {
    return 'seeDoctor';
  }

  if (lowerHeading.includes('disclaimer')) {
    return 'disclaimer';
  }

  return '';
}

function splitAdviceIntoSections(markdown) {
  if (!markdown.trim()) {
    return EMPTY_SECTIONS;
  }

  const sections = { ...EMPTY_SECTIONS };
  const blocks = markdown
    .split(/(?=^#{1,3}\s+)/m)
    .map((block) => block.trim())
    .filter(Boolean);

  let matchedSection = false;

  blocks.forEach((block) => {
    const [headingLine, ...contentLines] = block.split('\n');
    const heading = headingLine.replace(/^#{1,3}\s*/, '').trim();
    const key = resolveSectionKey(heading);
    const content = contentLines.join('\n').trim();

    if (key) {
      sections[key] = content || sections[key];
      matchedSection = true;
      return;
    }

    if (!matchedSection && !sections.insights) {
      sections.insights = block;
    }
  });

  if (!matchedSection && !sections.insights) {
    sections.insights = markdown.trim();
  }

  return sections;
}

function buildSummaryItems(formData) {
  if (!formData) {
    return [];
  }

  return [
    { label: 'Age', value: `${formData.age || '-'} years` },
    { label: 'Gender', value: formData.gender || '-' },
    { label: 'Weight', value: formData.weight ? `${formData.weight} kg` : '-' },
    { label: 'Height', value: formData.height ? `${formData.height} cm` : '-' },
    { label: 'Duration', value: formData.duration || '-' },
    {
      label: 'Symptoms',
      value:
        formData.symptoms?.length || formData.additionalSymptoms
          ? [...(formData.symptoms || []), formData.additionalSymptoms]
              .filter(Boolean)
              .join(', ')
          : '-',
    },
    {
      label: 'Conditions',
      value: formData.preExistingConditions || 'None reported',
    },
    {
      label: 'Allergies',
      value: formData.allergies || 'None reported',
    },
    {
      label: 'Medications',
      value: formData.currentMedications || 'None reported',
    },
  ];
}

const FinalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    location.state?.formData || readStoredPayload(),
  );
  const [adviceMarkdown, setAdviceMarkdown] = useState(readStoredAdvice());
  const [loading, setLoading] = useState(Boolean(location.state?.formData || readStoredPayload()));
  const [error, setError] = useState('');

  useEffect(() => {
    const nextPayload = location.state?.formData || readStoredPayload();
    setFormData(nextPayload);

    if (!nextPayload) {
      setLoading(false);
      setError('No health form data was found. Please complete the intake form first.');
      return undefined;
    }

    const controller = new AbortController();

    async function fetchAdvice() {
      setLoading(true);
      setError('');
      setAdviceMarkdown('');
      sessionStorage.removeItem('healthify:last-advice');

      try {
        const response = await fetch(buildApiUrl('/api/health-advice?stream=true'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nextPayload),
          signal: controller.signal,
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type') || '';
          let message = 'Unable to load health advice right now.';

          if (contentType.includes('application/json')) {
            const data = await response.json();
            message = data.error || message;
          } else {
            const text = await response.text();
            message = text.trim() || message;
          }

          throw new Error(message);
        }

        if (!response.body) {
          const fullResponse = await response.text();
          setAdviceMarkdown(fullResponse);
          sessionStorage.setItem('healthify:last-advice', fullResponse);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          fullResponse += decoder.decode(value, { stream: true });
          setAdviceMarkdown(fullResponse);
        }

        fullResponse += decoder.decode();
        setAdviceMarkdown(fullResponse);
        sessionStorage.setItem('healthify:last-advice', fullResponse);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load health advice right now.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAdvice();

    return () => {
      controller.abort();
    };
  }, [location.key, location.state]);

  const sections = splitAdviceIntoSections(adviceMarkdown);
  const summaryItems = buildSummaryItems(formData);

  return (
    <main className="advice-results-page">
      <section className="advice-results-shell">
        <aside className="patient-summary-card">
          <span className="eyebrow">Submitted Health Snapshot</span>
          <h1>Your intake summary</h1>
          <p>Use this panel to double-check the details sent to the assistant.</p>

          <dl className="summary-list">
            {summaryItems.map((item) => (
              <div key={item.label} className="summary-row">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="summary-actions">
            <button type="button" className="secondary-button" onClick={() => navigate('/form', { state: { formData } })}>
              Edit form
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate('/')}>
              Back home
            </button>
          </div>
        </aside>

        <section className="results-panel">
          <div className="results-header">
            <div>
              <span className="eyebrow">Groq Response</span>
              <h2>Personalized guidance</h2>
            </div>

            {loading ? (
              <div className="loading-indicator" aria-live="polite">
                <span className="spinner" />
                Streaming your advice...
              </div>
            ) : null}
          </div>

          {error ? <div className="error-banner">{error}</div> : null}

          {!loading && !error && !adviceMarkdown ? (
            <div className="empty-state">No advice has been generated yet.</div>
          ) : null}

          <div className="section-grid">
            {SECTION_CONFIG.map((section) => {
              const content = sections[section.key];
              const showPlaceholder = !content && loading;

              return (
                <article key={section.key} className="advice-card">
                  <header>
                    <h3>{section.title}</h3>
                  </header>

                  {content ? (
                    <div className="markdown-body">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  ) : null}

                  {showPlaceholder ? (
                    <p className="card-placeholder">Healthify is still drafting this section...</p>
                  ) : null}

                  {!content && !showPlaceholder && !error ? (
                    <p className="card-placeholder">This section was not included in the latest response.</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default FinalPage;
