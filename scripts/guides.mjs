// Original evergreen guides published alongside the headlines. Each becomes <slug>.html and is listed on guides.html.
// `tool` links the guide to a calculator on the tools site (TOOLS_URL in build.mjs). GUIDES_ORDER (at the end)
// sets the order on the guides page and menus: the most timely guides first.

const ALL_GUIDES = [
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
  {
    slug: 'christmas-budget-guide',
    title: 'Christmas on a Budget: A Simple Plan for Filipino Families',
    description: 'How to plan your Christmas spending in the Philippines — gifts, Noche Buena, aguinaldo for inaanak — without starting January in debt.',
    updated: '2026-10-29',
    tool: { path: 'savings-goal-calculator/', label: 'Plan your Christmas savings' },
    body: `
<p><b>Short answer:</b> decide one total amount for the whole season before you shop, split it into categories, and keep part of your 13th month pay for January. A written list with a peso amount next to every name is the single best way to stay on budget.</p>
<h2>Step 1: Set one total budget</h2>
<p>Start with what you can afford, not what you want to buy. A common approach is to use only <b>part</b> of your 13th month pay for Christmas and set the rest aside for January, when tuition, bills and post-holiday expenses arrive while the next payday still feels far away.</p>
<h2>Step 2: Split it into categories</h2>
<p>Most Filipino households spend in the same places. Here is an example for a ₱15,000 Christmas budget:</p>
<ul>
  <li><b>Gifts for family:</b> ₱5,000</li>
  <li><b>Aguinaldo for inaanak:</b> ₱2,500 (for example, ten inaanak at ₱250)</li>
  <li><b>Noche Buena and Media Noche:</b> ₱4,000</li>
  <li><b>Office parties and exchange gifts:</b> ₱1,500</li>
  <li><b>Travel home or transport:</b> ₱1,500</li>
  <li><b>Buffer for surprises:</b> ₱500</li>
</ul>
<h2>Step 3: Make a list with names and amounts</h2>
<p>Write every person you plan to give to and the amount for each. When the list adds up to more than the category budget, adjust the list — not the budget. Gift exchanges with a fixed price (for example, ₱300) keep things fair and predictable.</p>
<h2>Ways to spend less without feeling "kuripot"</h2>
<ul>
  <li><b>Shop early</b> and compare prices; prices and crowds rise in the last two weeks before Christmas.</li>
  <li><b>Check real discounts.</b> "Up to 70% off" often applies to a few items. Work out the actual sale price before buying.</li>
  <li><b>Give homemade food or useful gifts</b> — baked goods, a meal for the family, or something the person actually needs.</li>
  <li><b>Pool money with siblings</b> for one bigger gift for your parents instead of several small ones.</li>
  <li><b>Use cash or a debit card</b> for Christmas shopping, so you can only spend what you have.</li>
</ul>
<h2>Avoid starting the year in debt</h2>
<p>If you use a credit card, only charge what you can pay in full on the next statement. Interest on an unpaid balance quickly cancels out any holiday sale savings. If you have to borrow, compare the true cost first — see our guide on <a href="add-on-vs-diminishing-interest.html">add-on vs diminishing interest</a>.</p>
<h2>Start next year's fund in January</h2>
<p>Saving ₱1,250 a month from January gives you ₱15,000 by December. A small, automatic monthly transfer makes next Christmas far less stressful.</p>
<p class="note">Amounts in this guide are examples. Adjust them to your family and income.</p>`,
  },
  {
    slug: 'holiday-pay-rules',
    title: 'Holiday Pay in the Philippines: Regular Holidays vs Special Non-Working Days',
    description: 'How much you should be paid on regular holidays and special non-working days in the Philippines, with examples using a daily rate.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> if you work on a <b>regular holiday</b>, you get <b>200%</b> of your daily rate; if you don't work, you still get <b>100%</b>. On a <b>special non-working day</b>, you get <b>130%</b> if you work and, as a rule, nothing if you don't ("no work, no pay"), unless your company policy or contract says otherwise.</p>
<h2>Regular holidays</h2>
<p>Regular holidays are set by law. They include New Year's Day (1 January), Maundy Thursday, Good Friday, Araw ng Kagitingan (9 April), Labor Day (1 May), Independence Day (12 June), National Heroes Day (last Monday of August), Bonifacio Day (30 November), Christmas Day (25 December) and Rizal Day (30 December), plus Eid'l Fitr and Eid'l Adha on the dates proclaimed each year.</p>
<ul>
  <li><b>Did not work:</b> 100% of your daily rate, as long as you were present or on paid leave on the working day just before the holiday.</li>
  <li><b>Worked (first 8 hours):</b> 200% of your daily rate.</li>
  <li><b>Overtime:</b> an extra 30% of the hourly rate for that day.</li>
  <li><b>Worked, and it is also your rest day:</b> 200% plus another 30% of that, or 260%.</li>
</ul>
<h2>Special non-working days</h2>
<p>Special non-working days are declared each year by presidential proclamation. They commonly include days such as Ninoy Aquino Day (21 August), All Saints' Day (1 November), the Feast of the Immaculate Conception (8 December), Christmas Eve (24 December) and the last day of the year (31 December), and sometimes others. Always check the proclamation for the year.</p>
<ul>
  <li><b>Did not work:</b> no pay, unless your company policy, contract or collective agreement grants it.</li>
  <li><b>Worked (first 8 hours):</b> 130% of your daily rate.</li>
  <li><b>Worked, and it is also your rest day:</b> 150% of your daily rate.</li>
  <li><b>Overtime:</b> an extra 30% of the hourly rate for that day.</li>
</ul>
<h2>Special working days</h2>
<p>On a special <i>working</i> day, normal rules apply: you are paid your regular rate for work done.</p>
<h2>Examples with a ₱600 daily rate</h2>
<ul>
  <li>Regular holiday, not worked: <b>₱600</b></li>
  <li>Regular holiday, worked: <b>₱1,200</b></li>
  <li>Regular holiday on your rest day, worked: <b>₱1,560</b></li>
  <li>Special non-working day, worked: <b>₱780</b></li>
  <li>Special non-working day on your rest day, worked: <b>₱900</b></li>
</ul>
<h2>Who is not covered</h2>
<p>Holiday pay rules don't apply to everyone — for example, government employees, managerial employees and some small retail and service businesses are treated differently. Check with DOLE if you are unsure.</p>
<p>Want to know what overtime on these days is worth? See our guide to <a href="overtime-night-differential.html">overtime and night differential pay</a>.</p>
<p class="note">General information based on the Labor Code and DOLE advisories. DOLE issues a pay-rules advisory for each holiday; check it for special cases.</p>`,
  },
  {
    slug: 'overtime-night-differential',
    title: 'How to Compute Overtime and Night Differential Pay in the Philippines',
    description: 'Step-by-step computation of overtime pay, rest day pay and night shift differential under the Philippine Labor Code, with worked examples.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> overtime on a regular workday is paid at <b>125%</b> of your hourly rate. Work between <b>10 pm and 6 am</b> earns a night shift differential of at least <b>10%</b> of your hourly rate for each hour. Working on your rest day pays <b>130%</b> of your daily rate.</p>
<h2>Step 1: Find your hourly rate</h2>
<p>Normal working hours are 8 hours a day, so your hourly rate is your daily rate divided by 8. A ₱800 daily rate gives an hourly rate of <b>₱100</b>.</p>
<h2>Overtime on an ordinary working day</h2>
<p>Work beyond 8 hours earns your hourly rate plus at least <b>25%</b>.</p>
<p><b>Example:</b> 2 hours of overtime at ₱100 an hour: 2 × ₱100 × 1.25 = <b>₱250</b>.</p>
<h2>Working on your rest day or a special day</h2>
<p>Work on your scheduled rest day or a special non-working day is paid at <b>130%</b> of your daily rate for the first 8 hours. Overtime on those days adds another 30% of the hourly rate for that day.</p>
<p><b>Example:</b> 8 hours on your rest day at a ₱800 daily rate: ₱800 × 1.3 = <b>₱1,040</b>. Two more hours of overtime: 2 × (₱100 × 1.3) × 1.3 = <b>₱338</b>.</p>
<h2>Night shift differential</h2>
<p>For every hour worked between <b>10:00 pm and 6:00 am</b>, you get at least an extra <b>10%</b> of your hourly rate for that time.</p>
<p><b>Example:</b> a shift from 6 pm to 2 am includes 4 hours of night work. At ₱100 an hour, the night differential is 4 × ₱100 × 0.10 = <b>₱40</b>. Night hours that are also overtime earn both premiums.</p>
<h2>Things to know</h2>
<ul>
  <li><b>Undertime can't cancel overtime.</b> Under the Labor Code, coming in late or leaving early on one day can't be offset by overtime on another day.</li>
  <li><b>Overtime must be paid even if it wasn't formally approved</b> when the employer knew about the work and allowed it — but company rules on approval still matter, so keep records.</li>
  <li><b>Not everyone is covered.</b> Managerial employees, officers, field personnel and some others are excluded from overtime and night differential rules.</li>
  <li>For holidays, see our <a href="holiday-pay-rules.html">holiday pay guide</a>.</li>
</ul>
<p class="note">General information based on the Labor Code of the Philippines. Your contract or company policy may give more than the legal minimum; check with DOLE for your situation.</p>`,
  },
  {
    slug: 'budget-50-30-20-philippines',
    title: 'The 50/30/20 Budget Rule on a Filipino Salary',
    description: 'How to use the 50/30/20 budget rule with Philippine take-home pay, including family support, with a worked example and simple adjustments.',
    updated: '2026-10-29',
    tool: { path: 'take-home-pay-calculator/', label: 'Find your take-home pay first' },
    body: `
<p><b>Short answer:</b> split your <b>take-home pay</b> into 50% for needs, 30% for wants and 20% for savings and debt payments. On a ₱26,500 take-home pay, that is about ₱13,250 for needs, ₱7,950 for wants and ₱5,300 for savings.</p>
<h2>The three buckets</h2>
<ul>
  <li><b>Needs (50%):</b> rent or amortisation, food, utilities, transport, school expenses, insurance and minimum loan payments.</li>
  <li><b>Wants (30%):</b> eating out, shopping, subscriptions, travel, gadgets and hobbies.</li>
  <li><b>Savings and debt (20%):</b> emergency fund, retirement and investments, and any extra payments on debt.</li>
</ul>
<h2>Use take-home pay, not gross salary</h2>
<p>Base the split on what actually reaches your account after SSS, PhilHealth, Pag-IBIG and tax. A ₱30,000 monthly salary is about ₱26,500 take-home, so the budget starts from ₱26,500.</p>
<h2>What about supporting family?</h2>
<p>Many Filipinos send money to parents or siblings every month. Decide where it fits: if it pays for essentials like food, bills or tuition, treat it as a <b>need</b>. Write it down as its own line so it is planned, not a surprise each payday.</p>
<h2>Adjust the percentages to your life</h2>
<p>The 50/30/20 split is a starting point. In cities with high rent, needs may take 60% — then trim wants to 20%. Try to keep savings at 20%, or at least start with 10% and raise it with every salary increase.</p>
<h2>Make it automatic</h2>
<ol>
  <li>On payday, move your savings amount to a separate account first.</li>
  <li>Pay fixed needs right away.</li>
  <li>What's left is your spending money for wants — no guilt needed.</li>
</ol>
<p>Building your emergency fund? Read our <a href="emergency-fund-guide.html">emergency fund guide</a>.</p>
<p class="note">General information, not financial advice.</p>`,
  },
  {
    slug: 'pag-ibig-mp2-guide',
    title: 'Pag-IBIG MP2 Savings: How It Works and Who It Suits',
    description: 'A plain guide to the Pag-IBIG MP2 voluntary savings program: who can join, minimum savings, the 5-year term, dividends and payout options.',
    updated: '2026-10-29',
    tool: { path: 'compound-interest-calculator/', label: 'See how savings grow over 5 years' },
    body: `
<p><b>Short answer:</b> MP2 (Modified Pag-IBIG II) is a voluntary 5-year savings program run by the Pag-IBIG Fund. You can save from <b>₱500</b> per payment, dividends are <b>tax-free</b>, and the savings are <b>guaranteed by the national government</b>. It suits money you won't need for five years.</p>
<h2>Who can join</h2>
<p>Active Pag-IBIG members can open an MP2 account, including employees, self-employed members and OFWs. Some former members and pensioners can join too. You can open more than one MP2 account.</p>
<h2>How it works</h2>
<ul>
  <li><b>Term:</b> each MP2 account matures after <b>5 years</b>.</li>
  <li><b>Savings:</b> minimum of ₱500 per payment, with no fixed schedule — you can save monthly, occasionally or in one lump sum.</li>
  <li><b>Dividends:</b> declared each year based on the Fund's earnings. In recent years they have been around 6–7% a year, higher than most regular savings accounts. Past rates don't guarantee future ones.</li>
  <li><b>Payout options:</b> receive dividends <b>every year</b>, or let them <b>compound</b> and receive everything at maturity. Compounding gives a bigger total.</li>
</ul>
<h2>Can I withdraw early?</h2>
<p>Early withdrawal is allowed only for specific reasons set by Pag-IBIG (such as serious illness, disability, unemployment or leaving the country for good), and in some cases the dividends paid are reduced. Treat MP2 as money you can leave alone for the full five years — keep your emergency fund somewhere you can reach it quickly.</p>
<h2>How to open an account</h2>
<p>You can enrol online through Virtual Pag-IBIG or at a Pag-IBIG branch, then pay through accredited banks, payment centres or e-wallets. Keep your MP2 account number and receipts.</p>
<h2>Is MP2 right for you?</h2>
<ul>
  <li><b>Good for:</b> medium-term goals five years away, like a house down payment or a child's tuition, and savers who want low risk.</li>
  <li><b>Less suitable for:</b> money you may need soon, or savers comfortable with higher risk for potentially higher returns.</li>
</ul>
<p class="note">Rules and dividend rates are set by the Pag-IBIG Fund; check pagibigfund.gov.ph for the latest details before you save.</p>`,
  },
  {
    slug: 'ofw-remittance-tips',
    title: 'Sending Money Home: How OFWs Can Get More Pesos Per Remittance',
    description: 'How to compare remittance services, avoid hidden exchange rate costs and scams, and get more pesos to your family in the Philippines.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> compare the <b>total pesos your family receives</b>, not just the fee. The exchange rate a service gives you often costs more than its fee. Use services supervised by the Bangko Sentral ng Pilipinas (BSP) or regulated in the country you work in.</p>
<h2>The two costs of every remittance</h2>
<ol>
  <li><b>The fee</b> — a fixed amount or a percentage.</li>
  <li><b>The exchange rate margin</b> — the difference between the market rate and the rate the service gives you. This is often hidden.</li>
</ol>
<h2>A worked example</h2>
<p>You send US$500 when the market rate is about ₱64 per dollar:</p>
<ul>
  <li><b>Service A:</b> fee US$5, rate ₱63.20 → (500 − 5) × 63.20 = <b>₱31,284</b></li>
  <li><b>Service B:</b> fee US$10, rate ₱64.00 → (500 − 10) × 64.00 = <b>₱31,360</b></li>
</ul>
<p>Service B charges a higher fee but delivers more pesos. Always compare the final amount received. You can check the day's reference rates in our <a href="./#markets">Markets</a> section.</p>
<h2>Ways to get more pesos</h2>
<ul>
  <li><b>Send larger amounts less often</b> when fees are fixed per transfer.</li>
  <li><b>Send to a bank account or e-wallet</b> — it is usually cheaper than cash pickup.</li>
  <li><b>Compare two or three services</b> before each big transfer; rates change daily.</li>
  <li><b>Don't try to time the market.</b> Waiting for a "better rate" can backfire when your family needs the money now.</li>
</ul>
<h2>Stay safe</h2>
<ul>
  <li>Use banks, licensed remittance companies and e-money issuers. In the Philippines, they are supervised by the BSP.</li>
  <li>Never send money to someone you've only met online, or for a "job fee", "package release" or "prize".</li>
  <li>Double-check the recipient's account details; transfers to the wrong account are hard to reverse.</li>
  <li>Keep receipts and reference numbers until your family confirms they received the money.</li>
</ul>
<p>Planning what your family does with it? Our <a href="budget-50-30-20-philippines.html">50/30/20 budget guide</a> and <a href="emergency-fund-guide.html">emergency fund guide</a> can help.</p>
<p class="note">Examples are for illustration; fees and rates vary by service, country and day.</p>`,
  },
  {
    slug: 'peso-exchange-rates-explained',
    title: 'Peso Exchange Rates Explained: Why Your Bank Rate Differs',
    description: 'What the peso exchange rate means, why banks and money changers give different rates, and how to get a fair rate when you exchange or pay abroad.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> the rate you see in the news is a <b>reference rate</b>. Banks and money changers <b>buy</b> foreign currency from you at a lower rate and <b>sell</b> it to you at a higher one. The gap between them, the spread, is how they make money.</p>
<h2>Reading a rate</h2>
<p>"₱64 per US dollar" means one US dollar is worth 64 pesos. When the number goes up, the peso is <b>weaker</b> (you need more pesos per dollar); when it goes down, the peso is <b>stronger</b>.</p>
<ul>
  <li>A weaker peso helps OFW families and exporters, because each dollar sent home buys more pesos.</li>
  <li>A stronger peso helps importers and Filipinos travelling abroad, because foreign goods and trips cost fewer pesos.</li>
</ul>
<h2>Buying rate vs selling rate</h2>
<p>A money changer might post <b>buying ₱63.50 / selling ₱64.50</b> for the US dollar:</p>
<ul>
  <li>If you <b>sell</b> them US$100, you get ₱6,350 (their buying rate).</li>
  <li>If you <b>buy</b> US$100 from them, you pay ₱6,450 (their selling rate).</li>
</ul>
<p>The smaller the spread, the better the deal for you.</p>
<h2>Where to exchange</h2>
<ul>
  <li><b>Banks and licensed money changers</b> registered with the BSP. Compare a couple of nearby options.</li>
  <li>Avoid unlicensed street changers — short-changing and fake bills are common risks.</li>
  <li>Airport counters are convenient but often have wider spreads. Exchange only what you need there.</li>
</ul>
<h2>Paying with cards abroad</h2>
<p>When a foreign shop or ATM offers to charge you <b>in pesos</b> instead of the local currency, it usually uses a worse rate. Choosing to pay in the <b>local currency</b> generally works out cheaper. Check your card's foreign transaction fee too.</p>
<h2>Where our rates come from</h2>
<p>The peso rates in our <a href="./#markets">Markets</a> section are daily reference rates, useful for comparing offers. The rate you actually get from a bank or remittance service will be slightly different.</p>
<p class="note">General information; rates change throughout the day.</p>`,
  },
  {
    slug: 'psei-stock-investing-basics',
    title: "What Is the PSEi? A Beginner's Guide to the Philippine Stock Market",
    description: 'What the PSEi measures, how to start investing in Philippine stocks with a small amount, and the basic risks every beginner should know.',
    updated: '2026-10-29',
    tool: { path: 'compound-interest-calculator/', label: 'See how regular investing can grow' },
    body: `
<p><b>Short answer:</b> the <b>PSEi</b> (Philippine Stock Exchange index) tracks the share prices of <b>30 of the largest and most actively traded companies</b> on the Philippine Stock Exchange. When people say "the market went up today", they usually mean the PSEi rose. You can follow it in our <a href="./#markets">Markets</a> section.</p>
<h2>What the PSEi tells you</h2>
<p>The PSEi is a quick summary of how big Philippine companies are doing on the stock market — banks, property developers, conglomerates, telcos, utilities and food companies. Its companies are reviewed regularly, so the list changes over time.</p>
<h2>How to start investing</h2>
<ol>
  <li><b>Build your emergency fund first</b>, so you never have to sell stocks at a bad time to pay a bill.</li>
  <li><b>Open an account with a stockbroker</b> that is a trading participant of the PSE and registered with the SEC. Many online brokers let you start with a small amount.</li>
  <li><b>Learn about board lots</b> — the minimum number of shares per order, which depends on the share price.</li>
  <li><b>Understand the costs:</b> brokers charge commissions, and there are exchange fees and taxes when you buy and sell. Small, frequent trades lose more to fees.</li>
</ol>
<h2>Simple approaches for beginners</h2>
<ul>
  <li><b>Peso cost averaging:</b> invest a fixed amount on a regular schedule, whether prices are up or down.</li>
  <li><b>Diversify:</b> spread your money across several companies and industries, or use index funds that track the PSEi.</li>
  <li><b>Think long term:</b> share prices can fall sharply in the short run. Money you need within a few years usually belongs in safer places.</li>
</ul>
<h2>Dividends</h2>
<p>Some companies share profits with shareholders as dividends. For individual Philippine residents, cash dividends from Philippine companies are subject to a final tax, which is withheld before you receive them.</p>
<h2>Know the risks</h2>
<p>Stocks can lose value, and there is no guarantee of returns. Be wary of anyone promising fixed high returns or "sure win" stock tips — the SEC regularly warns against investment scams.</p>
<p class="note">General information, not investment advice. Check with a licensed professional before investing.</p>`,
  },
  {
    slug: 'typhoon-signals-preparedness',
    title: 'PAGASA Typhoon Signals Explained, Plus a Go-Bag Checklist',
    description: 'What PAGASA Tropical Cyclone Wind Signals 1 to 5 and rainfall warnings mean, what to do at each level, and what to pack in an emergency go-bag.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> PAGASA raises <b>Tropical Cyclone Wind Signals (TCWS) 1 to 5</b> for areas expecting strong winds from a storm. The higher the number, the stronger the expected winds and the less time before they arrive. Signal 1 means prepare; Signal 3 and above means stay indoors and be ready to evacuate if told to.</p>
<h2>Wind signals</h2>
<ul>
  <li><b>Signal 1:</b> strong winds of 39–61 km/h expected within 36 hours. Minimal to minor damage. Secure loose items and monitor updates.</li>
  <li><b>Signal 2:</b> gale-force winds of 62–88 km/h expected within 24 hours. Minor to moderate damage. Prepare your go-bag; stay away from the sea.</li>
  <li><b>Signal 3:</b> storm-force winds of 89–117 km/h expected within 18 hours. Moderate to significant damage. Stay indoors; follow evacuation orders.</li>
  <li><b>Signal 4:</b> typhoon-force winds of 118–184 km/h expected within 12 hours. Significant to severe damage.</li>
  <li><b>Signal 5:</b> winds of 185 km/h or more expected within 12 hours. Severe to catastrophic damage.</li>
</ul>
<p>Signals can be raised with less warning if a storm strengthens quickly, so keep checking official updates.</p>
<h2>Rainfall warnings</h2>
<p>Heavy rain is often more dangerous than wind. PAGASA's colour-coded rainfall warnings show expected rainfall intensity:</p>
<ul>
  <li><b>Yellow:</b> heavy rain; flooding possible in low-lying areas. Monitor the weather.</li>
  <li><b>Orange:</b> intense rain; flooding is threatening. Be alert and ready to move.</li>
  <li><b>Red:</b> torrential rain; serious flooding expected. Evacuate when told to.</li>
</ul>
<h2>What to pack in a go-bag</h2>
<ul>
  <li>Drinking water and ready-to-eat food for at least 3 days</li>
  <li>Flashlight, extra batteries and a fully charged power bank</li>
  <li>Battery-powered or wind-up radio</li>
  <li>First aid kit and a week's supply of maintenance medicines</li>
  <li>Copies of IDs and important documents in a waterproof pouch</li>
  <li>Some cash in small bills — ATMs and e-wallets may be down</li>
  <li>Change of clothes, raincoat, blanket and hygiene items</li>
  <li>Whistle, face masks, and supplies for babies, the elderly or pets</li>
</ul>
<h2>Before the storm</h2>
<ul>
  <li>Know your barangay's evacuation centre and the safest route there.</li>
  <li>Agree on a meeting place with your family in case you get separated.</li>
  <li>Charge phones, fill water containers and secure or bring in loose items outside.</li>
  <li>Follow announcements from PAGASA, NDRRMC and your local government. Call <b>911</b> in an emergency.</li>
</ul>
<p class="note">Signal definitions follow PAGASA's tropical cyclone wind signal system. Always follow official advisories and evacuation orders.</p>`,
  },
  {
    slug: 'gaming-scams-free-robux',
    title: '"Free Robux" and Other Gaming Scams: How to Spot and Avoid Them',
    description: 'The most common gaming scams targeting Filipino players — free Robux, free diamonds, fake top-ups and account trades — and how to stay safe.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> there is no such thing as free Robux, free diamonds or free in-game currency from a website, app or stranger. Every "generator" or giveaway that asks for your login, a verification step or a small payment is a scam. Get in-game currency only from the game itself or official stores and top-up partners.</p>
<h2>The most common scams</h2>
<ul>
  <li><b>"Free Robux / free diamonds" generators:</b> websites or videos promising free currency if you enter your username and password, complete "human verification" surveys or download an app. They steal your account or earn money from your clicks — you never get the currency.</li>
  <li><b>Fake top-up sellers:</b> cheap currency offered on social media or chat groups. You pay by e-wallet and receive nothing, or the currency came from a stolen card and the game removes it later and may ban your account.</li>
  <li><b>Account trading:</b> buying or selling accounts usually breaks the game's rules, and sellers can take the account back by recovering it with the original email.</li>
  <li><b>Fake moderators or admins:</b> messages saying your account will be banned unless you "verify" by logging in through a link.</li>
  <li><b>Trade scams:</b> in games with item trading, scammers switch items at the last second or ask you to "go first".</li>
</ul>
<h2>Warning signs</h2>
<ul>
  <li>Anyone asking for your <b>password</b> or a <b>verification code</b> sent to your phone or email.</li>
  <li>Prices that are far below the official price.</li>
  <li>Pressure to act quickly: "only 10 slots left", "your account will be deleted today".</li>
  <li>Links that look almost like the official site but with extra letters or a different ending.</li>
</ul>
<h2>How to stay safe</h2>
<ol>
  <li>Buy currency only inside the game, from official app stores, or from the game's official top-up partners.</li>
  <li>Never share your password or one-time codes — no real staff member will ask for them.</li>
  <li>Turn on two-step verification. See our guide to <a href="protect-gaming-accounts.html">protecting your gaming accounts</a>.</li>
  <li>Report scam messages and accounts using the game's report button.</li>
</ol>
<h2>For parents</h2>
<p>Young players are the main target of "free Robux" scams. Talk with your kids about why free currency offers are fake, set spending limits and parental controls in the game and on app stores, and ask them to tell you before entering their password anywhere new.</p>
<h2>If you've been scammed</h2>
<p>Change your password straight away, turn on two-step verification, and contact the game's official support. If you lost money through an e-wallet or bank, report it to the provider immediately. You can also report online scams to the PNP Anti-Cybercrime Group or the Cybercrime Investigation and Coordinating Center (CICC).</p>
<p class="note">This guide is general safety information. Roblox, Robux and other game names are trademarks of their owners; this site is not affiliated with them.</p>`,
  },
  {
    slug: 'protect-gaming-accounts',
    title: 'How to Protect Your Gaming Accounts from Hackers',
    description: 'Simple steps to keep your Roblox, Mobile Legends, Valorant, Steam and other gaming accounts safe: passwords, two-step verification and safe logins.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> use a different strong password for every game, turn on two-step verification, keep your email account secure, and always log out on shared computers like those in internet cafés and pisonet shops.</p>
<h2>1. Use a unique password for each account</h2>
<p>If one site leaks your password, attackers try it on every popular game and email service. A long passphrase — four or five random words — is easy to remember and hard to guess. A password manager can remember the rest.</p>
<h2>2. Turn on two-step verification</h2>
<p>Most big games and platforms offer two-step verification (also called 2FA): after your password, you confirm with a code from an app, email or text. Even if someone steals your password, they can't log in without the code. Turn it on in your account's security settings.</p>
<h2>3. Protect your email first</h2>
<p>Your email is the key to every account — whoever controls it can reset your game passwords. Give it the strongest password you have and turn on two-step verification there too.</p>
<h2>4. Be careful on shared computers</h2>
<ul>
  <li>Never tick "remember me" or let the browser save your password on a shared PC.</li>
  <li><b>Log out</b> of games, launchers, email and social media before you leave.</li>
  <li>If you think you forgot to log out somewhere, change your password from your own phone; many games also let you sign out of all devices.</li>
</ul>
<h2>5. Watch out for fake login pages</h2>
<p>Scammers send links to pages that look exactly like a game's login. Type the official address yourself or open the official app instead of clicking links in messages, comments or chats.</p>
<h2>6. Keep your recovery details up to date</h2>
<p>Add a recovery email and phone number you still use. If your account is ever taken, these are often the fastest way to get it back.</p>
<h2>If your account is hacked</h2>
<ol>
  <li>Try to reset the password straight away using your email or phone.</li>
  <li>Secure your email account if it may also be affected.</li>
  <li>Contact the game's official support with proof of ownership, such as purchase receipts.</li>
  <li>Warn your friends — hacked accounts are often used to scam them next.</li>
</ol>
<p>Learn the most common traps in our guide to <a href="gaming-scams-free-robux.html">"free Robux" and other gaming scams</a>.</p>
<p class="note">General safety information. Game names are trademarks of their owners; this site is not affiliated with them.</p>`,
  },
  {
    slug: 'roblox-safety-for-parents',
    title: 'Roblox Safety for Parents: Settings, Spending and Talking to Your Kids',
    description: 'A practical Roblox safety guide for Filipino parents: account settings, chat and spending controls, and the conversations that keep kids safe.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> create the account with your child, enter their real birthdate so age-based protections apply, turn on parental controls (chat, spending limits and a parent PIN), and agree on simple house rules. Check the official <a href="https://about.roblox.com/parental-controls" target="_blank" rel="noopener">Roblox parental controls page</a> for the current options.</p>
<h2>Why it matters</h2>
<p>Roblox is a platform where millions of players make and share their own games. Most experiences are fun and creative, but players can chat with strangers and spend real money, so a few minutes of setup makes a big difference.</p>
<h2>Set up the account together</h2>
<ul>
  <li><b>Use the real birthdate.</b> Roblox applies stricter default settings to younger players. A fake older age switches those protections off.</li>
  <li><b>Add a parent email</b> and link a parent account where offered, so you receive notices and can manage settings.</li>
  <li><b>Use a strong, unique password</b> and turn on two-step verification. See our guide to <a href="protect-gaming-accounts.html">protecting gaming accounts</a>.</li>
</ul>
<h2>Parental controls to check</h2>
<ul>
  <li><b>Chat:</b> limit who can message your child, or turn chat off for younger kids.</li>
  <li><b>Experience maturity:</b> limit games to the content level that suits your child's age.</li>
  <li><b>Spending:</b> set a monthly spending limit and notifications, and never save a card your child can use freely.</li>
  <li><b>Parent PIN:</b> lock the settings so they can't be changed without you.</li>
</ul>
<h2>House rules that work</h2>
<ol>
  <li>Never share your real name, school, address or photos with people met in games.</li>
  <li>Never move a chat to another app because someone in a game asked you to.</li>
  <li>Robux are bought only with a parent — there is no "free Robux". Read our <a href="gaming-scams-free-robux.html">gaming scams guide</a> together.</li>
  <li>If anything makes you uncomfortable, stop, take a screenshot and tell a grown-up. You won't be in trouble.</li>
</ol>
<h2>At internet cafés and pisonet shops</h2>
<p>Remind kids to log out completely when their time ends and never tick "remember me" on a shared computer.</p>
<h2>Reporting problems</h2>
<p>Use the in-game <b>Report</b> button for inappropriate chat or behaviour, and block the user. For threats or exploitation, contact the authorities — in the Philippines, the PNP Women and Children Protection Center or the PNP Anti-Cybercrime Group.</p>
<p class="note">General safety information. Roblox's settings and names change over time; check Roblox's official parental controls page for the current options. Roblox is a trademark of Roblox Corporation; this site is not affiliated with it.</p>`,
  },
  {
    slug: 'valorant-beginners-guide',
    title: 'Valorant for Beginners: Agents, Economy and Tips to Win More Rounds',
    description: 'A beginner-friendly Valorant guide: how a match works, the four agent roles, the buy economy and simple habits that win more rounds.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> Valorant is a 5-versus-5 tactical shooter. One team attacks and tries to plant the Spike; the other defends. Win rounds by playing with your team, keeping your crosshair at head height, and buying smartly between rounds. Check the official <a href="https://playvalorant.com/en-us/news/tags/patch-notes/" target="_blank" rel="noopener">patch notes</a> after each update.</p>
<h2>How a match works</h2>
<ul>
  <li>Teams swap between attacking and defending halfway through the match.</li>
  <li>Attackers win a round by planting the Spike and letting it detonate, or by eliminating the defenders.</li>
  <li>Defenders win by defusing the Spike, eliminating the attackers, or running out the clock.</li>
</ul>
<h2>The four agent roles</h2>
<ul>
  <li><b>Duelists</b> lead the way into sites and take fights.</li>
  <li><b>Initiators</b> gather information and break defensive positions so the team can enter.</li>
  <li><b>Controllers</b> block vision with smokes and walls to shape the fight.</li>
  <li><b>Sentinels</b> hold areas, watch flanks and slow down enemy pushes.</li>
</ul>
<p>Learn one or two agents well instead of switching every game.</p>
<h2>The economy in one minute</h2>
<p>You earn credits each round — more for winning, kills and planting. When money is low, the whole team "saves" (buys little) so everyone can afford full weapons and shields together next round. Buying alone while your team saves usually loses both rounds.</p>
<h2>Five habits that win more rounds</h2>
<ol>
  <li><b>Crosshair placement:</b> keep your aim at head height where enemies will appear.</li>
  <li><b>Stop before you shoot:</b> moving makes most guns inaccurate.</li>
  <li><b>Call out what you see:</b> enemy count and location, short and clear.</li>
  <li><b>Trade your teammates:</b> stay close enough to punish the enemy who takes a fight.</li>
  <li><b>Warm up</b> in the Range for a few minutes before playing ranked.</li>
</ol>
<h2>Play nice, play safe</h2>
<p>Mute toxic players instead of arguing, never share your account, and buy Valorant Points only through the game or official partners. See our <a href="gaming-scams-free-robux.html">gaming scams guide</a>.</p>
<p class="note">General gameplay tips. Agents, weapons and prices change with patches. Valorant is a trademark of Riot Games; this site is not affiliated with it.</p>`,
  },
  {
    slug: 'dota-2-beginners-guide',
    title: 'Dota 2 for Beginners: Roles, Last Hits and How to Improve',
    description: 'A plain Dota 2 guide for new players: what you are trying to do, the five positions, last hits and denies, and how to keep improving.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> Dota 2 is a 5-versus-5 strategy game where each team defends its Ancient. Pick a simple hero, learn your role, practise last hits for gold, and stick with your team. Patch changes are listed on the official <a href="https://www.dota2.com/patches" target="_blank" rel="noopener">Dota 2 patches page</a>.</p>
<h2>The goal</h2>
<p>Each team starts at opposite corners of the map. Three lanes connect the bases, guarded by towers. Push down the lanes, destroy the enemy buildings and finally their Ancient to win.</p>
<h2>The five positions</h2>
<ul>
  <li><b>Position 1 (carry):</b> farms gold early and becomes the strongest hero late in the game.</li>
  <li><b>Position 2 (mid):</b> plays the middle lane alone and makes plays around the map.</li>
  <li><b>Position 3 (offlane):</b> a tough hero who disrupts the enemy carry and starts fights.</li>
  <li><b>Positions 4 and 5 (supports):</b> protect the cores, place wards for vision and set up kills.</li>
</ul>
<h2>Gold basics: last hits and denies</h2>
<p>You earn most gold by landing the <b>final hit</b> on enemy creeps. You can also <b>deny</b> your own creeps when they're low on health, so the enemy doesn't get that gold. Practising last hits in a bot or demo game is one of the fastest ways to improve.</p>
<h2>Tips for your first games</h2>
<ol>
  <li>Start with heroes that are easy to play and forgiving; the hero guides in the game client suggest builds.</li>
  <li>Buy a <b>Town Portal Scroll</b> so you can return to defend or join fights.</li>
  <li>Watch the minimap often — most deaths come from enemies you didn't see coming.</li>
  <li>Group up with your team in the middle and late game instead of farming alone.</li>
  <li>Watch your own replays to spot mistakes.</li>
</ol>
<h2>Keep it friendly</h2>
<p>Dota games can get heated. Mute players who flame, focus on your own play, and take a break after a few losses. See our <a href="healthy-gaming-habits-kids.html">healthy gaming habits guide</a>.</p>
<p class="note">General gameplay tips; heroes and items change with patches. Dota 2 is a trademark of Valve Corporation; this site is not affiliated with it.</p>`,
  },
  {
    slug: 'healthy-gaming-habits-kids',
    title: 'Healthy Gaming Habits for Kids and Teens',
    description: 'Practical tips for healthy gaming: breaks, sleep, posture, eyes, spending and balancing games with school — for players and parents.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> gaming can be fun and social when it fits around sleep, school, meals and time outdoors. Take a short break every hour, stop gaming at least an hour before bed, sit with good posture, and agree on clear limits for time and spending.</p>
<h2>Take regular breaks</h2>
<ul>
  <li>Stand up, stretch and move for a few minutes every hour.</li>
  <li>Rest your eyes with the <b>20-20-20 rule</b>: every 20 minutes, look at something about 20 feet (6 metres) away for 20 seconds.</li>
  <li>Drink water and eat real meals — not just snacks at the computer.</li>
</ul>
<h2>Protect your sleep</h2>
<p>Late-night gaming is one of the main reasons kids feel tired in school. Stop playing at least an hour before bedtime; bright screens and exciting games make it harder to fall asleep.</p>
<h2>Set up a comfortable seat</h2>
<ul>
  <li>Sit back in the chair with your feet flat on the floor.</li>
  <li>Keep the top of the screen at about eye level and an arm's length away.</li>
  <li>Relax your shoulders and keep your wrists straight.</li>
</ul>
<h2>Balance games with everything else</h2>
<p>A simple rule: homework, chores and family time first, then games. Many families agree on a daily or weekly limit and stick to it — on school nights especially.</p>
<h2>Spending and safety</h2>
<ul>
  <li>Decide on a gaming budget in advance and never buy in-game items without a parent's OK.</li>
  <li>Never share personal details with people met online. Read our guides to <a href="gaming-scams-free-robux.html">gaming scams</a> and <a href="roblox-safety-for-parents.html">Roblox safety</a>.</li>
</ul>
<h2>Signs it may be too much</h2>
<p>Skipping meals or sleep, falling grades, losing interest in other activities, or getting very angry when asked to stop can mean gaming is taking over. Talk about it calmly, adjust the limits, and seek help from a school counsellor or doctor if it continues.</p>
<p class="note">General wellbeing information, not medical advice.</p>`,
  },
  {
    slug: 'gcash-ewallet-text-scams',
    title: 'E-Wallet and Text Scams in the Philippines: How to Protect Your Money',
    description: 'How to spot and avoid common e-wallet, bank and text message scams in the Philippines — phishing links, fake promos, wrong-send tricks and OTP theft.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> never share your <b>OTP, MPIN or password</b> with anyone, never log in through links sent by text, email or chat, and confirm any "you won" or "your account is locked" message through the official app. Real banks and e-wallets will never ask for your OTP.</p>
<h2>The most common scams</h2>
<ul>
  <li><b>Phishing texts and links:</b> messages saying your account is locked, a package is on hold or you won a promo, with a link to a fake login page that steals your details.</li>
  <li><b>OTP requests:</b> a caller pretending to be from your bank or e-wallet asks you to "confirm" a code. That code authorises a transfer out of your account.</li>
  <li><b>"Wrong send" scams:</b> someone sends you money "by mistake" and pressures you to return it to a different number — often the money came from a stolen account, or the original transfer gets reversed.</li>
  <li><b>Fake sellers:</b> online sellers who take payment and disappear, especially with prices that are too good to be true.</li>
  <li><b>Job and investment offers:</b> easy-money tasks, "double your money" schemes or crypto offers that ask you to pay first.</li>
</ul>
<h2>How to protect yourself</h2>
<ol>
  <li>Open your bank or e-wallet <b>only through the official app</b> or by typing the address yourself.</li>
  <li>Never share your OTP, MPIN or password — not even with someone claiming to be staff.</li>
  <li>Turn on app lock, biometrics and transaction notifications.</li>
  <li>For "wrong sends", don't send money to a new number — ask the sender to contact the e-wallet's official support to reverse it.</li>
  <li>Check investment offers against the SEC's advisories before paying anything.</li>
</ol>
<h2>If you've been scammed</h2>
<ol>
  <li>Contact your bank or e-wallet <b>immediately</b> through the official app or hotline and ask them to block or flag the transaction.</li>
  <li>Change your passwords and MPIN.</li>
  <li>Report it to the Cybercrime Investigation and Coordinating Center (CICC) — its Inter-Agency Response Center hotline is <b>1326</b> — or to the PNP Anti-Cybercrime Group.</li>
  <li>Keep screenshots of messages, numbers and receipts as evidence.</li>
</ol>
<p>Scammers now use AI too — see our guide to <a href="ai-deepfake-voice-scams.html">deepfake and voice-clone scams</a>.</p>
<p class="note">General safety information. Contact your bank or e-wallet's official channels for help with your account.</p>`,
  },
  {
    slug: 'ai-deepfake-voice-scams',
    title: 'AI Scams: How to Spot Deepfake Videos and Voice-Clone Calls',
    description: 'Scammers use AI to fake videos of celebrities and clone the voices of family members. Learn the warning signs and a simple family safety plan.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> AI can now fake a person's face and voice convincingly. Be suspicious of any urgent request for money — even from a familiar voice or a famous face — and verify it through another channel before acting. A family "safe word" stops most voice-clone scams.</p>
<h2>Deepfake videos</h2>
<p>Scammers use AI-made videos of celebrities, officials or news anchors to promote fake investments, miracle products or giveaways. Warning signs:</p>
<ul>
  <li>A famous person suddenly promoting a "guaranteed" investment or crypto scheme.</li>
  <li>Lips slightly out of sync, odd blinking, blurry edges around the face, or a voice that sounds flat.</li>
  <li>The video appears only in ads or unknown pages, not on the person's official accounts.</li>
</ul>
<h2>Voice-clone calls</h2>
<p>A few seconds of someone's voice from social media is enough to clone it. Scammers call pretending to be a child, parent or boss in trouble — an accident, an arrest, a hospital bill — and ask for money right away.</p>
<ul>
  <li><b>Hang up and call back</b> on the number you already have for that person.</li>
  <li>Ask a question only the real person would know.</li>
  <li>Be wary of pressure, secrecy ("don't tell anyone") and unusual payment methods.</li>
</ul>
<h2>Make a family safe word</h2>
<p>Agree on a word or phrase that your family will use in a real emergency. If a caller can't say it, it isn't them. Keep it private and never post it online.</p>
<h2>Protect your own voice and face</h2>
<ul>
  <li>Keep social media accounts private where you can, and limit public videos of children.</li>
  <li>Be careful with "fun" apps that ask for many photos or voice recordings.</li>
</ul>
<h2>Report it</h2>
<p>Report scam videos and accounts on the platform where you saw them. If you lost money, contact your bank or e-wallet immediately and report to the CICC hotline <b>1326</b> or the PNP Anti-Cybercrime Group. More tips are in our <a href="gcash-ewallet-text-scams.html">e-wallet and text scams guide</a>.</p>
<p class="note">General safety information.</p>`,
  },
  {
    slug: 'ai-chatbots-for-school-and-work',
    title: 'How to Use AI Chatbots for School and Work (Without Getting Into Trouble)',
    description: 'A practical guide to AI assistants like ChatGPT, Gemini, Claude and Copilot: what they are good at, their limits, privacy, and using them honestly for school.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> AI chatbots such as ChatGPT, Gemini, Claude and Microsoft Copilot are great for explaining topics, brainstorming, drafting and checking your writing. They can also be confidently wrong, so check important facts, keep private information out, and follow your school's or employer's rules on AI use.</p>
<h2>What AI chatbots are good at</h2>
<ul>
  <li><b>Explaining:</b> "Explain photosynthesis like I'm in Grade 6" or "What does this Excel formula do?"</li>
  <li><b>Brainstorming:</b> ideas for a project, a business name or a birthday plan.</li>
  <li><b>First drafts:</b> emails, letters, outlines and résumés that you then edit in your own words.</li>
  <li><b>Practice:</b> quiz questions for an exam, or a mock job interview.</li>
  <li><b>Fixing writing:</b> grammar, clarity and translating between English and Filipino.</li>
</ul>
<h2>Know the limits</h2>
<ul>
  <li><b>They make mistakes.</b> Chatbots can invent facts, numbers, quotes and sources. Double-check anything important against a reliable source.</li>
  <li><b>They may be out of date.</b> Ask for sources, and check the date for news, laws and prices.</li>
  <li><b>They don't replace professionals</b> for medical, legal or financial decisions.</li>
</ul>
<h2>Keep your information private</h2>
<p>Don't paste passwords, ID numbers, bank details, private photos or confidential work documents into a chatbot. At work, use only the AI tools your company allows.</p>
<h2>Using AI honestly at school</h2>
<ul>
  <li>Check your teacher's rules — some allow AI for research, others don't allow it at all.</li>
  <li>Use AI to <b>understand</b> and <b>practise</b>, not to submit work as your own.</li>
  <li>If you used AI, say how — many schools ask students to disclose it.</li>
</ul>
<h2>Free or paid?</h2>
<p>Most popular chatbots have free versions that are enough for everyday use; paid plans add more usage and features. Try a free version first.</p>
<p>Want better answers? Read our guide to <a href="ai-prompt-writing-tips.html">writing better AI prompts</a>.</p>
<p class="note">General information. Product names are trademarks of their owners; this site is not affiliated with them.</p>`,
  },
  {
    slug: 'ai-prompt-writing-tips',
    title: 'How to Write Better AI Prompts: 7 Simple Tips',
    description: 'Get better answers from ChatGPT, Gemini, Claude and other AI tools with seven easy prompt-writing tips and before-and-after examples.',
    updated: '2026-10-29',
    body: `
<p><b>Short answer:</b> tell the AI who the answer is for, what you need, the format you want, and any important details. Then refine with follow-up questions. A clear request gets a clear answer.</p>
<h2>1. Give context</h2>
<p><b>Instead of:</b> "Write a letter."<br><b>Try:</b> "Write a short, polite letter to my landlord in Quezon City asking to fix a leaking roof before the rainy season."</p>
<h2>2. Say who it's for</h2>
<p>"Explain inflation for a Grade 8 student" gets a very different answer from "Explain inflation for an economics graduate".</p>
<h2>3. Ask for a format</h2>
<p>Bullet points, a table, a step-by-step list, or "under 100 words". For example: "Give me a table comparing three budget phones under ₱10,000 by battery, camera and storage."</p>
<h2>4. Share examples</h2>
<p>Paste a sample of the style you like — "write it in a tone like this paragraph" — and the AI will match it.</p>
<h2>5. Break big tasks into steps</h2>
<p>Ask for an outline first, then each section. You'll get better results and can correct the direction early.</p>
<h2>6. Ask it to check itself</h2>
<p>Follow-ups like "What could be wrong with this answer?" or "Which facts here should I double-check?" help catch mistakes.</p>
<h2>7. Iterate</h2>
<p>Your first prompt is a starting point. Say what to change: "shorter", "more formal", "add an example", "in Filipino".</p>
<h2>A full example</h2>
<p>"I'm a pisonet owner in Pampanga. Write a friendly 3-sentence sign in Taglish reminding customers to log out of their accounts before leaving. Keep it simple for kids to understand."</p>
<p>Remember to keep private information out of prompts, and double-check important facts. More in our guide to <a href="ai-chatbots-for-school-and-work.html">using AI chatbots for school and work</a>.</p>
<p class="note">General information. Product names are trademarks of their owners; this site is not affiliated with them.</p>`,
  },
];

