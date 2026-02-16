# Changelog

This document outlines the changes introduced to the DeepVoidGate project.

## Version 1.1.0 (Feb 2026)

### New Features & Improvements

*   **Expedition System Overhaul (Event-Driven):**
    *   Completely re-designed the expedition mechanics to be event-driven rather than time-based. Expeditions now progress through player choices in interactive events, eliminating passive waiting times.
    *   Expedition status now includes "awaiting\_action" to indicate player input is required.
    *   New "start" events introduced for Scientific and Mining expeditions to initiate event chains.
    *   UI for expeditions updated to reflect the event-driven nature, showing event descriptions and options instead of progress bars and timers.
    *   Expedition cancellation now permitted for "awaiting\_action" status.

*   **Global Technology Research Time Reduction:**
    *   Implemented a global 50% reduction in research time for all technologies. This multiplier is applied on top of any existing faction bonuses or galactic upgrades.

*   **UI Enhancement: Time-to-Acquire Missing Resources:**
    *   **Building Upgrades:** The Building Card UI now dynamically calculates and displays the estimated time (e.g., "1h 30m") required to acquire missing resources for upgrades, shown next to the cost when resources are insufficient and net production is positive.
    *   **Technology Research:** Similarly, the Technology Manager UI now shows the estimated time to acquire missing resources for starting technology research.

### Bug Fixes

*   **UI Layout Fix - Technology Cards:**
    *   Resolved an overlap issue where "Research Time" text would sometimes overlap with the "Requires" (prerequisites) section on technology cards.
    *   Technology cards now use a minimum height (`min-h-[350px]`) and a flex column layout, allowing them to adapt dynamically to content. The bottom action section now uses `mt-auto` for proper spacing.
*   **Syntax Errors:**
    *   Fixed multiple syntax errors in `src/data/expeditionEvents.ts` related to missing curly braces in event option definitions, which caused runtime errors.
*   **Dependency Resolution:**
    *   Removed references to `handleExpeditionTick` from `gameReducer.ts` as the function was removed during the expedition system overhaul.

### Removed Features

*   Time-based expedition progression (including `handleExpeditionTick`, `calculateExpeditionDuration`, fixed durations).
*   `launchExpedition` function, as expeditions now start directly in an "awaiting\_action" state.