import type { Metadata } from 'next';
import ProofContent from './ProofContent';

export const metadata: Metadata = {
  title: 'Как EGC проверяет результат — EXPERIENCE GAMING CLUB',
  description: 'Как подтверждается прохождение квестов, как отсекаются накрутки и какие цифры мы можем показать студиям.',
};

export default function ProofPage() {
  return <ProofContent />;
}
