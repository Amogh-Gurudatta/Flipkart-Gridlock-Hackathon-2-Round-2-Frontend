# Bengaluru Traffic Police — Predictive Command Center

> *A high-performance predictive traffic management dashboard. The BTP's tactical terminal for managing traffic anomalies.*

The BTP Command Center provides a clinical blue tactical terminal to manage active traffic events, forecast congestion life-cycles, and issue dispatch recommendations for traffic police deployment.

## Features

1. **Live Traffic Map & Event Feed**
   - Leaflet map centered on Bengaluru (`12.9716° N, 77.5946° E`) with CartoDB dark tiles.
   - Interactive nodes representing traffic incidents with severity-coded pulsating rings.

2. **AI Forecast Integration**
   - Auto-generated Gaussian bell-curve charting to visualize the "Predicted Congestion Life-Cycle" of any selected event.
   - Severity-based real-time toast alerts for `CRITICAL` and `HIGH` impact events.

3. **Official BTP Deployment Order Generator**
   - Real-time deployment calculation based on traffic event severity.
   - High-fidelity PDF generation (A4 scale) using `html2canvas` and `jsPDF`.

4. **Traffic Offender Registry**
   - Registry for tracking vehicle numbers, offense frequency, and pending challans.
   - Issue challans or generate vehicle impound orders.

5. **Active Dispatch Logs**
   - Comprehensive table tracking all active and forecasted anomalies, including recommended officer and barricade deployments.

## Setup Instructions

- Node.js `v18+`
- A running backend providing the traffic event stream.

### Local Development

```bash
git clone https://github.com/your-org/btp-command-center.git
cd btp-command-center
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_DEV_BYPASS=true
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
