import React from 'react';
import styled from 'styled-components';

const Notification = () => {
  return (
    <StyledWrapper>
      <aside className="halo-toast" role="status">
        <span className="halo-toast-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <div className="halo-toast-body">
          <p className="halo-toast-title">Build deployed</p>
          <p className="halo-toast-text">halo-web v1.4.2 is live on production.</p>
        </div>
        <div className="halo-toast-actions">
          <button className="halo-toast-link" type="button">View logs</button>
          <button className="halo-toast-close" type="button" aria-label="Dismiss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </aside>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .halo-toast {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    width: 380px;
    padding: 14px 14px 14px 16px;
    background-color: var(--color-elevated, #1e2029);
    border: 1px solid var(--color-border-strong, #3a3d4a);
    border-radius: 12px;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
    font-family: var(
      --font-display,
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif
    );
    color: var(--color-text-primary, #f2f4f8);
    overflow: hidden;
  }
  .halo-toast::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 2px;
    background-color: var(--color-success, #2be08c);
  }
  .halo-toast-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: rgba(43, 224, 140, 0.12);
    color: var(--color-success, #2be08c);
    border-radius: 8px;
    flex-shrink: 0;
  }
  .halo-toast-icon svg {
    width: 14px;
    height: 14px;
  }
  .halo-toast-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .halo-toast-title {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--color-text-primary, #f2f4f8);
  }
  .halo-toast-text {
    margin: 0;
    font-family: var(
      --font-body,
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif
    );
    font-size: 0.8125rem;
    color: var(--color-text-secondary, #9aa0ae);
  }
  .halo-toast-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .halo-toast-link {
    appearance: none;
    background: transparent;
    border: 0;
    color: var(--color-primary, #5b6bff);
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    transition: background-color 150ms cubic-bezier(0.2, 0.6, 0.2, 1);
  }
  .halo-toast-link:hover {
    background-color: rgba(91, 107, 255, 0.12);
  }
  .halo-toast-close {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: transparent;
    border: 0;
    border-radius: 6px;
    color: var(--color-text-muted, #5c6170);
    cursor: pointer;
    transition:
      background-color 150ms cubic-bezier(0.2, 0.6, 0.2, 1),
      color 150ms cubic-bezier(0.2, 0.6, 0.2, 1);
  }
  .halo-toast-close:hover {
    background-color: var(--color-surface, #14151c);
    color: var(--color-text-primary, #f2f4f8);
  }
  .halo-toast-close svg {
    width: 14px;
    height: 14px;
  }`;

export default Notification;
