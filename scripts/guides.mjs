// Original evergreen guides published alongside the headlines. Each becomes <slug>.html and is listed on guides.html.
// `tool` links the guide to a calculator on the tools site (TOOLS_URL in build.mjs).

export const GUIDES = [
  {
    slug: 'payroll-deductions-guide',
    title: 'SSS, PhilHealth, Pag-IBIG and Tax: Your Payslip Deductions Explained',
    description: 'What each deduction on a Philippine payslip is, how much you pay at 2025 rates, and how to check your take-home pay.',
    updated: '2026-10-29',
    tool: { path: 'take-home-pay-calculator/', label: 'Compute your take-home pay' },
    body: `
<p><b>Short answer:</b> on a ₱30,000 monthly salary, a private-sector employee pays about ₱1,500 to SSS, ₱750 to PhilHealth, ₱200 to Pag-IBIG and roughly ₱1,000 in withholding tax, for take-home pay of about ₱26,500. Here is where each number comes from.</p>
<h2>SSS (Social Security System)</h2>
<p>SSS covers retirement, sickness, maternity, disability and death benefits. For 2025 the total contribution is <b>15% of your Monthly Salary Credit (MSC)</b>: your employer pays 10% and you pay <b>5%</b>.</p>
<ul>
  <li>The MSC is your salary rounded into ₱500 brackets, from a minimum of ₱5,000 to a maximum of ₱35,000.</li>
  <li>So your share ranges from <b>₱250 to ₱1,750</b> a month. Part of the contribution on salary credits above ₱20,000 goes to your Mandatory Provident Fund (MySSS Pension Booster) savings.</li>
</ul>
<h2>PhilHealth</h2>
<p>PhilHealth is the national health insurance program. The premium is <b>5% of your basic monthly salary</b>, shared equally, so you pay <b>2.5%</b>.</p>
<ul>
  <li>Salaries below ₱10,000 are computed as ₱10,000, and salaries above ₱100,000 as ₱100,000.</li>
  <li>Your share is therefore <b>₱250 to ₱2,500</b> a month.</li>
</ul>
<h2>Pag-IBIG Fund (HDMF)</h2>
<p>Pag-IBIG is a savings program that also gives access to housing and short-term loans. Since 2024, contributions are computed on salary up to <b>₱10,000</b>.</p>
<ul>
  <li>You pay <b>2%</b> (1% if you earn ₱1,500 or less), and your employer pays 2%.</li>
  <li>The maximum employee share is <b>₱200</b> a month. You can choose to contribute more to grow your savings.</li>
</ul>
<h2>Withholding tax</h2>
<p>Income tax is computed on your salary <i>after</i> your SSS, PhilHealth and Pag-IBIG shares are deducted. Under the TRAIN Law table in effect since 2023:</p>
<ul>
  <li>Annual taxable income up to <b>₱250,000</b> (about ₱20,833 a month) is <b>tax-free</b>.</li>
  <li>From ₱250,000 to ₱400,000, the rate is 15% of the excess over ₱250,000.</li>
  <li>From ₱400,000 to ₱800,000, it is ₱22,500 plus 20% of the excess over ₱400,000, and higher brackets go up to 35%.</li>
</ul>
<p>Minimum wage earners are exempt from income tax on their minimum wage, and 13th month pay and other benefits are tax-free up to ₱90,000 a year.</p>
<h2>Worked example: ₱30,000 a month</h2>
<ul>
  <li>SSS: MSC ₱30,000 × 5% = <b>₱1,500</b></li>
  <li>PhilHealth: ₱30,000 × 2.5% = <b>₱750</b></li>
  <li>Pag-IBIG: ₱10,000 × 2% = <b>₱200</b></li>
  <li>Taxable income: ₱30,000 − ₱2,450 = ₱27,550 a month, or ₱330,600 a year</li>
  <li>Tax: (₱330,600 − ₱250,000) × 15% = ₱12,090 a year, about <b>₱1,007.50</b> a month</li>
  <li>Take-home pay: <b>₱26,542.50</b></li>
</ul>
<h2>Check your contributions are being paid</h2>
<p>Deductions on your payslip only help you if your employer actually remits them. Check your records online through the <b>My.SSS</b> portal, the <b>PhilHealth Member Portal</b> and <b>Virtual Pag-IBIG</b>. If payments are missing, raise it with HR first, then with the agency.</p>
<p class="note">General information based on 2025 contribution rates. Rates change; check SSS, PhilHealth, Pag-IBIG and the BIR for the latest figures.</p>`,
  },
  {
    slug: '13th-month-pay-guide',
    title: '13th Month Pay in the Philippines: Who Gets It and How to Compute It',
    description: 'A plain-English guide to 13th month pay under Presidential Decree 851: who is entitled, how to compute it, when it is due, and how it is taxed.',
    updated: '2026-10-29',
    tool: { path: '13th-month-pay-calculator/', label: 'Compute your 13th month pay' },
    body: `
<p>Every December, millions of Filipino workers look forward to their 13th month pay. It is not a bonus your employer can choose to skip — it is required by law. Here is how it works.</p>
<h2>What the law says</h2>
<p>13th month pay comes from <b>Presidential Decree No. 851</b>, issued in 1975. It requires employers to give their rank-and-file employees an extra payment equal to at least one-twelfth (1/12) of the basic salary they earned during the calendar year.</p>
<h2>Who is entitled</h2>
<ul>
  <li><b>All rank-and-file employees</b> in the private sector, whatever their position or how they are paid (monthly, daily, piece rate or commission-based with a fixed wage component).</li>
  <li>Employees who worked <b>at least one month</b> during the calendar year.</li>
  <li>Employees who resigned or were separated before December — they are entitled to a <b>pro-rated</b> amount, paid with their final pay.</li>
</ul>
<p>Managerial employees are not covered by PD 851, although many companies give them a 13th month pay anyway as a company policy. Government employees receive a separate year-end bonus under their own rules.</p>
<h2>How to compute it</h2>
<p>The formula is simple:</p>
<p><b>13th month pay = total basic salary earned during the year ÷ 12</b></p>
<p>"Basic salary" means your regular pay for work done. It generally does <i>not</i> include overtime pay, night shift differential, holiday pay, cash allowances or other benefits, unless your company's policy or contract says otherwise. Unpaid absences are deducted, because you did not earn salary for those days.</p>
<h3>Example 1: worked the whole year</h3>
<p>Ana earns a basic salary of ₱20,000 a month and worked January to December with no unpaid leave. Her total basic salary for the year is ₱240,000, so her 13th month pay is ₱240,000 ÷ 12 = <b>₱20,000</b>.</p>
<h3>Example 2: joined mid-year</h3>
<p>Ben started on 1 June at ₱18,000 a month. By December he has earned 7 months × ₱18,000 = ₱126,000, so his 13th month pay is ₱126,000 ÷ 12 = <b>₱10,500</b>.</p>
<h3>Example 3: salary increase during the year</h3>
<p>Carla earned ₱25,000 a month from January to June and ₱28,000 from July to December. Her total is (6 × ₱25,000) + (6 × ₱28,000) = ₱318,000, so her 13th month pay is <b>₱26,500</b>.</p>
<h2>When it must be paid</h2>
<p>The deadline is <b>on or before 24 December</b> each year. Employers may pay it in two parts — for example, half in June and the rest in December — as long as the full amount is paid by the deadline.</p>
<h2>Is 13th month pay taxed?</h2>
<p>Under the TRAIN Law, 13th month pay and other benefits are <b>tax-exempt up to a combined ₱90,000</b> a year. Only the amount above ₱90,000 is added to your taxable income. Thresholds can change, so check the latest rules from the Bureau of Internal Revenue (BIR).</p>
<h2>What to do if you don't receive it</h2>
<p>Talk to your HR or payroll team first — sometimes it is a computation error. If the issue is not resolved, you can seek help from the Department of Labor and Employment (DOLE) through its Single Entry Approach (SEnA) for a free and quick settlement.</p>
<p class="note">This guide is general information, not legal advice. For your specific situation, check with DOLE or your company's HR team.</p>`,
  },
  {
    slug: 'add-on-vs-diminishing-interest',
    title: 'Add-On vs Diminishing Balance Interest: How Much Does Your Loan Really Cost?',
    description: 'Many Philippine lenders quote add-on rates that look cheap but cost almost twice as much. Learn the difference and how to compare loan offers.',
    updated: '2026-10-29',
    tool: { path: 'loan-calculator/', label: 'Try the loan calculator' },
    body: `
<p>Two lenders both offer you a loan at "1.5% a month". One will cost you far more than the other. The difference is how the interest is computed — and it is one of the most common money traps for Filipino borrowers.</p>
<h2>Add-on interest</h2>
<p>With <b>add-on interest</b>, the lender computes interest on the <i>full original amount</i> for the whole term, adds it to the loan, and divides the total into equal payments. You keep paying interest on money you have already paid back.</p>
<p><b>Example:</b> ₱100,000 for 12 months at 1.5% a month add-on.</p>
<ul>
  <li>Interest: ₱100,000 × 1.5% × 12 = ₱18,000</li>
  <li>Total to repay: ₱118,000, or about ₱9,833 a month</li>
</ul>
<h2>Diminishing balance interest</h2>
<p>With <b>diminishing balance</b> (also called declining balance or amortised) interest, each month's interest is charged only on what you still owe. As your balance goes down, so does the interest. This is how most bank housing loans and many personal loans work.</p>
<p><b>Same example on diminishing balance:</b> ₱100,000 for 12 months at 1.5% a month works out to about ₱9,168 a month, with total interest of roughly <b>₱10,000</b> — about ₱8,000 less than the add-on loan.</p>
<h2>The rule of thumb</h2>
<p>An add-on rate costs roughly <b>1.7 to 1.9 times</b> the same diminishing rate over a typical one-to-three-year loan. So a "1.5% add-on" loan is closer to 2.7% a month on a diminishing basis.</p>
<h2>How to compare loan offers</h2>
<ol>
  <li><b>Ask for the effective interest rate (EIR).</b> Under the Truth in Lending Act (Republic Act 3765), lenders must disclose the true cost of credit before you sign. The EIR includes the way interest is computed and most fees.</li>
  <li><b>Compare total amount repaid,</b> not the monthly rate. Multiply the monthly payment by the number of months.</li>
  <li><b>Check the fees.</b> Processing fees, service charges and insurance deducted from the proceeds raise the real cost, because you receive less cash than you borrow.</li>
  <li><b>Ask about early payment.</b> On add-on loans, paying early may not reduce your interest. Ask how pre-termination is computed.</li>
</ol>
<h2>Watch out for online lending apps</h2>
<p>Only borrow from lenders registered with the Securities and Exchange Commission (SEC) or supervised by the Bangko Sentral ng Pilipinas (BSP). Unregistered apps often charge very high fees and use abusive collection practices. You can check a lender's registration on the SEC website before borrowing.</p>
<p class="note">This guide is general information, not financial advice. Rates in the examples are for illustration only.</p>`,
  },
  {
    slug: 'emergency-fund-guide',
    title: 'How to Build an Emergency Fund on a Filipino Salary',
    description: 'How much emergency fund you need, where to keep it in the Philippines, and a step-by-step plan to build it even on a tight budget.',
    updated: '2026-10-29',
    tool: { path: 'savings-goal-calculator/', label: 'Plan your monthly savings' },
    body: `
<p>A typhoon damages your roof. A family member is hospitalised. Your contract isn't renewed. Without savings, emergencies like these push many families into high-interest debt. An emergency fund is the cushion that keeps a bad month from becoming a bad year.</p>
<h2>How much do you need?</h2>
<p>A common target is <b>three to six months of essential expenses</b> — not your full salary, just what you must pay to get by: rent or amortisation, food, utilities, transport, school costs, insurance and loan payments.</p>
<ul>
  <li><b>Closer to three months</b> if you have a stable job, a second income in the household and few dependants.</li>
  <li><b>Closer to six months or more</b> if you are self-employed, a freelancer, an OFW with a fixed-term contract, or the main provider for your family.</li>
</ul>
<p><b>Example:</b> if your household's essential expenses are ₱25,000 a month, a three-month fund is ₱75,000 and a six-month fund is ₱150,000.</p>
<h2>Where to keep it</h2>
<p>Your emergency fund should be <b>safe</b> and <b>quick to withdraw</b> — not invested in stocks or tied up in time deposits with penalties.</p>
<ul>
  <li><b>A separate savings account</b> from the one your salary goes into, so you are not tempted to spend it.</li>
  <li><b>Digital bank accounts</b> often pay higher interest than traditional savings accounts. Choose one licensed by the BSP; deposits are insured by the PDIC up to ₱1,000,000 per depositor per bank.</li>
  <li><b>Some cash at home</b> for disasters when ATMs and e-wallets are down — enough for a few days of food, water and transport.</li>
</ul>
<h2>A step-by-step plan</h2>
<ol>
  <li><b>Start with a mini goal.</b> Aim for ₱10,000 first. Reaching it quickly builds the habit.</li>
  <li><b>Save first, spend later.</b> Move a fixed amount on payday — even ₱500 or ₱1,000 — before paying for anything else. Automatic transfers make this easier.</li>
  <li><b>Use windfalls.</b> Put part of your 13th month pay, tax refunds or bonuses straight into the fund.</li>
  <li><b>Cut one recurring cost.</b> An unused subscription or a cheaper phone plan can fund your savings every month.</li>
  <li><b>Refill after you use it.</b> An emergency fund is meant to be spent on emergencies — then rebuilt.</li>
</ol>
<h2>What counts as an emergency?</h2>
<p>Unexpected, necessary and urgent: medical bills, essential home or vehicle repairs, sudden loss of income. Sales, gadgets and holidays are not emergencies — save for those separately.</p>
<p class="note">This guide is general information, not financial advice.</p>`,
  },
  {
    slug: 'how-to-spot-fake-news',
    title: 'How to Spot Fake News: A Practical Checklist for Filipino Readers',
    description: 'A simple checklist to tell real news from fake news, misleading headlines and edited photos before you share them on Facebook or group chats.',
    updated: '2026-10-29',
    body: `
<p>False stories spread fastest in the places we trust most — family group chats, Facebook pages and short videos. Before you share a shocking headline, take thirty seconds to run through this checklist.</p>
<h2>1. Check the source</h2>
<p>Is the story from a news organisation you recognise, with a real website, named editors and a way to contact them? Be careful with pages that have names similar to real outlets but a slightly different spelling or web address.</p>
<h2>2. Read past the headline</h2>
<p>Headlines are written to get clicks. Many misleading posts have a headline that the article itself does not support. Read the full story before reacting.</p>
<h2>3. Look for other reports</h2>
<p>Big news is covered by many outlets. If only one unknown page is reporting something dramatic, wait. Search for the story and see whether established news organisations are reporting the same facts. On this site, every headline links to its original publisher so you can see who is reporting what.</p>
<h2>4. Check the date</h2>
<p>Old stories and photos are often reshared as if they were new — especially during typhoons, elections and emergencies. Check when the article was published.</p>
<h2>5. Check photos and videos</h2>
<p>Images can be edited or taken from a completely different event. A reverse image search (for example, Google Lens) shows where else a photo has appeared and when.</p>
<h2>6. Watch your emotions</h2>
<p>Fake news is designed to make you angry, scared or excited, because strong emotions make people share without checking. If a post makes you feel outraged, slow down.</p>
<h2>7. Look for fact-checks</h2>
<p>Independent fact-checking organisations in the Philippines regularly review viral claims. Searching the claim together with the words "fact check" often finds an answer quickly.</p>
<h2>8. When in doubt, don't share</h2>
<p>Sharing a false story — even to ask "is this true?" — helps it spread. If you can't verify it, don't forward it.</p>
<p class="note">Spotted an error on this site? Tell us on our Contact page and we will correct it.</p>`,
  },
];
