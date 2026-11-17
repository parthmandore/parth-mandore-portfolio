# Planetary Assets & Visual Architecture Documentation
**Project**: Parth Mandore — Space Portfolio (`SPACE // STUDIO`)  
**Phase**: Phase 2 — Rebuild Solar-System Visuals  
**Date**: October 2026  

---

## 1. Asset Strategy & Synthesis Overview
To guarantee 60–120 FPS performance, instant zero-latency loading, zero external network requests, and absolute freedom from copyright restrictions, all astronomical surface maps in Phase 2 are synthesized through high-precision, mathematically rigorous procedural generators.

Unlike flat 2D canvas drawing (which causes severe polar distortion, egg-shaped stretching, and polygonal artifacts), our synthesis engine samples **3D Cartesian coordinates on the unit sphere**:
$$\theta = (u - 0.5) \cdot 2\pi, \quad \phi = (v - 0.5) \cdot \pi$$
$$\vec{P} = \begin{pmatrix} \cos\phi \cos\theta \\ \sin\phi \\ \cos\phi \sin\theta \end{pmatrix}$$

By evaluating 3D Simplex noise and fractional Brownian motion (fBm) directly at $\vec{P} \in \mathbb{R}^3$, the resulting $2048 \times 1024$ equirectangular maps are **100% distortion-free** across all latitudes, from the equator to the poles.

---

## 2. Planetary Surface Specifications (7 Authentic Projects)

| Body | Project Mapping | Astronomical Classification | Material & Surface Architecture |
| :--- | :--- | :--- | :--- |
| **Central Star** | Galactic Anchor | Class G2V Radiant Star | 3D Simplex convection granulation, physical Eddington limb darkening, organic multi-ray streamer corona. |
| **Planet 01** | RepoMentor AI | Terrestrial Synapse / Proto-Terra | Molten basalt crust, golden-amber continental highlands, tectonic rifts, independent drifting cloud sphere. |
| **Planet 02** | GymBuddy AI | Oceanic Glacial / High Albedo | Deep azure/cyan hydrosphere, crystalline continental plates, polar ice sheets with crevasse networks. |
| **Planet 03** | Career AI | Violet Gas Giant / Stratospheric | Multi-harmonic zonal jet streams, shear turbulence, cyclonic Great Violet Storm vortex. |
| **Planet 04** | MindPulse AI | Verdant Super-Earth / Biosphere | High-resolution fractal continents (forest jade, emerald canopy), coastal shallows, archipelago chains, dynamic baroclinic cloud spirals. |
| **Planet 05** | Spotify Clone | Ringed Gas Giant / Saturnian | Golden-ochre banded atmosphere; photorealistic concentric rings with Cassini Division ($0.58-0.64$), Crepe ring transparency, and $24^\circ$ axial tilt. |
| **Planet 06** | URL Shortener | Volcanic Basaltic / Magma Rifts | Dark basaltic crust, incandescent self-illuminating magma fractures, caldera hotspots (emissive night-side glow). |
| **Planet 07** | Gyan (Dyslexia App)| Amethyst Synapse / Neural World | Royal purple and sunset twilight mantle, luminescent cyan synaptic pathways, cognitive network nodes. |

---

## 3. Licensing, Attribution & Compliance
- **Procedural Synthesis Code**: Custom engineered for this portfolio, released under the MIT License.
- **Simplex Noise 3D Implementation**: Based on public-domain simplex noise algorithms originally formalized by Stefan Gustavson.
- **External Imagery Dependencies**: 0 external hotlinked image files. 0 proprietary copyright encumbrances.
- **Project Screenshots**: Authentic portfolio artifacts created and owned by Parth Mandore (`repomentor.png`, `gymbuddy.png`, `career-ai.png`, `mindpulse.png`, `spotify.png`, `url-shortner.jpeg`, `gyan.svg`).
