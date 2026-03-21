import { motion } from 'framer-motion';

import emblemSaps from '@/assets/emblem-saps.jpeg';
import emblemEms from '@/assets/emblem-ems.jpeg';
import emblemTransport from '@/assets/emblem-transport.jpeg';
import emblemHealth from '@/assets/emblem-health.jpeg';
import emblemRoads from '@/assets/emblem-roads.jpeg';
import emblemCoatOfArms from '@/assets/coat-of-arms-lesotho.jpg';

const emblemMap: Record<string, { src: string; alt: string }> = {
  saps: { src: emblemSaps, alt: 'Lesotho Mounted Police Service Emblem' },
  lmps: { src: emblemSaps, alt: 'Lesotho Mounted Police Service Emblem' },
  ems: { src: emblemEms, alt: 'Emergency Medical Services Emblem' },
  transport: { src: emblemTransport, alt: 'Lesotho Ministry of Transport Emblem' },
  health: { src: emblemHealth, alt: 'Lesotho Ministry of Health Emblem' },
  roads: { src: emblemRoads, alt: 'Roads Directorate Lesotho Emblem' },
  premier: { src: emblemCoatOfArms, alt: 'Kingdom of Lesotho Coat of Arms' },
  command: { src: emblemCoatOfArms, alt: 'National Safety Intelligence — Kingdom of Lesotho' },
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
