import React from 'react';

const Notification = ({
  title = 'Percepta learned a preference',
  message = 'Audio cues are working well for your morning routine.',
  actionLabel = 'View policy',
  actionHref = '/app/policy',
  onDismiss,
}) => {
  return (
    <aside className="folder-halo-toast" role="status">
      <span className="folder-halo-toast__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div className="folder-halo-toast__body">
        <p className="folder-halo-toast__title">{title}</p>
        <p className="folder-halo-toast__text">{message}</p>
      </div>
      <div className="folder-halo-toast__actions">
        <a className="folder-halo-toast__link" href={actionHref}>{actionLabel}</a>
        <button className="folder-halo-toast__close" type="button" aria-label="Dismiss notification" onClick={onDismiss}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Notification;