const GUIDES_ORDER = [
  'christmas-budget-guide', '13th-month-pay-guide', 'gaming-scams-free-robux', 'gcash-ewallet-text-scams',
  'ai-chatbots-for-school-and-work', 'holiday-pay-rules', 'roblox-safety-for-parents', 'payroll-deductions-guide',
  'ai-deepfake-voice-scams', 'valorant-beginners-guide', 'overtime-night-differential', 'dota-2-beginners-guide',
  'budget-50-30-20-philippines', 'protect-gaming-accounts', 'ai-prompt-writing-tips', 'healthy-gaming-habits-kids',
  'emergency-fund-guide', 'pag-ibig-mp2-guide', 'add-on-vs-diminishing-interest', 'ofw-remittance-tips',
  'peso-exchange-rates-explained', 'psei-stock-investing-basics', 'typhoon-signals-preparedness', 'how-to-spot-fake-news',
];

// Topic groups for the guides page, in display order.
export const GUIDE_TOPICS = [
  ['Money & work', ['christmas-budget-guide', '13th-month-pay-guide', 'holiday-pay-rules', 'payroll-deductions-guide',
    'overtime-night-differential', 'budget-50-30-20-philippines', 'emergency-fund-guide', 'pag-ibig-mp2-guide',
    'add-on-vs-diminishing-interest', 'ofw-remittance-tips', 'peso-exchange-rates-explained', 'psei-stock-investing-basics']],
  ['Gaming', ['gaming-scams-free-robux', 'protect-gaming-accounts', 'roblox-safety-for-parents', 'valorant-beginners-guide',
    'dota-2-beginners-guide', 'healthy-gaming-habits-kids']],
  ['Scams & online safety', ['gcash-ewallet-text-scams', 'ai-deepfake-voice-scams', 'how-to-spot-fake-news']],
  ['Tech & AI', ['ai-chatbots-for-school-and-work', 'ai-prompt-writing-tips']],
  ['Weather & safety', ['typhoon-signals-preparedness']],
];

const rank = (g) => (GUIDES_ORDER.includes(g.slug) ? GUIDES_ORDER.indexOf(g.slug) : GUIDES_ORDER.length);
export const GUIDES = [...ALL_GUIDES].sort((a, b) => rank(a) - rank(b));
