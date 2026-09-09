# Taking payments — donations and membership dues

The Donate and Membership pages hand visitors over to **Stripe** to pay.
Nobody types a card number on our website, and no card number is ever sent to
us by email.

This document explains how that works, and how to create the Stripe pages the
buttons lead to. It is written for somebody who has never used Stripe. Nothing
here needs any technical knowledge, and nothing here involves editing the
website's code.

---

## How it works

A **payment link** is a page that Stripe hosts and looks after. It has a web
address like `https://buy.stripe.com/aEU5kEd2n7vF3E4288`, and it is where
somebody actually pays. We make one for each thing a person can pay for, and
our buttons point at them.

That is the whole of the arrangement, and it is deliberately the simplest one
available:

- **Nothing secret lives on our website.** These addresses are meant to be
  public. There is no password, key or account detail anywhere in our files,
  so there is nothing to leak and nothing to keep up to date.
- **Card details never touch us.** They are typed on Stripe's page, on
  Stripe's computers. Everything about handling card numbers safely is
  Stripe's responsibility, not the Association's.
- **There is no code to maintain.** A future volunteer who has never seen this
  website can change what we charge, or which questions we ask, from Stripe's
  own website, without touching ours.
- **Receipts are automatic.** Stripe emails one the moment a payment goes
  through, so nobody has to send them by hand.

The trade-off is that Stripe's page can ask at most **three questions of our
own** on top of name, email and address. That is why the membership questions
below are the three that matter and no more.

---

## What has to be created

Five links altogether. **They can be made one at a time** — the website hides
any button whose link has not been filled in yet, and puts the "please send a
check" wording in its place, so nothing on the site is ever broken or
half-finished while you work through them.

| # | What it is for | Amount |
| --- | --- | --- |
| 1 | Donation | Whatever the donor chooses |
| 2 | Monthly donation *(optional)* | Whatever the donor chooses, every month |
| 3 | Household membership, one year | $30 once |
| 4 | Household membership, renewing automatically | $30 a year |
| 5 | Lifetime membership | $300 once |

---

## Before you start

Sign in at **dashboard.stripe.com** with the Association's Stripe account.

Two things are worth setting once, because every payment page inherits them:

1. **Settings → Business → Branding.** Upload the MVHA logo and set the button
   colour to the site's green, `#2f5d50`. Stripe's page will then look like it
   belongs to us.
2. **Settings → Business → Public details.** Fill in the Association's name,
   `info@mountainviewhistorical.org` and the website address. This is what
   appears on receipts and on a donor's bank statement, so it should say
   Mountain View Historical Association rather than anything abbreviated.

Make sure the toggle at the top of the dashboard is **not** on *Test mode*
when you create the real links. A test link looks identical but takes no
money — its address contains `test_`, which is the giveaway.

---

## 1. The donation link

**Payments → Payment links → Create payment link** (or **+ New**).

1. Choose **Donation** as the type, if Stripe offers it. If it does not, choose
   **Product**, then under pricing choose **Customers choose what to pay**.
2. Name the product **Donation to the Mountain View Historical Association**.
   Whatever you type here is what the donor sees and what the receipt says.
3. Set a **suggested amount** of $100 and a **minimum** of $5.
4. Under **Options**:
   - Tick **Collect customer addresses** → *Billing addresses only*. We need
     this for our records and for tax receipts.
   - Tick **Collect customer names**.
   - **Add a custom field** — one only:
     - Type: **Dropdown**
     - Label: **What is your gift for?**
     - Options: *Where it is needed most*, *The archive and History Center*,
       *Historical markers and plaques*, *Castro Street MVHS monument*,
       *Publications and newsletter*
5. Create the link and **copy its address**.

### 2. The monthly donation link (optional)

Exactly the same, with two differences: the price is **recurring, monthly**,
and the product is named **Monthly gift to the Mountain View Historical
Association**. Skip this one if the board would rather not offer it — the
website simply leaves that button out.

---

## 3–5. The membership links

Each membership is its own link. They differ only in the price, so the fastest
way is to make the first one properly and then duplicate it.

**Household, one year**

1. **Create payment link → Product**, named **MVHA household membership, one
   year**.
