import { RevaLogo } from '../../components/AppIcon';
import { config } from '../../config';

export default function About() {
  return (
    <div className="about">
      <RevaLogo size={56} />
      <h2>Reva OS</h2>
      <div className="mono">Version {config.version} · build 15.10.2026</div>
      <dl>
        <dt>Designed for</dt>
        <dd>{config.userName}, exclusively</dd>
        <dt>Built by</dt>
        <dd>{config.makerName} 🐡</dd>
        <dt>Processor</dt>
        <dd>Runs mostly on goodnight messages</dd>
        <dt>Memory</dt>
        <dd>Selective, but thorough</dd>
        <dt>Licence</dt>
        <dd>Non-transferable</dd>
      </dl>
      <p className="editor-note">No trackers, no analytics, no cloud. Everything stays on this page.</p>
    </div>
  );
}
