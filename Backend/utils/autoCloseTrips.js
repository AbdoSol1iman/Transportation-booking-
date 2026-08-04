/**
 * autoCloseTrips.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Background job that auto-closes trips when:
 *   1. departureTime has passed  → status: 'completed'  (or 'inProgress' while running)
 *   2. All seats are filled      → status: 'fullyBooked'
 *
 * Runs every 60 seconds via setInterval (no extra dependency needed).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const Trip = require('../Model/Trip');

const autoCloseTrips = async () => {
  try {
    const now = new Date();

    // ── 1. Mark as 'completed' trips whose departureTime has passed ──────────
    const completedResult = await Trip.updateMany(
      {
        status: { $in: ['scheduled', 'inProgress', 'fullyBooked'] },
        departureTime: { $lte: now },
      },
      { $set: { status: 'completed' } }
    );

    // ── 2. Mark as 'fullyBooked' trips where seats are all taken ─────────────
    const fullyBookedResult = await Trip.updateMany(
      {
        status: 'scheduled',
        departureTime: { $gt: now },
        $expr: { $gte: ['$currentPassengers', '$capacity'] },
      },
      { $set: { status: 'fullyBooked' } }
    );

    const modified = completedResult.modifiedCount + fullyBookedResult.modifiedCount;
    if (modified > 0) {
      console.log(
        `[AutoClose] ✅ ${completedResult.modifiedCount} trip(s) marked completed, ` +
        `${fullyBookedResult.modifiedCount} trip(s) marked fullyBooked`
      );
    }
  } catch (err) {
    console.error('[AutoClose] ❌ Error during auto-close:', err.message);
  }
};

/**
 * Start the background job.
 * @param {number} intervalMs - How often to run (default: 60 000 ms = 1 minute)
 */
const startAutoCloseJob = (intervalMs = 60_000) => {
  console.log(`[AutoClose] 🕐 Trip auto-close job started (interval: ${intervalMs / 1000}s)`);
  // Run immediately on start, then on interval
  autoCloseTrips();
  setInterval(autoCloseTrips, intervalMs);
};

module.exports = { startAutoCloseJob, autoCloseTrips };