2. Price: **$30**, **one-off**.
3. Under **Options**:
   - Tick **Collect customer addresses** → *Billing addresses only*.
   - Tick **Collect customer names**.
   - Add these three custom fields, in this order:

     | Type | Label | Options |
     | --- | --- | --- |
     | Dropdown | Is this a new membership or a renewal? | New membership, Renewal |
     | Dropdown | Which newsletter would you like? | Digital edition, by email · Print edition, by post · Both · None, thank you |
     | Text *(optional)* | Anyone else in your household this covers | — |

   Three is Stripe's limit, which is why the question about volunteering is
   not among them. The Membership page points people at the volunteer page
   instead.

**Household, renewing automatically** — duplicate the one above (the **⋯**
menu on the link, then **Duplicate**), rename it **MVHA household membership,
renewing yearly**, and change the price to **$30, recurring, yearly**.

**Lifetime** — duplicate it again, rename it **MVHA lifetime membership**, set
the price to **$300, one-off**, and remove the "new membership or renewal"
question. Nobody renews a lifetime membership.

---

## Putting the addresses on the website

Sign in to the editing panel at **/admin**, open **Payment links**, and paste
each address into the matching box:

| Box | Which link |
| --- | --- |
| Donations → Donation page | 1 |
| Donations → Monthly giving page | 2 |
| Membership → Household, one year | 3 |
| Membership → Household, renewing automatically | 4 |
| Membership → Lifetime | 5 |

Press **Publish**. The website updates itself a minute or two later.

The **suggested amounts** in the same section are the buttons that appear on
the Donate page — $50, $100, $250 and $500 to begin with. Change them to
whatever the board prefers; each one opens the same Stripe page with that
amount already filled in, and the donor can still change it there.

### Try it before you tell anybody

Open the Donate page, press an amount, and check that Stripe's page appears,
shows the right amount, and has the Association's name on it. Do the same for
each membership button. It is worth making one real $5 donation to yourself
and refunding it from the dashboard — that proves the money arrives in the
right bank account, which is the one thing none of the above can prove on its
own.

---

## Living with it afterwards

**Where the money goes.** Stripe holds payments and pays them into the
Association's bank account automatically, usually a couple of days later.
**Balance → Payouts** shows what is on its way.

**What it costs.** Stripe charges a percentage plus a few cents per payment.
Non-profits can ask Stripe for a discounted rate — worth doing, and it is a
form on their website, not a negotiation.

**Seeing who paid and what they said.** **Payments** lists every payment;
clicking one shows the name, address and the answers to our questions. The
**Export** button gives a spreadsheet, which is the easiest way to hand the
Membership Committee a list.

**Automatic renewals.** These appear under **Billing → Subscriptions**, not
under Payments. To stop somebody's renewal, find them there and cancel it. If
a member emails asking to stop, that is where to go.

**Refunds.** Open the payment and press **Refund**. No code, no phone call.

**Changing the price.** Dues change every few years. Create a new payment link
at the new price and paste its address into `/admin` over the old one. Leave
the old link alone rather than deleting it — deleting it would break the
history of who paid what.

---

## If something looks wrong

**A button has disappeared from the website.** Its box in `/admin` is empty,
or the address in it does not begin with `https://`. That is the website being
careful rather than showing a button that goes nowhere.

**The page says "Online giving is being set up".** Same cause: no link has
been filled in yet for that page.

**Stripe says the link is inactive.** Someone deactivated it, or it had a
limit on the number of payments. Reactivate it from the **⋯** menu, or make a
new one and paste in the new address.

**A payment arrived with no membership details.** The custom fields were left
off that link. Add them in Stripe — existing links can be edited — and the
answers will be there next time.

---

## For whoever maintains the website

The addresses live in `data/payments.json`. Buttons carry a `data-pay`
attribute naming which link they want, and `initPayments` in
`assets/js/site.js` fills in the addresses, removes any button whose link is
missing, and shows the pay-by-check wording in its place. An amount button is
the donation link with `?prefilled_amount=` and the amount in cents, which is
Stripe's own way of pre-filling the box.

`node tools/render-test.js` covers both states — links set up and not yet set
up — so a mistake here shows up as a failing test rather than as a dead button
on the live site.
