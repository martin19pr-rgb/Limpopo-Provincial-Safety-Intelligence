import { motion } from 'framer-motion';

import emblemSaps from '@/assets/emblem-saps.jpeg';
import emblemEms from '@/assets/emblem-ems.jpeg';
import emblemTransport from '@/assets/emblem-transport.jpeg';
import emblemHealth from '@/assets/emblem-health.jpeg';
import emblemRoads from '@/assets/emblem-roads.jpeg';
import emblemCoatOfArms from '@/assets/coat-of-arms-sa.jpg';

const emblemMap: Record<string, { src: string; alt: string }> = {
  saps: { src: emblemSaps, alt: 'South African Police Service Emblem' },
  lmps: { src: emblemSaps, alt: 'South African Police Service Emblem' },
  ems: { src: emblemEms, alt: 'Emergency Medical Services Emblem' },
  transport: { src: emblemTransport, alt: 'Limpopo Department of Transport Emblem' },
  health: { src: emblemHealth, alt: 'Limpopo Department of Health Emblem' },
  roads: { src: emblemRoads, alt: 'Roads Agency Limpopo Emblem' },
  premier: { src: emblemCoatOfArms, alt: 'Republic of South Africa Coat of Arms' },
  command: { src: emblemCoatOfArms, alt: 'National Safety Intelligence — Limpopo, South Africa' },
};

interface Props {
  department: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function OfficialEmblem({ department, size = 'md' }: Props) {
  const config = emblemMap[department];
  if (!config) return null;

  const sizes = { sm: 40, md: 64, lg: 96 };
  const s = sizes[size];

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden bg-card border border-border p-1.5 inline-flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <img
        src={config.src}
        alt={config.alt}
        style={{ width: s, height: s }}
        className="object-contain rounded"
      />
    </motion.div>
  );
}
