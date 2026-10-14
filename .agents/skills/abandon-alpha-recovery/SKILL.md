---
name: abandon-alpha-recovery
description: Deterministic mathematical engine and runbook for AbandonAlpha (#9) — Behavioral Mouse-Velocity Exit-Intent Prediction, Beta-Bernoulli Thompson Sampling (C1–C6 Objection Counter-Offer Bandit), Stripe Decline-Code Smart Retry Dunning, and Expected Recovered MRR (EV) calculation.
---

# AbandonAlpha Autonomous Recovery & Bandit Skill

Use this skill whenever implementing, auditing, or extending AbandonAlpha's checkout abandonment grader, behavioral exit-intent trajectory detector, Beta-Bernoulli Thompson Sampling bandit, or Stripe failed-payment dunning engine.

---

## 1. Mouse-Velocity & Visibility Exit-Intent Prediction Math

Given cursor samples $(x_{t-1}, y_{t-1}, t-1)$ and $(x_t, y_t, t)$ with $\Delta t = \max(1, t - t_{t-1})$ ms:

1. **Vertical Velocity ($v_y$) & Ascent Angle ($\theta$)**:
   $$v_y = \frac{y_t - y_{t-1}}{\Delta t} \quad (\text{px/ms}), \qquad v_x = \frac{x_t - x_{t-1}}{\Delta t}$$
   $$\text{Time to Browser Chrome } (\tau) = \begin{cases} \frac{y_t}{|v_y|} & \text{if } v_y < 0 \\ \infty & \text{otherwise} \end{cases}$$

2. **Exit-Intent Trigger Score ($S_{\text{exit}} \in [0, 100]$)**:
   $$S_{\text{exit}} = \text{clamp}_{[0,100]}\Big( 45 \cdot \mathbb{I}(y_t < 60) + 35 \cdot \min\big(1, \frac{\max(0, -v_y)}{1.2}\big) + 20 \cdot \mathbb{I}(\tau < 80\text{ms}) \Big)$$
   - Fire the behavioral exit-intent intervention when $S_{\text{exit}} \ge 72$ OR `document.visibilityState === 'hidden'` after $\ge 8\text{s}$ on checkout.

---

## 2. Beta-Bernoulli Thompson Sampling & Expected Recovered Revenue (ERPV)

Each C1–C6 objection counter-offer arm $k \in \{1 \dots 6\}$ maintains a Beta posterior $\text{Beta}(\alpha_k, \beta_k)$ in SQLite:
- Prior initialization: $(\alpha_k^{(0)}, \beta_k^{(0)})$ seeded from empirical checkout recovery priors.
- On **Impression**: $\beta_k \leftarrow \beta_k + 1$
- On **Conversion (Recovered Checkout)**: $\alpha_k \leftarrow \alpha_k + 1$, $\beta_k \leftarrow \max(1, \beta_k - 1)$

### Posterior Statistics & Sampling
- **Posterior Mean Conversion Rate**:
  $$\mu_k = \frac{\alpha_k}{\alpha_k + \beta_k}$$
- **Posterior Variance & Standard Deviation**:
  $$\sigma_k^2 = \frac{\alpha_k \beta_k}{(\alpha_k + \beta_k)^2 (\alpha_k + \beta_k + 1)}, \qquad \sigma_k = \sqrt{\sigma_k^2}$$
- **Box-Muller Beta Approximation Sample**:
  $$\tilde{\theta}_k = \text{clamp}_{[0.0001, 0.9999]}\left(\mu_k + \sigma_k \sqrt{-2 \ln u_1}\cos(2\pi u_2)\right)$$
- **Net Margin-Adjusted Expected Recovered Value ($\text{ERPV}_k$)**:
  $$\text{ERPV}_k = \tilde{\theta}_k \cdot \text{AOV} \cdot (1 - d_k)$$
  where $d_k \in [0, 0.20]$ is the effective discount/incentive cost of arm $k$. The bandit selects $k^* = \arg\max_k \text{ERPV}_k$ (with an 80/20 deterministic session-hash exploration clamp when unconditioned, or contextual C1–C6 override when the user clicks a specific objection).

---

## 3. Stripe Failed-Payment Decline-Code Dunning Matrix

| Decline Code | Classification | Retry Strategy | Optimal Timing Schedule | Expected Recovery Rate |
| :--- | :--- | :--- | :--- | :--- |
| `insufficient_funds` | Soft (Liquidity) | Payday Window + 1-Click Pause/Downgrade | +72h, 1st/15th 06:00 Local, Friday 06:00 | **62.4%** |
| `do_not_honor` | Soft (Bank Risk `05`) | Cooled Retry + Pre-Auth SMS Alert | +24h Cooled, +96h, +168h + Billing Portal | **47.8%** |
| `expired_card` | Hard (Card Update) | Zero Auto-Retry → Instant Apple/Google Pay Link | Immediate (+2m Email, +15m SMS, +48h Reminder) | **54.2%** |
| `processing_error` | Transient Network | Exponential Backoff Auto-Retry | +15m, +4h, +24h | **78.5%** |
| `authentication_required` | 3DS / SCA Challenge | Off-Session Exemption or 1-Click 3DS Link | Immediate (+1m SMS/Email 3DS Modal Link) | **51.0%** |

---

## 4. Deterministic Monthly Revenue Leakage & Recovery Formula

Given:
- $N_{\text{sessions}}$: Monthly initiated checkout sessions
- $V_{\text{aov}}$: Average Order Value (or Monthly/Annual Contract Value in USD)
- $r_{\text{abandon}} \in (0, 1)$: Checkout abandonment rate (e.g. $0.71$)
- $M_{\text{mrr}}$: Active recurring revenue / monthly gross volume ($N_{\text{sessions}}(1 - r_{\text{abandon}})V_{\text{aov}}$)
- $r_{\text{fail}} \in (0, 1)$: Monthly failed payment / involuntary churn rate (e.g. $0.065$)

1. **Monthly Abandoned Checkout Revenue ($L_{\text{checkout}}$)**:
   $$L_{\text{checkout}} = N_{\text{sessions}} \cdot r_{\text{abandon}} \cdot V_{\text{aov}}$$
2. **Monthly Failed-Payment Dunning Leakage ($L_{\text{dunning}}$)**:
   $$L_{\text{dunning}} = M_{\text{mrr}} \cdot r_{\text{fail}}$$
3. **Total Monthly Revenue Leakage ($L_{\text{total}}$)**:
   $$L_{\text{total}} = L_{\text{checkout}} + L_{\text{dunning}}$$
4. **Recoverable Revenue via AbandonAlpha ($R_{\text{total}}$)**:
   - Exit-Intent C1–C6 Bandit Recovery: $R_{\text{exit}} = L_{\text{checkout}} \cdot 0.142$ (14.2% of abandoned checkouts captured via in-session bandit + 3-step `checkout.session.expired` sequence)
   - Smart Dunning Recovery: $R_{\text{dunning}} = L_{\text{dunning}} \cdot 0.568$ (56.8% weighted recovery across `insufficient_funds`, `do_not_honor`, and `expired_card`)
   - Total Monthly Recovered Cashflow:
     $$R_{\text{total}} = R_{\text{exit}} + R_{\text{dunning}}, \qquad \text{Annualized Impact} = 12 \cdot R_{\text{total}}$$
