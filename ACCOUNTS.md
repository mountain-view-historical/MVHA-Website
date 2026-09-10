# Getting access to the Association's accounts

The website depends on several accounts that other people own — GoDaddy for
the domain registration, HostGator for the old site's hosting and its
nameservers, Stripe for payments. This explains how to be added to each one
properly, what each level of access can and cannot do, and what to ask for.

**Cloudflare and GitHub are different.** They hold the test site only. Nothing
the Association relies on runs on them and nobody has approved that site, so
anything here about them applies only if it goes ahead.

`MVHA-account-access-memo.docx` in this folder is the same material written up
for someone who does not maintain the website. It is deliberately kept out of
the repository, because the repository is public.

## The domain, in one place

| | |
| --- | --- |
| Registered at | **GoDaddy** — this is the account that owns the name |
| Nameservers | **HostGator** — ns6455 and ns6456.hostgator.com |
| Registered since | November 13, 2007 |
| **Expires** | **November 13, 2026** |

Moving the site to Cloudflare would mean changing the nameservers **at
GoDaddy**, not at HostGator. Checked September 9, 2026 against the public
registry record.

The short version: **ask to be added as a user in your own name. Never ask for
somebody's password.**

---

## Why not just share the password

It is the obvious thing to suggest, and it goes wrong in four ways.

**Two-step authentication.** Both accounts can send a code to the owner's
phone when somebody signs in. Sharing a password means texting them for a code
every time — more interruption than the thing you were trying to save them.

**Nobody can tell who did what.** Stripe records team activity per person and
keeps it for 180 days. Under a shared login everything reads as the owner. For
an organisation where the account can move money, the board wants that record
to say who actually did it — as much to protect the owner as anyone.

**You lose access without warning.** Passwords get changed. Owners step back
from roles. If the Association's payment processing depends on knowing
somebody's password, it depends on that person never changing it.

**It puts the owner in an awkward position.** They are being asked to hand
over everything at once, because a password has no settings. Adding a user
lets them give you exactly as much as the job needs, and take it back in one
click.

---

## Stripe

### The honest position on "administrator without financial control"

There isn't one, quite. It is worth understanding why before you ask.

Stripe's **Administrator** role is the one that can definitely do everything
the website needs. It **can also**:

- add and edit bank account details
- change the payout schedule
- pay the balance out to an external bank account

It cannot delete the account's existing default bank account, and it cannot
change who owns the account. But "an Administrator has no financial control"
would not be true, and it is not worth telling the owner that — if they later
discover otherwise, you have spent trust you will need.

*(An earlier version of this advice said an Administrator could not touch the
bank account. That was wrong. Stripe's own role documentation lists "Add and
edit bank account details" under what an Administrator can do.)*

### What to ask for instead

**Support Specialist** is the closest role to what you actually need. It can:

- create, edit and delete products — which is what a payment link is built on
- view and refund payments
- export payments and customers to a spreadsheet
- see the answers to the membership questions

And it **cannot**:

- pay any money out to a bank account
- add or edit bank account details
- change the payout schedule
- create API keys
- invite other people
- change the account's own details

That is a real separation: someone in this role can set up and run the giving,
and cannot get money out of the account.

**Two things it can't do that you will want.** It cannot set the branding (the
logo and colour on the payment page) or edit the public business details (the
name that appears on receipts and bank statements). Those need an
Administrator. They are one-off jobs of about five minutes, so the tidiest
answer is to ask the owner to do those two themselves, or to give you
Administrator briefly and drop you back afterwards.

**One uncertainty, worth naming.** Stripe documents this role as being able to
manage *products*, and payment links are built on products — but Stripe does
not spell out the Payment Links screen role by role. If you sign in and the
Payment Links page is not there, ask to be moved up to Administrator and say
plainly that it carries bank access, rather than pretending it doesn't.

### Ask for these at the same time

