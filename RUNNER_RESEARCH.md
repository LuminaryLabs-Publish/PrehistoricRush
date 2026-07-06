# PrehistoricRush Runner Research

## Runtime structure

Use a small scene state machine: menu -> game -> run-over -> win -> menu. The product app should only load scene manifests and pass input into kits.

## Infinite runner generation

Use streamed segments with look-ahead validation:

- keep a ring buffer of active segments
- spawn ahead of the camera/player
- recycle segments behind the player
- object-pool obstacles, pickups, and sky agents
- validate generated segments against reaction-time and lane-availability rules

## Movement feel

Use fixed-step simulation inside the runner kit where possible, with render interpolation in the host. Tune using:

- constant forward speed with a gradual speed ramp
- buffered jump input
- coyote-time tolerance
- eased lane changes
- FOV response at speed
- banking/leaning on lane transitions
- short camera lag and look-ahead

## Animation style

Use a procedural pose stack first:

- body bob from stride phase
- foot cycle from stride phase
- secondary motion from delayed phase
- squash/stretch on landing and fast lane changes
- follow-through on head, tail, feather, and wing accents

## Sky life

Use a light flocking model for background creatures:

- separation
- alignment
- cohesion
- goal seeking
- screen-space culling
- low update rate with interpolation

Keep all sky-agent state in a future domain kit; the product app should consume descriptors only.
