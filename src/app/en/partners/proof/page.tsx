import type { Metadata } from 'next';
import ProofContent from '../../../partners/proof/ProofContent';

export const metadata: Metadata = {
  title: 'How EGC verifies results — EXPERIENCE GAMING CLUB',
  description: 'How quest completion is confirmed, how fake activity is filtered out, and the numbers we can show to game studios.',
};

export default function ProofPageEn() {
  return <ProofContent lang="en" />;
}