- **View Only** for the Membership Committee chair. That role sees payments,
  the membership answers and exports, and can change nothing. You will not be
  able to add them yourself — Support Specialist cannot invite people — so it
  saves a second round trip.
- **Two-step authentication turned on** for the account, if it isn't already.

### How the owner does it

Customer sees: **dashboard.stripe.com/settings/team** → **Add member** → your
email address → choose the role → **Send invites**. Invitations expire after
ten days. You then set your own password and your own second factor; you never
learn theirs.

### What to send them

> Could you add me to the MVHA Stripe account as a team member? It's under
> Settings → Team (dashboard.stripe.com/settings/team) → Add member → my
> email → and then choose the role.
>
> The role I need is **Support Specialist**. That one can create the donation
> and membership payment buttons for the new website and see who has paid, but
> it cannot pay money out to a bank account, change the bank details, or change
> the payout schedule. You stay the account owner and can remove me at any time.
>
> Could you also add [name] as **View Only** at the same time, so the
> Membership Committee can see new memberships? That role can't change
> anything.
>
> Two small jobs that need your own login rather than mine, if you don't mind:
> setting the logo and colour under Settings → Business → Branding, and
> checking that Settings → Business → Public details says "Mountain View
> Historical Association" — that's the name donors see on their bank statement.
>
> The invitation expires after ten days.

### Once you are in

`PAYMENTS.md` in this folder is the step-by-step for creating the payment
links and pasting them into `/admin`.

---

## HostGator

HostGator is cleaner than Stripe, because the roles were designed around
exactly this question.

### The roles

| Role | Billing and payment methods | Buying and renewing | Managing users | Managing the sites |
| --- | --- | --- | --- | --- |
| **Primary Contact** (one only) | Yes | Yes | Yes | Yes |
| **Administrative Contact** | Yes | Yes | Yes | Yes |
| **Technical Contact** | **No** | No | No | Yes |

**Technical Contact is what you want.** It can manage and renew the products
and services — the websites, the domains, the technical side of the domain
records — and it has **no access to billing or payment information at all**.
Not restricted, not logged: absent. There is nothing to explain away, which
makes this an easy thing for an owner to say yes to.

### How the owner does it

In the Customer Portal: the **profile icon** → **Users & Roles** → pick the
account → **Manage** → scroll to **User Roles & Permissions** → **+ Add User**
→ your name, your email, role **Technical**  → **Invite**.

### cPanel is a separate thing

The Customer Portal and cPanel are two different logins. The portal is where
the account, roles and renewals live; cPanel is where the site's files, email
accounts and databases live. Being a Technical Contact in the portal does not
by itself hand you the cPanel password.

That is worth knowing rather than worrying about: cPanel contains no billing
of any kind, so cPanel access is technical control and nothing more. If you
need it, ask for it separately and say what for.

### What to send them

> Could you add me as a user on the MVHA HostGator account? It's in the
> Customer Portal under the profile icon → Users & Roles → Manage → Add User.
>
> The role I need is **Technical**. That role can look after the websites and
> domains but has no access to billing or payment information at all, and
> can't buy or renew anything. You stay the primary contact.
>
> If it's straightforward, could you also send me the cPanel login for
> mountainviewhistorical.org? I need the file manager to take a copy of the
> site's photographs before anything is switched off. cPanel has no billing in
> it — it's just the site's files.

### Why cPanel access is worth having

The Association's own photographs — about sixty of them — exist only on that
server. cPanel's File Manager can compress a folder and download it in one go,
which is much the quickest way to get a complete copy of
`public_html/wp-content/uploads` — everything, not just the pictures the new
site happens to use. See `photo-export/README.md`.

---

---

## What happens if the account holder dies

Everything above is about giving one volunteer the least access the job needs.
That is the right instinct for a volunteer, and it is the **wrong** tool for
this question. Least privilege protects the Association from mistakes. It does
nothing about the Association losing the account altogether — and taken on its
own it makes that worse, because a room full of carefully reduced roles is a
room in which nobody can let themselves back in.

