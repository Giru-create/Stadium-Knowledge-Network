/**
 * @module lib/firebase
 *
 * Barrel re-export file.
 * All Firebase services have been extracted into dedicated modules under `src/services/`.
 * This file re-exports every public symbol so that existing `import { ... } from '@/lib/firebase'`
 * statements continue to work without modification.
 */

// ── Firebase initialization & helpers ───────────────────────────────────────
export { isFirebaseConfigured, getPlatformMode } from '@/services/firebase';

// ── Domain services ─────────────────────────────────────────────────────────
export { authService } from '@/services/auth.service';
export { stadiumService } from '@/services/stadium.service';
export { matchService } from '@/services/match.service';
export { incidentService } from '@/services/incident.service';
export { playbookService } from '@/services/playbook.service';
export { recommendationService } from '@/services/recommendation.service';
export { telemetryService } from '@/services/telemetry.service';

// ── Mock database (used by tests) ───────────────────────────────────────────
export { mockDb } from '@/services/mock-database';