The answer is not to give everyone high access. It is that **the top role on
every account should be held by two people, and the account should belong to
the Association rather than to a person.**

### What is actually recoverable

Both companies have a way back, and neither is quick.

**Stripe.** Only the account owner can hand ownership to somebody else, and
only a Super Administrator can appoint another Super Administrator. If the
owner cannot sign in, Stripe Support runs a verification process in which you
prove your identity and your relationship with the business. Two things make
that go well: being *already on the account* as an Administrator, and being
able to show that the Association — not the deceased — is the account holder.

Money does not stop in the meantime. Payouts go to the Association's bank
account on their own schedule whether or not anybody signs in.

**HostGator.** They have a documented recovery process, including one for a
deceased account holder. To become the Primary Contact you need a
government-issued photo ID of the person asking, **plus two organisational
documents** — letters of incorporation, a tax ID or tax exemption certificate,
a business licence, or a utility bill under 90 days old. The address on those
documents has to match the address on the account. Changing the contact
details also triggers a **60-day ICANN lock** during which the domain cannot
be transferred away, and that cannot be waived.

MVHA can satisfy all of that — it is an incorporated 501(c)(3) with an EIN —
provided somebody can lay hands on the paperwork.

### The failures that have nothing to do with roles

These are more likely than the ownership problem, and they are cheaper to fix.

**The renewal card.** If hosting and the domain renew against the President's
personal credit card, that card is cancelled when their estate is settled. The
renewal fails, the site goes down, and the domain can lapse — and a lapsed
domain is the one loss that may be permanent. **Pay from an Association bank
account or card, not a personal one**, and put the renewal dates in the board
calendar.

**The email address.** Every recovery path in this document runs through
email. If the account's contact address is one person's personal mailbox, it
may be closed exactly when it is needed. Every account should be registered to
an address the Association controls and more than one officer can open.

**Two-step authentication.** Codes sent to a phone nobody can unlock stop
recovery dead. Whoever sets up 2FA should print the recovery codes and give
them to the Secretary with the other records.

**The documents.** The incorporation letter, the IRS determination letter and
the tax exemption certificate are what both companies will ask for. They
should be somewhere the board can find them, not in one member's filing
cabinet.

### What to put to the board

Six things, none of which costs money:

1. **A second Administrator on Stripe** — an officer, by office rather than by
   name, so it passes with the role. This is a governance decision, separate
   from whoever happens to maintain the website.
2. **A second contact on HostGator** who can pay — an Administrative Contact,
   since a Technical Contact deliberately cannot renew anything.
3. **Association-owned email** as the contact address on every account.
4. **An Association payment method** for every renewal.
5. **Recovery codes and account documents** held by the Secretary.
6. **A minuted resolution** naming who holds which account and in what role.
   This is not ceremony: it is the evidence Stripe asks for when somebody has
   to prove a relationship with the business.

### The record itself

Worth keeping as a single page with the Association's records, updated when
anything changes:

| Account | What it does | Held by | Second holder | Contact address | Paid by | Renews |
| --- | --- | --- | --- | --- | --- | --- |
| Stripe | Donations and dues | | | | n/a | n/a |
| HostGator | The old WordPress site | | | | | |
| Domain registration | mountainviewhistorical.org | | | | | |
| Cloudflare | The new website | | | | | |
| GitHub organisation | The website's files | | | | n/a | n/a |

Recovery codes: held by ______. Incorporation and tax documents: held by
______.

---

## The wider point

Every one of these accounts is currently one person deep, and that includes
the ones set up for the new site. The GitHub organisation and the Cloudflare
account are registered to `mvha@thenorrises.com` — an address on a private
domain, not one the Association owns or controls. That is the same fault this
document is about, pointed at the website rather than at the President, and it
should be fixed the same way.

An organisation founded in 1954 should not be able to lose its history because
one volunteer changed jobs, moved away, or died.
